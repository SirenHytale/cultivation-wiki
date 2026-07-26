---
title: 核心配置
description: Cultivation 模组的 Config.json：灵气曲线与每级属性加成，以及调整它们的后果。
group: 配置
han: 配
---

### 核心配置

这是唯一一份位于 `mods/Siren_Cultivation/` 根目录的文件。它承载着推导出每个境界与子阶段所需灵气的那条曲线，以及修士每攀升一级所得的固定属性加成。若你只打算改动一份文件来让服务器更难或更宽松，那就是它。曲线产出的结果见[境界与阶段](/cultivation/realms/)，灵气本身从何而来见[聚灵采气](/cultivation/qi-gathering/)。

#### Config

核心灵气曲线与每级属性加成，位于路径 `mods/Siren_Cultivation/Config.json`。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "Cultivation Config" | 此配置文件的名称。 |
| "ConfigVersion" | 4 | 你为此插件加载时的当前版本。 |
| "Base-Qi-Requirement" | 175.0 | 从最初的子阶段（炼体期·初期）进阶所需的灵气量。曲线中其余每一项需求都以这个基数缩放。 |
| "Description-Base-Qi-Requirement" | 一段解释上述数值的长字符串。 | 重述这是第一个子阶段的需求，且整条曲线都由它缩放而来。 |
| "Substage-Growth-Rate" | 1.55 | 在一个境界之内每攀升一个子阶段（初期 → 中期 → 后期 → 圆满），灵气需求所乘的倍率。 |
| "Realm-Base-Multiplier" | 4.25 | 每达到一个境界，灵气需求所乘的倍率，叠加在子阶段增长之上。 |
| "Realm-Breakthrough-Multiplier" | 5.5 | 仅在境界突破（圆满 → 下一境界的初期）的灵气消耗上额外施加的倍率，叠加于常规曲线之上。 |
| "Description-Realm-Breakthrough-Multiplier" | 一段解释上述数值的长字符串。 | 说明正是这一层额外倍率，让境界突破远比一次寻常的子阶段进阶更为郑重。 |
| "Health-Bonus-Per-Level" | 4.0 | 每获得一个总子等级（境界 × 4 + 阶段）所加的最大生命值。 |
| "Damage-Percent-Bonus-Per-Level" | 2.0 | 每获得一个总子等级所增的伤害百分比。 |

#### 关于曲线

某一次升级所需的灵气，是 `Base-Qi-Requirement` 在境界内每个子阶段按 `Substage-Growth-Rate` 增长、每已达到一个境界按 `Realm-Base-Multiplier` 增长的结果；仅当这次升级是境界突破时，才在其上再叠一层 `Realm-Breakthrough-Multiplier`。调高 `Substage-Growth-Rate` 会让境界内的攀爬更陡；调高 `Realm-Base-Multiplier` 则会拉大境界之间的鸿沟。

另有两套系统会削减玩家实际付出的量：第 8 层的「灵气消耗减免」天赋属性（其上限由[天赋树配置](/cultivation/config/cultivation/)中的 `Qi-Cost-Reduction-Cap-Percent` 约束），以及种族的 `Qi-Gain-Rate-Percent-Bonus`（见[种族配置](/cultivation/config/race/)）—— 后者提高的是收入，而非降低成本。

这两项属性加成是按总子等级施加的，计法为 `境界 × 4 + 阶段`，因此它们在整条进阶之路上平滑增长，而不是只在境界交界处跳一下。来自 `Health-Bonus-Percent` 与 `Damage-Bonus-Percent` 的种族加成，则叠加在这些之上。
