---
title: Spirit Sense
description: Cultivation Mod - Spirit Sense, a cultivator's perception of the ambient Qi in the land
group: The Path
han: 感
---

### Spirit Sense

**Spirit Sense (灵气感知)** is a cultivator's perception of the Qi in the land around them. Still your mind and the ambient Qi takes shape — motes drifting up from the ground you sit on, and a beacon standing over a [rich or dragon vein](/cultivation/qi-gathering/) from across the landscape. New in v0.6.0, and switched on by default (`Spirit-Sense-Enabled`).

Toggle it with `/cultivation sense`. It costs nothing to run and never expires.

* * *

#### It Unlocks in Two Steps

The gate is deliberately split, so that perception arrives before precision.

| Stage | Config | Default | What you get |
|:---|:---|:---|:---|
| **Qualitative** | `Spirit-Sense-Min-Realm` | 2 (Foundation Establishment) | The reading in **words** only |
| **Precise** | `Spirit-Sense-Precise-Min-Realm` | 4 (Nascent Soul) | Exact Qi **numbers** as well |

Below the precise realm the HUD tells you whether the Qi runs **barren**, **thin**, **steady**, **ample** or **overflowing**, and whether you are standing on **common ground**, **a rich vein** or **a dragon vein**. It also flags **turbid** ground, where the vein's Qi is evil-aligned and will pull your [Yin-Yang balance](/cultivation/dao/) as you meditate on it.

At or beyond the precise realm, a second HUD line adds the raw figures: current Qi, the chunk's ceiling, and the percentage between them.

Words before numbers is the point. A Foundation Establishment cultivator can tell good ground from bad, which is all they need; reading the exact reserve of a vein is a later art.

#### Your Reach Grows With You

| Variable Name | Default Value | Description |
|:---|:---|:---|
| `Spirit-Sense-Radius-Per-Realm` | 1 | Extra chunks of reach per realm past the unlock. |
| `Spirit-Sense-Max-Radius-Chunks` | 4 | The ceiling on that reach. |

With the defaults a Foundation Establishment cultivator senses **only their own chunk**, and a Void Refinement one senses a **9×9 area** around them. Sensing further is a genuine reason to keep climbing.

* * *

#### What You Actually See

**Motes** rise from the ground within your reach, thicker where the Qi is richer — the ambient reading, rendered.

**Vein beacons** are the reason to turn it on while travelling. A column of light stands over any chunk whose vein is good enough to bother sitting on, so hunting for a breakthrough site is something you *look* for rather than something you stumble onto.

**The Spirit Sense panel** is the close view, on the menu bar beside the Codex. It lays the chunks around you out as a grid, each tile tinted with **that ground's real colour, taken from Hytale's own world map** — so it reads as terrain rather than as a table of numbers. A gold wash marks a rich vein, jade a dragon vein, and the chunk you are standing on is ringed. Once your perception reads exactly, each tile carries **the Qi its vein actually holds**, with how full that vein is running beneath it — because 300 Qi is a brimming common vein or a spent dragon, and the amount alone cannot tell you which.

Ground you have never explored **stays veiled**. You still feel its Qi through the earth — the reading is there — but you have not laid eyes on the land, and the panel says so rather than inventing a colour for it.

**Map markers** are the wide view. Rich and dragon veins within your perception appear as pins on the world map you already use, terrain and all, with no custom screen involved. They arrive after your first sense pulse and disappear if you walk into another world. They are a *reading*, not a record — switch Spirit Sense off, or log out, and the pins are cleared rather than left standing over wherever you last sensed from.

All three obey **the same perception**: the same radius, and the same deep-or-thin before exact numbers. Nothing here shows you more than your sense already granted.

| Variable Name | Default Value | Description |
|:---|:---|:---|
| `Spirit-Sense-Tick-Interval-Seconds` | 2.5 | How often the sense re-reads the world and re-pulses. The particles are sized to finish inside one interval, so raising it thins the effect and lowering it thickens it — and costs more packets. |
| `Spirit-Sense-Mote-Budget` | 10 | Most ambient motes spawned per pulse, per player. The main cost knob. |
| `Spirit-Sense-Beacon-Min-Tier` | 1 | Lowest vein tier that raises a beacon. 0 = every chunk, 1 = rich and better, 2 = dragon only, 3 = never. |

#### Server Owners

The whole feature is one switch: `Spirit-Sense-Enabled` in `Cultivation/SpiritVeinConfig.json`. Turning it off leaves [Qi gathering](/cultivation/qi-gathering/) entirely unchanged — the sense only ever *reads*.

If the effect is costing you packets on a busy server, lower `Spirit-Sense-Mote-Budget` before raising the tick interval: the motes are the bulk of the traffic, and a longer interval makes the effect visibly stutter.

Full settings on the [Cultivation config page](/cultivation/config/cultivation/).
