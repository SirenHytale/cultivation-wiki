---
title: 核心配置
description: Cultivation 模组的 Config.json：灵气曲线与每级属性加成，以及调整它们的后果。
group: 配置
han: 配
---

### 核心配置

这是唯一一份位于 `mods/Siren_Cultivation/` 根目录的文件。它承载着推导出每个境界与子阶段所需灵气的那条曲线，以及修士每攀升一级所得的固定属性加成。若你只打算改动一份文件来让服务器更难或更宽松，那就是它。曲线产出的结果见[境界与阶段](/cultivation/realms/)，灵气本身从何而来见[聚灵采气](/cultivation/qi-gathering/)。

#### Config

核心灵气曲线、每级属性加成，以及[气息](/cultivation/auras/)与[屏显通告](/cultivation/notices/)的全服开关，位于路径 `mods/Siren_Cultivation/Config.json`。

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
| "Aura-Enabled" | true | [气息](/cultivation/auras/)的全服总开关 —— 境界气息与打坐气息皆归其管。只想藏起自己的气息、或不愿看见他人气息的玩家，在设置中另有各自独立的三个开关可用。 |
| "Aura-Pulse-Interval-Seconds" | 4.0 | 每道气息在其所属玩家位置重新生成的间隔。数值限制在 1.0 至 6.0 之间 —— 粒子素材按默认值设计，恰好两次脉冲会有所交叠。 |
| "Aura-Desc" | 一段解释上述数值的长字符串。 | 重述这一全服总开关，与各玩家在设置中独立开关之间的分工。 |
| "Notice-Titles-Enabled" | true | 境界突破、子阶段进阶、跌落境界与宗门变动时所现的[全屏标题](/cultivation/notices/)。聊天栏仍会道出这些标题所现的一切，故关闭它们无损分毫信息。 |
| "Notice-Notifications-Enabled" | true | 较次要时刻所现的[角落通知](/cultivation/notices/) —— 如解锁一个天赋节点、[本命法宝](/cultivation/lifebound/)升级、一次洗点，或一场仪式开始。 |
| "Breakthrough-Title-Radius-Chunks" | 9 | 境界突破向周围其他修士播告的范围，以区块计的半径距离。限制在 0 至 32 之间；0 则让每一次突破都只归你私人所知。 |
| "Notice-Desc" | 一段解释上述数值的长字符串。 | 指出无论这些开关如何设置，走火入魔与心魔劫仍各自保有专门撰写的标题。 |

#### 关于曲线

某一次升级所需的灵气，是 `Base-Qi-Requirement` 在境界内每个子阶段按 `Substage-Growth-Rate` 增长、每已达到一个境界按 `Realm-Base-Multiplier` 增长的结果；仅当这次升级是境界突破时，才在其上再叠一层 `Realm-Breakthrough-Multiplier`。调高 `Substage-Growth-Rate` 会让境界内的攀爬更陡；调高 `Realm-Base-Multiplier` 则会拉大境界之间的鸿沟。

另有两套系统会削减玩家实际付出的量：第 8 层的「灵气消耗减免」天赋属性（其上限由[天赋树配置](/cultivation/config/cultivation/)中的 `Qi-Cost-Reduction-Cap-Percent` 约束），以及种族的 `Qi-Gain-Rate-Percent-Bonus`（见[种族配置](/cultivation/config/race/)）—— 后者提高的是收入，而非降低成本。

这两项属性加成是按总子等级施加的，计法为 `境界 × 4 + 阶段`，因此它们在整条进阶之路上平滑增长，而不是只在境界交界处跳一下。来自 `Health-Bonus-Percent` 与 `Damage-Bonus-Percent` 的种族加成，则叠加在这些之上。
