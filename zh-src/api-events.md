---
title: 事件
description: Cultivation 的约 135 个事件，分布于十个 *Events 类：前置可取消事件与后置通知事件的约定、线程规则，以及逐个子系统的完整表格。
group: 开发者
han: 匠
---

### 事件

Cultivation 在 `plugin.siren.API` 下的十个 `*Events` 类中，暴露了约 135 个事件。模组中几乎每一项机制都被暴露了两次 —— 一次是变更发生**之前**触发的可取消 `Pre*` 事件，一次是变更落定之后触发的普通后置事件。

每个类都遵循 `CultivationEvents` 上所记载的约定，因此学会一个便学会了全部十个。

#### 前置与后置

`Pre*` 事件继承自 `plugin.siren.API.CancellableEvent`，并在任何东西被施加**之前**触发。它给你两项能力：

- `event.setCancelled(true)` 否决该操作。派发一返回，模组即刻检查这个标志并放弃操作，不留下任何状态变更。之所以什么都不必回滚，是因为什么都还没被施加 —— 这正是这些事件先于事实触发的全部理由。一个被取消的前置事件，意味着与之配对的后置事件永不触发。
- 事件上的 setter 用于重新调整驱动该操作的数字 —— 一次突破的灵气消耗、一门功法的冷却、一道天劫落雷的伤害、一次收服的概率。派发结束时监听器留在那些字段里的东西，就是模组实际采用的东西。这是从扩展中重塑一项机制、而不必碰[配置](/cultivation/config/)文件的受支持途径。

后置事件是一个普通的 Java `record`。它无法被取消，纯粹是一则通知；待它触发时，变更早已在组件上可见。

`CancellableEvent` 恰好暴露两个方法：

| 方法 | 返回 | 说明 |
|:---|:---|:---|
| `isCancelled()` | `boolean` | 是否已有某个监听器否决了此操作。 |
| `setCancelled(boolean cancelled)` | | 否决该操作；传 `false` 则撤销否决。 |

**即便有人取消了，每一个监听器仍会运行。** 靠后的监听器尽可调用 `setCancelled(false)` 把操作放行，因此插件加载顺序决定了分歧中谁胜出。若你只想旁观，请改为监听后置事件。

#### 注册与线程

每个事件都有一个配套的 `on*` 注册方法，接受该事件类型的一个 `Consumer`：

```java
CultivationEvents.onPreQiGain(event -> event.setAmount(event.amount() * 1.25F));
DaoEvents.onPathChange(event -> myPlugin.announce(event.player(), event.newPath()));
```

注册就是一次普通的 `CopyOnWriteArrayList.add`，可安全地从任何插件的 `setup()` 中、以任何加载顺序调用。没有反注册 —— 监听器的生命周期就是服务器的生命周期。

监听器是**在事件所发生玩家的世界线程上同步**调用的。在监听器内部经由惯常的访问器读取组件是安全的，但请勿阻塞；在触碰任何位于另一世界的东西之前，请自行切换线程（例如 `CompletableFuture.runAsync(task, otherWorld)`）。抛出异常的监听器会被记录并跳过，因此一个写坏的扩展，既弄不垮模组自己的系统，也弄不垮监听同一事件的其他扩展。

有两个子系统带有额外约束，二者都在各自的源码中有所声明：

- **宗门。** 宗门的变更运行在 `SectManager` 的 synchronized 方法之内，因此一个 `SectEvents` 监听器正持有那把锁。读走你要的东西、交接出去、然后返回。请勿从监听器回调进 `SectManager` 的变更方法。
- **用 UUID 而非 PlayerRef。** `SectEvents`、`DuelEvents`、`FormationEvents` 与 `DwellingEvents` 以 `java.util.UUID` 标识玩家，因为这些操作经常触及离线玩家 —— 一个被逐的门人、一个已解散宗门的名录、一场比会话活得更久的赌斗。用 `Universe.get().getPlayer(uuid)` 解析，并检查 `isValid()`。

#### 修炼核心

`plugin.siren.API.CultivationEvents` —— 28 个事件，涵盖灵气、打坐、仪式、突破、晋阶、跌境、天劫、心魔劫、走火入魔、种族、本命法宝与天赋树。面向玩家的文档：[境界与阶段](/cultivation/realms/)、[聚灵采气](/cultivation/qi-gathering/)、[天劫](/cultivation/tribulations/)、[种族](/cultivation/races/)、[本命法宝](/cultivation/lifebound/)、[天赋树](/cultivation/skilltree/)。

此类上有两个枚举：`RitualType`（`BREAKTHROUGH`、`ADVANCEMENT`、`REFINEMENT`）与 `MeditationStopReason`（`COMMAND`、`MOVEMENT`）。

| 事件 | 可取消 | 触发时机 | 暴露 |
|:---|:---|:---|:---|
| `PreQiGainEvent` | 是 | 灵气即将入账，对**每一处**来源皆然 —— 打坐周期、赌斗结算、管理授予 —— 且在模组自身所有倍率之后。 | `ref()`、`player()`、`amount()` / `setAmount(float)`、`baseAmount()`（任何监听器动手之前的值）。 |
| `QiGainEvent` | 否 | 灵气已入账。 | `ref()`、`player()`、`amount()`、`totalQi()`。 |
| `PreMeditationStartEvent` | 是 | 玩家即将盘坐打坐。取消则让他继续站着。 | `ref()`、`player()`。 |
| `MeditationStartEvent` | 否 | 玩家已盘坐打坐。 | `ref()`、`player()`。 |
| `PreMeditationStopEvent` | 是 | 玩家即将停止打坐。取消可让一场仪式不可打断，或压制移动中断。 | `ref()`、`player()`、`reason()`。 |
| `MeditationStopEvent` | 否 | 玩家已停止。任何仪式惩罚都已施加。 | `ref()`、`player()`、`reason()`。 |
| `PreRitualStartEvent` | 是 | 一场计时仪式即将开始。取消后玩家继续打坐（照常存灵气），却永不进入仪式。 | `ref()`、`player()`、`type()`、`requiredSeconds()` / `setRequiredSeconds(float)`。 |
| `RitualStartEvent` | 否 | 首次累积仪式进度的那一 tick。 | `ref()`、`player()`、`type()`。 |
| `PreBreakthroughEvent` | 是 | 一次境界突破即将完成。取消可把他按在圆满阶段 —— 进度重置，他可以再试。 | `ref()`、`player()`、`fromRealm()`、`toRealm()`、`qiCost()` / `setQiCost(float)`。 |
| `BreakthroughEvent` | 否 | 突破已完成；其阶段为 `EARLY`。 | `ref()`、`player()`、`newRealm()`。 |
| `PreAdvancementEvent` | 是 | 一次子阶段晋阶即将完成。取消可把他按在原处。 | `ref()`、`player()`、`realm()`、`fromStage()`、`toStage()`、`qiCost()` / `setQiCost(float)`。 |
| `AdvancementEvent` | 否 | 晋阶已完成。 | `ref()`、`player()`、`realm()`、`newStage()`。 |
| `PreDemotionEvent` | 是 | 玩家即将因放弃仪式而折损一个子阶段。取消则他全身而退 —— 存蓄的灵气也保住了。 | `ref()`、`player()`、`realm()`、`oldStage()`、`newStage()`、`wasBreakthrough()`。 |
| `DemotionEvent` | 否 | 跌境已落定；存蓄灵气被清空，随之授予的天赋点被收回。 | `ref()`、`player()`、`realm()`、`oldStage()`、`newStage()`、`wasBreakthrough()`。 |
| `PreTribulationStrikeEvent` | 是 | 天劫雷霆即将劈向仪式中的修士。取消可完全放过他 —— 无雷、无声、无伤。把伤害设为 0 则让雷落得无伤无害。 | `ref()`、`player()`、`damage()` / `setDamage(float)`（在致死上限之后、护甲之前）、`breakthroughRitual()`。 |
| `TribulationStrikeEvent` | 否 | 雷已落下。 | `ref()`、`player()`、`damage()`、`breakthroughRitual()`。 |
| `PreHeartDevilTrialEvent` | 是 | 一次心魔侵扰即将折磨仪式中的修士。把扣减设为 0 可让那幻象纯粹成为装饰。 | `ref()`、`player()`、`composureDrain()` / `setComposureDrain(float)`、`leanFraction()`（0–1）、`pulseIndex()`（自 0 起）、`breakthroughRitual()`。 |
| `HeartDevilTrialEvent` | 否 | 一次侵扰已结算。 | `ref()`、`player()`、`composureRemaining()`、`deviated()`、`breakthroughRitual()`。 |
| `PreQiDeviationEvent` | 是 | 道心已碎，走火入魔即将施加。取消可免去这份惩罚 —— 仪式仍然结束。 | `ref()`、`player()`、`demotes()` / `setDemotes(boolean)`、`qiLoss()` / `setQiLoss(float)`、`breakthroughRitual()`。 |
| `QiDeviationEvent` | 否 | 惩罚已落定。`demoted()` 与 `qiLost()` 中恰有一个承载它。 | `ref()`、`player()`、`demoted()`、`qiLost()`、`breakthroughRitual()`。 |
| `PreRaceChangeEvent` | 是 | 种族即将改变。取消后种族菜单只会报告「未发生变更」。 | `ref()`、`player()`、`oldRace()`、`newRace()`、`adminOverride()`。 |
| `RaceChangeEvent` | 否 | 种族已改变。管理员把种族设为玩家已有的那一个时不触发。 | `ref()`、`player()`、`oldRace()`、`newRace()`、`adminOverride()`。 |
| `PreSkillUnlockEvent` | 是 | 一个天赋树节点即将解锁。取消则他的点数不会被花掉。 | `ref()`、`player()`、`node()`、`pointCost()` / `setPointCost(int)`。 |
| `SkillUnlockEvent` | 否 | 节点已解锁；点数已花，各项修正已重新施加。 | `ref()`、`player()`、`node()`。 |
| `PreRespecEvent` | 是 | 一次天赋树洗点即将执行。 | `ref()`、`player()`、`refundedPoints()` / `setRefundedPoints(int)`。 |
| `RespecEvent` | 否 | 每个节点都已清空，点数已返还。 | `ref()`、`player()`、`refundedPoints()`。 |
| `PreLifeBoundLevelUpEvent` | 是 | 一件本命法宝即将升级。取消可把它按在当前等级 —— 经验仍会存下。 | `owner()`、`item()`（写入升级**之前**的那一叠）、`oldLevel()`、`newLevel()`。 |
| `LifeBoundLevelUpEvent` | 否 | 法宝已升级。 | `owner()`、`item()`（已更新）、`newLevel()`。 |

这些所覆写的配置键：`setRequiredSeconds` 对应 `Breakthrough-Base-Seconds` 与 `Advancement-Base-Seconds`；`PreTribulationStrikeEvent.setDamage` 对应 `Tribulation-Damage-Percent-Of-Max-Health` 与 `Advancement-Tribulation-Damage-Percent-Of-Max-Health`；`setComposureDrain` 对应 `HeartDevil-Composure-Drain-Per-Pulse`；`setDemotes` / `setQiLoss` 对应 `HeartDevil-Deviation-Demotes` 与 `HeartDevil-Deviation-Qi-Loss-Percent`；`PreRespecEvent` 映照 `Respec-Enabled` 与 `/cultivation respec` 指令。见[配置](/cultivation/config/)与[指令](/cultivation/commands/)。

本类中的 `player()` 通篇皆为 `@Nullable` —— 唯有 `PlayerRef` 组件不可用时它才为 null。

#### 大道与业力

`plugin.siren.API.DaoEvents` —— 14 个事件，涵盖元素、偏移、阴阳之衡、德行道途与业力。面向玩家的文档：[大道](/cultivation/dao/)与[业力](/cultivation/karma/)。

阴阳与业力几乎在每个打坐周期与每次击杀时都在变动，因此这些事件触发得很频繁。请让监听器保持轻量；若你只关心结果，请优先用道途与偏移事件。此类带有一个枚举 `ElementChangeReason`（`CHOSEN`、`DRIFT`）。

| 事件 | 可取消 | 触发时机 | 暴露 |
|:---|:---|:---|:---|
| `PreDaoElementChangeEvent` | 是 | 修士即将择定或改换某一元素。取消后它会报告「道未变更」。 | `ref()`、`player()`、`dao()`、`oldElement()`（首次择道时为 null）、`newElement()` / `setNewElement(DaoElement)`、`reason()`、`qiCost()` / `setQiCost(float)`（首次择道与 `DRIFT` 时恒为 0）。 |
| `DaoElementChangeEvent` | 否 | 元素已改变。 | `ref()`、`player()`、`dao()`、`oldElement()`、`newElement()`、`reason()`、`qiCost()`。 |
| `PreDaoAffinityGainEvent` | 是 | 行止亲和即将被加到某一元素上 —— 那正是最终导致偏移的压力。 | `player()`、`dao()`、`element()`、`amount()` / `setAmount(float)`。 |
| `DaoAffinityGainEvent` | 否 | 亲和已加上。 | `player()`、`dao()`、`element()`、`amount()`。 |
| `DaoDriftWarningEvent` | 否 | 修士已被警示其道正在偏移。每出现一个新的威胁元素触发一次。 | `player()`、`dao()`、`chosenElement()`、`driftingTo()`。 |
| `PreAlignmentShiftEvent` | 是 | 一次阴阳偏移即将施加。种族偏向的分流发生在此之后。 | `dao()`、`amount()` / `setAmount(float)`（原始偏移量）、`towardYin()`。 |
| `AlignmentShiftEvent` | 否 | 阴阳之衡已移动。 | `dao()`、`yin()`、`yang()` —— 种族偏向分流之后实际加上的量。 |
| `PrePathChangeEvent` | 是 | 德行道途即将改变。取消后底层的阴阳之衡分毫不动，因此这只是压制了那次重新归类。 | `player()`、`dao()`、`oldPath()`、`newPath()`。 |
| `PathChangeEvent` | 否 | 道途已改变并已昭告。 | `player()`、`dao()`、`oldPath()`、`newPath()`。 |
| `PreKarmaGainEvent` | 是 | 业力即将因一次击杀而记账。取消可让账簿保持清白。 | `player()`、`dao()`、`amount()` / `setAmount(float)`、`farmedKill()`（防刷窗口内的重复击杀 —— 不产灵气，业力却更重）。 |
| `KarmaGainEvent` | 否 | 业力已记账。 | `player()`、`dao()`、`amount()`、`total()`（在 `Karma-Max` 封顶之后）、`farmedKill()`。 |
| `KarmaClearedEvent` | 否 | 业力已消解 —— 或因挺过一道天劫落雷，或因久不杀生的墙上时钟衰减。 | `dao()`、`amount()`、`total()`、`fromTribulation()`。 |
| `PreDevilHarvestEvent` | 是 | 一名魔道修士即将从被斩杀的玩家身上掠夺存蓄灵气。 | `killer()`、`killerPlayer()`、`qi()` / `setQi(float)`。 |
| `DevilHarvestEvent` | 否 | 掠夺已发生。 | `killer()`、`killerPlayer()`、`qi()`。 |

这些所覆写的配置键：`PreDaoElementChangeEvent.setQiCost` 对应 `Dao-Switch-Base-Qi-Cost` 与 `Dao-Switch-Qi-Cost-Realm-Multiplier`；`PreDaoAffinityGainEvent.setAmount` 对应 `Dao-Affinity-Per-Elemental-Kill`（由 `Dao-Drift-Margin` 决定偏移何时触发）；`PreAlignmentShiftEvent.setAmount` 对应 `Meditation-Alignment-Shift-Per-Tick` 与 `Kill-Yin-Amount`，其后置事件的分流则由 `Qi-Alignment-Yin-Bias-Percent` 支配；`PreKarmaGainEvent.setAmount` 对应 `Karma-Per-Player-Kill` 与 `Karma-Per-Farmed-Kill`；`PreDevilHarvestEvent.setQi` 对应 `Path-Devil-PK-Qi-Reward`。

#### 功法

`plugin.siren.API.TechniqueEvents` —— 11 个事件，涵盖功法的施展与习得、御剑飞行的开关，以及计时战斗增益。面向玩家的文档：[功法](/cultivation/techniques/)与[秘籍](/cultivation/manuals/)。

对经由 [`CultivationAPI.registerTechnique`](/cultivation/api/registries/) 注册的第三方功法，这些事件与对内置功法完全一样地触发 —— 关卡、消耗与冷却的管线是共用的。此处有两个枚举：`BuffType`（`IRON_BODY`、`QI_INFUSION`、`QI_BARRIER`、`CLOUD_STEP`）与 `FlightStopReason`（`TOGGLE`、`QI_EXHAUSTED`、`DEATH`）。

| 事件 | 可取消 | 触发时机 | 暴露 |
|:---|:---|:---|:---|
| `PreTechniquePerformEvent` | 是 | 一门功法即将施展 —— 每道关卡都已通过。取消可静默回绝：不耗灵气，不进冷却。 | `ref()`、`player()`、`technique()`、`qiCost()` / `setQiCost(float)`、`cooldownSeconds()` / `setCooldownSeconds(float)`（小于等于 0 则不盖冷却戳）。 |
| `TechniquePerformEvent` | 否 | 灵气已耗、冷却已盖戳、效果已运行。 | `ref()`、`player()`、`technique()`、`qiCost()`。 |
| `PreTechniqueLearnEvent` | 是 | 一门功法即将被永久习得。取消可回绝之 —— 无论如何秘籍都会被消耗，正如一本传授已知功法的秘籍照样会被用掉。 | `ref()`、`player()`、`techniqueId()`。 |
| `TechniqueLearnEvent` | 否 | 功法已习得。宗门所授的功法是实时解算的，永不触发此事件 —— 请改为监听宗门碑文事件。 | `ref()`、`player()`、`techniqueId()`。 |
| `PreSwordFlightStartEvent` | 是 | 修士即将御剑升空。 | `ref()`、`player()`、`horizontalSpeed()` / `setHorizontalSpeed(float)`、`verticalSpeed()` / `setVerticalSpeed(float)`。 |
| `SwordFlightStartEvent` | 否 | 他已凌空。 | `ref()`、`player()`、`horizontalSpeed()`、`verticalSpeed()`。 |
| `PreSwordFlightStopEvent` | 是 | 修士即将落地。对 `TOGGLE` 取消是安全的，但取消一次 `DEATH` 落地会把飞行状态留在一具尸体上 —— 请按 `reason()` 加以判别。 | `ref()`、`player()`、`reason()`。 |
| `SwordFlightStopEvent` | 否 | 他已落地；其坐骑（若有）也已消失。 | `ref()`、`player()`、`reason()`。 |
| `PreTechniqueBuffApplyEvent` | 是 | 一项计时功法增益即将施加。 | `ref()`、`player()`、`type()`、`durationSeconds()` / `setDurationSeconds(float)`、`magnitude()` / `setMagnitude(float)`。 |
| `TechniqueBuffApplyEvent` | 否 | 增益已生效。`magnitude` 表示该增益所度量的东西 —— 一个减伤百分比、一个伤害百分比、一个护盾池、一个速度倍率。 | `ref()`、`player()`、`type()`、`durationSeconds()`、`magnitude()`。 |
| `TechniqueBuffExpireEvent` | 否 | 疾风步的速度倍率已被撤回，或因到期，或因清理。 | `ref()`、`player()`、`type()`。 |

这些所覆写的配置键：`PreTechniquePerformEvent` 映照功法规则中各门功法自己的 `Qi-Cost` 与 `Cooldown-Seconds` 条目（见[配置](/cultivation/config/)），以及[指令](/cultivation/commands/)页上的 `/cultivation technique <id>` 指令。`PreTechniqueLearnEvent` 只会为规则中设了 `Requires-Manual` 的功法触发。

#### 物品

`plugin.siren.API.ItemEvents` —— 12 个事件，涵盖修炼掉落、丹药、修行之核、秘籍与炼器。面向玩家的文档：[聚灵采气](/cultivation/qi-gathering/)、[炼丹](/cultivation/alchemy/)、[秘籍](/cultivation/manuals/)、[炼器](/cultivation/refinement/)。

从秘籍中习得功法会触发上文的功法习得事件；传授天赋节点的秘籍则走核心的天赋解锁事件。本类涵盖的是秘籍**物品**本身。此处有两个枚举：`LootType`（`CULTIVATION_CORE`、`BEAST_EGG`、`SPIRIT_STONE`、`MANUAL`）与 `RefinementOutcome`（`SUCCESS`、`DESTROYED`、`DEMOTED`、`FAILED`）。

| 事件 | 可取消 | 触发时机 | 暴露 |
|:---|:---|:---|:---|
| `PreLootDropEvent` | 是 | 一份修炼掉落即将交付。取消可拒绝它。 | `ref()`、`player()`、`type()`、`itemId()` / `setItemId(String)` —— 可整个替换成另一件物品。 |
| `LootDropEvent` | 否 | 掉落已落入玩家背包并已昭告。判定未中、或物品放不下时永不触发。 | `ref()`、`player()`、`type()`、`itemId()`。 |
| `PreManualReadEvent` | 是 | 一本秘籍即将授法。取消可回绝之 —— 无论如何秘籍都会被消耗。 | `ref()`、`player()`、`techniqueId()`（传授功法时有值）、`skillNodeId()`（传授节点时有值）。 |
| `ManualReadEvent` | 否 | 秘籍已被阅读，其所授已施加。 | `ref()`、`player()`、`techniqueId()`、`skillNodeId()`。 |
| `PrePillConsumeEvent` | 是 | 一枚灵丹即将生效。取消则该丹药**不会**被消耗。 | `ref()`、`player()`、`effect()` —— 该交互所配置的效果 id。 |
| `PillConsumeEvent` | 否 | 丹药已服下，其药力已施加。 | `ref()`、`player()`、`effect()`。 |
| `PreSpiritCoreConsumeEvent` | 是 | 一枚修行之核即将被吸收。取消则该核**不会**被消耗。 | `ref()`、`player()`、`qi()` / `setQi(float)`（打坐加成已折入其中）、`meditating()`。 |
| `SpiritCoreConsumeEvent` | 否 | 核已被吸收。 | `ref()`、`player()`、`qi()` —— 实际入账的量。 |
| `PreRefinementStartEvent` | 是 | 一场炼器仪式即将开始。取消则不耗灵气。 | `ref()`、`player()`、`element()`、`targetTier()`、`qiCost()` / `setQiCost(float)`。 |
| `RefinementStartEvent` | 否 | 仪式已开始；灵气已耗，修士已落座。 | `ref()`、`player()`、`element()`、`targetTier()`、`qiCost()`。 |
| `PreRefinementCompleteEvent` | 是 | 一场炼器仪式即将结算。取消可静默中止 —— 兵器分毫不动，但预先付出的灵气仍是耗掉了。 | `ref()`、`player()`、`element()`、`targetTier()`、`successChance()` / `setSuccessChance(float)` —— 填 1 必成，填 0 必败。 |
| `RefinementCompleteEvent` | 否 | 仪式已结算。 | `ref()`、`player()`、`element()`、`targetTier()`、`outcome()`、`stack()` —— 事后的兵器，若已毁则为 null。 |

这些所覆写的配置键：`PreLootDropEvent` 对应各项掉落概率键（`Spirit-Core-Drop-Chance`、`Profound-Core-Drop-Chance`、`Divine-Core-Drop-Chance`、`Egg-Kill-Drop-Chance`、`SpiritStone-Kill-Drop-Chance`、`Manual-Tribulation-Drop-Chance`、`Manual-Player-Kill-Drop-Chance`）；`PreSpiritCoreConsumeEvent.setQi` 对应 `Spirit-Core-Qi-Value` / `Profound-Core-Qi-Value` / `Divine-Core-Qi-Value` 与 `Meditation-Core-Bonus-Multiplier`；`PreRefinementStartEvent.setQiCost` 对应 `Refinement-Base-Qi-Cost` 与 `Refinement-Qi-Cost-Tier-Multiplier`；`PreRefinementCompleteEvent.setSuccessChance` 对应 `Refinement-Base-Success-Chance`、`Refinement-Success-Chance-Loss-Per-Tier` 与 `Refinement-Min-Success-Chance`。

#### 灵兽

`plugin.siren.API.BeastEvents` —— 12 个事件，涵盖收服、孵化、召唤，以及伙伴自身的修行。面向玩家的文档：[灵兽](/cultivation/beasts/)。

此处有两个枚举：`BindSource`（`TAME`、`HATCH`）与 `DismissReason`（`DISMISSED` —— 遣归，所修一概不损；`RELEASED` —— 永久放归，契约就此断绝）。

| 事件 | 可取消 | 触发时机 | 暴露 |
|:---|:---|:---|:---|
| `PreBeastTameAttemptEvent` | 是 | 一次收服判定即将掷出。取消可直接回绝这次尝试 —— 不耗符箓。 | `ref()`、`player()`、`species()`、`chance()` / `setChance(float)` —— 0–1，已计入境界与道之共鸣的加权。 |
| `BeastTameAttemptEvent` | 否 | 判定已结算。 | `ref()`、`player()`、`species()`、`chance()`、`success()`。 |
| `PreBeastBindEvent` | 是 | 一头伙伴即将结契。取消则修士保留他原有的灵兽 —— 符箓或蛋照样耗掉。 | `ref()`、`player()`、`species()`、`source()`。 |
| `BeastBindEvent` | 否 | 伙伴已结契，取代此前的那一头。 | `ref()`、`player()`、`species()`、`source()`。 |
| `PreBeastSummonEvent` | 是 | 伙伴之身即将生成。取消则玩家会被告知召唤失败。 | `owner()`、`player()`、`species()`。 |
| `BeastSummonEvent` | 否 | 其身已生成于主人身侧。 | `owner()`、`player()`、`beast()`（生成的实体）、`species()`。 |
| `PreBeastDismissEvent` | 是 | 伙伴即将被遣归或放归。 | `owner()`、`player()`、`reason()`。 |
| `BeastDismissEvent` | 否 | 其身已离世间。 | `owner()`、`player()`、`reason()`。 |
| `PreBeastXpGainEvent` | 是 | 伙伴即将获得经验。对每一处来源皆触发 —— 打坐分成、击杀与亲手喂食一视同仁。 | `owner()`、`player()`、`beast()`（当前的 `SpiritBeastComponent` —— 境界、阶段、已存经验）、`amount()` / `setAmount(float)`。 |
| `BeastXpGainEvent` | 否 | 经验已入账。 | `owner()`、`player()`、`amount()`、`stagesGained()`（只存了进度时为 0）。 |
| `PreBeastAdvanceEvent` | 是 | 伙伴即将进阶一个阶段。取消可把它按在原处 —— 那一阶段的经验已经花掉了，因此这会让它白丢那份进度。 | `owner()`、`player()`、`fromRealm()`、`fromStage()`。 |
| `BeastAdvanceEvent` | 否 | 伙伴已进阶。每一阶段触发一次。 | `owner()`、`player()`、`realm()`、`stage()`。 |

这些所覆写的配置键：`PreBeastTameAttemptEvent.setChance` 对应 `Tame-Chance-Bonus-Per-Realm`、`Tame-Chance-Element-Match-Bonus` 与 `Tame-Chance-Max`（由 `Tame-Consume-Talisman-On-Failure` 决定失手的代价）；`PreBeastXpGainEvent.setAmount` 对应 `Beast-Xp-Per-Kill`、`Beast-Xp-Own-Kill-Multiplier` 与 `Beast-Xp-Per-Qi-Item-Point`。整套系统的门禁：`Beasts-Enabled`。

#### 宗门

`plugin.siren.API.SectEvents` —— 27 个事件，涵盖开宗、门籍、职位、大殿与殿上碑文。面向玩家的文档：[宗门](/cultivation/sects/)，以及[指令](/cultivation/commands/)页上的 `/sect` 系列。

记住上文那两条约束：监听器持有 `SectManager` 的锁，且此处的玩家是 `UUID`。此类上有两个枚举：`JoinMethod`（`INVITE`、`OPEN`、`REQUEST`）与 `LeaveReason`（`LEFT`、`KICKED`）。

| 事件 | 可取消 | 触发时机 | 暴露 |
|:---|:---|:---|:---|
| `PreSectCreateEvent` | 是 | 玩家即将开宗立派。取消后它会报告创立被回绝。 | `leader()`、`name()` / `setName(String)` —— 事后仍会重新校验形状与唯一性。 |
| `SectCreateEvent` | 否 | 宗门已创立并已建索引。 | `leader()`、`sect()`。 |
| `PreSectDisbandEvent` | 是 | 宗门即将解散。取消可保其不倒。 | `leader()`、`sect()`。 |
| `SectDisbandEvent` | 否 | 门人索引已解除、阵法已释放。`sect` 是那个已成孤儿的对象，仍可读取其最后的名录。 | `leader()`、`sect()`。 |
| `PreSectInviteEvent` | 是 | 一份邀约即将发出。 | `inviter()`、`invitee()`、`sect()`、`expiryMillis()` / `setExpiryMillis(long)` —— 其失效的墙上时钟毫秒数。 |
| `SectInviteEvent` | 否 | 邀约处于未决状态，尚未被接受。 | `inviter()`、`invitee()`、`sect()`。 |
| `PreSectJoinEvent` | 是 | 玩家即将入门。取消后邀约或申请仍存续，因此他可以再试。 | `player()`、`sect()`、`method()`。 |
| `SectJoinEvent` | 否 | 他已在名录之上。 | `player()`、`sect()`、`method()`。 |
| `PreSectLeaveEvent` | 是 | 玩家即将离去或被逐。取消可把他留在名录上。 | `player()`、`sect()`、`reason()`、`actor()`。 |
| `SectLeaveEvent` | 否 | 他已不在名录上。`KICKED` 时 `actor` 是执行驱逐者，`LEFT` 时则是玩家本人。 | `player()`、`sect()`、`reason()`、`actor()`。 |
| `PreSectJoinRequestEvent` | 是 | 一份入门申请即将排入某个 `REQUEST` 规矩的宗门。 | `player()`、`sect()`。 |
| `SectJoinRequestEvent` | 否 | 申请已排入队列。 | `player()`、`sect()`。 |
| `SectJoinRequestDeniedEvent` | 否 | 管理者驳回了一份未决申请。 | `manager()`、`applicant()`、`sect()`。 |
| `PreSectRankChangeEvent` | 是 | 长老职位即将变更。 | `leader()`、`target()`、`sect()`、`promoted()` —— 由弟子擢升为长老时为 true。 |
| `SectRankChangeEvent` | 否 | 职位已变更。 | `leader()`、`target()`、`sect()`、`promoted()`。 |
| `PreSectMottoChangeEvent` | 是 | 宗训即将设定。 | `manager()`、`sect()`、`oldMotto()`、`motto()` / `setMotto(String)` —— 事后仍适用 60 字符上限。 |
| `SectMottoChangeEvent` | 否 | 宗训已替换。 | `manager()`、`sect()`、`oldMotto()`、`newMotto()`。 |
| `PreSectJoinPolicyChangeEvent` | 是 | 入门规矩即将变更。 | `leader()`、`sect()`、`oldPolicy()`、`policy()` / `setPolicy(Sect.JoinPolicy)`。 |
| `SectJoinPolicyChangeEvent` | 否 | 规矩已变更。 | `leader()`、`sect()`、`oldPolicy()`、`newPolicy()`。 |
| `PreSectRenameEvent` | 是 | 宗门即将改名。 | `leader()`、`sect()`、`oldName()`、`newName()` / `setNewName(String)` —— 事后仍会重新校验。 |
| `SectRenameEvent` | 否 | 已改名；阵法、山门灵泉与未决邀约都已随之带过。 | `leader()`、`sect()`、`oldName()`、`newName()`。 |
| `PreSectInscriptionChangeEvent` | 是 | 殿上碑文即将变更。 | `leader()`、`sect()`、`oldTechniqueId()`、`newTechniqueId()` / `setNewTechniqueId(String)` —— 传空则将其抹去。 |
| `SectInscriptionChangeEvent` | 否 | 碑文已变更。 | `leader()`、`sect()`、`oldTechniqueId()`、`newTechniqueId()`。 |
| `PreSectHallClaimEvent` | 是 | 大殿即将设立。取消后它会报告该区块已被占据。 | `leader()`、`sect()`、`world()`、`chunkX()`、`chunkZ()`、`veinTier()`。 |
| `SectHallClaimEvent` | 否 | 宗门已在一条灵脉上设立或迁移了大殿。 | `leader()`、`sect()`、`world()`、`chunkX()`、`chunkZ()`、`veinTier()`。 |
| `PreSectHallCaptureEvent` | 是 | 大殿即将易主给得胜的围攻方。取消可让它留在守方手中 —— 围攻仍判为胜。 | `attacker()`、`defender()`、`world()`、`chunkX()`、`chunkZ()`、`veinTier()`。 |
| `SectHallCaptureEvent` | 否 | 一场获胜的围攻已移交大殿；守方现已无殿。 | `attacker()`、`defender()`、`world()`、`chunkX()`、`chunkZ()`、`veinTier()`。 |

这些所覆写的配置键：`PreSectInviteEvent.setExpiryMillis` 对应 `Sect-Invite-Expiry-Seconds`；大殿的设立受 `Sect-Hall-Min-Vein-Tier` 管辖；碑文受 `Sect-Inscription-Enabled` 管辖；整个子系统受 `Sects-Enabled` 与 `Sect-Max-Members` 管辖。

#### 战事

`plugin.siren.API.WarEvents` —— 5 个事件，涵盖向敌方大殿宣战及其如何结算。面向玩家的文档：[宗门攻伐](/cultivation/wars/)。

大殿真正易主的是 `SectEvents.SectHallCaptureEvent`，它在夺取过程内部触发 —— 否决**那一个**，即可让围攻获胜而大殿不动。此处有一个枚举：`SiegeFailReason`（`LAPSED`、`DEFENDER_GONE`）。

| 事件 | 可取消 | 触发时机 | 暴露 |
|:---|:---|:---|:---|
| `PreWarDeclareEvent` | 是 | 一场围攻即将宣布。取消后调用方会被告知战事系统已禁用。 | `attacker()`、`defender()`、`windowMillis()` / `setWindowMillis(long)` —— 攻方有多久去完成其占据。 |
| `WarDeclareEvent` | 否 | 围攻已生效，双方均已收到告知。 | `attacker()`、`defender()`、`siege()`。 |
| `PreSiegeCaptureEvent` | 是 | 一场围攻即将获胜。取消可让它继续进行 —— 攻方仍在占据，并会在其下一个在场判定周期再次触发此事件，因此请仅在你自己的某个条件尚未满足时取消。 | `attacker()`、`defender()`、`siege()`。 |
| `SiegeCaptureEvent` | 否 | 攻方已占据足够久。大殿的移交已经尝试过，守方的免战冷却也已开始。 | `attacker()`、`defender()`、`siege()`。 |
| `SiegeFailEvent` | 否 | 围攻结束，大殿仍在守方手中。 | `siege()`、`reason()`。 |

这些所覆写的配置键：`PreWarDeclareEvent.setWindowMillis` 对应 `War-Window-Seconds`；相关键还有 `War-Required-Hold-Seconds`、`War-Cooldown-Hours`、`War-Defender-Grace-Seconds`、`War-Requires-Defender-Online` 以及 `Wars-Enabled` 这道门禁。

#### 斗法

`plugin.siren.API.DuelEvents` —— 8 个事件，涵盖发起、接受，以及一场灵气赌斗如何结算。面向玩家的文档：[斗法](/cultivation/duels/)，以及[指令](/cultivation/commands/)页上的 `/cultivation duel`。

此处的玩家是 `UUID`，因为一场赌斗经常比其中一名参与者的会话活得更久 —— 而那恰恰正是它作罢的缘由。此处有一个枚举：`DuelEndReason`（`DEATH` —— 押注易主；`VOIDED` —— 有参与者离开、或赌斗超出其最长时限，押注分毫不动）。

| 事件 | 可取消 | 触发时机 | 暴露 |
|:---|:---|:---|:---|
| `PreDuelChallengeEvent` | 是 | 一份邀约即将发出。 | `challenger()`、`challenged()`、`wager()` / `setWager(int)` —— 事后仍会重新核对所配置的上限。 |
| `DuelChallengeEvent` | 否 | 邀约正等待对方应答。 | `challenger()`、`challenged()`、`wager()`。 |
| `DuelDeclineEvent` | 否 | 邀约已被拒绝；赌斗未开始。 | `challenger()`、`challenged()`。 |
| `PreDuelStartEvent` | 是 | 一场赌斗即将开始。取消可回绝之 —— 无论如何邀约都已消耗，因此挑战者须重新发起一份。 | `challenger()`、`challenged()`、`wager()` / `setWager(int)` —— 在此重新调整的值，才是这场赌斗实际结算的数额。 |
| `DuelStartEvent` | 否 | 赌斗已生效；双方均被标记为赌斗中。 | `challenger()`、`challenged()`、`wager()`。 |
| `DuelEndEvent` | 否 | 赌斗已结束。`DEATH` 时胜者与败者是有意义的，且结算已排队；`VOIDED` 时二者不过是那两名参与者。 | `winner()`、`loser()`、`wager()`、`reason()`。 |
| `PreDuelPayoutEvent` | 是 | 一场已判定赌斗的押注即将转移。取消可让胜者一无所得。 | `winner()`、`loser()`、`amount()` / `setAmount(int)` —— 实际转移的量仍受败者所持数额的封顶。 |
| `DuelPayoutEvent` | 否 | 押注已转移。`amount` 是败者所能拿出的数额，也正是胜者所得。 | `winner()`、`loser()`、`amount()`。 |

这些所覆写的配置键：`setWager` 对应 `Duel-Max-Wager`；相关键还有 `Duel-Challenge-Expiry-Seconds`、`Duel-Max-Duration-Seconds`、`Duel-Overrides-World-Pvp` 以及 `Duels-Enabled` 这道门禁。

#### 阵法

`plugin.siren.API.FormationEvents` —— 6 个事件，涵盖锚定于区块的灵阵之布设与驱散，以及困仙阵伤及入侵者。面向玩家的文档：[阵法](/cultivation/formations/)。

| 事件 | 可取消 | 触发时机 | 暴露 |
|:---|:---|:---|:---|
| `PreFormationPlaceEvent` | 是 | 一座阵法即将布下。取消后它会报告此地已被设防。 | `owner()`、`sectName()`（阵法归其个人时为空）、`world()`、`chunkX()`、`chunkZ()`、`type()`、`radiusChunks()` / `setRadiusChunks(int)`。 |
| `FormationPlaceEvent` | 否 | 阵法已在其区块上生效。 | `owner()`、`sectName()`、`formation()`。 |
| `PreFormationRemoveEvent` | 是 | 一座阵法即将被其掌阵者驱散。取消可让它继续矗立。 | `owner()`、`sectName()`、`formation()`。 |
| `FormationRemoveEvent` | 否 | 已驱散。`formation` 是那个已被移除的对象。 | `owner()`、`sectName()`、`formation()`。 |
| `PreFormationTrapStrikeEvent` | 是 | 困仙阵即将伤及一名入侵者。取消可让他完全逃过这一次结算 —— 无粒子、无减益、无伤害。把伤害设为 0 则只定住他而不伤其身。 | `ref()`、`player()`、`world()`、`chunkX()`、`chunkZ()`、`damage()` / `setDamage(float)` —— 在致死上限之后、护甲之前；入侵者的生命值无法解析时为 0。 |
| `FormationTrapStrikeEvent` | 否 | 入侵者已受伤。 | `ref()`、`player()`、`world()`、`chunkX()`、`chunkZ()`、`damage()`。 |

这些所覆写的配置键：`setRadiusChunks` 视 `type()` 而定，对应 `QiGathering-Radius-Chunks`、`Warding-Radius-Chunks` 或 `Trapping-Radius-Chunks`；`PreFormationTrapStrikeEvent.setDamage` 对应 `Trapping-Damage-Percent-Of-Max-Health`（与之并列的还有 `Trapping-Lethal`、`Trapping-Interval-Seconds` 与 `Trapping-Debuff-Duration-Seconds`）。整套系统的门禁：`Formations-Enabled` 与 `Max-Formations-Per-Controller`。

#### 洞府

`plugin.siren.API.DwellingEvents` —— 12 个事件，涵盖洞府的开辟、其灵泉、供奉与闭关。面向玩家的文档：[洞府](/cultivation/dwelling/)。

宗门山门灵泉是自动创建并随其宗门大殿迁移的；那套内务处理刻意不触发任何事件。请改为监听宗门大殿的设立与夺取事件 —— 它们才是其成因。

| 事件 | 可取消 | 触发时机 | 暴露 |
|:---|:---|:---|:---|
| `PreDwellingClaimEvent` | 是 | 一座洞府即将开辟或迁移。取消后它会报告此地已被设防。 | `owner()`、`world()`、`chunkX()`、`chunkZ()`、`veinTier()`、`moved()`、`radiusChunks()` / `setRadiusChunks(int)`。 |
| `DwellingClaimEvent` | 否 | 洞府已开辟，或已有的一座完成迁移 —— 迁移会保留所蓄灵泉与已付供奉。 | `owner()`、`dwelling()`、`moved()`。 |
| `PreDwellingAbandonEvent` | 是 | 一座洞府即将被舍弃。取消可保其不失。 | `owner()`、`dwelling()`。 |
| `DwellingAbandonEvent` | 否 | 已舍弃；灵泉中所存也随之而去。 | `owner()`、`dwelling()`。 |
| `PreDwellingLapseEvent` | 是 | 一座洞府即将因未付供奉而被收回。取消可为其缓刑 —— 它只能撑到下一次扫描重新检验它为止，因此请从一个「持续在做判断」的监听器中取消，而非一次性的。 | `dwelling()`。 |
| `DwellingLapseEvent` | 否 | 一处私人洞府在其宽限期过后被世界收回。 | `dwelling()`。 |
| `PreSpringCollectEvent` | 是 | 一眼灵泉即将被饮尽。取消可让它保持满盈。 | `dwelling()`、`amount()` / `setAmount(float)` —— 改变取用者带走的量；灵泉无论如何都会被清空。 |
| `SpringCollectEvent` | 否 | 灵泉已被清空。`amount` 是交付出去的灵气 —— 由调用方为其入账。 | `dwelling()`、`amount()`。 |
| `PreUpkeepDepositEvent` | 是 | 供奉即将付讫。取消后它会报告未蓄存任何东西。 | `dwelling()`、`itemId()`、`quantity()`、`hours()` / `setHours(float)` —— 整份献纳所值几何，在蓄存时长封顶之前。 |
| `UpkeepDepositEvent` | 否 | 供奉已缴入。`hoursGranted` 是实际蓄存下来的量，一旦触顶便少于所献纳的量。 | `dwelling()`、`itemId()`、`quantity()`、`hoursGranted()`。 |
| `PreSeclusionSettleEvent` | 是 | 一次闭关即将结算。取消可使其作废 —— 玩家会被告知灵泉已干涸。 | `ref()`、`player()`、`dwelling()`、`hours()`（已被 `Seclusion-Max-Hours` 封顶）、`qi()` / `setQi(float)`（当 `Seclusion-Drains-Spring` 为开时，已被限制在灵泉所能覆盖的范围内）。 |
| `SeclusionSettleEvent` | 否 | 修士已出关，并已为其离开的时日付讫。 | `ref()`、`player()`、`dwelling()`、`hours()`、`qi()`。 |

这些所覆写的配置键：`PreDwellingClaimEvent.setRadiusChunks` 对应 `Dwelling-Radius-Chunks`；`PreSpringCollectEvent.setAmount` 对应 `Spring-Qi-Per-Hour`、`Spring-Pool-Base-Cap` 与 `Spring-Pool-Cap-Per-Realm`；`PreUpkeepDepositEvent.setHours` 对应 `Upkeep-Item-Hours`，并受 `Upkeep-Max-Banked-Hours` 封顶；`PreDwellingLapseEvent` 对应 `Upkeep-Grace-Hours`；`PreSeclusionSettleEvent.setQi` 对应 `Seclusion-Qi-Per-Hour`。整套系统的门禁：`Dwellings-Enabled`、`Upkeep-Enabled`、`Seclusion-Enabled`。

#### 另见

- [注册表](/cultivation/api/registries/) —— 添加你自己的种族、功法与灵气吸收物品。
- [接口参考](/cultivation/api/reference/) —— 直接读取玩家的修炼状态。
- [配置](/cultivation/config/) —— 事件允许你逐玩家覆写的每一个面向服主的键。
- [指令](/cultivation/commands/) —— 这些事件大多所依托的那些指令。
