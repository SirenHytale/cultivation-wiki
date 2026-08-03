#!/usr/bin/env python3
"""One-time migration: turn the generated wiki pages into MDX for the Next.js site.

The static site's pages are machine-generated HTML (convert_docs.py) with a
presentation pass layered on top (enhance.py). That regularity is what makes
going back to Markdown safe: this only ever sees markup this repo produced.

Theme components come back as MDX components rather than raw divs, which is the
whole point of the migration — a <Note> written where it is used cannot be
silently lost by a reworded heading the way an enhance.py regex could.

Usage (from the repo root):
    python tools/html_to_mdx.py              # convert everything
    python tools/html_to_mdx.py dao realms   # convert named slugs only
    python tools/html_to_mdx.py --dry-run
"""
from __future__ import annotations

import argparse
import html
import pathlib
import re
import sys
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_EN = ROOT / "web" / "content" / "en"
OUT_ZH = ROOT / "web" / "content" / "zh"

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr"}

# Directories at the repo root that are not wiki pages.
SKIP_DIRS = {"assets", "data", "tools", "web", "en-src", "zh-src", ".git",
             ".github", "node_modules", ".claude"}

# Pages whose markup is form controls bound to hand-written JS, not prose.
# They become real React components instead of MDX.
INTERACTIVE = {"planner", "calculator"}

# The JSON API docs page is standalone (own inline CSS, no site chrome).
SKIP_SLUGS = {"api/get"}


# ---------------------------------------------------------------------------
# A very small DOM
# ---------------------------------------------------------------------------
class Node:
    __slots__ = ("tag", "attrs", "children", "parent")

    def __init__(self, tag: str, attrs: dict | None = None, parent: "Node | None" = None):
        self.tag = tag
        self.attrs = attrs or {}
        self.children: list = []
        self.parent = parent

    @property
    def classes(self) -> set[str]:
        return set(self.attrs.get("class", "").split())

    def find(self, tag: str, cls: str | None = None) -> "Node | None":
        for node in self.walk():
            if node.tag == tag and (cls is None or cls in node.classes):
                return node
        return None

    def walk(self):
        for child in self.children:
            if isinstance(child, Node):
                yield child
                yield from child.walk()

    def text(self) -> str:
        out = []
        for child in self.children:
            out.append(child if isinstance(child, str) else child.text())
        return "".join(out)


class TreeBuilder(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.root = Node("#root")
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        node = Node(tag, dict(attrs), self.cur)
        self.cur.children.append(node)
        if tag not in VOID:
            self.cur = node

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, dict(attrs), self.cur))

    def handle_endtag(self, tag):
        node = self.cur
        while node is not self.root and node.tag != tag:
            node = node.parent
        if node is not self.root and node.parent is not None:
            self.cur = node.parent

    def handle_data(self, data):
        self.cur.children.append(data)


# ---------------------------------------------------------------------------
# Escaping
# ---------------------------------------------------------------------------
def esc_text(text: str) -> str:
    """Escape prose for MDX.

    MDX parses `{` as an expression and `<` as JSX, so both have to be escaped
    or a stray brace in prose becomes a build error rather than a character.
    """
    return (text.replace("\\", "\\\\")
                .replace("{", "\\{")
                .replace("}", "\\}")
                .replace("<", "\\<"))


def esc_attr(text: str) -> str:
    return text.replace('"', "&quot;")


def esc_cell(text: str) -> str:
    """A raw pipe inside a table cell ends the cell; escape it."""
    return text.replace("|", "\\|")


# ---------------------------------------------------------------------------
# Link rewriting
# ---------------------------------------------------------------------------
def fix_href(href: str, lang: str) -> str:
    """Turn the static site's relative links into root-absolute ones.

    Pages lived at <slug>/index.html, so siblings were "../<slug>/" and the
    Chinese tree one level deeper used "../../<slug>/" to reach English.
    """
    if href.startswith(("http://", "https://", "#", "mailto:")):
        return href
    if href.startswith("../../"):          # zh page -> English page
        return "/" + href[6:]
    if href.startswith("../"):
        rest = href[3:]
        if rest in ("", "index.html"):
            return "/zh/" if lang == "zh" else "/"
        return ("/zh/" if lang == "zh" else "/") + rest
    if href.startswith("/"):
        return href
    return "/" + href


# ---------------------------------------------------------------------------
# Inline serialization
# ---------------------------------------------------------------------------
INLINE_TAGS = {"a", "code", "strong", "em", "b", "i", "span", "br", "sup", "sub", "mark"}


def inline(node, lang: str) -> str:
    if isinstance(node, str):
        return esc_text(node)

    tag = node.tag
    inner = "".join(inline(c, lang) for c in node.children)

    if tag == "code":
        raw = node.text()
        # Inline code is not MDX-parsed, so it carries its literal text.
        fence = "`"
        while fence in raw:
            fence += "`"
        pad = " " if raw.startswith("`") or raw.endswith("`") else ""
        return f"{fence}{pad}{raw}{pad}{fence}"
    if tag in ("strong", "b"):
        return f"**{inner}**" if inner.strip() else inner
    if tag in ("em", "i"):
        return f"*{inner}*" if inner.strip() else inner
    if tag == "a":
        href = fix_href(node.attrs.get("href", ""), lang)
        return f"[{inner}]({href})"
    if tag == "br":
        return "<br />"
    if tag == "img":
        if "divider-ink" in node.classes:
            return "\n\n<Divider />\n\n"
        src = node.attrs.get("src", "")
        alt = esc_attr(node.attrs.get("alt", ""))
        return f'<img src="{fix_href(src, lang)}" alt="{alt}" />'
    if tag == "span":
        cls = node.classes
        if "han-dim" in cls or "card-han" in cls:
            return inner          # handled by the component that owns it
        if "note-title" in cls:
            return ""             # lifted into the <Note title> prop
        if "chip" in cls:
            return f"<Chip>{inner}</Chip>"
        if "tag" in cls:
            return f"<Tag>{inner}</Tag>"
        return inner
    return inner


def collapse(text: str) -> str:
    return re.sub(r"[ \t\n]+", " ", text).strip()


# ---------------------------------------------------------------------------
# Block serialization
# ---------------------------------------------------------------------------
def heading(node: Node, lang: str) -> str:
    level = int(node.tag[1])
    text = collapse(inline_children(node, lang))
    anchor = node.attrs.get("id")
    # The braces are escaped because MDX lexes a bare "{" as the start of a JSX
    # expression and fails to parse the file before any plugin can run. They
    # survive parsing as literal text, and remarkHeadingIds strips them from
    # the mdast and pins the id.
    suffix = f" \\{{#{anchor}\\}}" if anchor else ""
    return f"{'#' * level} {text}{suffix}"


def inline_children(node: Node, lang: str) -> str:
    return "".join(inline(c, lang) for c in node.children)


def list_block(node: Node, lang: str, depth: int = 0) -> str:
    ordered = node.tag == "ol"
    lines: list[str] = []
    index = 1
    for child in node.children:
        if not isinstance(child, Node) or child.tag != "li":
            continue
        marker = f"{index}." if ordered else "-"
        index += 1
        # Split the item's own text from any nested list.
        own = [c for c in child.children
               if not (isinstance(c, Node) and c.tag in ("ul", "ol"))]
        nested = [c for c in child.children
                  if isinstance(c, Node) and c.tag in ("ul", "ol")]
        text = collapse("".join(inline(c, lang) for c in own))
        pad = "  " * depth
        lines.append(f"{pad}{marker} {text}")
        for sub in nested:
            lines.append(list_block(sub, lang, depth + 1))
    return "\n".join(lines)


def table_block(node: Node, lang: str) -> str:
    heads: list[str] = []
    rows: list[list[str]] = []
    for tr in node.walk():
        if tr.tag != "tr":
            continue
        cells = [c for c in tr.children if isinstance(c, Node) and c.tag in ("th", "td")]
        values = [esc_cell(collapse(inline_children(c, lang))) for c in cells]
        if cells and cells[0].tag == "th" and not heads:
            heads = values
        elif values:
            rows.append(values)
    if not heads and not rows:
        return ""
    width = max([len(heads)] + [len(r) for r in rows]) if (heads or rows) else 0
    if not heads:
        heads = [""] * width
    heads += [""] * (width - len(heads))

    out = ["| " + " | ".join(heads) + " |",
           "|" + "|".join([" --- "] * width) + "|"]
    for row in rows:
        row = row + [""] * (width - len(row))
        out.append("| " + " | ".join(row) + " |")
    return "\n".join(out)


def code_block(node: Node) -> str:
    """A <pre>. Mermaid diagrams keep their own fence language."""
    if "mermaid" in node.classes:
        return "```mermaid\n" + node.text().strip("\n") + "\n```"
    code = node.find("code")
    lang = ""
    if code:
        match = re.search(r"language-([\w-]+)", code.attrs.get("class", ""))
        if match:
            lang = match.group(1)
        body = code.text()
    else:
        body = node.text()
    body = body.strip("\n")
    fence = "```"
    while fence in body:
        fence += "`"
    return f"{fence}{lang}\n{body}\n{fence}"


def note_block(node: Node, lang: str) -> str:
    kind = ""
    if "tip" in node.classes:
        kind = "tip"
    elif "warn" in node.classes:
        kind = "warn"

    title_node = node.find("span", "note-title")
    title = collapse(title_node.text()) if title_node else ""

    body = blocks(node, lang, skip_note_title=True).strip()
    attrs = ""
    if kind:
        attrs += f' kind="{kind}"'
    if title:
        attrs += f' title="{esc_attr(title)}"'
    return f"<Note{attrs}>\n{indent(body)}\n</Note>"


def card_block(node: Node, lang: str) -> str:
    """One card. An <a class="card"> becomes a CardLink — those are the home
    page's navigation tiles, and a.card:hover carries its own lift-and-glow, so
    losing the anchor would cost both the link and the interaction."""
    han_node = node.find("span", "card-han")
    han = collapse(han_node.text()) if han_node else ""
    # The home page heads its cards with <h3>, the converted pages with <h4>.
    head = node.find("h4") or node.find("h3")
    title = collapse(inline_children(head, lang)) if head else ""

    parts = []
    for child in node.children:
        if not isinstance(child, Node):
            if child.strip():
                parts.append(collapse(esc_text(child)))
            continue
        if child is head:
            continue
        if child.tag == "span" and "card-han" in child.classes:
            continue
        parts.append(block(child, lang))
    body = "\n\n".join(p for p in parts if p.strip())

    attrs = ""
    if title:
        attrs += f' title="{esc_attr(title)}"'
    if han:
        attrs += f' han="{esc_attr(han)}"'

    if node.tag == "a":
        href = fix_href(node.attrs.get("href", ""), lang)
        return f'<CardLink href="{esc_attr(href)}"{attrs}>\n{indent(body)}\n</CardLink>'
    return f"<Card{attrs}>\n{indent(body)}\n</Card>"


def grid_block(node: Node, lang: str) -> str:
    cols = 3
    for cls in node.classes:
        match = re.fullmatch(r"cols-(\d)", cls)
        if match:
            cols = int(match.group(1))
    cards = [card_block(c, lang) for c in node.children
             if isinstance(c, Node) and "card" in c.classes]
    body = "\n\n".join(cards)
    return f"<CardGrid cols={{{cols}}}>\n{indent(body)}\n</CardGrid>"


def panel_block(node: Node, lang: str) -> str:
    head = node.find("div", "panel-head")
    title = collapse(head.text()) if head else ""
    parts = []
    for child in node.children:
        if isinstance(child, Node) and "panel-head" in child.classes:
            continue
        parts.append(block(child, lang) if isinstance(child, Node)
                     else (collapse(esc_text(child)) if child.strip() else ""))
    body = "\n\n".join(p for p in parts if p.strip())
    return f'<Panel title="{esc_attr(title)}">\n{indent(body)}\n</Panel>'


def indent(text: str, pad: str = "  ") -> str:
    return "\n".join(pad + line if line.strip() else line for line in text.split("\n"))


def block(node, lang: str) -> str:
    """Serialize one block-level node."""
    if isinstance(node, str):
        return collapse(esc_text(node)) if node.strip() else ""

    tag = node.tag
    cls = node.classes

    if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
        return heading(node, lang)
    if tag == "p":
        return collapse(inline_children(node, lang))
    if tag in ("ul", "ol"):
        return list_block(node, lang)
    if tag == "table":
        return table_block(node, lang)
    if tag == "pre":
        return code_block(node)
    if tag == "img" and "divider-ink" in cls:
        return "<Divider />"
    if tag == "hr":
        return "<Divider />"
    # A linked card reached outside a grid still has to stay a card, not be
    # flattened to an inline link by the INLINE_TAGS branch below.
    if tag == "a" and "card" in cls:
        return card_block(node, lang)
    if tag == "div":
        if "note" in cls:
            return note_block(node, lang)
        if "grid" in cls:
            return grid_block(node, lang)
        if "panel" in cls:
            return panel_block(node, lang)
        if "mermaid-wrap" in cls:
            pre = node.find("pre", "mermaid")
            cap = node.find("span", "mermaid-cap")
            out = code_block(pre) if pre else ""
            if cap:
                out += "\n\n*" + collapse(cap.text()) + "*"
            return out
        if {"page-eyebrow", "page-nav", "table-wrap"} & cls:
            if "table-wrap" in cls:
                return blocks(node, lang)
            return ""
        return blocks(node, lang)
    if tag in INLINE_TAGS:
        return collapse(inline(node, lang))
    if tag in ("section", "article", "main", "figure"):
        return blocks(node, lang)
    return blocks(node, lang)


def blocks(node: Node, lang: str, skip_note_title: bool = False) -> str:
    out: list[str] = []
    pending_inline: list[str] = []

    def flush() -> None:
        if pending_inline:
            text = collapse("".join(pending_inline))
            if text:
                out.append(text)
            pending_inline.clear()

    for child in node.children:
        if isinstance(child, str):
            pending_inline.append(esc_text(child))
            continue
        if skip_note_title and child.tag == "span" and "note-title" in child.classes:
            continue
        if child.tag in INLINE_TAGS and not (
            child.tag == "img" and "divider-ink" in child.classes
        ):
            pending_inline.append(inline(child, lang))
            continue
        flush()
        rendered = block(child, lang)
        if rendered.strip():
            out.append(rendered)
    flush()
    return "\n\n".join(out)


# ---------------------------------------------------------------------------
# Page conversion
# ---------------------------------------------------------------------------
def frontmatter_value(text: str) -> str:
    """Quote a YAML scalar safely."""
    return '"' + text.replace("\\", "\\\\").replace('"', '\\"') + '"'


def convert_page(path: pathlib.Path, lang: str) -> tuple[dict, str]:
    raw = path.read_text(encoding="utf-8")

    builder = TreeBuilder()
    builder.feed(raw)
    builder.close()
    root = builder.root

    main = root.find("main", "content")
    if main is None:
        raise ValueError("no <main class=\"content\"> found")

    # Title and description come from <head>, which the converter stamped.
    title_match = re.search(r"<title>(.*?)</title>", raw, re.S)
    title = html.unescape(title_match.group(1)).strip() if title_match else path.parent.name
    title = re.split(r"\s+[—|·]\s+", title)[0].strip()

    desc_match = re.search(r'<meta name="description" content="([^"]*)"', raw)
    description = html.unescape(desc_match.group(1)).strip() if desc_match else ""

    eyebrow = main.find("div", "page-eyebrow")
    group = ""
    if eyebrow:
        spans = [c for c in eyebrow.children
                 if isinstance(c, Node) and c.tag == "span" and "sep" not in c.classes]
        if spans:
            group = collapse(spans[0].text())

    toc = main.attrs.get("data-toc", "")

    body = blocks(main, lang)
    # The lede paragraph carried a class on the old site; MDX styles the first
    # paragraph after the h1 via CSS instead, so nothing to carry over.
    body = re.sub(r"\n{3,}", "\n\n", body).strip()

    meta = {"title": title, "description": description, "group": group, "toc": toc}
    return meta, body


ZH_GROUP_TO_EN = {
    "由此开始": "Start Here", "修炼之道": "The Path", "功法与法宝": "Arts & Treasures",
    "红尘世间": "The World", "配置": "Configuration", "开发者": "For Developers",
    "关于": "About", "工具": "Tools",
}


def write_mdx(meta: dict, body: str, out_dir: pathlib.Path, slug: str, dry: bool) -> int:
    lines = ["---", f"title: {frontmatter_value(meta['title'])}"]
    if meta.get("description"):
        lines.append(f"description: {frontmatter_value(meta['description'])}")
    group = meta.get("group") or ""
    group = ZH_GROUP_TO_EN.get(group, group)
    if group:
        lines.append(f"group: {frontmatter_value(group)}")
    if meta.get("toc"):
        lines.append(f"toc: {frontmatter_value(meta['toc'])}")
    if "```mermaid" in body:
        lines.append("mermaid: true")
    lines.append("---")
    text = "\n".join(lines) + "\n\n" + body + "\n"

    if not dry:
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / f"{slug}.mdx").write_text(text, encoding="utf-8")
    return len(text)


def discover() -> list[tuple[pathlib.Path, str, str]]:
    """(html path, language, output slug) for every convertible page."""
    found: list[tuple[pathlib.Path, str, str]] = []

    index = ROOT / "index.html"
    if index.exists():
        found.append((index, "en", "index"))
    zh_index = ROOT / "zh" / "index.html"
    if zh_index.exists():
        found.append((zh_index, "zh", "index"))

    for path in sorted(ROOT.glob("*/index.html")):
        slug = path.parent.name
        if slug in SKIP_DIRS or slug == "zh" or slug in INTERACTIVE:
            continue
        found.append((path, "en", slug))

    for path in sorted((ROOT / "zh").glob("*/index.html")):
        slug = path.parent.name
        if slug in INTERACTIVE:
            continue
        found.append((path, "zh", slug))

    # Nested English pages (api/get is skipped as a standalone document).
    for path in sorted(ROOT.glob("*/*/index.html")):
        rel = path.relative_to(ROOT).parent.as_posix()
        if rel.startswith("zh/") or rel in SKIP_SLUGS:
            continue
        if rel.split("/")[0] in SKIP_DIRS:
            continue
        found.append((path, "en", rel.replace("/", "-")))

    return found


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("slugs", nargs="*", help="convert only these slugs")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    pages = discover()
    if args.slugs:
        wanted = set(args.slugs)
        pages = [p for p in pages if p[2] in wanted]

    ok = 0
    failed: list[str] = []
    for path, lang, slug in pages:
        try:
            meta, body = convert_page(path, lang)
        except Exception as exc:                       # noqa: BLE001
            failed.append(f"{lang}/{slug}: {exc}")
            continue
        out_dir = OUT_ZH if lang == "zh" else OUT_EN
        size = write_mdx(meta, body, out_dir, slug, args.dry_run)
        ok += 1
        print(f"  {lang}/{slug:28s} {size:>7,} bytes")

    print(f"\n{ok} pages converted"
          + (f", {len(failed)} FAILED" if failed else ""))
    for message in failed:
        print("  !!", message)
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
