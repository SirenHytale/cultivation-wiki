#!/usr/bin/env python3
"""Build the client-side search index for the Cultivation wiki.

Walks every .html page, splits it at each <h2>, and writes one search record
per section to data/search-index.js.

Emitted as a .js file assigning a global rather than .json: it loads with a
plain <script> tag, so there is no fetch, no CORS and no MIME configuration to
get wrong on a static host.

Record URLs are the clean, served paths (docs/realms/, not
docs/realms/index.html), matching the links in data/nav.js.

Usage (from the repo root):
    python tools/build_index.py
"""
from __future__ import annotations

import html
import json
import pathlib
import re
import sys
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "search-index.js"

SKIP_DIRS = {".git", "assets", "tools", "data", "node_modules"}
SKIP_FILES = {"404.html"}

# Tags whose text is chrome or code-noise rather than prose worth indexing.
DROP_TAGS = {"script", "style", "nav", "svg", "canvas", "template"}

# Same idea, by class: diagram source, breadcrumbs and decorative glyphs.
DROP_CLASSES = {"mermaid", "mermaid-cap", "page-eyebrow", "card-han", "han-dim", "heading-anchor"}

# Elements that never get an end tag, so they must not go on the open-tag stack.
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr"}


class PageParser(HTMLParser):
    """Pull the <title>, the <main> prose, and the <h2>/<h3> structure.

    Uses an explicit open-tag stack so that "skip this subtree" works for any
    element, not just the handful of tags we happen to list.
    """

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.in_title = False
        self.in_main = False
        self.stack: list[str] = []
        self.drop_at: int | None = None      # stack depth where skipping began
        self.current_head: str | None = None
        self.head_tag: str | None = None
        self.buf: list[str] = []
        self._pending_head: list[str] = []
        self.sections: list[tuple[str | None, str]] = []   # (heading|None, text)

    @property
    def dropping(self) -> bool:
        return self.drop_at is not None

    def _flush(self) -> None:
        text = re.sub(r"\s+", " ", "".join(self.buf)).strip()
        if text or self.current_head:
            self.sections.append((self.current_head, text))
        self.buf = []

    def handle_startendtag(self, tag, attrs):
        # Self-closing: never opens a subtree, so nothing to track.
        pass

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self.in_title = True
            return

        if tag not in VOID:
            self.stack.append(tag)

        if self.dropping:
            return

        classes = set(dict(attrs).get("class", "").split())
        if tag in DROP_TAGS or (classes & DROP_CLASSES):
            self.drop_at = len(self.stack)
            return

        if tag == "main":
            self.in_main = True
            return
        if not self.in_main:
            return

        if tag in ("h2", "h3"):
            self._flush()
            self.head_tag = tag
            self._pending_head = []

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
            return

        depth = len(self.stack)
        if tag not in VOID and self.stack:
            # Pop back to the matching open tag, tolerating unclosed markup.
            if tag in self.stack:
                while self.stack and self.stack.pop() != tag:
                    pass
            depth = len(self.stack)

        if self.dropping:
            if depth < self.drop_at:
                self.drop_at = None
            return

        if tag == "main" and self.in_main:
            self._flush()
            self.in_main = False
            return
        if self.head_tag and tag == self.head_tag:
            self.current_head = re.sub(r"\s+", " ", "".join(self._pending_head)).strip() or None
            self.head_tag = None
            self._pending_head = []

    def handle_data(self, data):
        if self.in_title:
            self.title += data
            return
        if self.dropping or not self.in_main:
            return
        if self.head_tag:
            self._pending_head.append(data)
        else:
            self.buf.append(data)


def clean_url(rel: str) -> str:
    """Repo path -> the URL it is actually served at (no .html, no index.html)."""
    if rel == "index.html":
        return "./"
    if rel.endswith("/index.html"):
        return rel[: -len("index.html")]
    return rel


def clean_title(raw: str) -> str:
    t = re.sub(r"\s+", " ", raw).strip()
    # "Realms & Stages — Cultivation Wiki"  ->  "Realms & Stages"
    return re.split(r"\s+[—|·]\s+", t)[0].strip() or t


def section_for(rel: str, nav_map: dict[str, str]) -> str:
    return nav_map.get(rel.replace("\\", "/"), "Wiki")


def load_nav_map() -> dict[str, str]:
    """Best-effort read of data/nav.js so hits show their sidebar group."""
    nav = ROOT / "data" / "nav.js"
    out: dict[str, str] = {}
    if not nav.exists():
        return out
    text = nav.read_text(encoding="utf-8")
    # Grab each `title: "X", han:` group header, then the hrefs that follow it.
    for block in re.split(r'\{\s*\n\s*title:\s*"', text)[1:]:
        m = re.match(r'([^"]+)",\s*han:', block)
        if not m:
            continue
        group = m.group(1)
        body = block.split("]")[0]
        for href in re.findall(r'href:\s*"([^"]+)"', body):
            out.setdefault(href, group)
    return out


def build() -> list[dict]:
    nav_map = load_nav_map()
    records: list[dict] = []

    pages = sorted(
        p for p in ROOT.rglob("*.html")
        if not any(part in SKIP_DIRS for part in p.relative_to(ROOT).parts)
        and p.name not in SKIP_FILES
    )
    if not pages:
        print("no .html pages found", file=sys.stderr)

    for path in pages:
        rel = path.relative_to(ROOT).as_posix()
        url = clean_url(rel)
        parser = PageParser()
        parser.feed(path.read_text(encoding="utf-8"))
        parser.close()

        title = clean_title(parser.title) or rel
        group = section_for(url, nav_map)

        for head, text in parser.sections:
            text = text.strip()
            if len(text) < 40 and not head:
                continue
            records.append({
                "u": url + ("#" + slug(head) if head else ""),
                "t": head or title,
                "s": f"{group} › {title}" if head else group,
                "h": title if head else "",
                "x": text[:1400],
            })
        print(f"  {url}: {len(parser.sections)} sections")

    return records


def slug(head: str) -> str:
    """Mirror the id scheme site.js generates for headings."""
    s = head.lower().strip()
    s = re.sub(r"[^\w一-鿿]+", "-", s, flags=re.UNICODE)
    return s.strip("-")


def main() -> None:
    records = build()
    payload = json.dumps(records, ensure_ascii=False, separators=(",", ":"))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "/* GENERATED by tools/build_index.py — do not edit by hand. */\n"
        "window.SEARCH_INDEX = " + payload + ";\n",
        encoding="utf-8",   # no BOM: a BOM here breaks the <script> parse
    )
    print(f"\nwrote {OUT.relative_to(ROOT)}  ({len(records)} records, {OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
