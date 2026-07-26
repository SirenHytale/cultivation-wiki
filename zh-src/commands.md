---
title: 指令
description: Cultivation 模组的全部指令：玩家、功法、灵兽、洞府、阵法、赌斗、宗门、攻伐、排行、管理与调试。
group: 由此开始
han: 起
---

### 指令

模组注册了两条根指令：`/cultivation`（别名：`/cult`、`/qi`）与 `/sect`。

写在 `{花括号}` 中的参数为必填，写在 `[方括号]` 中的为选填。凡是接受玩家的地方，接受的都是玩家引用 —— 即一名在线玩家的名字。

整套宗门指令同时也挂在 cultivation 根指令之下，因此 `/cultivation sect create` 与 `/sect create` 是同一条指令、操作同一份数据。本页通篇采用较短的 `/sect` 写法。

#### 玩家指令

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/cultivation` | 打开你的修炼状态页。 | `cultivation` |
| `/cultivation info (i)` | 将你的境界、阶段与灵气进度打印至聊天栏。 | `cultivation` |
| `/cultivation meditate (med, cultivate)` | 切换打坐，从你落座区块的灵脉中汲取灵气。仪式中途起身即告作废 —— 见[聚灵采气](/cultivation/qi-gathering/)。 | `cultivation` |
| `/cultivation bind` | 将你手中的物品炼化为[本命法宝](/cultivation/lifebound/)。对自己已认主之物再次运行，会将其重置为 1 级。 | `cultivation` |
| `/cultivation race` | 打开种族菜单，查看各族天赋，并在条件具备时择定你的[种族](/cultivation/races/)。 | `cultivation` |
| `/cultivation hud` | 开启或关闭常驻的修炼状态栏。 | `cultivation` |
| `/cultivation settings (options)` | 打开玩家设置菜单。 | `cultivation` |
| `/cultivation bonuses` | 打开生效加成页，列出当前作用于你的每一项修正。 | `cultivation` |

#### 修炼功法

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/cultivation skilltree (skills)` | 打开[天赋树](/cultivation/skilltree/)。 | `cultivation` |
| `/cultivation dao` | 打开[大道](/cultivation/dao/)页 —— 你的属性、道途与阴阳平衡。 | `cultivation` |
| `/cultivation technique (tech) [名称]` | 不填名称时，列出每一门[功法](/cultivation/techniques/)及其解锁境界、灵气消耗与当前可用状态。填了名称则施展该功法。 | `cultivation` |
| `/cultivation refine (temper) [属性]` | 不填属性时，回报手中兵器当前的炼器情况，以及下一炼要付出什么、冒什么险。填了属性则预先扣除灵气，并让你坐入[炼器](/cultivation/refinement/)仪式。 | `cultivation` |
| `/cultivation respec (resetskillpoints, resetskills)` | 返还你付费购得的每一点天赋点并清空这些节点。由[秘籍](/cultivation/manuals/)所授的节点不耗天赋点，因此既不退还也不清除。需要 `Respec-Enabled`。 | `cultivation` |

#### 灵兽

结契灵兽是在世间完成的，而非通过指令 —— 见[灵兽](/cultivation/beasts/)。

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/cultivation beast (companion, pet)` | 列出你所契灵兽的物种、类别、属性、境界与当前所助益。 | `cultivation` |
| `/cultivation beast summon (call)` | 将你所契的灵兽唤入世间，伴于身侧。其加成只在现身期间生效。 | `cultivation` |
| `/cultivation beast dismiss (recall)` | 遣灵兽之身归去。它已修得的每一阶段分毫不损。 | `cultivation` |
| `/cultivation beast feed` | 将你手中的一整叠物品喂给灵兽，把每件物品所值的灵气化为灵兽经验。 | `cultivation` |
| `/cultivation beast info` | 与裸写 `/cultivation beast` 相同的一览，以子指令形式呈现。 | `cultivation` |
| `/cultivation beast release [confirm]` | 彻底断绝契约，好让你另契他兽。灵兽所修的一切尽失，故而唯有传入字面的 `confirm` 一词方会执行。 | `cultivation` |

#### 洞府

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/cultivation abode (dwelling, cave)` | 在任何地方回报你的[洞府](/cultivation/dwelling/)，若有宗门则连同山门灵泉一并回报。 | `cultivation` |
| `/cultivation abode claim` | 在你所立的区块开辟（或迁移）洞府。任何地界都容得下洞府，但其下的灵脉决定灵泉蓄积的快慢。 | `cultivation` |
| `/cultivation abode collect (drink)` | 饮尽灵泉，将其所蓄化作你自己的灵气入账。须站在洞府之中或自家宗门山门之内运行。 | `cultivation` |
| `/cultivation abode deposit (offer)` | 献上手中的一整叠物品作为供奉，每件物品所值时辰列于 `Upkeep-Item-Hours`。须在洞府之中运行。 | `cultivation` |
| `/cultivation abode info` | 与裸写 `/cultivation abode` 相同的一览，以子指令形式呈现。 | `cultivation` |
| `/cultivation abode abandon` | 舍弃洞府并腾出地界。灵泉中所蓄的一切随之尽失。 | `cultivation` |

#### 阵法

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/cultivation formations (formation, arrays)` | 列出你掌控的每一座[阵法](/cultivation/formations/) —— 宗门的与你个人的 —— 附其类型、世界、阵眼区块与半径。 | `cultivation` |

#### 斗法

`/cultivation duel` 接受一个动作词，部分动作还需再带一个参数。见[斗法](/cultivation/duels/)。

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/cultivation duel challenge {玩家} [押注]` | 押上存蓄灵气，向另一名修士发起赌斗。押注缺失或无法解析时按 0 计。 | `cultivation` |
| `/cultivation duel accept {玩家}` | 接受该玩家未决的邀约，赌斗随即开始。 | `cultivation` |
| `/cultivation duel decline {玩家}` | 拒绝该玩家未决的邀约。 | `cultivation` |
| `/cultivation duel yield (forfeit)` | 认输当前赌斗 —— 押注归对手所有。 | `cultivation` |

#### 宗门

此处每一条指令同样可写作 `/cultivation sect ...`。宗门内部的权柄（宗主、长老、弟子）是逐项事务核查的，而非靠权限节点 —— 见[宗门](/cultivation/sects/)。

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/sect` | 打开宗门菜单界面。 | `cultivation.sect` |
| `/sect create {名称}` | 以该名称创立新宗门。 | `cultivation.sect` |
| `/sect invite {玩家}` | 邀请一名在线玩家加入你的宗门。 | `cultivation.sect` |
| `/sect join {宗门}` | 按名称加入宗门。 | `cultivation.sect` |
| `/sect leave` | 离开你当前的宗门。 | `cultivation.sect` |
| `/sect kick {玩家}` | 将一名门人移出你的宗门。 | `cultivation.sect` |
| `/sect disband` | 彻底解散你的宗门。 | `cultivation.sect` |
| `/sect claim` | 在你所立的区块设立（或迁移）宗门大殿。唯有踞于配置所要求品阶的灵脉之上方可成功。 | `cultivation.sect` |
| `/sect inscribe` | 将你手中的功法秘籍镌于大殿之上，只要宗门还持有大殿，此法便传于全体门人。秘籍会被消耗。空手运行则改为将现有碑文抹去。 | `cultivation.sect` |
| `/sect info (i)` | 列出本宗的境况 —— 门人、大殿与各项加成。 | `cultivation.sect` |
| `/sect menu (ui)` | 打开宗门菜单界面，与裸写 `/sect` 所开的是同一页。 | `cultivation.sect` |

#### 宗门攻伐

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/sect war [宗门]` | 不带参数、或写作 `status` 时，回报本宗所处的围攻 —— 已累积的占据、战期剩余时间、守方是否正在争夺 —— 若无围攻则回报剩余冷却。任何门人皆可查询。 | `cultivation.sect` |
| `/sect war {宗门}` | 向该敌对宗门已占的大殿发起围攻。仅限宗主。见[宗门攻伐](/cultivation/wars/)。 | `cultivation.sect` |

#### 排行

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/cultivation top (leaderboard)` | 按境界与阶段列出本服顶尖的 10 名修士。 | `cultivation` |
| `/sect top (leaderboard)` | 列出本服顶尖的 10 个宗门。 | `cultivation.sect` |

#### 管理指令

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/cultivation admin` | 打开游戏内的实时配置编辑界面。 | `cultivation.admin` |
| `/cultivation admin setrealm [玩家] {境界}` | 直接设定玩家的[境界](/cultivation/realms/)，保留其当前阶段。 | `cultivation.admin` |
| `/cultivation admin setstage [玩家] {阶段}` | 直接设定玩家的子阶段（初期、中期、后期或圆满），保留其当前境界。 | `cultivation.admin` |
| `/cultivation admin setqi [玩家] {灵气}` | 直接设定玩家当前存蓄的灵气。 | `cultivation.admin` |
| `/cultivation admin setrace [玩家] {种族}` | 直接设定玩家的[种族](/cultivation/races/)。除非将 `Race-Admin-Bypasses-Realm-Gate` 设为 false，否则会绕过该族的解锁境界。 | `cultivation.admin` |
| `/cultivation admin grantracechoice [玩家] [数量]` | 授予额外的改换种族次数，让玩家可重新打开种族菜单再择一次。默认为 1。 | `cultivation.admin` |
| `/cultivation admin grantskillpoints [玩家] [数量]` | 授予额外的[天赋树](/cultivation/skilltree/)点数。默认为 1。 | `cultivation.admin` |
| `/cultivation admin setlifebound [玩家] {等级} [经验]` | 强制设定玩家手中[本命法宝](/cultivation/lifebound/)的等级，并可选地设定该等级内已存的经验。 | `cultivation.admin` |
| `/cultivation admin reset [玩家]` | 将玩家的修炼进度重置回炼体期初期、0 点灵气。 | `cultivation.admin` |

#### 调试指令

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/cultivation debug (d)` | 调试指令组。 | `cultivation.debug` |
| `/cultivation debug vein` | 打印你所立区块中灵脉的阶位与当前／最大灵气。 | `cultivation.debug.vein` |

凡是以另一名玩家为目标的管理指令，都接受一个可选的玩家参数 —— 省略它即以自己为目标。完整的权限清单与默认授予情况，见[权限](/cultivation/permissions/)。
