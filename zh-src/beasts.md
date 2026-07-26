---
title: 灵兽
description: Cultivation 模组的灵兽契约：三类灵兽、收服与孵化、全部物种名录与养育之法。
group: 功法与法宝
han: 術
---

### 灵兽

**灵兽**是与你结下永契的伙伴 —— 它循着与你相同的境界成长，却有自己独立的经验池，并按其种类各尽其能。

你同时只能契约**一头**灵兽。要另契他兽，须先将其放归。灵兽可随心召唤与遣归，现身时保有自己原本的原版 AI，一旦游荡出 `Leash-Distance`（24 格）便会被拉回你身边，而你一下线，它便自行消失。

此系统默认启用（`Beasts-Enabled`）。

#### 三类灵兽

物种的类别，正是收集第二头灵兽的意义所在。**被遣归**的灵兽什么也不做 —— 加成是给「留它在侧」的人的。

| 类别 | 效用 | 默认值 |
|:---|:---|:---|
| **战兽** | 提升你的输出伤害，并以自己的 AI 伴你厮杀。 | `Guardian-Damage-Percent-Base` 4%，每级 +0.6%。 |
| **守护兽** | 削减你所受的伤害。 | `Warden-Reduction-Percent-Base` 5%，每级 +0.7%，上限 40%。 |
| **聚灵兽** | 现身期间提升你打坐所得的灵气倍率。 | `Gatherer-Qi-Multiplier-Base` ×1.15，每级 +0.02。 |

以上每一个数值都会再乘以该物种自身的 `Power`；而当灵兽属性与你所择的[大道](/cultivation/dao/)相合时，还会再乘以 `Element-Resonance-Multiplier`（1.25）。

#### 收服

对名录之内、生命值已跌至 `Tame-Max-Health-Percent`（30%）或以下的野生生灵使用**驯兽符**。先重创，再结契。

成功率为该物种自身的 `TameChance`，另加：

- 你每达到一个境界，`Tame-Chance-Bonus-Per-Realm`（+0.05）；
- 若灵兽属性与你所择之道相合，`Tame-Chance-Element-Match-Bonus`（+0.25）—— 修士之道会召唤同性之兽，它们也远更甘心归顺。

最终结果以 `Tame-Chance-Max`（0.95）封顶。当 `Tame-Consume-Talisman-On-Failure` 为 true（默认）时，失败的尝试照样耗去符箓，而那头灵兽仍旧立在原处。

#### 孵化

**灵兽蛋**以 `Egg-Kill-Drop-Chance`（1.5%）的概率从击杀的生灵身上掉落。使用它便可破壳，其中沉睡之物随即与你结契 —— 具体是何物，按各物种的 `EggWeight` 加权随机。蛋重为 0 的物种永不孵出，只能在野外收服。蛋同样遵守 `MinRealm`，规则与收服一致；而你若已有灵兽在身，孵化会被拒绝。

#### 物种名录

`MinRealm` 是境界序号 —— 0 为炼体，1 为炼气，2 为筑基，3 为金丹，4 为元婴。

| 物种 | 类别 | 属性 | 收服概率 | 最低境界 | 威能 | 蛋重 |
|:---|:---|:---|:---|:---|:---|:---|
| Wolf_Black | 战兽 | 虚无 | 35% | 1 | 1.0 | 1.0 |
| Wolf_White | 战兽 | 冰 | 35% | 1 | 1.0 | 1.0 |
| Emberwulf | 战兽 | 火 | 20% | 3 | 1.4 | 0.4 |
| Leopard_Snow | 战兽 | 冰 | 28% | 2 | 1.2 | 0.7 |
| Tiger_Sabertooth | 战兽 | 金 | 22% | 3 | 1.4 | 0.5 |
| Fen_Stalker | 战兽 | 水 | 25% | 2 | 1.2 | 0.6 |
| Raptor_Cave | 战兽 | 风 | 30% | 2 | 1.1 | 0.8 |
| Rex_Cave | 战兽 | 金 | 15% | 4 | 1.6 | 0.2 |
| Hyena | 战兽 | 毒 | 35% | 1 | 0.9 | 1.0 |
| Bear_Grizzly | 守护兽 | 土 | 28% | 2 | 1.2 | 0.8 |
| Bear_Polar | 守护兽 | 冰 | 26% | 2 | 1.25 | 0.7 |
| Yeti | 守护兽 | 冰 | 18% | 4 | 1.5 | 0.3 |
| Tortoise | 守护兽 | 土 | 50% | 0 | 0.9 | 1.2 |
| Toad_Rhino | 守护兽 | 毒 | 40% | 1 | 1.0 | 1.0 |
| Toad_Rhino_Magma | 守护兽 | 火 | 25% | 3 | 1.3 | 0.5 |
| Armadillo | 守护兽 | 金 | 50% | 0 | 0.85 | 1.2 |
| Moose_Bull | 守护兽 | 土 | 32% | 1 | 1.1 | 0.9 |
| Spark_Living | 聚灵兽 | 雷 | 20% | 3 | 1.5 | 0.4 |
| Snapdragon | 聚灵兽 | 木 | 30% | 2 | 1.2 | 0.7 |
| Cactee | 聚灵兽 | 木 | 40% | 1 | 1.0 | 1.0 |
| Trillodon | 聚灵兽 | 木 | 22% | 3 | 1.35 | 0.5 |
| Fox | 聚灵兽 | 风 | 45% | 0 | 0.9 | 1.2 |
| Deer_Stag | 聚灵兽 | 木 | 45% | 0 | 0.9 | 1.2 |
| Antelope | 聚灵兽 | 风 | 45% | 0 | 0.85 | 1.2 |

灵兽的属性是它**自己**的天性，与主人的属性毫无干系 —— 二者相合是锦上添花，而非硬性要求。物种的任何一项都不是写死的，因此服主（或其他模组）尽可往这份名录中添入新的生灵。

#### 养育

灵兽循着与你相同的境界与阶段成长，却有自己独立的经验池。每一阶段所需为 `Beast-Base-Xp-Requirement`（120）× `Beast-Xp-Growth-Rate`（1.35）^ 等级。

| 来源 | 默认值 |
|:---|:---|
| 你的击杀 | `Beast-Xp-Per-Kill` 12；当最后一击由灵兽自己落下时，再乘以 `Beast-Xp-Own-Kill-Multiplier`（2）。 |
| 喂食 | 所喂之物每一点灵气折 `Beast-Xp-Per-Qi-Item-Point` 0.75 点经验。 |
| 你的打坐 | 你所汲灵气的 `Meditation-Qi-Share-Percent` 12%。 |

打坐分成默认是**额外的馈赠** —— 你自己仍旧全额入账 —— 除非设了 `Meditation-Share-Taken-From-Owner`，那才会把它变成真正的抽成，在你的灵气入账之前先行扣除。

`Beast-Realm-Capped-By-Owner`（true）意味着灵兽永远不能凌驾于主人之上：它会停在你的境界上，直到你更进一步。

**喂食**取用你手中之物。各类修行之核的价值，恰是你自己吸收所得 —— 灵核 30、玄核 80、神核 220；灵石值 40；四种[丹药](/cultivation/alchemy/)各值 25。除此之外的东西，灵兽一概不吃。

#### 指令

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/cultivation beast summon` | 唤灵兽至你身侧。别名：`call`。 | `cultivation` |
| `/cultivation beast dismiss` | 遣它归去。别名：`recall`。 | `cultivation` |
| `/cultivation beast feed` | 以手中之物饲喂。 | `cultivation` |
| `/cultivation beast info` | 查看其物种、类别、属性、境界、阶段与经验。 | `cultivation` |
| `/cultivation beast release` | 永久放归，以便另契他兽。 | `cultivation` |

父指令 `/cultivation beast` 亦可写作 `companion` 或 `pet`。

本页每一个数值 —— 包括整份物种名录 —— 皆位于灵兽配置之中，详见[配置](/cultivation/config/arts/)；指令的完整说明则见[指令](/cultivation/commands/)页。
