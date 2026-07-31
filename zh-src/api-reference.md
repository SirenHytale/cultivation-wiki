---
title: 接口参考
description: CultivationAPI 门面上的组件类型 getter 与状态读取方法，以及线程约定。
group: 开发者
han: 匠
---

### 接口参考

`plugin.siren.API.CultivationAPI` 的其余部分 —— 扩展直接调用的那些方法，而非它所监听的[事件](/cultivation/api/events/)或它所添加的[注册表](/cultivation/api/registries/)。

该类上的一切皆为 `static`；构造函数是私有的，且它永不被实例化。大多数方法接受每个 Hytale ECS 系统手头已有的那两个参数：

- `ComponentAccessor<EntityStore> accessor` —— 该实体所在存储的访问器。
- `Ref<EntityStore> ref` —— 实体本身。

#### 线程

源码在一处对此有明确说明：事件监听器是在事件所发生玩家的世界线程上同步调用的，而在触碰任何位于另一世界的东西之前，你必须自行切换线程 —— `CompletableFuture.runAsync(task, otherWorld)`。

下列各项读取自身并无另行记载的线程约定；它们只是经由你所传入的访问器所作的普通组件读取，因此适用的是该访问器自己的线程规则。请从拥有你所读取 `Ref` 的那个世界线程上调用它们。

注册与监听器的调用则是反方向的例外：它们在任何插件的 `setup()` 中、以任何加载顺序都是安全的，因为其背后的结构是静态 map 与 `CopyOnWriteArrayList`，在玩家与模组交互之前无人读取。

#### 组件类型

当你想自行经由 ECS 读写某个 Cultivation 组件，而非使用下方的便捷读取时，向它索取一个 `ComponentType`。

| 方法 | 返回 | 说明 |
|:---|:---|:---|
| `CultivationAPI.getCultivationComponentType()` | `ComponentType<EntityStore, CultivationComponent>` | 境界、阶段与存蓄灵气。 |
| `CultivationAPI.getCultivationStateComponentType()` | `ComponentType<EntityStore, CultivationStateComponent>` | 瞬态状态 —— 打坐、仪式进度。 |
| `CultivationAPI.getCultivationSettingsComponentType()` | `ComponentType<EntityStore, CultivationSettingsComponent>` | 各玩家的设置，例如状态栏开关。 |
| `CultivationAPI.getRaceComponentType()` | `ComponentType<EntityStore, RaceComponent>` | 玩家所择的[种族](/cultivation/races/)。 |
| `CultivationAPI.getSkillTreeComponentType()` | `ComponentType<EntityStore, SkillTreeComponent>` | 已解锁的节点与未花费的点数 —— 见[天赋树](/cultivation/skilltree/)。 |
| `CultivationAPI.getTechniqueComponentType()` | `ComponentType<EntityStore, TechniqueComponent>` | 已习得的功法与冷却 —— 见[功法](/cultivation/techniques/)。 |
| `CultivationAPI.getSpiritVeinComponentType()` | `ComponentType<ChunkStore, SpiritVeinComponent>` | 区块的灵脉池。注意这一个是 **`ChunkStore`** 组件，而非实体组件 —— 见[聚灵采气](/cultivation/qi-gathering/)。 |

#### 修炼状态

| 方法 | 返回 | 说明 |
|:---|:---|:---|
| `CultivationAPI.getCultivationComponent(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref)` | `CultivationComponent`（可为 null） | 原始组件；实体没有该组件时返回 `null`。 |
| `CultivationAPI.getCultivationStateComponent(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref)` | `CultivationStateComponent`（可为 null） | 原始状态组件，或 `null`。 |
| `CultivationAPI.getRaceComponent(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref)` | `RaceComponent`（可为 null） | 原始种族组件，或 `null`。 |
| `CultivationAPI.getRealm(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref)` | `CultivationRealm`（可为 null） | 玩家当前的[境界](/cultivation/realms/)；若其没有 `CultivationComponent`（例如并非玩家实体）则为 `null`。 |
| `CultivationAPI.getStage(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref)` | `CultivationStage`（可为 null） | 玩家当前的子阶段，同样条件下为 `null`。 |
| `CultivationAPI.getGlobalLevel(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref)` | `int` | 境界与阶段压平成一个只增不减的数。没有 `CultivationComponent` 时为 `0`。 |
| `CultivationAPI.getQi(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref)` | `float` | 存蓄灵气 —— 即通往下一子阶段或突破的进度。没有 `CultivationComponent` 时为 `0`。 |
| `CultivationAPI.getRace(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref)` | `PlayerRace`（绝不为 null） | 玩家当前的种族；尚无 `RaceComponent` 时默认为人族。 |
| `CultivationAPI.isMeditating(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref)` | `boolean` | 此刻是否正盘坐打坐。没有状态组件时为 `false`。 |

`CultivationRealm` 依次为 `BODY_REFINEMENT`、`QI_CONDENSATION`、`FOUNDATION_ESTABLISHMENT`、`GOLDEN_CORE_FORMATION`、`NASCENT_SOUL`、`SOUL_FORMATION`、`VOID_REFINEMENT`。`CultivationStage` 依次为 `EARLY`、`MIDDLE`、`LATE`、`PEAK`。二者面向玩家的说明都在[境界与阶段](/cultivation/realms/)页。

门面上**没有** `setQi` 或 `grantQi`。若要从扩展中改变玩家的存蓄灵气，请挂接 `CultivationEvents.onPreQiGain`，在那次已经发生的获取上以 `event.setAmount(...)` 重新缩放 —— 那才是受支持的途径，也正是模组自身的种族、天赋、丹药、宗门与大道倍率所走的同一条路。见[事件页](/cultivation/api/events/)。

#### 天赋树

| 方法 | 返回 | 说明 |
|:---|:---|:---|
| `CultivationAPI.getAvailableSkillPoints(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref)` | `int` | 未花费的天赋树点数；尚无 `SkillTreeComponent` 时为 `0`。 |
| `CultivationAPI.isNodeUnlocked(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref, String nodeId)` | `boolean` | 玩家是否已解锁该节点 id。没有 `SkillTreeComponent`、或该 id 不匹配任何已解锁节点时为 `false`。 |

节点 id 就是 `plugin.siren.ECS.SkillTree.SkillTreeRegistry` 中的那些 —— 例如 `"VITALITY_1"`。面向玩家的树形图在[天赋树](/cultivation/skilltree/)页，点数则按[配置](/cultivation/config/)页的 `Points-Per-Breakthrough` 与 `Points-Per-Advancement` 两键授予。

#### 功法

| 方法 | 返回 | 说明 |
|:---|:---|:---|
| `CultivationAPI.performTechnique(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref, PlayerRef playerRef, Technique technique)` | `boolean` | 立即施展一门功法。施展成功返回 `true`，被某道关卡拦下则返回 `false`。 |

它会跑完每一道关卡 —— 系统已启用、该功法已启用、境界解锁、道之相符、灵气消耗、冷却 —— 成功时扣除灵气、盖上冷却戳并运行效果。无论成败玩家都会收到消息，或是效果的成功提示，或是失败的缘由。用它把一门功法接到你自己的触发器上：一个按键绑定、另一件物品、或你自己的一个事件。

它对内置功法与你自己注册的功法皆有效，且两种情形下都会触发 `TechniqueEvents.PreTechniquePerformEvent` 与 `TechniquePerformEvent`。构建一门功法见[注册表](/cultivation/api/registries/)，面向玩家的列表见[功法](/cultivation/techniques/)。

#### 存档、称号与配色

<span class="tag">v0.7.0</span> 面向玩家修炼存档与其装饰外观的读取面。注意这些方法接受的是 `Store<EntityStore>`，而非 `ComponentAccessor`。

| 方法 | 返回 |
|:---|:---|
| `getActiveProfileName(store, ref)` | 玩家所在存档的名字；在任何存档被创建之前为 `""`。 |
| `getProfileCount(store, ref)` | 玩家所持有的真实（非沙盒）存档数目。 |
| `isTestProfileActive(store, ref)` | 玩家此刻是否身处管理员授予的试炼存档沙盒 —— 排行榜与宗门积分皆不将其计入。 |
| `getMaxProfiles()` · `getMaxTechniquePresets()` | 当前生效的上限 —— 任何扩展所注册过的最高值，下限为 3。 |
| `getTitle(store, ref)` | 玩家已佩戴的[称号](/cultivation/titles/)，或 `null`。 |
| `getSectBanner(String)` · `getPalette(store, ref)` | 按 id 取一面已注册的旗帜；玩家所选的配色（`null` 表示默认外观）。 |

**存档是被观察的，而非被驱动的。**门面上刻意没有 `switchProfile` —— 切换是玩家自己的举动，经由菜单或 `/cultivation profile` 完成。扩展所能做的，是监听（`ProfileEvents`，见[事件](/cultivation/api/events/)）、让自己按存档维系的状态与之同步，并通过 `ProgressionProvider.supportsProfiles()`（见[编写扩展](/cultivation/api/addons/)）昭告它确实这样做了。

#### 注册

完整内容见[注册表](/cultivation/api/registries/)：

| 方法 | 返回 | 说明 |
|:---|:---|:---|
| `CultivationAPI.registerRace(String id, String displayName, String translationKey, CultivationRealm unlockRealm, Supplier<RaceConfig> stats)` | `PlayerRace` | 向种族菜单添加一个种族，以 `unlockRealm` 为门槛。 |
| `CultivationAPI.registerTechnique(String id, String displayName, String nameKey, String descriptionKey, TechniqueRule defaultRule, TechniqueEffect effect)` | `Technique` | 添加一门可施展的功法。 |
| `CultivationAPI.newTechniqueRule(String id, boolean enabled, boolean daoSpecific, String requiredElement, String elements, String damageType, String unlockRealm, float qiCost, float cooldownSeconds, Object... params)` | `TechniqueRule` | 为 `registerTechnique` 构建规则。 |
| `CultivationAPI.registerQiAbsorptionItemModifier(String itemId, float multiplier)` | | 设定某件物品在打坐时的灵脉吸收倍率。 |
| `CultivationAPI.registerTitle(CultivationTitle title)` | | 向称号页添加一个纯装饰称号。 |
| `CultivationAPI.registerSectBanner(SectBanner banner)` | | 添加一面宗门可悬挂于其大殿之上的旗帜。 |
| `CultivationAPI.registerPalette(CultivationPalette palette)` | | 添加一套玩家可选的菜单/HUD 配色。 |
| `CultivationAPI.registerProfileCap(String key, int cap)` · `registerTechniquePresetCap(String key, int cap)` | | 上调存档 / 配置组的上限（取最高的注册值）。 |

#### 另见

- [事件](/cultivation/api/events/) —— 重塑或否决任何一项机制。
- [注册表](/cultivation/api/registries/) —— 添加种族、功法、灵气物品、称号、宗门旗帜与配色。
- [配置](/cultivation/config/)与[指令](/cultivation/commands/) —— 上述大多数内容面向服主的对应形式。
