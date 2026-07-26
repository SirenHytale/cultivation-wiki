#!/usr/bin/env python3
"""Convert the just-the-docs Markdown in mermaids.dev/cultivation/ into wiki pages.

The Markdown there is the authoritative content for the mod; this script re-homes
it into this site's page shell and theme instead of re-writing it by hand.

It implements only the Markdown subset those files actually use (surveyed before
writing): ATX headings, GFM tables, fenced code incl. ```mermaid, ordered and
unordered lists with one level of nesting, blockquotes, `* * *` rules, reference
link definitions, and inline bold/em/code/links. No third-party dependency —
nothing but the standard library is installed on this machine.

Usage (from the repo root):
    python tools/convert_docs.py            # write pages
    python tools/convert_docs.py --dry-run  # report only
"""
from __future__ import annotations

import argparse
import html
import pathlib
import re
import sys

import enhance  # noqa: E402  (same directory)

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "mermaids.dev" / "cultivation"
OUT = ROOT   # pages live at the repo root: <slug>/index.html

# Chinese sources live in this repo (the English ones live in mermaids.dev).
# Each zh-src/<slug>.md builds to zh/<slug>/index.html through the same
# converter, so the Chinese pages get identical tables, diagrams and theme
# components — and a content change flows to both languages the same way.
ZH_SRC = ROOT / "zh-src"
ZH_OUT = ROOT / "zh"
# Chinese pages written by hand as HTML; never generated over.
ZH_PROTECTED = {"realms", "qi-gathering", "getting-started", "glossary", "index"}
# Set while the Chinese pass runs: which slugs actually have a zh/ page. A link
# to anything else must drop back to the English page (../../<slug>/) instead of
# pointing at a zh/ URL that does not exist.
ZH_MODE = False
ZH_AVAILABLE: set[str] = set()

# Pages are written as <slug>/index.html so they serve at a clean, extensionless
# URL (/realms/). That puts every page exactly one directory below the repo root.
ASSETS = "../"

# Pages that are hand-authored in this repo and must never be overwritten.
PROTECTED = {"realms", "qi-gathering", "getting-started"}

# ---------------------------------------------------------------------------
# Source -> output mapping. Order here is only cosmetic (progress output).
# ---------------------------------------------------------------------------
PAGES: list[tuple] = [
    # (source markdown, output file, sidebar group [, extra sources merged in
    #  as sub-sections — used so the short per-race pages become anchors on the
    #  Races page rather than five thin pages])
    ("commands.md",            "commands.html",           "Start Here"),
    ("permissions.md",         "permissions.html",        "Start Here"),

    ("tribulations/index.md",  "tribulations.html",       "The Path"),
    ("races/index.md",         "races.html",              "The Path",
        ["races/human.md", "races/demon.md", "races/deity.md"]),
    ("skilltree/index.md",     "skilltree.html",          "The Path"),
    ("dao/index.md",           "dao.html",                "The Path"),
    ("karma/index.md",         "karma.html",              "The Path"),

    ("techniques/index.md",    "techniques.html",         "Arts & Treasures"),
    ("manuals/index.md",       "manuals.html",            "Arts & Treasures"),
    ("alchemy/index.md",       "alchemy.html",            "Arts & Treasures"),
    ("refinement/index.md",    "refinement.html",         "Arts & Treasures"),
    ("lifebound/index.md",     "lifebound.html",          "Arts & Treasures"),
    ("beasts/index.md",        "beasts.html",             "Arts & Treasures"),

    ("sects/index.md",         "sects.html",              "The World"),
    ("formations/index.md",    "formations.html",         "The World"),
    ("dwelling/index.md",      "dwelling.html",           "The World"),
    ("duels/index.md",         "duels.html",              "The World"),
    ("wars/index.md",          "wars.html",               "The World"),

    ("config/index.md",        "config.html",             "Configuration"),
    ("config/core.md",         "config-core.html",        "Configuration"),
    ("config/cultivation.md",  "config-cultivation.html", "Configuration"),
    ("config/arts.md",         "config-arts.html",        "Configuration"),
    ("config/society.md",      "config-society.html",     "Configuration"),
    ("config/race.md",         "config-race.html",        "Configuration"),
    ("config/data.md",         "config-data.html",        "Configuration"),

    ("api/index.md",           "api.html",                "For Developers"),
    ("api/reference.md",       "api-reference.html",      "For Developers"),
    ("api/events.md",          "api-events.html",         "For Developers"),
    ("api/addons.md",          "api-addons.html",         "For Developers"),
    ("api/registries.md",      "api-registries.html",     "For Developers"),
]

# Permalink -> target. Bare values are page slugs (optionally with an #anchor)
# and get turned into "../<slug>/" by resolve_link; "" means the site root.
LINKS: dict[str, str] = {
    "/cultivation/": "",
    "/cultivation/commands/": "commands",
    "/cultivation/permissions/": "permissions",
    "/cultivation/realms/": "realms",
    "/cultivation/qi-gathering/": "qi-gathering",
    "/cultivation/tribulations/": "tribulations",
    "/cultivation/races/": "races",
    "/cultivation/races/human/": "races#human",
    "/cultivation/races/demon/": "races#demon",
    "/cultivation/races/deity/": "races#deity",
    "/cultivation/skilltree/": "skilltree",
    "/cultivation/dao/": "dao",
    "/cultivation/karma/": "karma",
    "/cultivation/techniques/": "techniques",
    "/cultivation/manuals/": "manuals",
    "/cultivation/alchemy/": "alchemy",
    "/cultivation/refinement/": "refinement",
    "/cultivation/lifebound/": "lifebound",
    "/cultivation/beasts/": "beasts",
    "/cultivation/sects/": "sects",
    "/cultivation/formations/": "formations",
    "/cultivation/dwelling/": "dwelling",
    "/cultivation/duels/": "duels",
    "/cultivation/wars/": "wars",
    "/cultivation/config/": "config",
    "/cultivation/config/core/": "config-core",
    "/cultivation/config/cultivation/": "config-cultivation",
    "/cultivation/config/arts/": "config-arts",
    "/cultivation/config/society/": "config-society",
    "/cultivation/config/race/": "config-race",
    "/cultivation/config/data/": "config-data",
    "/cultivation/api/": "api",
    "/cultivation/api/reference/": "api-reference",
    "/cultivation/api/events/": "api-events",
    "/cultivation/api/addons/": "api-addons",
    "/cultivation/api/registries/": "api-registries",
    # Redirect stubs on the old site resolve straight to their destination.
    "/cultivation/curseforge/": "https://www.curseforge.com/hytale/mods/cultivation/",
    "/cultivation/download/": "https://www.curseforge.com/hytale/mods/cultivation/download",
    "/cultivation/hstats/": "https://hstats.dev/mods/828f65ac-8c45-4510-893b-cc90cd9734aa",
    "/cultivation/modifold/": "https://modifold.com/mod/cultivation",
    "/cultivation/source/": "https://github.com/meFroggy/Cultivation",
}

ZH_GROUP = {
    "Start Here": "由此开始", "The Path": "修炼之道", "Arts & Treasures": "功法与法宝",
    "The World": "红尘世间", "Configuration": "配置", "For Developers": "开发者",
    "About": "关于", "Tools": "工具",
}

HAN = {  # decorative glyph for the page eyebrow, by group
    "Start Here": "起", "The Path": "道", "Arts & Treasures": "術",
    "The World": "界", "Configuration": "配", "For Developers": "匠",
}


def resolve_link(url: str) -> str:
    """Map an old permalink to a relative, extensionless URL for this site.

    Pages live at <slug>/index.html, so a sibling page is "../<slug>/" and the
    site root is "../".
    """
    url = url.strip()
    if url in LINKS:
        target = LINKS[url]
        if target.startswith("http"):
            return target
        if target == "":
            return "../" if not ZH_MODE else "../"
        slug, _, anchor = target.partition("#")
        frag = f"#{anchor}" if anchor else ""
        if ZH_MODE and slug not in ZH_AVAILABLE:
            # No Chinese counterpart yet - link to the English page one level up.
            return f"../../{slug}/" + frag
        return f"../{slug}/" + frag
    if url.startswith(("http://", "https://", "#", "mailto:")):
        return url
    # An unmapped site-absolute link would 404 silently; surface it instead.
    if url.startswith("/"):
        UNMAPPED.add(url)
        return url
    return url


UNMAPPED: set[str] = set()


# ---------------------------------------------------------------------------
# Inline
# ---------------------------------------------------------------------------
def inline(text: str, refs: dict[str, str]) -> str:
    """Convert inline Markdown to HTML, escaping everything that isn't markup."""
    spans: list[str] = []

    def stash(m: re.Match) -> str:
        spans.append(m.group(1))
        return f"\x00{len(spans) - 1}\x00"

    # 1. Pull code spans out before anything can mangle their contents.
    text = re.sub(r"`([^`]+)`", stash, text)

    # 2. Everything left is prose: escape it.
    text = html.escape(text, quote=False)

    # 3. Links: inline, then reference-style, then bare shortcuts.
    def a(label: str, url: str) -> str:
        href = resolve_link(url)
        ext = href.startswith("http")
        rel = ' rel="noopener"' if ext else ""
        return f'<a href="{html.escape(href, quote=True)}"{rel}>{label}</a>'

    text = re.sub(r"\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)",
                  lambda m: a(m.group(1), m.group(2)), text)
    text = re.sub(r"\[([^\]]+)\]\[([^\]]*)\]",
                  lambda m: a(m.group(1), refs.get((m.group(2) or m.group(1)).lower(), "#")), text)

    def shortcut(m: re.Match) -> str:
        key = m.group(1).lower()
        return a(m.group(1), refs[key]) if key in refs else m.group(0)

    text = re.sub(r"\[([^\]]+)\]", shortcut, text)

    # 4. Emphasis.
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<![\w*])\*([^*\n]+)\*(?![\w*])", r"<em>\1</em>", text)

    # 5. Restore code spans.
    return re.sub(r"\x00(\d+)\x00",
                  lambda m: f"<code>{html.escape(spans[int(m.group(1))], quote=False)}</code>",
                  text)


# ---------------------------------------------------------------------------
# Blocks
# ---------------------------------------------------------------------------
RE_HR = re.compile(r"^\s*(\*\s*\*\s*\*|-\s*-\s*-|_\s*_\s*_)[\s*\-_]*$")
RE_BR = re.compile(r"^\s*<br\s*/?>\s*$", re.I)
RE_HEAD = re.compile(r"^(#{1,6})\s+(.*?)\s*#*$")
RE_LI = re.compile(r"^(\s*)([-*+]|\d+\.)\s+(.*)$")
RE_TROW = re.compile(r"^\s*\|.*\|\s*$")
RE_TSEP = re.compile(r"^\s*\|[\s:|-]+\|\s*$")
RE_REF = re.compile(r"^\s*\[([^\]]+)\]:\s*(\S+)\s*$")


def mermaid_block(code: str) -> str:
    """Escape for HTML and rewrite click-target paths inside a diagram."""
    def fix_click(m: re.Match) -> str:
        return f'click {m.group(1)} "{resolve_link(m.group(2))}"'

    code = re.sub(r'click\s+(\S+)\s+"([^"]+)"', fix_click, code)
    # The browser parses the <pre> before mermaid sees it, so any markup in a
    # node label (notably <br/>) has to arrive escaped.
    return html.escape(code, quote=False)


def convert(md: str, demote: int = 0, allow_lede: bool = True) -> tuple[dict, str]:
    """Return (front matter, body HTML).

    `demote` pushes every heading down a level, used when a page is merged into
    another as a sub-section (its <h1> title becomes an <h2> anchor).
    """
    meta: dict[str, str] = {}
    if md.startswith("---"):
        end = md.index("\n---", 3)
        for line in md[3:end].strip().splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        md = md[end + 4:]

    lines = md.replace("\r\n", "\n").split("\n")

    # Collect (and remove) reference link definitions first.
    refs: dict[str, str] = {}
    kept: list[str] = []
    for ln in lines:
        m = RE_REF.match(ln)
        if m:
            refs[m.group(1).lower()] = m.group(2)
        else:
            kept.append(ln)
    lines = kept

    # Heading offset: the shallowest heading in the file becomes <h1>.
    levels = [len(m.group(1)) for m in (RE_HEAD.match(l) for l in lines) if m]
    offset = (min(levels) - 1) if levels else 0

    out: list[str] = []
    i, n = 0, len(lines)
    seen_h1 = False
    lede_done = not allow_lede

    while i < n:
        line = lines[i]

        if not line.strip() or RE_BR.match(line):
            i += 1
            continue

        # --- fenced code -------------------------------------------------
        if line.lstrip().startswith("```"):
            lang = line.strip().strip("`").strip()
            i += 1
            buf: list[str] = []
            while i < n and not lines[i].lstrip().startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            code = "\n".join(buf)
            if lang.lower() == "mermaid":
                out.append('<div class="mermaid-wrap">\n<pre class="mermaid">\n'
                           + mermaid_block(code) + "\n</pre>\n</div>")
            else:
                cls = f' class="language-{lang}"' if lang else ""
                out.append(f"<pre><code{cls}>{html.escape(code, quote=False)}</code></pre>")
            continue

        # --- horizontal rule ---------------------------------------------
        if RE_HR.match(line):
            out.append(f'<img class="divider-ink" src="{ASSETS}assets/img/divider-ink.svg" '
                       'alt="" width="340" height="24">')
            i += 1
            continue

        # --- heading ------------------------------------------------------
        m = RE_HEAD.match(line)
        if m:
            lvl = max(1, len(m.group(1)) - offset) + demote
            txt = inline(m.group(2), refs)
            if lvl == 1 and not seen_h1:
                seen_h1 = True
                out.append(f"<h1>{txt}</h1>")
            else:
                out.append(f"<h{min(lvl, 5)}>{txt}</h{min(lvl, 5)}>")
            i += 1
            continue

        # --- table --------------------------------------------------------
        if RE_TROW.match(line) and i + 1 < n and RE_TSEP.match(lines[i + 1]):
            def cells(row: str) -> list[str]:
                return [c.strip() for c in row.strip().strip("|").split("|")]

            head = cells(line)
            i += 2
            body: list[list[str]] = []
            while i < n and RE_TROW.match(lines[i]):
                body.append(cells(lines[i]))
                i += 1
            # Source headers read "Variable Name:" — drop the trailing colon.
            names = [c.rstrip(":").strip().lower() for c in head]
            th = "".join(f"<th>{inline(c.rstrip(':'), refs)}</th>" for c in head)

            def cell(text: str, col: int) -> str:
                out = inline(text, refs)
                # The source leaves command and permission columns as bare text;
                # every hand-authored page here renders them as code, so match it.
                if (col < len(names) and names[col] in ("command", "permission")
                        and out and "<code>" not in out and "<a " not in out):
                    out = f"<code>{out}</code>"
                return out

            rows = "".join(
                "<tr>" + "".join(f"<td>{cell(c, j)}</td>" for j, c in enumerate(r)) + "</tr>"
                for r in body
            )
            out.append(f"<table>\n<thead><tr>{th}</tr></thead>\n<tbody>{rows}</tbody>\n</table>")
            continue

        # --- blockquote ---------------------------------------------------
        if line.lstrip().startswith(">"):
            buf = []
            while i < n and lines[i].lstrip().startswith(">"):
                buf.append(lines[i].lstrip()[1:].strip())
                i += 1
            out.append('<div class="note">' + inline(" ".join(buf), refs) + "</div>")
            continue

        # --- list ----------------------------------------------------------
        if RE_LI.match(line):
            html_out, i = parse_list(lines, i, refs)
            out.append(html_out)
            continue

        # --- paragraph ------------------------------------------------------
        buf = []
        while i < n and lines[i].strip() and not RE_BR.match(lines[i]) \
                and not RE_HEAD.match(lines[i]) and not RE_HR.match(lines[i]) \
                and not RE_LI.match(lines[i]) and not RE_TROW.match(lines[i]) \
                and not lines[i].lstrip().startswith(("```", ">")):
            buf.append(lines[i].strip())
            i += 1
        para = inline(" ".join(buf), refs)
        if seen_h1 and not lede_done:
            lede_done = True
            out.append(f'<p class="page-lede">{para}</p>')
        else:
            out.append(f"<p>{para}</p>")

    return meta, "\n\n".join(out)


def parse_list(lines: list[str], i: int, refs: dict[str, str]) -> tuple[str, int]:
    """One level of nesting is enough for this corpus."""
    n = len(lines)
    first = RE_LI.match(lines[i])
    ordered = first.group(2).endswith(".")
    tag = "ol" if ordered else "ul"
    items: list[str] = []
    cur: list[str] | None = None
    nested: list[str] = []
    base_indent = len(first.group(1))

    def flush() -> None:
        nonlocal cur, nested
        if cur is None:
            return
        body = inline(" ".join(cur), refs)
        if nested:
            sub, _ = parse_list(nested, 0, refs)
            body += sub
        items.append(f"<li>{body}</li>")
        cur, nested = None, []

    while i < n:
        line = lines[i]
        if not line.strip():
            # A blank line ends the list unless the next line continues it.
            if i + 1 < n and RE_LI.match(lines[i + 1]):
                i += 1
                continue
            break
        m = RE_LI.match(line)
        if m:
            indent = len(m.group(1))
            if indent > base_indent:
                nested.append(line[base_indent + 2:])
            else:
                flush()
                cur = [m.group(3)]
                base_indent = indent
        elif cur is not None and line.startswith(" "):
            cur.append(line.strip())          # lazy continuation
        else:
            break
        i += 1

    flush()
    return f"<{tag}>" + "".join(items) + f"</{tag}>", i


# ---------------------------------------------------------------------------
# Page shell
# ---------------------------------------------------------------------------
SHELL = """<!doctype html>
<html lang="en" data-root="../" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — Cultivation Wiki</title>
<meta name="description" content="{desc}">
<link rel="icon" href="../assets/img/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Noto+Serif+SC:wght@400;600;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/xianxia.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div id="site-header"></div>

<div class="layout">
  <div id="site-sidebar"></div>

  <main class="content" id="main">
    <div class="page-eyebrow">
      <span>{group}</span><span class="sep">/</span><span>{crumb}</span>
      <span class="sep">·</span><span class="han-dim">{han}</span>
    </div>

{body}

  </main>

  <div id="site-toc"></div>
</div>

<div id="site-footer"></div>

<script src="../data/nav.js"></script>
<script src="../data/search-index.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script src="../assets/js/site.js"></script>
</body>
</html>
"""


ZH_SHELL = SHELL.replace('<html lang="en" data-root="../"',
                         '<html lang="zh-CN" data-root="../"')                 .replace("{title} — Cultivation Wiki", "{title} — 修真百科")                 .replace('href="#main">Skip to content<', 'href="#main">跳到正文<')


def build_zh() -> int:
    """Convert every zh-src/<slug>.md into zh/<slug>/index.html."""
    if not ZH_SRC.exists():
        return 0
    global ZH_MODE, ZH_AVAILABLE
    ZH_AVAILABLE = {f.stem for f in ZH_SRC.glob("*.md")} | ZH_PROTECTED
    ZH_MODE = True
    written = 0
    for src in sorted(ZH_SRC.glob("*.md")):
        slug = src.stem
        if slug in ZH_PROTECTED:
            print(f"  -- skipped (hand-authored): zh/{slug}/")
            continue
        meta, body = convert(src.read_text(encoding="utf-8"))
        body = enhance.enhance(slug, body)
        title = meta.get("title", slug)
        group = meta.get("group", "")
        h1 = re.search(r"<h1>(.*?)</h1>", body, re.S)
        crumb = re.sub(r"<[^>]+>", "", h1.group(1)).strip() if h1 else title
        page = ZH_SHELL.format(
            title=html.escape(title, quote=True),
            crumb=html.escape(crumb, quote=True),
            desc=html.escape(meta.get("description", title), quote=True),
            group=html.escape(group, quote=True),
            han=meta.get("han", ""),
            body=indent_body(body),
        )
        # zh/<slug>/ is one level deeper than <slug>/, so re-base every asset
        # reference the shared shell and body emitted for the English depth.
        page = (page.replace('data-root="../"', 'data-root="../../"')
                    .replace('"../assets/', '"../../assets/')
                    .replace('"../data/', '"../../data/'))
        (ZH_OUT / slug).mkdir(parents=True, exist_ok=True)
        (ZH_OUT / slug / "index.html").write_text(page, encoding="utf-8")
        written += 1
        print(f"  zh-src/{src.name:26s} -> zh/{slug + '/':25s} ({len(body):>6,} bytes)")
    ZH_MODE = False
    return written


def indent_body(body: str) -> str:
    """Indent for readability — but never inside <pre>, where whitespace is content.

    Indenting a <pre> would visibly corrupt the ASCII folder trees and can break
    whitespace-sensitive mermaid diagram types.
    """
    out, in_pre = [], False
    for line in body.split("\n"):
        if not in_pre and "<pre" in line:
            in_pre = True
            out.append("    " + line if line.strip() else line)
            if "</pre>" in line:
                in_pre = False
            continue
        if in_pre:
            out.append(line)
            if "</pre>" in line:
                in_pre = False
            continue
        out.append("    " + line if line.strip() else line)
    return "\n".join(out)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    # The English Markdown that lived in mermaids.dev/cultivation was removed
    # when that site became a redirect, so the English pass has no input and
    # the generated pages already in this repo are now the only copy. Skip it
    # quietly; the Chinese pass below has its own in-repo source.
    english_available = (SRC / "commands.md").exists()
    if not english_available:
        print(f"English source not present ({SRC}) - skipping the English pass.")
        print("Generated English pages in this repo are left untouched.")
    OUT.mkdir(parents=True, exist_ok=True)

    # Pages live at the repo root, so a slug that matches an asset directory
    # would shadow it and silently break the whole site. Refuse up front.
    RESERVED = {"assets", "data", "tools", ".git", ".github", "node_modules"}
    clashes = sorted({e[1][:-5] for e in PAGES if e[1][:-5] in RESERVED})
    if clashes:
        sys.exit(f"slug collides with a reserved directory, aborting: {clashes}")

    written = 0
    for entry in (PAGES if english_available else []):
        src_rel, out_name, group = entry[0], entry[1], entry[2]
        merges = entry[3] if len(entry) > 3 else []
        src = SRC / src_rel
        if not src.exists():
            print(f"  !! missing source: {src_rel}")
            continue
        slug = out_name[:-5] if out_name.endswith(".html") else out_name
        if slug in PROTECTED:
            print(f"  -- skipped (hand-authored): {slug}/")
            continue

        meta, body = convert(src.read_text(encoding="utf-8"))
        for extra in merges:
            ex = SRC / extra
            if not ex.exists():
                print(f"  !! missing merge source: {extra}")
                continue
            _, sub = convert(ex.read_text(encoding="utf-8"), demote=1, allow_lede=False)
            body += ('\n\n<img class="divider-ink" src="../assets/img/divider-ink.svg" '
                     'alt="" width="340" height="24">\n\n') + sub
        title = meta.get("title", out_name.replace(".html", "").title())
        desc = meta.get("description", f"Cultivation mod documentation — {title}")
        body = enhance.enhance(slug, body)

        # Breadcrumb tracks the visible <h1>, not the front matter, so the two
        # never disagree on screen (e.g. "Main Config" vs "Config").
        h1 = re.search(r"<h1>(.*?)</h1>", body, re.S)
        crumb = re.sub(r"<[^>]+>", "", h1.group(1)).strip() if h1 else title
        page = SHELL.format(
            title=html.escape(title, quote=True),
            crumb=html.escape(crumb, quote=True),
            desc=html.escape(desc, quote=True),
            group=html.escape(group, quote=True),
            han=HAN.get(group, ""),
            body=indent_body(body),
        )
        if not args.dry_run:
            (OUT / slug).mkdir(parents=True, exist_ok=True)
            (OUT / slug / "index.html").write_text(page, encoding="utf-8")
        written += 1
        print(f"  {src_rel:28s} -> {slug + '/':31s} ({len(body):>6,} bytes)")

    if not args.dry_run:
        zh_written = build_zh()
        if zh_written:
            print(f"\n{zh_written} Chinese pages generated from zh-src/")

    if english_available:
        print(f"\n{written} English pages written")
    if UNMAPPED:
        print("\nUNMAPPED site-absolute links (these would 404):")
        for u in sorted(UNMAPPED):
            print("  -", u)


if __name__ == "__main__":
    main()
