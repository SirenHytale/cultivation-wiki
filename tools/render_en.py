#!/usr/bin/env python3
"""Render en-src/<slug>.md into <slug>/index.html.

Why this exists
---------------
convert_docs.py's English pass is permanently skipped: the Markdown that fed it
lived in ../mermaids.dev/cultivation/ and was deleted when that site became a
redirect, so the generated English pages became hand-maintained HTML with no
source. Pages added since then keep their Markdown in en-src/ instead - but
en-src/ is NOT wired into convert_docs.py, so a file there does nothing on its
own. This is what turns it into a page.

It deliberately reuses the wiki's OWN converter, enhancer and shell rather than
templating anything itself. That is the whole point: output identical to what the
English pass would have produced, so a page built from en-src/ is
indistinguishable from the ~36 legacy HTML pages beside it. Hand-writing the HTML
instead is what causes drift.

This mirrors build_zh() in convert_docs.py almost line for line - the differences
are only the source directory, the output depth (no ../../ re-basing, since
<slug>/ sits at the repo root) and the English shell.

Usage
-----
    python tools/render_en.py            # every en-src/*.md
    python tools/render_en.py spirit-sense compatibility   # only these slugs

Run order after content changes:
    render_en.py -> convert_docs.py -> audit_zh.py -> stamp_meta.py -> build_index.py
"""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import convert_docs as cd  # noqa: E402  - path set above
import enhance  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
EN_SRC = ROOT / "en-src"


def render(slug: str, md: str) -> str:
    """Convert one page's Markdown into the finished HTML document."""
    meta, body = cd.convert(md)
    body = enhance.enhance(slug, body, "en")

    title = meta.get("title", slug)
    h1 = re.search(r"<h1>(.*?)</h1>", body, re.S)
    crumb = re.sub(r"<[^>]+>", "", h1.group(1)).strip() if h1 else title

    return cd.SHELL.format(
        title=html.escape(title, quote=True),
        crumb=html.escape(crumb, quote=True),
        desc=html.escape(meta.get("description", title), quote=True),
        group=html.escape(meta.get("group", ""), quote=True),
        han=meta.get("han", ""),
        body=cd.indent_body(body),
    )


def main() -> None:
    if not EN_SRC.exists():
        print("no en-src/ directory - nothing to do")
        return

    wanted = set(sys.argv[1:])
    sources = sorted(EN_SRC.glob("*.md"))
    if wanted:
        sources = [s for s in sources if s.stem in wanted]
        missing = wanted - {s.stem for s in sources}
        for slug in sorted(missing):
            print(f"  !! no en-src/{slug}.md")

    written = 0
    for src in sources:
        slug = src.stem

        # A slug that collides with assets/, data/ or tools/ would be served as
        # that directory instead of as the page - the same guard convert_docs.py
        # applies to its own output.
        if slug in {"assets", "data", "tools", "zh", "en-src", "zh-src"}:
            print(f"  !! refusing to write reserved slug: {slug}")
            continue

        page = render(slug, src.read_text(encoding="utf-8"))
        (ROOT / slug).mkdir(parents=True, exist_ok=True)
        (ROOT / slug / "index.html").write_text(page, encoding="utf-8")
        written += 1
        print(f"  en-src/{src.name:28s} -> {slug + '/':26s} ({len(page):>6,} bytes)")

    print(f"\nrendered {written} English page(s) from en-src/")

    # Unmapped site-absolute links are the single most common breakage when
    # adding a page: config and API permalinks are NESTED (/cultivation/api/
    # registries/), not flat, and a link the LINKS table does not know about is
    # emitted as-is and silently 404s. convert_docs.py collects them globally.
    unmapped = getattr(cd, "UNMAPPED", None)
    if unmapped:
        print("\nUNMAPPED site-absolute links (add them to LINKS in convert_docs.py):")
        for url in sorted(unmapped):
            print(f"  {url}")


if __name__ == "__main__":
    main()
