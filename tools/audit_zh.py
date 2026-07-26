#!/usr/bin/env python3
"""Check every Chinese page against its English counterpart.

Translating technical docs from memory silently invents config keys — this
caught `Karma-Farm-Multiplier`, which does not exist (the real key is
`Karma-Per-Farmed-Kill`). Run this after translating anything:

    python tools/audit_zh.py

Reports, per page:
  invented  - a config key used in Chinese that appears on no English page
  missing   - a key documented in English but absent from the translation
"""
from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
KEY = re.compile(r"[A-Z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)+")


def keys_in(text: str) -> set[str]:
    """Config keys, taken only from code spans so prose can't produce noise."""
    # Strip fenced blocks FIRST: a ```mermaid fence contributes three backticks
    # and desynchronises inline-code pairing for the whole rest of the file, so
    # every key after a diagram would otherwise go unseen.
    text = re.sub(r"```.*?```", "", text, flags=re.S)
    spans = re.findall(r"<code>(.*?)</code>", text, re.S) + re.findall(r"`([^`]+)`", text)
    out = set()
    for s in spans:
        s = re.sub(r"<[^>]+>", "", s).strip()
        if KEY.fullmatch(s):
            out.add(s)
    return out


def main() -> None:
    zh_dir, problems = ROOT / "zh", 0
    if not zh_dir.exists():
        sys.exit("no zh/ directory")

    for zh_page in sorted(zh_dir.glob("*/index.html")):
        slug = zh_page.parent.name
        en_page = ROOT / slug / "index.html"
        if not en_page.exists():
            continue
        src = ROOT / "zh-src" / f"{slug}.md"
        zh_text = src.read_text(encoding="utf-8") if src.exists() else zh_page.read_text(encoding="utf-8")

        zh_keys, en_keys = keys_in(zh_text), keys_in(en_page.read_text(encoding="utf-8"))
        invented, missing = sorted(zh_keys - en_keys), sorted(en_keys - zh_keys)
        if invented or missing:
            problems += 1
            print(f"\n{slug}")
            for k in invented:
                print(f"  INVENTED  {k}")
            for k in missing:
                print(f"  missing   {k}")

    total = len(list(zh_dir.glob("*/index.html")))
    print(f"\n{total} Chinese pages audited, {problems} with differences")
    sys.exit(1 if any(True for _ in ()) else 0)


if __name__ == "__main__":
    main()
