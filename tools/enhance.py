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
            cap = title or (_strip(lead.group(1)).rstrip(".。") if lead else "")
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
        # The separator is [-–—.]* rather than a single character because the
        # Chinese pages use a doubled em dash (——) after the lead-in.
        lead = re.match(r"\s*(?:<strong>(.*?)</strong>|<code>(.*?)</code>)\s*[-–—.]*\s*", item, re.S)
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
        # "Balanced - within `X`" -> title "Balanced", the rest joins the body.
        # Split the RAW cell so the tail keeps its markup: stripping tags here
        # used to silently drop <code> from config keys in the first column.
        # [-–—]+ rather than a single dash so the Chinese doubled em dash (——)
        # splits too - left unsplit, the whole cell became the <h4> and lost
        # its <code> spans to _strip.
        parts = re.split(r"\s+[-–—]+\s+", title_raw, maxsplit=1)
        title = _strip(parts[0])
        tail = parts[1].strip() if len(parts) > 1 else ""
        bits = []
        if tail:
            bits.append(f"<em>{tail}</em>")
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
        # Both languages: the Chinese pages head these columns 指令 / 权限.
        return {"command": "Commands", "permission": "Permissions",
                "指令": "指令", "权限": "权限"}.get(_strip(th.group(1)).lower())

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
def _dao(slug: str, b: str, s: dict) -> str:
    b = panel(slug, b, s["conversion"], s["conversion_title"])
    b = note(slug, b, s["wood"], "tip")
    b = table_to_cards(slug, b, s["yinyang"], 3, ("☯", "陰", "陽"))
    b = table_to_cards(slug, b, s["paths"], 3, ("魔", "正", "中"))
    b = note(slug, b, s["harvest"], "warn", s["harvest_title"])
    return b


def _techniques(slug: str, b: str, s: dict) -> str:
    b = list_to_cards(slug, b, s["performing"], 2, ("令", "器"))
    b = panel(slug, b, s["gates"], s["gates_title"], "ol")
    b = panel(slug, b, s["builtin"], s["builtin_title"])
    b = note(slug, b, s["stacking"], "tip", s["stacking_title"])
    return b


def _presets(slug: str, b: str, s: dict) -> str:
    # No explicit titles: each of these paragraphs opens with a bold lead-in,
    # which note() lifts into the callout heading and removes from the body.
    b = note(slug, b, s["apply"])
    b = note(slug, b, s["spectacle"], "tip")
    b = note(slug, b, s["adv_trib"], "warn")
    b = note(slug, b, s["defender"], "warn")
    b = note(slug, b, s["vein_rule"], "warn")
    b = note(slug, b, s["not_official"])
    return b


def _changelog(slug: str, b: str, s: dict) -> str:
    b = note(slug, b, s["upgrading"])
    b = note(slug, b, s["why"], "tip")
    b = note(slug, b, s["watch"])
    return b


def _addons(slug: str, b: str, s: dict) -> str:
    b = list_to_cards(slug, b, s["how"], 2, ("梯", "言", "族", "術"))
    b = note(slug, b, s["guarantee"], "tip")
    b = note(slug, b, s["running"])
    b = note(slug, b, s["made"])
    return b


def _faq(slug: str, b: str, s: dict) -> str:
    b = note(slug, b, s["why"], "tip")
    b = note(slug, b, s["vein_rule"], "warn")
    b = note(slug, b, s["stuck"])
    return b


def _api_addons(slug: str, b: str, s: dict) -> str:
    b = note(slug, b, s["threading"], "warn")
    b = note(slug, b, s["raw_text"])
    b = note(slug, b, s["stable_fields"], "warn")
    return b


def _sects(slug: str, b: str, s: dict) -> str:
    b = list_to_cards(slug, b, s["menu"], 3, ("宗", "覽", "榜"))
    b = panel(slug, b, s["hall"], s["hall_title"], "ul")
    b = note(slug, b, s["scour"], "warn", s["scour_title"])
    b = note(slug, b, s["ranks"], "", s["ranks_title"])
    return b


# Match strings, per recipe and per language. Kept beside the recipes rather
# than inlined so a page can be enhanced identically in both languages; the
# strings are still deliberately brittle, and an unmatched one warns.
STRINGS: dict[str, dict[str, dict[str, str]]] = {
    "dao": {
        "en": dict(conversion="Damage Conversion", conversion_title="Dao Damage Values",
                   wood="Wood is the healing path",
                   yinyang="Yin-Yang Balance", paths="Devil and Righteous Paths",
                   harvest="Devil Path's Qi harvest is rate-limited",
                   harvest_title="Farming is gated"),
        "zh": dict(conversion="伤害转化与相克", conversion_title="大道伤害数值",
                   wood="木是疗愈之道",
                   yinyang="阴阳之衡", paths="正魔两途",
                   harvest="魔道的灵气掠夺设有防刷限制",
                   harvest_title="刷杀无功"),
    },
    "techniques": {
        "en": dict(performing="Performing One",
                   gates="The Gates",
                   gates_title="Activation Order — first failure is what you are told",
                   builtin="The Built-In Arts", builtin_title="The Nine Arts",
                   stacking="stack in a defined order",
                   stacking_title="Stacking Qi Barrier and Iron Body"),
        "zh": dict(performing="如何施展",
                   gates="层层关卡",
                   gates_title="施展顺序 —— 第一个未通过的关卡即是所告之因",
                   builtin="内置功法", builtin_title="通用功法",
                   stacking="叠加时有明确的先后",
                   stacking_title="护体真气与金刚不坏的叠加"),
    },
    "changelog": {
        "zh": dict(upgrading="升级须知",
                   why="这个版本为何存在",
                   watch="去哪里关注新版本"),
    },
    "addons": {
        "zh": dict(how="兼容是如何做到的",
                   guarantee="那条要紧的保证",
                   running="运行一个扩展",
                   made="做了什么东西"),
    },
    "faq": {
        "zh": dict(why="为何会这样",
                   vein_rule="服主请注意：真正要紧的那条规矩",
                   stuck="还是没辙"),
    },
    "api-addons": {
        "zh": dict(threading="组件的创建必须走 accessor",
                   raw_text="原始文本在每种语言下都长得一模一样",
                   stable_fields="页面是按键把管理员正在编辑的内容与字段对应起来的"),
    },
    # The English presets page is hand-authored HTML with its callouts already
    # in place, so only the Chinese build needs a recipe here.
    "presets": {
        "zh": dict(apply="如何套用这些预设",
                   spectacle="留住那份声势",
                   adv_trib="开启晋阶天劫请慎重",
                   defender="别去动 War-Requires-Defender-Online",
                   vein_rule="灵脉恢复必须低于汲取",
                   not_official="这些是起点，而非官方平衡"),
    },
    "sects": {
        "en": dict(menu="The Sect Menu",
                   hall="The Sect Hall", hall_title="Claiming a Hall",
                   scour="scours the hall clean", scour_title="Inscribing empty-handed",
                   ranks="Elders (长老) are the middle rank", ranks_title="Ranks"),
        "zh": dict(menu="宗门菜单",
                   hall="宗门大殿", hall_title="设立大殿",
                   scour="尽数抹去", scour_title="空手镌刻",
                   ranks="长老是居中的职位", ranks_title="职位"),
    },
}

RECIPES = {
    "dao": _dao,
    "techniques": _techniques,
    "sects": _sects,
    "presets": _presets,
    "api-addons": _api_addons,
    "faq": _faq,
    "addons": _addons,
    "changelog": _changelog,
}


def enhance(slug: str, body: str, lang: str = "en") -> str:
    """Apply the global rules, then this page's recipe if it has one.

    Recipes match on heading text and prose, which differs per language, so
    every match string is looked up in STRINGS[slug][lang]. A page with no
    strings for this language is left plain rather than warned about - the
    translation simply does not exist yet. The global command/permission panel
    rule is bilingual and always applies.
    """
    body = panel_command_tables(body)
    recipe = RECIPES.get(slug)
    strings = STRINGS.get(slug, {}).get(lang)
    if recipe and strings:
        body = recipe(slug, body, strings)
    return body
