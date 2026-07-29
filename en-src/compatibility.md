---
title: Compatibility
description: Cultivation Mod - how Cultivation behaves alongside Endless Leveling, PlaceholderAPI and Marriage
group: The World
han: 和
---

# Compatibility

Cultivation is built to sit beside other mods rather than on top of them. Three
are detected automatically at startup, and each changes what Cultivation does —
without a single line of configuration.

None of them are required. On a server without them, the relevant feature is
simply absent; nothing errors, nothing warns, and no setting has to be turned
off.

| Mod | What it unlocks | Required? |
| --- | --- | --- |
| **Endless Leveling** | Cultivation hands its stat bonuses to EL so the two progressions add instead of multiplying | No |
| **PlaceholderAPI** | ~60 `%cultivation_...%` placeholders for chat, scoreboards, tab lists and signs | No |
| **Marriage** | [Partnered Cultivation](/cultivation/partnered-cultivation/) — married couples cultivating together | No |

Each is found once during startup and reported in the server log, so you can
always tell what Cultivation thinks is installed:

```
[Cultivation] Endless Leveling found - handing over max health and outgoing damage so the two do not stack.
[Cultivation] PlaceholderAPI found - %cultivation_...% placeholders are available.
[Cultivation] Marriage 2.0.0 found - Partnered Cultivation is available.
```

## Endless Leveling

Both mods raise the same two numbers: **max health** and **outgoing damage**.
Left alone they compose by *multiplication* — a cultivator's realm bonus lands on
top of an Endless Leveling character's level bonus, so a player deep into both
carries the product of two full power curves. That is not what either mod is
balanced for.

With Endless Leveling installed, Cultivation **stops applying those two itself**
and publishes them into Endless Leveling's own bonus channel instead. Endless
Leveling then performs one calculation that already contains Cultivation's share.

The important consequence: **your cultivation numbers are unchanged in
isolation.** Health still comes from your realm, damage still scales with your
level, and your race, skill tree and technique multipliers still apply to them
exactly as before. Only the *stacking* changes — the two progressions now add
rather than multiply.

Nothing else Cultivation does is affected. Qi, realms, rituals, sects, daos,
techniques, beasts, abodes and formations are Cultivation's alone.

### Tuning the handoff

Settings live in `Compatibility/EndlessLevelingConfig.json`, and appear as their
own section in the [admin menu](/cultivation/commands/) — hidden entirely unless
Endless Leveling is actually installed.

| Setting | Default | What it does |
| --- | --- | --- |
| `Handoff-Health` | `true` | Hand max health to Endless Leveling |
| `Handoff-Damage` | `true` | Hand outgoing damage to Endless Leveling |
| `Handoff-Health-Scale` | `1.0` | Fraction of Cultivation's health bonus handed over |
| `Handoff-Damage-Scale` | `1.0` | Fraction of Cultivation's damage bonus handed over |

The two scale values exist so a server running both mods can be rebalanced
without retuning the Cultivation config that a Cultivation-only server also
reads. Setting `Handoff-Health-Scale` to `0.5` hands over half of what
Cultivation would have applied.

Turning a handoff **off** returns that stat to Cultivation — correct in
isolation, and stacked on top of Endless Leveling when both are installed. The
switch takes effect on the cultivator's next progression change, and the bonus
already published is withdrawn at the same moment, so the two can never both be
applied at once.

## PlaceholderAPI

Cultivation registers a `cultivation` expansion, so anything that runs text
through PlaceholderAPI — chat formats, scoreboards, tab lists, holograms, signs —
can show a cultivator's standing.

There is nothing to configure: installing PlaceholderAPI *is* the setup. See the
full list on the [Placeholders](/cultivation/placeholders/) page, or run
`/papi info cultivation` in game.

## Marriage

The Marriage mod is what defines who is married to whom, and
[Partnered Cultivation](/cultivation/partnered-cultivation/) is gated on it
entirely. Without Marriage there is nothing to define a partner, so the whole
feature stays off no matter what `Society/PartnerConfig.json` says.

## Writing your own compatibility

Cultivation's API is designed for exactly this. An add-on can read every config
file, drive progression, register its own settings into the admin menu, and
listen to ~135 cancellable events across ten subsystems.

Two calls are worth knowing if your mod applies stats of its own:

```java
// On a server running Endless Leveling, EL is where a stat bonus belongs -
// Cultivation defers to it, and an addon that stacks on top would undo that.
if (CultivationAPI.isEndlessLevelingInstalled()) { ... }

// True only when PlaceholderAPI is present AND accepted our expansion.
if (CultivationAPI.isPlaceholderApiRegistered()) { ... }
```

See [Building Add-ons](/cultivation/api/addons/) and the
[API Reference](/cultivation/api/reference/) for the rest.
