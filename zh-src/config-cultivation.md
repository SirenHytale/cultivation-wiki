---
title: 修炼配置
description: Cultivation 模组 Cultivation/ 目录下的五份文件：修行之核、灵脉、突破与天劫、种族系统与天赋树。
group: 配置
han: 配
---

### 修炼配置

`mods/Siren_Cultivation/Cultivation/` 中的五份文件是进阶的核心：灵气从何而来、攀升要付出什么、天道为你的攀升收取什么，以及升一级能给你什么。它们合起来涵盖[聚灵采气](/cultivation/qi-gathering/)、[境界与阶段](/cultivation/realms/)、[天劫](/cultivation/tribulations/)、[种族](/cultivation/races/)与[天赋树](/cultivation/skilltree/)。

#### 修行之核配置

灵核、玄核与神核的掉落概率与灵气值，位于路径 `mods/Siren_Cultivation/Cultivation/SpiritCoreConfig.json`。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "Spirit Core Config" | 此配置文件的名称。 |
| "ConfigVersion" | 1 | 你为此插件加载时的当前版本。 |
| "Spirit-Core-Drop-Chance" | 0.12 | 第 1 阶（常见）每次击杀生灵的掉落概率，以 0–1 的小数表示。 |
| "Spirit-Core-Qi-Value" | 30.0 | 吸收灵核所得的灵气。 |
| "Profound-Core-Drop-Chance" | 0.035 | 第 2 阶（较罕见、较强悍的生灵）每次击杀的掉落概率。 |
| "Profound-Core-Qi-Value" | 80.0 | 吸收玄核所得的灵气。 |
| "Divine-Core-Drop-Chance" | 0.008 | 第 3 阶（罕见、强大的生灵）每次击杀的掉落概率。 |
| "Divine-Core-Qi-Value" | 220.0 | 吸收神核所得的灵气。 |
| "Description-Drop-Chances" | 一段解释上述数值的长字符串。 | 三个 Drop-Chance 皆为 0–1 的小数，每次击杀生灵时按「最稀有的先判」各自独立判定 —— 一次击杀至多掉落一枚核。 |
| "Meditation-Core-Bonus-Multiplier" | 1.1 | 若玩家在打坐期间吸收修行之核，其灵气值所乘的倍率（两法兼修的奖励）。1.10 即额外 10% 灵气。 |
| "Description-Meditation-Core-Bonus-Multiplier" | 一段解释上述数值的长字符串。 | 重述这是「打坐与吸核并用」而非二选一的奖励。 |

#### 灵脉配置

灵脉阶位、打坐节奏与灵气吸收物品修正，位于路径 `mods/Siren_Cultivation/Cultivation/SpiritVeinConfig.json`。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "Spirit Vein Config" | 此配置文件的名称。 |
| "ConfigVersion" | 5 | 你为此插件加载时的当前版本。 |
| "Spirit-Vein-Min-Qi" | 150.0 | 寻常区块的灵脉所摇出的随机 maxQi 的下界。 |
| "Spirit-Vein-Max-Qi" | 500.0 | 同一随机区间的上界。每个区块起始时皆为满值。 |
| "Description-Spirit-Vein-Min-Max-Qi" | 一段解释上述数值的长字符串。 | 每个区块的灵脉在首次访问时以两值之间的随机 maxQi 播种，其随机由世界种子确定，且起始为满 —— 除非它摇成了丰灵脉或龙脉。 |
| "Spirit-Vein-Rich-Chance" | 0.03 | 区块灵脉摇成「丰灵脉」而非寻常灵脉的概率（0–1），改用下方的 Rich-Min/Max-Qi 区间。每区块由世界种子确定性地判定一次。 |
| "Spirit-Vein-Rich-Min-Qi" | 1200.0 | 丰灵脉灵气池的下界。 |
| "Spirit-Vein-Rich-Max-Qi" | 2600.0 | 丰灵脉灵气池的上界。 |
| "Description-Spirit-Vein-Rich" | 一段解释上述数值的长字符串。 | 说明摇中丰灵脉会整体取代寻常的最小／最大区间，且与寻常区间一样每区块确定性地判定一次。 |
| "Spirit-Vein-Dragon-Chance" | 0.003 | 区块摇成「龙脉」—— 最稀有的一阶 —— 的概率（0–1）。在丰灵脉判定之前先行判定。 |
| "Spirit-Vein-Dragon-Min-Qi" | 3500.0 | 龙脉灵气池的下界。 |
| "Spirit-Vein-Dragon-Max-Qi" | 5500.0 | 龙脉灵气池的上界。 |
| "Description-Spirit-Vein-Dragon" | 一段解释上述数值的长字符串。 | 指出龙脉判定先于丰灵脉判定，且打坐的玩家坐在丰灵脉或龙脉上时会收到告知。 |
| "Spirit-Vein-Rich-Regen-Multiplier" | 1.25 | 丰灵脉的恢复较 Spirit-Vein-Regen-Per-Second 快多少。 |
| "Spirit-Vein-Dragon-Regen-Multiplier" | 1.6 | 龙脉的恢复较 Spirit-Vein-Regen-Per-Second 快多少。 |
| "Description-Spirit-Vein-Regen-Multipliers" | 一段解释上述数值的长字符串。 | 警示：倍率 × Spirit-Vein-Regen-Per-Second 必须始终**低于** Spirit-Vein-Drain-Per-Second，否则灵脉回满的速度会快过一名打坐者的汲取，从而变成无尽的灵气源泉。 |
| "Spirit-Vein-Regen-Per-Second" | 1.5 | 灵脉每秒被动恢复多少灵气。 |
| "Spirit-Vein-Drain-Per-Second" | 2.75 | 打坐的玩家每秒从灵脉汲取多少灵气。 |
| "Spirit-Vein-Drain-Radius-Chunks" | 1 | 打坐玩家在自己区块见底后，还可从外扩几圈的相邻区块汲取（0 = 仅自己的区块，1 = 3×3 的范围）。 |
| "Description-Spirit-Vein-Drain-Radius-Chunks" | 一段解释上述数值的长字符串。 | 重述圈数的计法：0 表示仅自己的区块，1 表示 3×3 的范围。 |
| "Meditation-Tick-Interval-Seconds" | 1.0 | 每隔多少秒结算一次打坐玩家的灵气所得。 |
| "Meditation-Movement-Cancel-Threshold" | 0.35 | 打坐玩家可以从落座处漂移多少格，超出则自动中断打坐。 |
| "Description-Meditation-Movement-Cancel-Threshold" | 一段解释上述数值的长字符串。 | 重述漂移距离，以及超出即自动中断打坐。 |
| "Meditation-Movement-Check-Interval-Seconds" | 0.25 | 每隔多少秒检查一次打坐玩家的移动与落座状态。 |
| "Qi-Absorption-Item-Modifiers" | `[{"ItemId": "Cultivation_QiGatheringTalisman", "Multiplier": 1.5}]` | 一个「物品 id／倍率」对的数组。打坐时若快捷栏当前槽位持有匹配的物品，你的灵脉吸收速率即乘以该倍率。 |
| "Spirit-Sense-Enabled" | true | [灵气感知](/cultivation/spirit-sense/)的总开关。感知只读取，因此关掉它，聚灵采气分毫不受影响。 |
| "Spirit-Sense-Min-Realm" | 2 | 解锁感知所需的境界序号（从 0 起算，2 ＝筑基）。未及此境则毫无所感。 |
| "Spirit-Sense-Precise-Min-Realm" | 4 | 显示确切灵气数值所需的境界序号（4 ＝元婴）。未及此境则只以言辞相告 —— 枯竭、稀薄、平和、充盈、磅礴。 |
| "Spirit-Sense-Radius-Per-Realm" | 1 | 超出解锁境界后，每高一境所增的区块数。 |
| "Spirit-Sense-Max-Radius-Chunks" | 4 | 该范围的上限。按默认值，筑基修士仅及自身区块，炼虚修士可及 9×9。 |
| "Spirit-Sense-Tick-Interval-Seconds" | 2.5 | 感知重读世界并再次脉动粒子的间隔。粒子资产的时长正好铺满一个间隔，故调大会变稀、调小会变密 —— 也更耗封包。 |
| "Spirit-Sense-Mote-Budget" | 10 | 每次脉动、每名玩家最多生成的灵光微粒数。主要的开销旋钮；要省开销请先调低它，再考虑调大间隔。 |
| "Spirit-Sense-Beacon-Min-Tier" | 1 | 立起光柱所需的最低地脉品级。0＝所有区块，1＝灵脉及以上，2＝仅龙脉，3＝永不。 |
| "Description-Spirit-Sense" | 一段解释上述数值的长字符串。 | 两阶境界门槛、范围如何随境界扩展，以及未及精微之境时所用的言辞分级。 |
| "Description-Spirit-Sense-Visuals" | 一段解释上述数值的长字符串。 | 粒子开销的两个旋钮，以及光柱品级各值的含义。 |
| "Description-Qi-Absorption-Item-Modifiers" | 一段解释上述数组的长字符串。 | 只影响灵脉吸收，绝不影响修行之核的灵气值；其他模组可经由 [Cultivation 接口](/cultivation/api/)在 Java 中注册更多条目。 |

#### 突破配置

子阶段晋阶与境界突破二者的时长与灵气在场要求，以及两种[天劫](/cultivation/tribulations/)之考验，位于路径 `mods/Siren_Cultivation/Cultivation/BreakthroughConfig.json`。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "Breakthrough Config" | 此配置文件的名称。 |
| "ConfigVersion" | 4 | 你为此插件加载时的当前版本。 |
| "Breakthrough-Min-Chunk-Qi" | 750.0 | 玩家打坐所在的区块须持有至少这么多灵脉灵气，其境界突破的尝试才会推进 —— 这是在场检查，而非汲取。 |
| "Description-Breakthrough-Min-Chunk-Qi" | 一段解释上述数值的长字符串。 | 强调此项检查不会消耗灵脉，只要求其存在。 |
| "Breakthrough-Base-Seconds" | 24.0 | 自最初境界起，一次境界突破需要多少秒。 |
| "Breakthrough-Duration-Realm-Multiplier" | 1.35 | 每达到一个境界，突破时长所乘的倍率，逐层叠加。 |
| "Description-Breakthrough-Duration" | 一段解释上述数值的长字符串。 | 总时长（秒）= Breakthrough-Base-Seconds × Breakthrough-Duration-Realm-Multiplier ^ 境界序号，尚未计入任何种族加速。 |
| "Advancement-Min-Chunk-Qi" | 200.0 | 与 Breakthrough-Min-Chunk-Qi 相同的在场检查机制，只是门槛更低，因为子阶段晋阶远比突破频繁。 |
| "Description-Advancement-Min-Chunk-Qi" | 一段解释上述数值的长字符串。 | 重述这是同一道在场检查，只是阈值更低。 |
| "Advancement-Base-Seconds" | 8.0 | 自最初境界起，一次子阶段晋阶需要多少秒。 |
| "Advancement-Duration-Realm-Multiplier" | 1.3 | 与突破同形的公式，只是更短。 |
| "Description-Advancement-Duration" | 一段解释上述数值的长字符串。 | 总时长 = Advancement-Base-Seconds × Advancement-Duration-Realm-Multiplier ^ 境界序号，尚未计入任何种族加速。 |
| "Tribulation-Enabled" | true | 境界突破仪式期间天劫雷霆的总开关。 |
| "Tribulation-Strike-Interval-Seconds" | 6.0 | 两道落雷之间相隔多少秒的仪式进度。 |
| "Tribulation-Damage-Percent-Of-Max-Health" | 15.0 | 突破时每道落雷造成修士最大生命的百分之几，尚未计入境界缩放。 |
| "Tribulation-Damage-Realm-Multiplier" | 1.12 | 每达到一个境界，落雷伤害所乘的倍率，逐层叠加。 |
| "Tribulation-Lethal" | true | 若为 false，落雷始终至少留一丝生机，而不会致死。 |
| "Description-Tribulation" | 一段解释上述数值的长字符串。 | 摊开整条落雷公式：最大生命的伤害百分比，乘以境界倍率的境界序号次方，按落雷间隔降下，以及它是否可以致死。 |
| "Advancement-Tribulation-Enabled" | false | 默认关闭 —— 主动开启后，寻常的子阶段晋阶也会伴有天劫雷霆。 |
| "Advancement-Tribulation-Damage-Percent-Of-Max-Health" | 6.0 | 启用晋阶天劫时所用的、低得多的伤害百分比。 |
| "Description-Advancement-Tribulation" | 一段解释上述数值的长字符串。 | 指出晋阶天劫沿用与突破相同的间隔、境界缩放与致死规则，只是换用这个更低的百分比。 |
| "HeartDevil-Enabled" | true | 心魔劫的总开关 —— 那是替深度偏倚的修士以内心之魔取代雷霆的天劫变体。 |
| "HeartDevil-Lean-Threshold" | 0.5 | 阴阳之中较强的一侧须偏得多深（0–1），心魔才会取代雷霆现身。 |
| "HeartDevil-Max-Composure" | 100.0 | 修士每次尝试所要守护的道心池。 |
| "HeartDevil-Composure-Drain-Per-Pulse" | 34.0 | 每次侵扰所失的基础道心。实际所失为此值乘以（0.5 + 偏倚比例），故偏得越深，所面之魔越凶。 |
| "HeartDevil-Debuff-Effect" | "Stun" | 每次侵扰所施加的原版 EntityEffect 资产 id。真实可选项包括 Stun、Root、Slow 与 Poison。留空则跳过减益。 |
| "HeartDevil-Debuff-Duration-Seconds" | 1.5 | 该实体效果每次侵扰持续多久。 |
| "HeartDevil-Deviation-Demotes" | true | 走火入魔时跌落一个子阶段 —— 这会清空存蓄的灵气，一如任何失败的仪式。若为 false，则保住阶段，只损失下方所定比例的灵气。 |
| "HeartDevil-Deviation-Qi-Loss-Percent" | 100.0 | 当 HeartDevil-Deviation-Demotes 为 false 时，走火入魔所损失的存蓄灵气百分比。 |
| "HeartDevil-On-Advancement" | false | 心魔是否也能在子阶段晋阶仪式中现身。默认关闭，以保寻常晋阶的安稳。 |
| "Description-HeartDevil" | 一段解释上述数值的长字符串。 | 走完整场考验：侵扰按 Tribulation-Strike-Interval-Seconds 发动，按比例扣减道心并施加减益，一道蓄下的定心丹可抵消一次侵扰，而道心归零则仪式失败并走火入魔。 |

#### 种族系统配置

跨种族的服务器行为，与任何单一种族的属性无关，位于路径 `mods/Siren_Cultivation/Cultivation/RaceSystemConfig.json`。各族自身的数值则位于[种族配置](/cultivation/config/race/)。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "Race System Config" | 此配置文件的名称。 |
| "ConfigVersion" | 1 | 你为此插件加载时的当前版本。 |
| "Race-Admin-Bypasses-Realm-Gate" | true | 若为 true，`/cultivation admin setrace`（以及管理界面的「设定种族」操作）可强制设定任何在线玩家的种族，无论其是否已达到该族所配置的解锁境界。若为 false，对境界不足的玩家，该管理覆写会被回绝。 |
| "Description-Race-Admin-Bypasses-Realm-Gate" | 一段解释上述数值的长字符串。 | 重述覆写规则，并指向各族文件自身的 `Unlock-Realm`。 |

#### 天赋树配置

天赋点如何赚取与消耗，位于路径 `mods/Siren_Cultivation/Cultivation/SkillTreeConfig.json`。天赋树本身见[天赋树](/cultivation/skilltree/)页。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "Skill Tree Config" | 此配置文件的名称。 |
| "ConfigVersion" | 2 | 你为此插件加载时的当前版本。 |
| "Points-Per-Advancement" | 1 | 玩家每完成一次常规的子阶段晋阶所授予的天赋点。 |
| "Description-Points-Per-Advancement" | 一段解释上述数值的长字符串。 | 澄清此项只涵盖子阶段晋阶，而境界突破所付为此项**加上** Points-Per-Breakthrough。 |
| "Points-Per-Breakthrough" | 2 | 玩家突破至新境界时，在 Points-Per-Advancement 之外额外授予的天赋点。 |
| "Description-Points-Per-Breakthrough" | 一段解释上述数值的长字符串。 | 重述突破的奖励是叠加在晋阶奖励之上的。 |
| "Qi-Cost-Reduction-Cap-Percent" | 40.0 | 第 8 层「灵气消耗减免」天赋属性叠加后的上限，如此无论一套配点收集了多少顶点节点，升级的灵气需求都不会坍缩趋零。 |
| "Description-Qi-Cost-Reduction-Cap" | 一段解释上述数值的长字符串。 | 重述无论多少顶点节点授予此属性，它都会被夹紧在这一总百分比之内。 |
| "Respec-Enabled" | true | 若为 true，玩家可运行 `/cultivation respec` 清空整棵天赋树，并取回每一点已花费的天赋点。 |
| "Description-Respec-Enabled" | 一段解释上述数值的长字符串。 | 指出将其设为 false 会让天赋抉择永久生效，而管理员仍可授予额外的点数。 |
