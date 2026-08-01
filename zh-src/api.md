---
title: 接口总览
description: Cultivation 模组的公开集成接口：如何引入依赖、静态入口、第一个监听器，以及各接口页导览。
group: 开发者
han: 匠
---

### Cultivation 接口

Cultivation 为其他 Hytale 模组提供了一套公开的集成面：`plugin.siren.API.CultivationAPI`，外加同一包下的十二个 `*Events` 类。它是本模组有意保持稳定的形态 —— 请优先使用它，而非直接伸手去碰 `CultivationManager`、`Cultivation` 或那些 ECS 组件，因为后者随时可能在版本之间变动。

你可以用它做四件事：

- **读取**玩家的修炼状态 —— 境界、阶段、全局等级、存蓄灵气、种族、打坐状态、天赋点、已解锁节点。见[接口参考](/cultivation/api/reference/)。
- **注册**与内置内容行为完全一致的新内容 —— 一个种族、一门功法、一项灵气吸收物品修正。见[注册表](/cultivation/api/registries/)。
- **监听**（并重新调参，或否决）遍及模组各子系统的156 个事件。见[事件](/cultivation/api/events/)。
- **替换**模组的一整个层次 —— 进阶阶梯本身、它的全套用词，或两者兼有 —— 而其余每个子系统仍照常在其之上运行。此为 0.5.0 新增；见[编写扩展](/cultivation/api/addons/)。

本页所记载的是 Cultivation **0.7.0** 时的接口。

> **源码已公开。**每一个公开接口类连同其 javadoc，都在 [github.com/SirenHytale/Cultivation-API](https://github.com/SirenHytale/Cultivation-API) —— 同处还有一份自动生成的全部 156 个事件的参考、一个完整的示例扩展，以及一份写给 AI 编程助手的说明。那些源码中的 javadoc 才是权威的约定；本站是带你走一遍的向导。

#### 将 Cultivation 引入你的项目

Maven `pom.xml`：

```xml
<dependencies>
    <dependency>
        <groupId>plugin.siren</groupId>
        <artifactId>Cultivation</artifactId>
        <version>0.7.0</version>
        <scope>provided</scope>
        <optional>true</optional>
    </dependency>
</dependencies>
```

然后在你的 Hytale `manifest.json` 中声明它。Cultivation 自己的清单将自身发布为 group `Siren`、name `Cultivation`，因此依赖 id 是 `Siren:Cultivation`：

```json5
"OptionalDependencies": {
  "Siren:Cultivation": ">=0.5.0"
}
```

若你的模组离了 Cultivation 便无法运作，请改用 `"Dependencies"`。

#### 入口点

一切都是静态的。`CultivationAPI` 有一个私有构造函数，永不被实例化 —— 你直接在类上调用它：

```java
import plugin.siren.API.CultivationAPI;
import plugin.siren.ECS.Realms.CultivationRealm;

CultivationRealm realm = CultivationAPI.getRealm(accessor, ref);
float qi = CultivationAPI.getQi(accessor, ref);
```

这些读取方法一律接受一个 `ComponentAccessor<EntityStore>` 与一个 `Ref<EntityStore>` —— 正是每个 Hytale ECS 系统手头已有的那一对。凡是读取组件的方法，在玩家尚未拥有该组件时都返回 `null`（或 0，或 Human），因此一个刚进服的新玩家绝不会引发异常。

监听器与注册表的调用，在你自己插件的 `setup()` 中，相对于 Cultivation 自身的 `setup()` 无论**何种**加载顺序都是安全的。注册表是普通的静态 map，监听器列表则是 `CopyOnWriteArrayList`；在玩家真正与模组交互之前，二者都不会被读取，而那已远在每个插件加载完毕之后。

#### 你的第一个监听器

其模式是：以 `CultivationEvents.onPreX(...)` 在事情发生**之前**更改或否决它，以 `CultivationEvents.onX(...)` 在其落定之后收到告知。二者都接受一个该事件类型的 `java.util.function.Consumer`，因此一个 lambda 就够了：

```java
import com.hypixel.hytale.server.core.universe.PlayerRef;
import plugin.siren.API.CultivationEvents;
import plugin.siren.ECS.Realms.CultivationRealm;

public final class MyCultivationHooks {

    public static void register(){
        // 让踏入金丹期的那一跃，所耗存蓄灵气翻倍。
        CultivationEvents.onPreBreakthrough(event -> {
            if(event.toRealm() == CultivationRealm.GOLDEN_CORE_FORMATION){
                event.setQiCost(event.qiCost() * 2.0F);
            }
        });

        // 直接回绝最后一个境界。
        CultivationEvents.onPreBreakthrough(event -> {
            if(event.toRealm() == CultivationRealm.VOID_REFINEMENT){
                event.setCancelled(true);
            }
        });

        // 事情真正发生之后再作反应 —— 此时组件已显示新的境界。
        CultivationEvents.onBreakthrough(event -> {
            if(event.player() != null){
                recordAscension(event.player(), event.newRealm());
            }
        });
    }

    private static void recordAscension(PlayerRef player, CultivationRealm realm){
        // 你自己的记账逻辑
    }
}
```

在你插件的 `setup()` 中调用 `MyCultivationHooks.register()`。这里刻意没有反注册 —— 监听器的生命周期就是服务器的生命周期，正合插件「加载一次、常驻不去」的方式。

#### 各页导览

| 页面 | 涵盖 |
|:---|:---|
| [事件](/cultivation/api/events/) | 十二个 `*Events` 类中的每一个事件、它暴露什么，以及取消它意味着什么。 |
| [注册表](/cultivation/api/registries/) | `registerRace`、`registerTechnique`、`registerQiAbsorptionItemModifier`、`registerTitle`、`registerSectBanner`、`registerPalette` 以及可由扩展提升的上限。 |
| [接口参考](/cultivation/api/reference/) | 组件类型的 getter，以及 `CultivationAPI` 门面上的各项状态读取。 |
| [编写扩展](/cultivation/api/addons/) | `ProgressionProvider`（包括 `supportsProfiles`）、`CultivationTheme` 与 `AdminConfigSection` —— 替换阶梯、替换用词，以及添加你自己的管理设置。 |

这些钩子所依托的各系统，其面向玩家的文档位于本站主体：[境界与阶段](/cultivation/realms/)、[聚灵采气](/cultivation/qi-gathering/)、[大道](/cultivation/dao/)、[功法](/cultivation/techniques/)、[宗门](/cultivation/sects/)、[宗门攻伐](/cultivation/wars/)、[阵法](/cultivation/formations/)、[洞府](/cultivation/dwelling/)、[斗法](/cultivation/duels/)与[灵兽](/cultivation/beasts/)。事件允许你重新调整的每一个数值，在[配置](/cultivation/config/)页都有一份面向服主的对应项，其中大多数也在[指令](/cultivation/commands/)页有所映照。
