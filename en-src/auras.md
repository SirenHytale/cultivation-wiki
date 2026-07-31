---
title: Auras
description: Cultivation Mod - the visible Qi a cultivator gives off, what its color and size say, and the meditation aura
group: The Path
han: 芒
---

### Auras

Every cultivator gives off an **aura** — visible Qi that says what they are at a glance, from across a field. Realm sets its **color** and how thickly it pours off you; your sub-stage sets its **size**. New in v0.7.0, on by default, and readable by anyone: auras are the public face of the ladder, where the [HUD](/cultivation/qi-gathering/) is the private one.

* * *

#### The Realm Aura

| Realm | Color | Motes per second |
|:---|:---|:---|
| Body Refinement | earthy bronze (`#C08A5A`) | 2 |
| Qi Condensation | pale sky (`#8FD4F0`) | 3 |
| Foundation Establishment | spring jade (`#7FD8A0`) | 4 |
| Golden Core Formation | gold (`#F0C44F`) | 5 |
| Nascent Soul | amethyst (`#B888EC`) | 6 |
| Soul Formation | moonlit white (`#E4E8FA`) | 7 |
| Void Refinement | void indigo (`#9B5EFF`) | 8 |

The density climbs with the realm — a Void Refinement cultivator sheds four times the motes a Body Refinement one does. Your **sub-stage sets the width**: a Peak cultivator's aura stands roughly 1.7× as wide as an Early one of the same realm, so the two things worth reading about a stranger are both there before a word is spoken.

The aura shows your **effective** realm — a technique or an add-on that temporarily raises your realm raises your aura with it.

Auras are visible out to about **50 blocks**, deliberately shorter than Hytale's own entity range so the effect thins out before it clutters a busy town.

#### The Meditation Aura

Sitting down to [meditate](/cultivation/qi-gathering/) gives you a second, different aura. Where the realm aura rises and spreads, this one **converges inward** — Qi being drawn out of the land toward you. It deepens through three stages the longer you sit:

| Stage | After | Reads as |
|:---|:---|:---|
| Stirring | sitting down | a faint drift |
| Gathering | 45 seconds | a steady draw |
| Converging | 3 minutes | the land visibly feeding you |

The clock only advances on ticks that **actually drew Qi**, so the aura stops deepening when the vein beneath you runs dry — a bystander can tell a fruitful meditation from an empty one. Standing up resets it; so does logging out.

#### Your Three Switches

In **Settings**, under *Cultivation Aura*:

| Setting | Default | Means |
|:---|:---|:---|
| **Give off an aura** | on | Whether anyone sees yours. Also toggled by `/cultivation aura` |
| **Show me my own aura** | on | Whether *you* see yours |
| **Show me other cultivators' auras** | on | Whether you see anyone else's — the one to reach for on a busy server |

The first switch is yours as the emitter; the other two only filter what your own client is shown. Hiding your aura hides it from everyone — there is no reading someone who chose not to be read.

* * *

#### Server Owners

| Variable Name | Default Value | Description |
|:---|:---|:---|
| `Aura-Enabled` | true | The whole feature, both auras, server-wide. |
| `Aura-Pulse-Interval-Seconds` | 4.0 | How often each aura is re-spawned at its player's position. Clamped between 1.0 and 6.0 — the assets are sized so exactly two pulses overlap at the default. |

Both live in the root `Config.json` — see the [Core config page](/cultivation/config/core/). The colors themselves are **baked into the particle assets** rather than configurable — recoloring them means editing `Server/Particles/Cultivation/RealmAura/` (the mod's `tools/gen_realm_auras.py` regenerates the set).

Auras are spawn packets, not entities — nothing about them exists server-side between pulses, and a player who disabled theirs costs nothing at all.
