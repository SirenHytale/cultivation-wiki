---
title: 模组兼容
description: 修真模组 —— 与 Endless Leveling、PlaceholderAPI 及 Marriage 共存时的行为
group: 天地
han: 和
---

# 模组兼容

修真模组的设计是与其他模组**并肩而立**，而非叠加其上。以下三个模组会在服务器启动时自动检测，各自改变修真模组的行为，无需任何配置。

三者皆非必需。未安装时，相应功能只是不存在：不会报错，不会警告，也无需手动关闭任何设置。

| 模组 | 启用的功能 | 是否必需 |
| --- | --- | --- |
| **Endless Leveling** | 修真将属性加成交由其统一结算，使两套成长体系相加而非相乘 | 否 |
| **PlaceholderAPI** | 约 60 个 `%cultivation_...%` 占位符，可用于聊天、计分板、玩家列表与告示牌 | 否 |
| **Marriage** | [双修](/cultivation/partnered-cultivation/) —— 道侣同修 | 否 |

三者均在启动时检测一次并记入服务器日志，因此你随时可以确认修真模组认为装了什么：

```
[Cultivation] Endless Leveling found - handing over max health and outgoing damage so the two do not stack.
[Cultivation] PlaceholderAPI found - %cultivation_...% placeholders are available.
[Cultivation] Marriage 2.0.0 found - Partnered Cultivation is available.
```

## Endless Leveling

两个模组都会提升同样的两项数值：**生命上限**与**输出伤害**。若各行其是，二者便**相乘** —— 修真的境界加成叠在 Endless Leveling 的等级加成之上，兼修二者的玩家便携带着两套完整成长曲线的乘积。这不是任何一方的平衡所预期的。

安装 Endless Leveling 后，修真模组**不再自行施加这两项**，转而将其发布到 Endless Leveling 自己的加成通道中。由 Endless Leveling 作一次已经包含修真那一份的统一结算。

要点在于：**你的修真数值本身毫无变化。** 生命仍来自境界，伤害仍随等级增长，种族、天赋树与功法的倍率照旧作用其上。改变的只是**叠加方式** —— 两套成长体系现在相加，而非相乘。

修真模组的其余一切均不受影响。灵气、境界、仪式、宗门、道、功法、灵兽、洞府与阵法，仍完全归修真模组所有。

### 调整交接

设置位于 `Compatibility/EndlessLevelingConfig.json`，并在[管理菜单](/cultivation/commands/)中自成一节 —— 未安装 Endless Leveling 时该节完全隐藏。

| 设置 | 默认值 | 作用 |
| --- | --- | --- |
| `Handoff-Health` | `true` | 将生命上限交予 Endless Leveling |
| `Handoff-Damage` | `true` | 将输出伤害交予 Endless Leveling |
| `Handoff-Health-Scale` | `1.0` | 交出修真生命加成的比例 |
| `Handoff-Damage-Scale` | `1.0` | 交出修真伤害加成的比例 |

两个比例值的存在，是为了让同时运行两个模组的服务器可以重新平衡，而不必改动仅装修真模组的服务器同样读取的配置。将 `Handoff-Health-Scale` 设为 `0.5`，即交出修真本应施加的一半。

将某项交接**关闭**，该属性便交还修真模组自行施加 —— 单独运行时正确，两个模组同装时则会叠加在 Endless Leveling 之上。开关在该修士下一次境界变动时生效，已发布的加成也在同一刻撤回，因此二者绝无同时生效之虞。

## PlaceholderAPI

修真模组会注册一个 `cultivation` 扩展，因此凡是经 PlaceholderAPI 处理文本之处 —— 聊天格式、计分板、玩家列表、悬浮字、告示牌 —— 皆可显示修士的境况。

无需任何配置：安装 PlaceholderAPI 本身即是全部设置。完整清单见[占位符](/cultivation/placeholders/)页，或在游戏中执行 `/papi info cultivation`。

## Marriage

Marriage 模组定义了谁与谁结为道侣，[双修](/cultivation/partnered-cultivation/)完全以此为前提。没有 Marriage，便无从定义道侣，故无论 `Society/PartnerConfig.json` 如何设置，该功能始终关闭。

## 编写你自己的兼容

修真模组的接口正是为此而设。扩展可以读取每一个配置文件、驱动修为进程、将自己的设置注册进管理菜单，并监听十大子系统中约 135 个可取消事件。

若你的模组也施加属性，以下两个调用值得一记：

```java
// 在运行 Endless Leveling 的服务器上，属性加成理应归它结算 ——
// 修真模组已然让路，若扩展再叠加其上，便前功尽弃。
if (CultivationAPI.isEndlessLevelingInstalled()) { ... }

// 仅当 PlaceholderAPI 存在且接受了我们的扩展时为真。
if (CultivationAPI.isPlaceholderApiRegistered()) { ... }
```

其余细节见[编写扩展](/cultivation/api/addons/)与[接口参考](/cultivation/api/reference/)。
