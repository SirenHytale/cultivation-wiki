---
title: 典籍
description: Cultivation 模组的游戏内典籍：二十四篇记载，读的是你这台服务器的真实数值。
group: 入门指引
han: 典
---

### 典籍

**典籍（修真宝典）**是 Cultivation 的随身参考书，它不在这个百科里，而在游戏之中。二十四篇记载涵盖模组的每一套体系，且每一篇都是**针对你这台服务器**所写 —— 它列出的是*本服*当前真正在跑的数值，以及*你本人*实际修到的境界。此功能于 v0.6.0 加入。

这正是百科做不到的事。本站记载的是默认值；典籍记载的是你的世界。

* * *

#### 如何打开

| 方式 | 说明 |
|:---|:---|
| **典籍**物品 | 右键使用。可以合成，配方就写在典籍自己里面。 |
| **导航栏** | 任意修真菜单上的「典籍」按钮。 |
| `/cultivation codex` | 直接打开总目。 |
| **ALT+4** | 默认即绑定至典籍 —— 见[快捷键](/cultivation/keybinds/)。 |

#### 四大部类

| 部类 | 涵盖 |
|:---|:---|
| **修行之路** | [境界](/cultivation/realms/)、[灵气](/cultivation/qi-gathering/)、突破、[天劫](/cultivation/tribulations/) |
| **己身** | [种族](/cultivation/races/)、[大道](/cultivation/dao/)、[功法](/cultivation/techniques/)、[灵兽](/cultivation/beasts/) |
| **天地** | [灵脉](/cultivation/qi-gathering/)、[宗门](/cultivation/sects/)、[洞府](/cultivation/dwelling/)、[阵法](/cultivation/formations/) |
| **炼制** | [炼丹](/cultivation/alchemy/)、[炼器](/cultivation/refinement/)、[秘籍](/cultivation/manuals/) |

* * *

#### 为何它读的是你的服务器

百科页面能写的，永远只是默认值。若服主把 `Qi-Required-Base` 减半，或调动了 `Spirit-Sense-Min-Realm`，此处写下的每一个数字对那台服务器而言都是错的 —— 而玩家无从得知。

典籍的每一篇，都在有人翻开的那一刻从头重写，并且随身带着读者本人。因此它能说出：

*   **本服当前配置的数值**，从配置文件中实时读取；
*   **读者自己**修到了何处 —— 一篇记载可以直接告诉你，你离它所述之境还差两个境界；
*   一份**合成配方**，实时取自该物品自身的资产文件 —— 服主改了配方，典籍随之更新，别处一字不必动。

各篇记载刻意**不隐藏**你尚未解锁的内容。一部把你还做不到的事藏起来的典籍，便无法告诉你如何做到；它只会在原处注明，此节尚在你当前境界之上。

* * *

#### 予扩展作者

典籍是一张**开放注册表**。你自己的模组可以把一篇记载列在 Cultivation 自带的诸篇之侧，外观与行为完全一致：

```java
CultivationAPI.registerCodexEntry(
        CodexEntry.builder("myMod:alchemy")
                .title("server.myMod.codex.alchemy.title")
                .summary("server.myMod.codex.alchemy.summary")
                .category(CodexCategory.CRAFT)
                .body(page -> page
                        .heading("server.myMod.codex.alchemy.costs")
                        .paragraph("server.myMod.codex.alchemy.intro")
                        .stat("server.myMod.codex.alchemy.brewTime", config.getBrewSeconds())
                        .recipe("MyMod_ElixirOfNight")))
```

一篇记载是以区块来自述的 —— `heading`、`paragraph`、`stat`、`note`、`recipe`、`divider` —— 至于每个区块长什么样，由典籍自己决定。正因如此，各篇记载完全不必懂界面，而典籍本身的样式也可以改动，无须惊动任何一篇。

注册一个已存在的 id 会**取而代之**，模组便是以此改写内置记载，而非另立一篇。详见[注册表](/cultivation/api/registries/)。
