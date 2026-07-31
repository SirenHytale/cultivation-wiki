---
title: Titles
description: Cultivation Mod - the cosmetic titles a cultivator can earn and wear, and where they show
group: The Path
han: 号
---

### Titles

Cultivators earn **cosmetic titles** — one for each realm, one for each dao element, one for each side of the Righteous/Devil split, ranks for a sect's leader and elders, and a capstone for the peak of Void Refinement. Equip one from the **Titles** page on the menu bar. New in v0.7.0.

Titles are **purely cosmetic**. No stat, no permission, no gameplay change — a title is a thing you say about yourself, in the world's hearing.

* * *

#### Where a Title Shows

An equipped title is worn as `[Title] Name`:

*   **Above your head**, on the overhead nameplate.
*   **In chat**, in front of your name on every message.
*   **On the [rankings](/cultivation/commands/)** and **your [sect's](/cultivation/sects/) roster** — both work for offline players too.

Titles you have not earned **stay on the list, greyed**, each telling you what unlocks it — rather than hiding until they appear from nowhere. The "No Title" card at the top returns you to a plain name.

#### The Titles

| Title | Group | Earned by |
|:---|:---|:---|
| Wandering Cultivator | — | Nothing — always available, so the picker is never empty |
| Body Refinement Disciple | Cultivation Rank | Reaching [Body Refinement](/cultivation/realms/) or beyond |
| Qi Adept | Cultivation Rank | Qi Condensation or beyond |
| Foundation Adept | Cultivation Rank | Foundation Establishment or beyond |
| Golden Core Elder | Cultivation Rank | Golden Core Formation or beyond |
| Nascent Soul Sage | Cultivation Rank | Nascent Soul or beyond |
| Soul Formation Venerable | Cultivation Rank | Soul Formation or beyond |
| Void Sovereign | Cultivation Rank | Void Refinement |
| Peak of the Void | Legendary | Void Refinement at its **Peak** stage — the top of the ladder |
| the Righteous Path | Dao & Path | Walking the [Righteous Path](/cultivation/dao/) |
| the Devil Path | Dao & Path | Walking the Devil Path |
| Wood Dao … Void Dao | Dao & Path | One per element — your [chosen Dao](/cultivation/dao/) being that element |
| Sect Leader | Sect Rank | Leading a [sect](/cultivation/sects/) |
| Sect Elder | Sect Rank | Being a sect elder |

Twenty-three in all: seven realm titles, ten element titles, two paths, two sect ranks, the capstone, and the Wanderer. The Mortal Road — the unaligned middle — is deliberately not a title; a title states an allegiance, and the middle is the absence of one.

#### When the Earning Lapses

Realm titles ask for the realm **or beyond**, so they stay yours as you climb. Path, element and sect titles are read **live** at the moment you equip them — but an already-equipped title is *not* re-checked. Drift from the Righteous Path, or step down as leader, and the title you were wearing stays on; it is a memory the world lets you keep until you take it off. What you cannot do is equip it again without qualifying.

Titles are **account-wide**: switching [profiles](/cultivation/profiles/) keeps your equipped title, even onto a fresh Body Refinement cultivator wearing *Void Sovereign* — the title was earned by the account's deeds, and the picker only gates on your current cultivator when equipping anew.

#### Two Caveats

*   The overhead name is written through Hytale's shared display-name machinery, so a **nickname mod** that writes the same field will overwrite the title, or be overwritten by it — last writer wins.
*   There is no chat-format config: the `[Title] Name` shape is fixed (add-ons can reword it through the theming hook).

#### For Add-on Authors

The list is an open registry: `registerTitle` puts your own titles on the same picker, greyed-with-a-hint until earned, grouped under your own caption — see [API Registries](/cultivation/api/registries/). No new [placeholders](/cultivation/placeholders/) were added for titles in v0.7.0.
