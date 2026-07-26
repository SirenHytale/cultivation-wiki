---
title: 种族配置
description: Cultivation 模组的每族独立属性文件：共用的字段结构、内置三族的数值与阴气偏向。
group: 配置
han: 配
---

### 种族配置

每个可选种族在 `mods/Siren_Cultivation/Race/` 中各有一份自己的文件 —— `Human.json`、`Demon.json` 与 `Deity.json`。它们彼此完全独立，却共用同一套字段结构，因此重调某一族绝不会波及其余。这些数字在实战中意味着什么，见[种族](/cultivation/races/)页。

种族文件是常规结构的唯一例外：它们不带 `ConfigName` 与 `ConfigVersion`，因为其全部内容都是服主理应完全自主的数值。

由其他模组注册的种族不会出现在此处。第三方种族是通过 `CultivationAPI.registerRace`，以其自身插件的配置文件（或一个纯常量）为其属性提供支撑 —— 见 [Cultivation 接口](/cultivation/api/)。

#### 每族配置

共用的字段结构，位于路径 `mods/Siren_Cultivation/Race/Human.json`、`mods/Siren_Cultivation/Race/Demon.json` 与 `mods/Siren_Cultivation/Race/Deity.json`。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "Description" | 各族不同 —— 见下表。 | 种族选择菜单中显示的风味文本。 |
| "Unlock-Realm" | "BodyRefinement" | 玩家的修为须达到此境界，方可在种族菜单中选择该族。接受境界名称如 `BodyRefinement` 或 `GoldenCoreFormation`，亦接受从 1 起算的境界序号。 |
| "Description-Unlock-Realm" | 一段解释上述数值的长字符串。 | 列出可接受的取值形式，并指出除非在 [RaceSystemConfig](/cultivation/config/cultivation/) 中禁用 `Race-Admin-Bypasses-Realm-Gate`，否则管理指令 `setrace` 的覆写会无视这道门槛。 |
| "Health-Bonus-Percent" | 0.0 | 最大生命的百分比加成，以乘法叠加在境界／等级的生命加成之上。 |
| "Damage-Bonus-Percent" | 0.0 | 输出伤害的百分比加成，叠加在境界／等级的伤害加成之上。 |
| "Qi-Gain-Rate-Percent-Bonus" | 0.0 | 该族所获**一切**灵气的百分比加成 —— 打坐（灵脉）吸纳与修行之核吸收皆在其内。填 10 即每一处来源的灵气 +10%。 |
| "Description-Qi-Gain-Rate-Percent-Bonus" | 一段解释上述数值的长字符串。 | 重述这一个数字同时涵盖两处灵气来源。 |
| "Breakthrough-Duration-Percent-Reduction" | 0.0 | 该族境界突破仪式所需时长的百分比削减。填 20 即突破少花 20% 的时间。 |
| "Description-Breakthrough-Duration-Percent-Reduction" | 一段解释上述数值的长字符串。 | 指出该值在代码中被夹紧，无论设得多高，都不可能把时长削减超过 90%。 |
| "Qi-Alignment-Yin-Bias-Percent" | 0.0 | 该族施加于[大道](/cultivation/dao/)系统中打坐灵气阴阳偏移的百分比扭曲。填 50 即本该偏阳的量有一半转为偏阴；填 -30 则本该偏阴的量有 30% 转为偏阳。0 为中性。 |
| "Description-Qi-Alignment-Yin-Bias" | 一段解释上述数值的长字符串。 | 以风味之笔勾勒这层扭曲 —— 魔性者所纳之气染黑，天生者所纳之气涤清。 |

#### 内置三族

以下是首次运行时写入各文件的数值。

| 种族 | 解锁境界 | 生命 | 伤害 | 灵气获取 | 突破速度 | 阴气偏向 |
|:---|:---|:---|:---|:---|:---|:---|
| 人族 | BodyRefinement | +0% | +0% | +10% | +0% | 0% |
| 魔族 | GoldenCoreFormation | -10% | +25% | -10% | +0% | +50% |
| 神族 | GoldenCoreFormation | +20% | -10% | +5% | 快 20% | -30% |

以及它们默认的风味文本。

| 种族 | 说明 |
|:---|:---|
| 人族 | 「适应力强，学得也快。战力上没有极端之处，但灵气流转略为顺畅。」 |
| 魔族 | 「凶戾而嗜战。厮杀时狠辣，但修炼之法粗陋，聚气因而迟缓。」 |
| 神族 | 「天生一副天赋异禀之躯。体魄坚实、突破迅捷，只是斗起来不够狠。」 |

阴气偏向，正是让种族抉择超越纯属性之处：魔族所纳之气以一倍半的常速朝阴沉降，将其推向**魔道**，最终每逢突破皆迎[心魔劫](/cultivation/tribulations/)；而神族则朝另一个方向漂移，趋向**正道**。
