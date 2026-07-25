#!/usr/bin/env python3
"""Presentation layer applied on top of converted pages.

convert_docs.py turns the source Markdown into correct but plain HTML. This
module then promotes chosen blocks into the site's theme components — card
grids, callouts, lacquered panels — without touching the Markdown, so pages
still track the upstream content and a re-run never loses the styling.

Rules are matched by heading text and by substrings of the prose. That is
deliberately brittle: if the upstream wording changes, the rule should stop
matching and SAY SO rather than silently doing nothing. Every unmatched rule is
reported by convert_docs.py.

The regexes here run against HTML this repo generated itself, not arbitrary
markup, which is what makes them safe enough.
"""
from __future__ import annotations

import html as H
import re

WARNINGS: list[str] = []


def _warn(slug: str, msg: str) -> None:
    WARNINGS.append(f"{slug}: {msg}")


# ---------------------------------------------------------------------------
# Block location
# ---------------------------------------------------------------------------
def _heading_end(body: str, heading: str) -> int | None:
    """Index just past the <hN> whose text contains `heading`."""
    for m in re.finditer(r"<h([1-5])>(.*?)</h\1>", body, re.S):
        text = re.sub(r"<[^>]+>", "", m.group(2))
        if heading.lower() in text.lower():
            return m.end()
    return None


def _block_after(body: str, heading: str, tag: str) -> tuple[int, int] | None:
    """Span of the first <tag>...</tag> after the given heading, depth-aware."""
    start_at = _heading_end(body, heading)
    if start_at is None:
        return None
    m = re.compile(rf"<{tag}[ >]").search(body, start_at)
    if not m:
        return None
    depth, i = 0, m.start()
    for t in re.finditer(rf"</?{tag}[ >]", body[m.start():]):
        depth += 1 if not t.group(0).startswith("</") else -1
        if depth == 0:
            end = m.start() + t.end()
            end = body.find(">", end - 1) + 1
            return (i, end)
    return None


def _cells(row: str) -> list[str]:
    return [c.strip() for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", row, re.S)]


def _strip(s: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).strip()


# ---------------------------------------------------------------------------
# Transforms
# ---------------------------------------------------------------------------
def note(slug: str, body: str, contains: str, kind: str = "", title: str = "") -> str:
    """Promote the paragraph containing `contains` into a callout."""
    for m in re.finditer(r"<p>(.*?)</p>", body, re.S):
        if contains.lower() in _strip(m.group(1)).lower():
            inner = m.group(1)
            # A leading "<strong>Lead-in.</strong>" becomes the callout's title.
            lead = re.match(r"\s*<strong>(.*?)</strong>\s*", inner, re.S)
            cap = title or (_strip(lead.group(1)).rstrip(".") if lead else "")
            if lead and not title:
                inner = inner[lead.end():]
            cls = f"note {kind}".strip()
            head = f'<span class="note-title">{H.escape(cap)}</span>\n      ' if cap else ""
            return body[:m.start()] + f'<div class="{cls}">\n      {head}{inner.strip()}\n    </div>' + body[m.end():]
    _warn(slug, f'note: no paragraph containing "{contains}"')
    return body


def list_to_cards(slug: str, body: str, heading: str, cols: int = 3,
                  glyphs: tuple[str, ...] = ()) -> str:
    """Turn the <ul> after `heading` into a card grid, one card per item."""
    span = _block_after(body, heading, "ul")
    if not span:
        _warn(slug, f'list_to_cards: no <ul> after "{heading}"')
        return body
    block = body[span[0]:span[1]]
    items = re.findall(r"<li>(.*?)</li>", block, re.S)
    if not items:
        _warn(slug, f'list_to_cards: empty <ul> after "{heading}"')
        return body

    cards = []
    for i, item in enumerate(items):
        lead = re.match(r"\s*(?:<strong>(.*?)</strong>|<code>(.*?)</code>)\s*[-–—.]?\s*", item, re.S)
        if lead:
            title = _strip(lead.group(1) or "") or f"<code>{lead.group(2)}</code>"
            rest = item[lead.end():]
        else:
            title, rest = "", item
        glyph = f'<span class="card-han">{glyphs[i]}</span>' if i < len(glyphs) else ""
        head = f"<h4>{title}</h4>" if title else ""
        cards.append(f'      <div class="card">{glyph}{head}<p>{rest.strip()}</p></div>')

    grid = f'<div class="grid cols-{cols}">\n' + "\n".join(cards) + "\n    </div>"
    return body[:span[0]] + grid + body[span[1]:]


def table_to_cards(slug: str, body: str, heading: str, cols: int = 3,
                   glyphs: tuple[str, ...] = ()) -> str:
    """Turn the first table after `heading` into a card grid (row = card)."""
    span = _block_after(body, heading, "table")
    if not span:
        _warn(slug, f'table_to_cards: no <table> after "{heading}"')
        return body
    block = body[span[0]:span[1]]
    heads = _cells(re.search(r"<thead>(.*?)</thead>", block, re.S).group(1)) \
        if "<thead>" in block else []
    rows = re.findall(r"<tr>(.*?)</tr>", block.split("<tbody>")[-1], re.S)

    cards = []
    for i, row in enumerate(rows):
        cs = _cells(row)
        if not cs:
            continue
        title_raw = cs[0]
        # "Balanced - within X" -> title "Balanced", the rest joins the body.
        parts = re.split(r"\s+[-–—]\s+", _strip(title_raw), maxsplit=1)
        title, tail = parts[0], (parts[1] if len(parts) > 1 else "")
        bits = []
        if tail:
            bits.append(f"<em>{H.escape(tail)}</em>")
        for j, cell in enumerate(cs[1:], start=1):
            label = f"<strong>{H.escape(heads[j])}:</strong> " if j < len(heads) and heads[j] else ""
            bits.append(label + cell)
        glyph = f'<span class="card-han">{glyphs[i]}</span>' if i < len(glyphs) else ""
        cards.append(f'      <div class="card">{glyph}<h4>{title}</h4>'
                     f'<p>{"<br>".join(bits)}</p></div>')

    if not cards:
        _warn(slug, f'table_to_cards: no rows after "{heading}"')
        return body
    grid = f'<div class="grid cols-{cols}">\n' + "\n".join(cards) + "\n    </div>"
    return body[:span[0]] + grid + body[span[1]:]


def panel(slug: str, body: str, heading: str, title: str, tag: str = "table") -> str:
    """Wrap the first <tag> after `heading` in a lacquered panel."""
    span = _block_after(body, heading, tag)
    if not span:
        _warn(slug, f'panel: no <{tag}> after "{heading}"')
        return body
    inner = body[span[0]:span[1]]
    wrapped = (f'<div class="panel">\n      <div class="panel-head">{H.escape(title)}</div>\n'
               f'      {inner}\n    </div>')
    return body[:span[0]] + wrapped + body[span[1]:]


def panel_command_tables(body: str) -> str:
    """Global: frame a page's trailing command/permission reference table.

    Most pages end with one and it reads far better framed. Deliberately does
    nothing on pages that are *made of* such tables (Commands, Permissions) —
    there the headings already say what each table is, and framing every one
    would be noise rather than structure.
    """
    def kind(table: str) -> str | None:
        th = re.search(r"<th>(.*?)</th>", table, re.S)
        if not th:
            return None
        return {"command": "Commands", "permission": "Permissions"}.get(
            _strip(th.group(1)).lower())

    matches = [m for m in re.finditer(r"<table>.*?</table>", body, re.S) if kind(m.group(0))]
    if not matches or len(matches) > 2:
        return body

    out, pos = [], 0
    for m in matches:
        # Skip if already inside a panel.
        if body.rfind('<div class="panel">', 0, m.start()) > body.rfind("</div>", 0, m.start()):
            continue
        out.append(body[pos:m.start()])
        out.append(f'<div class="panel">\n      <div class="panel-head">{kind(m.group(0))}</div>\n      '
                   + m.group(0) + "\n    </div>")
        pos = m.end()
    out.append(body[pos:])
    return "".join(out)


# ---------------------------------------------------------------------------
# Per-page recipes
# ---------------------------------------------------------------------------
def _dao(slug: str, b: str) -> str:
    b = panel(slug, b, "Damage Conversion", "Dao Damage Values")
    b = note(slug, b, "Wood is the healing path", "tip")
    b = table_to_cards(slug, b, "Yin-Yang Balance", 3, ("☯", "陰", "陽"))
    b = table_to_cards(slug, b, "Devil and Righteous Paths", 3, ("魔", "正", "中"))
    b = note(slug, b, "Devil Path's Qi harvest is rate-limited", "warn", "Farming is gated")
    return b


def _techniques(slug: str, b: str) -> str:
    b = list_to_cards(slug, b, "Performing One", 2, ("令", "器"))
    b = panel(slug, b, "The Gates", "Activation Order — first failure is what you are told", "ol")
    b = panel(slug, b, "The Built-In Arts", "The Nine Arts")
    b = note(slug, b, "stack in a defined order", "tip", "Stacking Qi Barrier and Iron Body")
    return b


def _sects(slug: str, b: str) -> str:
    b = list_to_cards(slug, b, "The Sect Menu", 3, ("宗", "覽", "榜"))
    b = panel(slug, b, "The Sect Hall", "Claiming a Hall", "ul")
    b = note(slug, b, "scours the hall clean", "warn", "Inscribing empty-handed")
    b = note(slug, b, "Elders (长老) are the middle rank", "", "Ranks")
    return b


RECIPES = {
    "dao": _dao,
    "techniques": _techniques,
    "sects": _sects,
}


def enhance(slug: str, body: str) -> str:
    """Apply the global rules, then this page's recipe if it has one."""
    body = panel_command_tables(body)
    recipe = RECIPES.get(slug)
    if recipe:
        body = recipe(slug, body)
    return body
