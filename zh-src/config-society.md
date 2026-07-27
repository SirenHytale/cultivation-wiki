---
title: 宗门社群配置
description: Cultivation 模组 Society/ 目录下的五份文件：宗门、阵法、洞府、宗门攻伐与斗法。
group: 配置
han: 配
---

### 宗门社群配置

`mods/Siren_Cultivation/Society/` 中的五份文件涵盖一切唯因他人存在才有意义的东西 —— 修士们聚成的[宗门](/cultivation/sects/)、他们在自家地界上刻下的[阵法](/cultivation/formations/)、退隐其中的[洞府](/cultivation/dwelling/)、为大殿而起的[宗门攻伐](/cultivation/wars/)，以及押上灵气的[斗法](/cultivation/duels/)。

#### 宗门配置

宗门名录、大殿与全宗灵气加成，位于路径 `mods/Siren_Cultivation/Society/SectConfig.json`。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "Sect Config" | 此配置文件的名称。 |
| "ConfigVersion" | 2 | 你为此插件加载时的当前版本。 |
| "Sects-Enabled" | true | 整套宗门系统的总开关。 |
| "Description-Sects-Enabled" | 一段解释上述数值的长字符串。 | 为 false 时每条 `/sect` 指令都会客气地回绝，宗门灵气加成不再生效，宗门也从排行中消失 —— 但磁盘上已有的宗门数据原封保留，以备你重新启用。 |
| "Sect-Max-Members" | 12 | 每个宗门名录的人数上限，含宗主。 |
| "Sect-Hall-Min-Vein-Tier" | 1 | `/sect claim` 要在某区块成功，该区块所摇出的灵脉品阶下限。1 = 丰灵脉及以上，2 = 仅限龙脉。寻常区块永远承载不了大殿。 |
| "Description-Sect-Hall" | 一段解释上述数值的长字符串。 | 重述人数上限与灵脉阶位门槛，并指出一宗仅一殿 —— 再次占取只是把它迁走。 |
| "Sect-Qi-Bonus-Percent-Rich-Hall" | 5.0 | 宗门大殿踞于丰灵脉上时，每名门人从所有来源多得的灵气百分比。 |
| "Sect-Qi-Bonus-Percent-Dragon-Hall" | 8.0 | 大殿踞于龙脉上时的同一加成。 |
| "Description-Sect-Qi-Bonus" | 一段解释上述数值的长字符串。 | 该加成在全服范围内对每名门人生效，无论其身在何处；而没有大殿的宗门分文不得 —— 大殿正是关窍所在。 |
| "Sect-Invite-Expiry-Seconds" | 300 | 一份未决的宗门邀约在失效前可存续多久。 |
| "Sect-Inscription-Enabled" | true | 宗主是否可将功法秘籍镌于大殿之上，将此法借予全体门人。 |
| "Description-Sect-Inscription" | 一段解释上述数值的长字符串。 | 宗主立于自家大殿中以 `/sect inscribe` 消耗一本功法秘籍；此后只要宗门**持有**大殿，每名门人便知晓此法。同时只能镌刻一道，且唯有功法秘籍行得通 —— 天赋树秘籍授予的是永久节点，无法外借。 |

#### 阵法配置

三种可布设的灵阵，位于路径 `mods/Siren_Cultivation/Society/FormationConfig.json`。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "Formation Config" | 此配置文件的名称。 |
| "ConfigVersion" | 1 | 你为此插件加载时的当前版本。 |
| "Formations-Enabled" | true | 整套阵法系统的总开关。 |
| "Max-Formations-Per-Controller" | 3 | 一位掌阵者 —— 一个宗门，或按 UUID 计的一名独修者 —— 同时可持有多少座已布下的阵法。已达上限时布设会被回绝。 |
| "Description-Formations" | 一段解释上述数值的长字符串。 | 阵法是站在某区块中使用其阵旗物品布下的，锚定于该区块并以方形（切比雪夫）半径展开；布设者若有宗门则由其宗门掌控，否则归其个人。在你已掌控同类阵法的区块上再次使用同一阵旗，会将其撤去。 |
| "QiGathering-Radius-Chunks" | 2 | 聚灵阵的方形半径，以区块计。 |
| "QiGathering-Regen-Multiplier" | 1.4 | 该半径内掌阵者打坐灵气恢复所乘的倍率。 |
| "QiGathering-Benefits-Everyone" | false | 若为 true，范围内任何打坐者皆可受惠，而不限于掌阵者。 |
| "Description-QiGathering" | 一段解释上述数值的长字符串。 | 重述默认受惠者是谁（该宗门的门人，或个人所有者），以及「惠及众生」开关会改变什么。 |
| "Warding-Radius-Chunks" | 2 | 护山大阵的方形半径，以区块计。 |
| "Warding-Outsider-Regen-Multiplier" | 0.25 | 该半径内**外人**打坐灵气恢复所乘的倍率。掌阵者不受影响。 |
| "Description-Warding" | 一段解释上述数值的长字符串。 | 补充说明外人也无法在受护区块上布下自己的阵法。 |
| "Trapping-Radius-Chunks" | 1 | 困仙阵的方形半径，以区块计。 |
| "Trapping-Interval-Seconds" | 3.0 | 陷阱对该半径内的入侵者多久发动一次。 |
| "Trapping-Damage-Percent-Of-Max-Health" | 4.0 | 每次陷阱结算造成最大生命的百分之几，经由常规伤害管线，故护甲与各项减伤皆会生效。 |
| "Trapping-Debuff-Effect" | "Root" | 每次结算所施加的原版 EntityEffect 资产 id。真实可选项包括 Root、Slow、Stun 与 Poison。留空则跳过减益。 |
| "Trapping-Debuff-Duration-Seconds" | 2.5 | 该效果每次结算持续多久。 |
| "Trapping-Lethal" | false | 默认关闭 —— 陷阱伤及并定住入侵者，却给他们留一丝生机，逼其逃出阵界。设为 true 则可让它了结一个屡教不改的擅闯者。 |
| "Description-Trapping" | 一段解释上述数值的长字符串。 | 完整的陷阱结算：对谁发动、施加什么、掌阵者可畅通穿行，以及致死开关会改变什么。 |

#### 洞府配置

洞府、其灵泉、供奉与闭关，位于路径 `mods/Siren_Cultivation/Society/DwellingConfig.json`。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "Dwelling Config" | 此配置文件的名称。 |
| "ConfigVersion" | 2 | 你为此插件加载时的当前版本。 |
| "Dwellings-Enabled" | true | 洞府的总开关。 |
| "Dwelling-Radius-Chunks" | 1 | 以所占区块为中心、以区块计的方形（切比雪夫）半径。1 = 3×3 的一方区块，也就是洞府本该有的那个「洞天」。 |
| "Dwelling-Owner-Regen-Multiplier" | 1.25 | 主人在自家洞府中的打坐灵气倍率。 |
| "Dwelling-Outsider-Regen-Multiplier" | 0.5 | 任何不属于此地者的打坐灵气倍率。 |
| "Description-Dwellings" | 一段解释上述数值的长字符串。 | 以 `/cultivation abode claim` 开辟、一名修士一座洞府、两项恢复倍率，以及外人无法在其地界上刻下阵法。 |
| "Spring-Qi-Per-Hour" | 60.0 | 灵泉每一小时真实时间所蓄的灵气，无论在线与否。 |
| "Spring-Rich-Vein-Multiplier" | 1.5 | 洞府踞于丰灵脉上时该速率所乘的倍率。 |
| "Spring-Dragon-Vein-Multiplier" | 2.5 | 踞于龙脉上时该速率所乘的倍率。 |
| "Spring-Pool-Base-Cap" | 500.0 | 所蓄之池的基础上限。 |
| "Spring-Pool-Cap-Per-Realm" | 250.0 | 主人每达到一个境界，为该上限所加之数。 |
| "Description-Spring" | 一段解释上述数值的长字符串。 | 灵泉无论主人在线与否都会蓄积，但超出上限的部分会溢出浪费；池中之物须亲自站在其中以 `/cultivation abode collect` 取走。 |
| "Upkeep-Enabled" | true | 洞府是否需要供养。为 false 则洞府永久且免费。 |
| "Upkeep-Item-Hours" | "Cultivation_SpiritStone:24,Cultivation_DivineCore:36,Cultivation_ProfoundCore:12,Cultivation_SpiritCore:4,Cultivation_QiGatheringPill:6,Cultivation_ClarityPill:6,Cultivation_TribulationWardPill:8,Cultivation_ClearMindPill:8" | 以逗号分隔的 `物品id:时辰` 供奉对。未列于此者一概不受，因此服主只需写上名字，就能添入自己的通货。 |
| "Upkeep-Initial-Free-Hours" | 0.0 | 新开辟的洞府起始所带的供奉。刻意为零：任何非零的赠予都会在每一次新开辟时再送一遍，因此调高它就等于让玩家靠「舍弃再开辟」的循环白住。 |
| "Upkeep-Max-Banked-Hours" | 720.0 | 一座洞府一次至多可蓄存多少供奉。 |
| "Upkeep-Grace-Hours" | 168.0 | 供奉耗尽之后，再过多久这处地界会被彻底释放、所蓄之池尽失。 |
| "Description-Upkeep" | 一段解释上述数值的长字符串。 | 献纳供奉、初始赠予的漏洞警示、蓄存上限，以及两段式失效 —— 灵泉立即停蓄，地界在宽限后释放。宗门大殿的灵泉绝不会这样被释放；它只是停止蓄积，直到有人来喂。 |
| "Sect-Hall-Spring-Enabled" | true | 宗门已占的大殿是否会在每位门人的私人洞府之外，另长出一眼自己的共享灵泉。 |
| "Sect-Spring-Rate-Multiplier" | 1.5 | 山门灵泉的蓄积较私泉快多少。 |
| "Sect-Spring-Pool-Cap-Multiplier" | 2.0 | 山门之池较私池深多少。 |
| "Description-SectSpring" | 一段解释上述数值的长字符串。 | 山门灵泉可由**任何**站在大殿中的门人取走 —— 先到者尽收之 —— 它随大殿迁移而动、在围攻中归于胜者，且与私人洞府一样需要供奉。 |
| "SpiritStone-Kill-Drop-Chance" | 0.04 | 修士斩杀生灵时掉落灵石的概率，与修行之核的判定各自独立，故一次击杀可能两者兼得。 |
| "SpiritStone-Tribulation-Drop-Chance" | 0.35 | 修士**挺过**一道天劫落雷时掉落灵石的概率。 |
| "Description-SpiritStone" | 一段解释上述数值的长字符串。 | 灵石是维系洞府的通货，而天劫掉落被诠释为天雷把它所击散的灵气凝作了晶石。 |
| "Seclusion-Enabled" | true | 闭关的总开关。 |
| "Seclusion-Qi-Per-Hour" | 25.0 | 离线闭关时每一小时真实时间所蓄的灵气，于下次登入时入账。刻意远低于醒着打坐所得。 |
| "Seclusion-Max-Hours" | 24.0 | 任何一次离开至多计入多少小时。 |
| "Seclusion-Drains-Spring" | true | 开启后，闭关所得的灵气是**从**洞府灵泉中汲取而来，而非凭空生出，因此闭关与取用池中之物争抢的是同一份储备，洞府无法为同样的时辰付两次账。 |
| "Description-Seclusion" | 一段解释上述数值的长字符串。 | 在自家洞府（或自家宗门山门）中开始打坐然后下线，即进入闭关。它要求供奉仍是已付的，每次离开有上限，其存在是为了让坐不满四十分钟的修士仍能寸进。 |

#### 战事配置

宗门对敌方大殿的围攻，位于路径 `mods/Siren_Cultivation/Society/WarConfig.json`。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "War Config" | 此配置文件的名称。 |
| "ConfigVersion" | 1 | 你为此插件加载时的当前版本。 |
| "Wars-Enabled" | true | 宗门攻伐的总开关。 |
| "War-Required-Hold-Seconds" | 120.0 | 攻方须在战期内无人争夺地占据争议大殿区块共计多少秒，方可夺取。 |
| "War-Window-Seconds" | 600.0 | 自宣战起围攻开启多久。若未能及时达到所需占据，围攻失败。 |
| "War-Defender-Grace-Seconds" | 8.0 | 大殿处见到守方门人后，占据累积停滞多久。 |
| "War-Cooldown-Hours" | 24.0 | 一场战事之后，守方宗门免受再次围攻多少小时真实时间，无论胜负。 |
| "War-Requires-Defender-Online" | true | 离线保护 —— 无人在线的宗门不可被围攻。 |
| "Description-Wars" | 一段解释上述数值的长字符串。 | 完整的围攻循环：宣战、开启的战期、无守方在场时的占据累积、夺取时大殿的移交、战期终了时的失败，以及无论结果如何的冷却。并指出守方自家的护山与困仙阵天然会阻滞攻方。 |

#### 双修配置

结为道侣的修士之间的双修，位于路径 `mods/Siren_Cultivation/Society/PartnerConfig.json`。需要 Marriage 模组 —— 见[双修](/cultivation/partnered-cultivation/)。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "Partner Config" | 此配置文件的名称。 |
| "ConfigVersion" | 1 | 你为此插件加载时的当前版本。 |
| "Partnered-Cultivation-Enabled" | true | 总开关。未安装 Marriage 模组时本就无效。 |
| "Partner-Radius-Blocks" | 8.0 | 两名道侣须坐得多近，双修方能结成。 |
| "Partner-Qi-Multiplier" | 1.25 | 各自汲取灵气的倍率。与地脉品级、天候共鸣、阵法、洞府及采集型灵兽相乘，故为层层叠乘而非取而代之。 |
| "Partner-Unlock-Realm" | "BODY_REFINEMENT" | 双修所需的境界。默认实际等于不设门槛。 |
| "Partner-Convergence-Enabled" | true | 双方的阴阳之衡是否相互牵引。 |
| "Partner-Convergence-Shift-Per-Tick" | 0.2 | 每 tick 双方各自被拉向对方的力度。与大道配置中打坐时的阴阳偏移同一量级。 |
| "Partner-Convergence-Deadzone-Percent" | 1.0 | 阴之百分比的差距低于此值时双方都不再偏移，稳定下来的一对便不会来回震荡。 |
| "Description-Partner" | 一段解释上述数值的长字符串。 | 整套功能：它需要 Marriage 模组、结成双修的四项条件、该倍率与什么相乘，以及牵引如何运作。 |

#### 斗法配置

修士之间押上灵气的赌斗，位于路径 `mods/Siren_Cultivation/Society/DuelConfig.json`。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| "ConfigName" | "Duel Config" | 此配置文件的名称。 |
| "ConfigVersion" | 3 | 你为此插件加载时的当前版本。 |
| "Duels-Enabled" | true | `/cultivation duel` 的总开关。 |
| "Duel-Challenge-Expiry-Seconds" | 60.0 | 一份无人应答的邀约可存续多久。 |
| "Duel-Max-Wager" | 0 | 玩家在单场赌斗中可押上的存蓄灵气上限。0 表示不设上限。 |
| "Duel-Overrides-World-Pvp" | true | 已被接受的赌斗，能否在关闭了 PvP 的世界上交手。赌斗是双向且押上彩头的同意，故此项默认开启 —— 而且它只会让那两名赌斗者能互相击中，只在赌斗进行期间，且绝不穿透出生点保护或无敌。 |
| "Duel-Max-Duration-Seconds" | 600.0 | 一场进行中的赌斗可持续多久，超时即作罢且双方押注均不易主。这是对付永远无法判定的赌斗的最后一道保险。填 0 则关闭此超时。 |
| "Description-Duels" | 一段解释上述数值的长字符串。 | 完整的赌斗流程：邀约与押注、失效、胜负如何判定与败者交出什么、PvP 覆写究竟允许与不允许什么，以及参与者下线的赌斗与超时的赌斗以同样方式作罢。 |
