---
title: 注册表
description: 用 CultivationAPI 注册自己的种族、功法与灵气吸收物品，附完整示例；以及哪些扩展点不可注册。
group: 开发者
han: 匠
---

### 注册表

监听[事件](/cultivation/api/events/)让你得以重塑 Cultivation 已有的行为。而此处的注册表，让你得以**添加**模组随后会视如己出的内容 —— 一个出现在种族菜单里的种族、一门可经由每种功法触发器施展的功法、一件能增幅灵脉吸收的物品。

`CultivationAPI` 暴露三个注册方法与一个构建辅助方法：

| 方法 | 返回 | 说明 |
|:---|:---|:---|
| `CultivationAPI.registerRace(String id, String displayName, String translationKey, CultivationRealm unlockRealm, Supplier<RaceConfig> stats)` | `PlayerRace` | 注册一个全新的[种族](/cultivation/races/)，玩家修为达到 `unlockRealm` 后即可选择。 |
| `CultivationAPI.registerTechnique(String id, String displayName, String nameKey, String descriptionKey, TechniqueRule defaultRule, TechniqueEffect effect)` | `Technique` | 注册一门修士可施展的全新[功法](/cultivation/techniques/)。 |
| `CultivationAPI.newTechniqueRule(String id, boolean enabled, boolean daoSpecific, String requiredElement, String elements, String damageType, String unlockRealm, float qiCost, float cooldownSeconds, Object... params)` | `TechniqueRule` | 为你传给 `registerTechnique` 的规则提供的便捷构建器。 |
| `CultivationAPI.registerQiAbsorptionItemModifier(String itemId, float multiplier)` | | 注册或覆写某件物品的灵脉吸收倍率 —— 当它位于打坐玩家当前快捷栏槽位中时生效。 |

三者都可安全地从你自己插件的 `setup()` 中调用，相对于 Cultivation 自身的 `setup()` 无论何种加载顺序皆然。注册表是普通的静态 map，在玩家真正交互之前 —— 打开种族菜单、打坐、施展功法 —— 无人读取，而那只会发生在每个插件加载完毕许久之后。

以同一 id 重复注册一个种族或一门功法是**空操作**：它返回已有的条目而非报错，因此在你的插件重载时也是安全的。

#### 注册一个种族

```java
@Nonnull
public static PlayerRace registerRace(@Nonnull String id, @Nonnull String displayName, @Nullable String translationKey,
                                      @Nonnull CultivationRealm unlockRealm, @Nonnull Supplier<RaceConfig> stats)
```

| 参数 | 说明 |
|:---|:---|
| `id` | 一个稳定、唯一、且不展示给玩家的 id。请以你模组的名字作命名空间 —— `"MyMod:Vampire"` —— 以免与另一模组同短名的种族相撞。 |
| `displayName` | 未给出 `translationKey` 时界面所显示的名称；若该键在玩家的语言环境下无法解析，也会作为回退。 |
| `translationKey` | 用于本地化名称的 `server.lang` 键；填 `null` 则始终以纯文本显示未翻译的 `displayName`。 |
| `unlockRealm` | 玩家修为须达到的[境界](/cultivation/realms/)，方可在菜单中选择此族。 |
| `stats` | 每当需要时，供给此族的属性加成。 |

`stats` 供给器是实时调用的，因此你可以用自己插件的 `withConfig(name, RaceConfig.codec(...))` 为其提供一份服主可编辑的 JSON 文件，或者对固定数值直接用 `() -> myConstantConfig`。仅当所供给的配置尚未指定时，`unlockRealm` 才会去**播种** `RaceConfig` 的 `Unlock-Realm` —— 这样一来，用自己 JSON 文件（其本身可能设了 `Unlock-Realm`）来支撑属性的调用方，仍保持服主可编辑。

`RaceConfig` 为它的每一个可调项都提供了 getter 与 setter：`getDescription` / `setDescription`、`getUnlockRealm` / `setUnlockRealm`、`getHealthBonusPercent` / `setHealthBonusPercent`、`getDamageBonusPercent` / `setDamageBonusPercent`、`getQiGainRatePercentBonus` / `setQiGainRatePercentBonus`、`getBreakthroughDurationPercentReduction` / `setBreakthroughDurationPercentReduction`，以及 `getQiAlignmentYinBiasPercent` / `setQiAlignmentYinBiasPercent`。它们与[配置](/cultivation/config/)页内置种族配置文件中的 `Health-Bonus-Percent`、`Damage-Bonus-Percent`、`Qi-Gain-Rate-Percent-Bonus`、`Breakthrough-Duration-Percent-Reduction` 与 `Qi-Alignment-Yin-Bias-Percent` 诸键一一对应。

完整示例 —— 一个于元婴期解锁、属性固定的吸血鬼族：

```java
import plugin.siren.API.CultivationAPI;
import plugin.siren.ECS.Races.PlayerRace;
import plugin.siren.ECS.Realms.CultivationRealm;
import plugin.siren.Utils.Config.RaceConfig;

public final class MyRaces {

    public static PlayerRace VAMPIRE;

    public static void register(){
        VAMPIRE = CultivationAPI.registerRace(
                "MyMod:Vampire",
                "Vampire",
                "server.mymod.race.vampire",
                CultivationRealm.NASCENT_SOUL,
                MyRaces::vampireStats);
    }

    private static RaceConfig vampireStats(){
        RaceConfig config = new RaceConfig();
        config.setDescription("嗜血者。体魄孱弱，聚气之速却倍于常人。");
        config.setHealthBonusPercent(-10.0F);
        config.setDamageBonusPercent(15.0F);
        config.setQiGainRatePercentBonus(100.0F);
        config.setBreakthroughDurationPercentReduction(0.0F);
        config.setQiAlignmentYinBiasPercent(80.0F);
        return config;
    }
}
```

`Qi-Alignment-Yin-Bias-Percent` 的值会直接汇入[大道](/cultivation/dao/)页所述的阴阳之衡，因此以此法注册的种族，也会左右其族人朝哪一条德行之途漂移。

#### 注册一门功法

```java
@Nonnull
public static Technique registerTechnique(@Nonnull String id, @Nonnull String displayName, @Nullable String nameKey,
                                          @Nullable String descriptionKey, @Nonnull TechniqueRule defaultRule,
                                          @Nonnull TechniqueEffect effect)
```

这与内置的「一步千里」所用的是同一套系统。一经注册，该功法便自动可经由**每一种**功法触发器施展：

- `/cultivation technique <id>` 指令及其列表（见[指令](/cultivation/commands/)）；
- 任何 `CultivationActivateTechnique` 交互以此 id 作为其 `TechniqueId` 的启用物品；
- 你自己的触发器 —— 一个按键绑定、另一件物品、一个事件 —— 经由 `CultivationAPI.performTechnique`。

| 参数 | 说明 |
|:---|:---|
| `id` | 一个稳定、唯一的 id。它同时充当配置键与启用物品的 `TechniqueId`。请加命名空间 —— `"MyMod:flame_step"`。 |
| `displayName` | 未给出 `nameKey` 时显示；若该键无法解析，也作为回退。 |
| `nameKey` | 用于本地化名称的 `server.lang` 键，或 `null` 表示直接显示 `displayName`。 |
| `descriptionKey` | 用于描述的 `server.lang` 键，或 `null`。 |
| `defaultRule` | 该功法据以运行的规则。除非服主在 Cultivation 的 `TechniqueConfig.json` 中添加了一条相符的覆写条目，否则这是你功法规则的**唯一**来源。 |
| `effect` | 施展它会做什么。仅在所有关卡通过、灵气消耗与冷却均已施加之后才会被调用。 |

`TechniqueEffect` 是一个只有 `void execute(TechniqueContext context)` 一个方法的 `@FunctionalInterface`，因此一个 lambda 或方法引用便已足够。效果所需的一切都在 context 上：`getAccessor()`、`getRef()`、`getPlayerRef()`、`getTechnique()`、`getRule()`、`getParam(String key, float fallback)`、`getCultivation()`、`getRealmIndex()`、`getStageIndex()`、`getPosition()`、`getLookDirection()`、`getWorld()`、`teleport(Vector3d)`、`spawnParticle(String particleId, Vector3d position)` 与 `sendMessage(Message)`。其中的向量是 `org.joml.Vector3d`，故以 `x()`、`y()`、`z()` 读取其分量；实体没有 transform 时 `getPosition()` 返回 `null`，因此正式代码中使用前请先做判空。

请用辅助方法而非构造函数来构建规则：

```java
@Nonnull
public static TechniqueRule newTechniqueRule(@Nonnull String id, boolean enabled, boolean daoSpecific,
                                             @Nullable String requiredElement, @Nullable String elements,
                                             @Nullable String damageType, @Nonnull String unlockRealm,
                                             float qiCost, float cooldownSeconds, @Nonnull Object... params)
```

| 参数 | 说明 |
|:---|:---|
| `requiredElement` | 当 `daoSpecific` 为 true 时，一个 `DaoElement` 枚举名，例如 `"WIND"`；否则填 `""` 或 `null`。 |
| `elements` | 以逗号分隔的、该功法所「携带」的 `DaoElement` 名称 —— 元数据与风味 —— 或 `""`。 |
| `damageType` | 伤害类功法所用的 `DamageCause` 资产 id，无则填 `""`。 |
| `unlockRealm` | 使用它所需的 `CultivationRealm` 枚举名，例如 `"QI_CONDENSATION"`。 |
| `params` | 交替出现的键／值对，你的效果以 `context.getParam(key, fallback)` 读回。参数个数必须为**偶数**：`String, float, String, float, ...`。 |

完整示例 —— 一门携带火属性、将修士向前传送的「烈焰步」：

```java
import org.joml.Vector3d;
import plugin.siren.API.CultivationAPI;
import plugin.siren.ECS.Technique.Technique;
import plugin.siren.Utils.Config.TechniqueRule;

public final class MyTechniques {

    public static Technique FLAME_STEP;

    public static void register(){
        TechniqueRule rule = CultivationAPI.newTechniqueRule(
                "MyMod:flame_step",
                true,                 // enabled
                true,                 // daoSpecific
                "FIRE",               // requiredElement
                "FIRE",               // 所携带的属性
                "",                   // damageType —— 无
                "QI_CONDENSATION",    // unlockRealm
                25.0F,                // qiCost
                8.0F,                 // cooldownSeconds
                "Distance", 12.0F);   // params

        FLAME_STEP = CultivationAPI.registerTechnique(
                "MyMod:flame_step",
                "Flame Step",
                "server.mymod.technique.flame_step",
                "server.mymod.technique.flame_step.desc",
                rule,
                context -> {
                    float distance = context.getParam("Distance", 12.0F);
                    Vector3d from = context.getPosition();
                    Vector3d look = context.getLookDirection();
                    context.teleport(new Vector3d(
                            from.x() + look.x() * distance,
                            from.y(),
                            from.z() + look.z() * distance));
                    context.spawnParticle("MyMod:FlameStepBurst", new Vector3d(from));
                });
    }
}
```

由于 `daoSpecific` 为 true 且 `requiredElement` 为 `"FIRE"`，唯有行火之道的修士方可施展它 —— 见[大道](/cultivation/dao/)。施展它会像内置功法一样，如实触发 `TechniqueEvents.PreTechniquePerformEvent` 与 `TechniquePerformEvent`，因此其他扩展也能为你的功法重新定价或将其否决。

若要从你自己的触发器施展它：

```java
boolean performed = CultivationAPI.performTechnique(accessor, ref, playerRef, MyTechniques.FLAME_STEP);
```

它会跑完每一道关卡 —— 系统已启用、该功法已启用、境界解锁、道之相符、灵气消耗、冷却 —— 成功时扣除灵气、盖上冷却戳并运行效果。无论成败玩家都会收到消息，或是效果的成功提示，或是失败的缘由。唯有功法确实施展成功时它才返回 `true`。

#### 注册一件灵气吸收物品

```java
public static void registerQiAbsorptionItemModifier(@Nonnull String itemId, float multiplier)
```

这正是内置聚气符背后的确切机制：当该物品位于打坐玩家当前快捷栏槽位中时，其灵脉吸收会乘以 `multiplier`。为一个已有修正的 id 再次注册会将其**覆写**，因此你也可以借此重调内置的那一项。

```java
CultivationAPI.registerQiAbsorptionItemModifier("MyMod:JadePendant", 1.75F);
```

服主可在[配置](/cultivation/config/)页的 `Qi-Absorption-Item-Modifiers` 键下查看并编辑内置条目；机制本身则记载于[聚灵采气](/cultivation/qi-gathering/)。

#### 哪些不可注册

并非每个扩展点都是一个 Java 注册表。截至 0.4.1，`CultivationAPI` 只为种族、功法与灵气吸收物品暴露了 `register*` 方法。天赋树节点、秘籍与灵兽物种改为在 Cultivation 自己的 JSON 配置中声明 —— 见[配置](/cultivation/config/)页 —— 且无法从代码注册。不过你仍可经由事件触及这三者：节点解锁经由 `CultivationEvents.PreSkillUnlockEvent`，秘籍经由 `ItemEvents.PreManualReadEvent`，灵兽物种则经由每个 `BeastEvents` 事件上的 `species()` getter。

#### 另见

- [事件](/cultivation/api/events/) —— 你所注册的内容会流经的那约 135 个钩子。
- [接口参考](/cultivation/api/reference/) —— 在动手之前读取玩家的状态。
- [种族](/cultivation/races/)、[功法](/cultivation/techniques/)、[聚灵采气](/cultivation/qi-gathering/)、[配置](/cultivation/config/)、[指令](/cultivation/commands/)。
