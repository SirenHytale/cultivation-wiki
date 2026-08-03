---
title: Body Tempering
description: Cultivation Mod - the second ladder, climbed by taking blows rather than gathering Qi, and how armor blunts it
group: The Path
han: 體
---

### Body Tempering

Every realm on the Qi ladder is climbed by **gathering**. Body tempering (炼体) is climbed by **enduring**: your body tempers from damage that actually reaches it, and the reward is a body that turns damage aside.

New in v0.7.1. It runs **alongside** the realms, not inside them — a Void Refinement cultivator can be completely untempered, and a fully tempered body can belong to somebody who has never condensed Qi.

* * *

#### It is not the Body Refinement realm

The names collide and the systems do not. **Body Refinement** is the first rung of the [realm ladder](/cultivation/realms/), left by gathering Qi. **Body Tempering** is a separate track with its own level, its own curve and its own reward. You have both at once.

* * *

#### Earning it

XP comes from **damage that actually reached you** — measured after armor, after every other reduction, counting only what got through.

That is the whole design. Armor turns the blow aside, and turns the lesson aside with it. Blows below `Min-Damage-For-Xp` are ignored outright.

**What you wear scales it twice over:**

| Wearing | XP earned |
| --- | --- |
| Nothing | Full rate |
| Any ordinary armor | 35% of full |
| Onyxium | 23.5% of full |
| Prisma | 10% of full |

Partial sets count partially: one piece of a set is a quarter of the effect, so a single helmet is a real decision.

___

#### Attrition — the standing-in-a-fire rule

**New in v0.7.4.** Attrition means damage with **nothing holding it**: an effect ticking (Burn, Poison), drowning, suffocation, a fall, a damaging block. A mob or a player hitting you is never attrition, so **ordinary combat is untouched by any of this**.

It exists because the ladder could be farmed on a brazier. A vanilla brazier applies Burn for 5 Fire damage a second — which a tempered body shrugs off and a meat skewer out-heals entirely. Free progress for standing still, forever.

Two keys close it, and **both** must be satisfied for attrition to temper at all:

| Variable Name | Default | Description |
|:---|:---|:---|
| `Attrition-Min-Damage-Percent-Of-Max-Health` | 8 | A blow must cost at least this share of your **maximum** health. |
| `Attrition-Xp-Interval-Seconds` | 5 | Attrition can temper at most once per this many seconds. |

The first makes the bar **scale with the body** rather than standing still, so a hazard that genuinely threatens a novice is beneath the notice of a cultivator who has doubled their health pool. The second exists because the real problem with a burning block is not how hard it hits but that it hits *forever*.

The 8% default is chosen against that exact number. A player's base maximum health is 100, so the bar sits at 8 and Burn's 5 does not clear it even on a bare-skinned novice with no fire resistance at all — while a bad fall or a lava bath still counts.

Raise it if your pack has harsher ambient hazards. Lowering it toward 5 if you *want* fire to temper re-opens the loop for anyone at base health, since 5 is exactly Burn's damage. Setting either key to `0` switches it off; setting both to `0` restores the pre-0.7.4 behavior where a fire tempered you as fast as it could tick.

* * *

#### The reward

A tempered body **turns damage aside**, and that scales on the same two things — how far up the ladder you are, and what you are wearing:

| At max level, wearing | Damage reduced |
| --- | --- |
| Nothing | **40%** |
| Halfway armored | 27.5% |
| The heaviest set | **15%** |

Below max level you get a proportion of it: a level 50 of 100 body wearing nothing gets half of 40%.

This is the tempered body itself. It **stacks with** your armor's own resistance rather than replacing it — so heavy armor is still the safer choice moment to moment. What it is not is the *faster* choice.

* * *

#### Max level is meant to be far away

The curve compounds. At the defaults the last level costs nearly **three thousand times** the first, and capping out bare-skinned means taking roughly **1.5 million damage**. In full armor it is ten times that.

This is not a weekend's work and is not designed to be. A cultivator who has capped it has spent a very long time choosing to be hit.

* * *

#### Where to see it

Your **Overview** page shows the whole trade: your level, how armored you currently are, what that costs you per blow, and how much damage your body is turning aside right now.

Swap a chestplate and reopen it — the numbers move. That is the clearest way to understand the system.

* * *

#### For server owners

`Cultivation/BodyTemperingConfig.json` holds all of it: the curve, the ceiling, the XP rate, both ends of the armor scale, and both ends of the reduction.

**Armor is ranked two ways.** By default `Protection-Mode` is `Tiered`, which ranks by family — Prisma highest, Onyxium second, everything else equal — because that is the ranking most servers actually play with.

If your server retunes armor, switch it to `Live` and the system scores armor on **your own numbers instead**: resistance across the damage causes you list, the max health a set grants, and optionally item level, all read from the items themselves at the moment of the blow. Armor added by another mod is scored on exactly the same terms as vanilla's, with nothing to register and no list to maintain.

Switch the whole system off with `Body-Tempering-Enabled`; the damage reduction goes with it.

* * *

#### With Endless Leveling

Body tempering's damage reduction is handed to **Endless Leveling's Defense attribute** rather than applied separately, so the two mods produce one combined calculation instead of quietly compounding two independent reductions. See [Compatibility](/cultivation/compatibility/).
