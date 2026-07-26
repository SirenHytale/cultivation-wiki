---
title: 编写扩展
description: Cultivation 0.5.0 的三个接管型钩子：ProgressionProvider 替换进阶阶梯、CultivationTheme 替换全部用词、AdminConfigSection 添加你自己的管理设置。
group: 开发者
han: 匠
---

### 编写扩展

Cultivation **0.5.0** 新增。

[事件](/cultivation/api/events/)让你重塑 Cultivation 的所作所为。[注册表](/cultivation/api/registries/)让你添加它视如己出的内容。而本页的三个钩子走得更远：它们让另一个模组**接管** Cultivation 的一整个层次，同时让其余一切照常在其之上运行。

| 钩子 | 所替换的 |
|:---|:---|
| `ProgressionProvider` | 整条境界／阶段／灵气的阶梯。 |
| `CultivationTheme` | 模组展示给玩家的每一个字。 |
| `AdminConfigSection` | 什么也不替换 —— 它是把你自己的设置**添加**进 Cultivation 的管理菜单。 |

三者皆从你插件的 `setup()` 中安装，相对于 Cultivation 自身的加载顺序不限。在玩家打坐、打开菜单或触及某道境界门槛之前，无人读取它们，而那已远在每个插件加载完毕之后。

#### ProgressionProvider

```java
CultivationAPI.setProgressionProvider(@Nullable ProgressionProvider provider)
CultivationAPI.getProgressionProvider()
```

把境界／阶段／灵气的阶梯交到你的模组手里。自安装的那一刻起，Cultivation 中每一条指令、每一个界面页、每一行状态栏与每一道玩法门槛，都改从你这里读取数字，而不再读玩家的 `CultivationComponent`：`/cultivation` 显示你的等级名，状态栏显示你的经验条，打坐仪式跑的是你的升级。

**模组中其余一切照常运作。** [宗门](/cultivation/sects/)、[大道](/cultivation/dao/)、[功法](/cultivation/techniques/)、[灵兽](/cultivation/beasts/)、[阵法](/cultivation/formations/)、[洞府](/cultivation/dwelling/)、[斗法](/cultivation/duels/)、[炼丹](/cultivation/alchemy/)、[炼器](/cultivation/refinement/)与[天赋树](/cultivation/skilltree/)，一律架在当前所安装的那条阶梯之上。

##### 境界门槛

模组中数十道门槛是针对 `CultivationRealm` 写的 —— 一门功法的解锁境界、一个种族的解锁境界、一种灵兽的最低境界、炼器阶数、洞府品质、大道解锁。Cultivation 不去重写它们，而是询问你的 provider：这名玩家**算作**哪个境界：

```java
@Nonnull CultivationRealm getEquivalentRealm(ComponentAccessor<EntityStore> accessor, Ref<EntityStore> ref);
```

随你把自己的等级映射到那七个境界上，此后每一道既有门槛都会白白地读懂你的进阶体系。

##### 两种升级

Cultivation 通过其计时打坐仪式驱动升级，并提供两种风味。随你把自己的进阶体系映射上去：

| 风味 | 仪式 |
|:---|:---|
| **晋阶** | 寻常的一步。更短、灵脉要求更低，默认不带[天劫](/cultivation/tribulations/)雷霆。 |
| **突破** | 里程碑式的一步。更长、灵脉要求更高、伴有天劫雷霆 —— 对偏倚极深的修士则是心魔劫。 |

同一时刻只能有一种就绪；`isReadyForBreakthrough` 会被先行检验。两者都返回 false，不过意味着打坐在这一 tick 做它寻常该做的事。仪式时长也由你自己经由 `getBreakthroughDurationSeconds` 与 `getAdvancementDurationSeconds` 供给，因此[内置的那套时长](/cultivation/realms/)对你的阶梯并不适用。

##### 你所存储的东西

这个接口刻意是**无状态**的 —— 每个方法都会拿到被询问玩家的 accessor 与 ref，因此你自己持久化的组件始终是唯一的事实来源。玩家的 `CultivationComponent` 依然存在且被完全放置不动，正是这一点让服务器得以卸载你的扩展，并原封不动地取回它原本的境界。

**线程。** 每个方法都在该玩家的世界线程上被调用，而那个 accessor 可能是一个 `CommandBuffer` 而非 `Store`。组件的**创建**必须走 accessor，而不是 `ref.getStore().putComponent` —— 后者会抛出 *"Store is currently processing!"* 并把世界线程带崩。读取则两种方式都无妨。

同一时刻只能安装一个 provider。最后注册者胜出，并会记录一条同时点名双方的警告 —— 因为两个模组各自都认为自己拥有进阶体系，这是一种配置错误，而不是该悄悄挑一个赢家的事。传入 `null` 即可把进阶体系交还给内置系统。

#### CultivationTheme

```java
CultivationAPI.setTheme(@Nullable CultivationTheme theme)
CultivationAPI.getTheme()
```

在丝毫不触碰行为的前提下，重写模组面向玩家的全套用词，如此一来，一个讲魂师与学院而非修士与宗门的设定，读起来便是它自己的一款游戏，而不是一层换皮。Cultivation 展示给玩家的每一个字符串 —— 聊天、指令、状态栏、菜单、物品名、提示框 —— 都会先经由你的 `translate` 路由，而你返回什么就原样采用什么。

```java
@Nullable Message translate(@Nonnull String key);
```

对任何你不打算改写的键返回 `null`，即采用 Cultivation 自己的用词，因此一套主题想覆盖多少便覆盖多少。

##### 为何是钩子而非语言文件

因为引擎不允许你那样做。所有资源包的语言文件会被合并进单一目录，而这次合并是**先写者胜** —— 来自较晚资源包的重复键会被丢弃，并记录为 `'x' has multiple definitions`。Cultivation 自己的资源包先于任何依赖它的扩展加载，因此扩展若在自己的 `server.lang` 中提供 `server.cultivation.playerMsg.breakthrough`，会被悄然忽略；而即便侥幸赢下这场竞争，也不过是赢在那一次启动而已。

所以主题把自己的字符串放在**它自己的键**之下 —— 那与任何东西都不冲突 —— 再把 Cultivation 的键映射过去。

只要可能，就返回你自己键的 `Message.translation(...)`，而非 `Message.raw(...)`。原始文本在每种语言下都长得一模一样，而 Cultivation 是有翻译的。

`translate` 是在正构建该消息的那个线程上调用的，且每渲染一行往往要调用数次，因此它必须快速、线程安全且无副作用 —— 在一个不可变 map 中查表，正是它本该有的形状。Cultivation 所填入的任何 `.param(...)` 占位符，都会施加到你所返回的内容上，因此替换文本必须保留同样的占位符名；漏掉一个，那一处便会渲染为空。

#### AdminConfigSection

```java
CultivationAPI.registerAdminConfigSection(@Nonnull AdminConfigSection section)
CultivationAPI.unregisterAdminConfigSection(@Nonnull String sectionKey)
CultivationAPI.getAdminConfigSections()
CultivationAPI.newAdminConfigField(String key, Message label, ...)
```

向 Cultivation 的管理菜单添加一组可调数值，它会作为一个独立的分节按钮，与 Cultivation 自己的九个并列出现在 `/cultivation admin` 的配置页上 —— 同样的行、同样的编辑方式、同样的一次保存。这些设置同时也出现在寻常 Cultivation 设置菜单底部的一块**模组设置**区域中，仅管理员可见。

一份配置文件对应一个分节，这是 Cultivation 自己所采用、也是读起来最顺的形状。

| 成员 | 用途 |
|:---|:---|
| `getKey()` | 一个稳定的 id，在所有已注册分节中唯一。请加命名空间（`"SoulRings:spiritPower"`）。点击按钮时回传的正是它，故而刻意与列表顺序无关。 |
| `getLabel()` | 分节按钮与标题。请使用 `Message.translation(...)` 以便本地化。 |
| `getHint()` | 一行说明此分节调整的是什么 —— 即按钮提示框与标题下方的文字。 |
| `getFields()` | 各行，按显示顺序排列。请用 `newAdminConfigField` 构建，而非自行实现 `AdminConfigField`。 |
| `save()` | 管理员按下保存后持久化此分节。 |

只支持**数字**，因为其背后的行控件是一个数字输入框。布尔值请表达为一个 0／1 字段并在标签中注明，任何列表形状的东西请留在配置文件里 —— Cultivation 对自己的布尔值与灵气吸收物品表也是这么做的。

两个宿主页面都以 `cultivation.admin` 为门槛，且该门槛在保存时是在服务端重新核验的，而非信任菜单的说法，因此一个分节尽可安全地暴露真正的平衡数值。

返回一份**稳定**的字段列表。页面是按键把管理员正在编辑的内容与字段对应起来的，因此一份在渲染与保存之间改变形状的列表，会悄悄丢掉那些编辑。请在字段的 `set` 中夹紧越界值 —— 页面此后会重新显示 `get` 所返回的内容，因此被强制修正的值会回显给管理员，而不是与他所输入的悄然不符。

以同一分节键重复注册会替换先前那一个，因此在你的插件重载时这是安全的。

#### 在任何阶梯下读取玩家

三个门面方法会在当前生效的任一体系下报告修士的境况，因此你的代码无需知道是否安装了 provider：

| 方法 | 返回 |
|:---|:---|
| `CultivationAPI.getGlobalLevel(accessor, ref)` | 已安装 provider 的等级，或内置境界／阶段压平成的一个只增不减的数。 |
| `CultivationAPI.getQi(accessor, ref)` | 通往下一次升级的已存进度 —— 若安装了 provider 则为其进度，否则为存蓄灵气。 |
| `CultivationAPI.refreshProgression(accessor, ref)` | 在你自己的模组于升级之外改动了玩家等级之后，重新读取 provider 对该玩家的视图。 |

`CultivationAPI.getRealm(accessor, ref)` 返回的是**有效**境界，即在安装了 provider 时其所给出的等价境界 —— 模组中每一道门槛检验的正是它。在 provider 之下，`CultivationAPI.getStage(accessor, ref)` 始终为 `null`，因为替换阶梯并没有子阶段 —— 它只有自己的 `getSubRankLabel`。凡涉及数值，请优先使用 `getGlobalLevel`。

[排行](/cultivation/realms/)与 `/cultivation top` 按那个压平后的等级排序，因此一套替换进阶体系能正确地与自身相互排名。对内置阶梯而言，其顺序恰是「先境界后阶段」一贯产出的结果。
