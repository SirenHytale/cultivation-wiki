#!/usr/bin/env python3
"""Generate data/skilltree.js — the node data the build planner runs on.

This is a direct port of the mod's own SkillTreeRegistry.build(), so the planner
matches the game rather than an approximation. If the mod's registry changes,
re-read it and update the constants below; the assertions at the bottom catch
the obvious kinds of drift (node count, per-branch cost).

Source of truth:
  Cultivation/src/main/java/plugin/siren/ECS/SkillTree/SkillTreeRegistry.java
  Cultivation/src/main/java/plugin/siren/ECS/SkillTree/SkillTreeBranch.java
  Cultivation/src/main/java/plugin/siren/ECS/SkillTree/SkillTreeStat.java

    python tools/make_skilltree_data.py
"""
from __future__ import annotations

import json
import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "data" / "skilltree.js"

# --- SkillTreeStat -------------------------------------------------------
PERCENT_STATS = {
    "MOVE_SPEED_PERCENT", "DAMAGE_PERCENT", "QI_GAIN_PERCENT",
    "RITUAL_SPEED_PERCENT", "DAMAGE_REDUCTION_PERCENT",
    "QI_COST_REDUCTION_PERCENT", "LIFEBOUND_XP_GAIN_PERCENT",
}
STAT_LABEL = {
    "HEALTH": "Max Health", "MANA": "Mana", "STAMINA": "Stamina", "BREATH": "Breath",
    "MOVE_SPEED_PERCENT": "Movement Speed", "DAMAGE_PERCENT": "Damage",
    "QI_GAIN_PERCENT": "Qi Gain Rate", "RITUAL_SPEED_PERCENT": "Ritual Speed",
    "DAMAGE_REDUCTION_PERCENT": "Damage Reduction",
    "QI_COST_REDUCTION_PERCENT": "Qi Cost Reduction",
    "LIFEBOUND_XP_GAIN_PERCENT": "Life-Bound XP Gain",
    "VEIN_DRAIN_RADIUS": "Vein Drain Radius",
}

# --- SkillTreeBranch (enum order IS ring order) --------------------------
BRANCHES = [
    ("VITALITY",   "Vitality",   "HEALTH",                   0,   "體"),
    ("RESILIENCE", "Resilience", "BREATH",                   40,  "韌"),
    ("MIGHT",      "Might",      "DAMAGE_PERCENT",           80,  "力"),
    ("WARDING",    "Warding",    "DAMAGE_REDUCTION_PERCENT", 120, "護"),
    ("INSIGHT",    "Insight",    "QI_GAIN_PERCENT",          160, "悟"),
    ("HARMONY",    "Harmony",    "RITUAL_SPEED_PERCENT",     200, "和"),
    ("SWIFTNESS",  "Swiftness",  "MOVE_SPEED_PERCENT",       240, "疾"),
    ("ENDURANCE",  "Endurance",  "STAMINA",                  280, "耐"),
    ("SPIRIT",     "Spirit",     "MANA",                     320, "靈"),
]
BRANCH_COLOR = {
    "VITALITY": "#D97E7E", "RESILIENCE": "#C98A4E", "MIGHT": "#E0B44C",
    "WARDING": "#9EC96F", "INSIGHT": "#6FBF9B", "HARMONY": "#5FB6C9",
    "SWIFTNESS": "#7EA8D9", "ENDURANCE": "#A98BD1", "SPIRIT": "#D07EB8",
}

FLAT_TIER_AMOUNTS = [10.0, 20.0, 35.0, 55.0]
PERCENT_TIER_AMOUNTS = [3.0, 5.0, 8.0, 12.0]
INSIGHT_TIER_AMOUNTS = [4.0, 7.0, 10.0, 14.0]
TIER_AMOUNTS = {
    "VITALITY": FLAT_TIER_AMOUNTS, "RESILIENCE": FLAT_TIER_AMOUNTS,
    "MIGHT": PERCENT_TIER_AMOUNTS, "WARDING": PERCENT_TIER_AMOUNTS,
    "INSIGHT": INSIGHT_TIER_AMOUNTS, "HARMONY": PERCENT_TIER_AMOUNTS,
    "SWIFTNESS": PERCENT_TIER_AMOUNTS, "ENDURANCE": FLAT_TIER_AMOUNTS,
    "SPIRIT": FLAT_TIER_AMOUNTS,
}

FORK_ANGLE_OFFSET, TIER7_SUB_OFFSET = 10, 5
TIER_COSTS = [1, 1, 1, 1]
FORK_COST, TIER6_COST, TIER7_COST, TIER8_COST = 2, 2, 3, 4

FORK_PRIMARY = (55.0, 7.0)      # (flat, percent)
FORK_SECONDARY = (30.0, 4.0)
TIER6_PRIMARY, TIER6_SECONDARY = (80.0, 10.0), (45.0, 6.0)
TIER7_PRIMARY, TIER7_SECONDARY = (110.0, 12.0), (60.0, 7.0)

TIER8_STATS = ["QI_COST_REDUCTION_PERCENT", "LIFEBOUND_XP_GAIN_PERCENT", "VEIN_DRAIN_RADIUS"]
TIER8_AMOUNT = {"QI_COST_REDUCTION_PERCENT": 8.0, "LIFEBOUND_XP_GAIN_PERCENT": 25.0,
                "VEIN_DRAIN_RADIUS": 1.0}


def amount(stat: str, flat: float, percent: float) -> float:
    """SkillTreeRegistry.primaryAmount — flavor decides which number applies."""
    return percent if stat in PERCENT_STATS else flat


def bonus(stat: str, amt: float) -> dict:
    return {"stat": stat, "amount": amt, "pct": stat in PERCENT_STATS}


def build() -> list[dict]:
    nodes: list[dict] = []
    names = [b[0] for b in BRANCHES]

    for idx, (key, label, stat, angle, glyph) in enumerate(BRANCHES):
        prev_stat = BRANCHES[(idx - 1) % len(BRANCHES)][2]
        next_stat = BRANCHES[(idx + 1) % len(BRANCHES)][2]
        tiers = TIER_AMOUNTS[key]

        # Tiers 1-4: the branch's own spoke.
        previous_id = None
        for i, amt in enumerate(tiers):
            tier = i + 1
            nid = f"{key}_{tier}"
            nodes.append({
                "id": nid, "branch": key, "tier": tier, "cost": TIER_COSTS[i],
                "angle": angle, "prereq": previous_id, "prereq2": None,
                "bonuses": [bonus(stat, amt)],
            })
            previous_id = nid

        tier4_id = f"{key}_4"

        # Tier 5: the first hybrid pair, borrowing from each ring neighbour.
        def fork(side: str, neighbour_stat: str, offset: int) -> dict:
            return {
                "id": f"{key}_5{side}", "branch": key, "tier": 5, "cost": FORK_COST,
                "angle": angle + offset, "prereq": tier4_id, "prereq2": None,
                "bonuses": [bonus(stat, amount(stat, *FORK_PRIMARY)),
                            bonus(neighbour_stat, amount(neighbour_stat, *FORK_SECONDARY))],
            }

        fork_a = fork("A", prev_stat, -FORK_ANGLE_OFFSET)
        fork_b = fork("B", next_stat, FORK_ANGLE_OFFSET)
        nodes += [fork_a, fork_b]

        # Tiers 6 and 7 continue the parent's exact stat pairing, larger.
        def child(parent: dict, tier: int, path: str, cost: int,
                  primary: tuple[float, float], secondary: tuple[float, float],
                  offset: int) -> dict:
            bs = []
            for b in parent["bonuses"]:
                scale = primary if b["stat"] == stat else secondary
                bs.append(bonus(b["stat"], amount(b["stat"], *scale)))
            return {"id": f"{key}_{tier}{path}", "branch": key, "tier": tier, "cost": cost,
                    "angle": offset, "prereq": parent["id"], "prereq2": None, "bonuses": bs}

        t6a = child(fork_a, 6, "A", TIER6_COST, TIER6_PRIMARY, TIER6_SECONDARY, fork_a["angle"])
        t6b = child(fork_b, 6, "B", TIER6_COST, TIER6_PRIMARY, TIER6_SECONDARY, fork_b["angle"])
        nodes += [t6a, t6b]

        for parent, paths in ((t6a, ("A1", "A2")), (t6b, ("B1", "B2"))):
            for path, sign in zip(paths, (-1, 1)):
                nodes.append(child(parent, 7, path, TIER7_COST, TIER7_PRIMARY, TIER7_SECONDARY,
                                   parent["angle"] + sign * TIER7_SUB_OFFSET))

        # Tier 8: the branch's single transcendence capstone, dual-prerequisite.
        t8_stat = TIER8_STATS[idx % len(TIER8_STATS)]
        nodes.append({
            "id": f"{key}_8", "branch": key, "tier": 8, "cost": TIER8_COST, "angle": angle,
            "prereq": f"{key}_7A2", "prereq2": f"{key}_7B1",
            "bonuses": [bonus(t8_stat, TIER8_AMOUNT[t8_stat])],
        })

    return nodes


def main() -> None:
    nodes = build()

    # Guard against silent drift from the Java source.
    assert len(nodes) == 117, f"expected 117 nodes, built {len(nodes)}"
    by_branch: dict[str, int] = {}
    for n in nodes:
        by_branch[n["branch"]] = by_branch.get(n["branch"], 0) + n["cost"]
    assert set(by_branch.values()) == {28}, f"per-branch cost drifted: {by_branch}"
    ids = {n["id"] for n in nodes}
    for n in nodes:
        for k in ("prereq", "prereq2"):
            assert n[k] is None or n[k] in ids, f"{n['id']} -> missing prereq {n[k]}"

    payload = {
        "branches": [{"key": k, "label": l, "stat": s, "angle": a, "glyph": g,
                      "color": BRANCH_COLOR[k]} for k, l, s, a, g in BRANCHES],
        "statLabels": STAT_LABEL,
        "percentStats": sorted(PERCENT_STATS),
        "nodes": nodes,
        "totalCost": sum(n["cost"] for n in nodes),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "/* GENERATED by tools/make_skilltree_data.py — do not edit by hand.\n"
        "   Ported from the mod's SkillTreeRegistry so the planner matches the game. */\n"
        "window.SKILL_TREE = " + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8")

    print(f"wrote {OUT.name}: {len(nodes)} nodes, "
          f"{payload['totalCost']} points to fill, 28 per branch")


if __name__ == "__main__":
    main()
