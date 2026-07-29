---
title: 占位符
description: 修真模组 —— %cultivation_...% 占位符扩展完整清单
group: 天地
han: 符
---

# 占位符

安装 [PlaceholderAPI](/cultivation/compatibility/) 后，修真模组会注册一个 `cultivation` 扩展。凡是经 PlaceholderAPI 处理文本之处 —— 聊天格式、计分板、玩家列表、悬浮字、告示牌 —— 皆可显示修士的境况。

无需任何配置：安装 PlaceholderAPI 本身即是全部设置。游戏中执行 `/papi info cultivation` 可查看实时清单。

{: .note }
> **名称为英文。** 占位符返回纯文本，而 PlaceholderAPI 不携带语言信息，故此处一切名称均为英文。若你想自行本地化，对应的 `_key` 占位符会返回 `server.lang` 键名 —— `%cultivation_realm%` 得到 “Golden Core Formation”，`%cultivation_realm_key%` 则得到可翻译出它的键名。

## 修为

| 占位符 | 示例 |
| --- | --- |
| `%cultivation_realm%` | Golden Core Formation |
| `%cultivation_realm_key%` | 对应的 `server.lang` 键名 |
| `%cultivation_realm_id%` | `GOLDEN_CORE_FORMATION` |
| `%cultivation_realm_index%` | `4`（从 1 起算） |
| `%cultivation_stage%` | Late-Stage |
| `%cultivation_stage_key%` · `%cultivation_stage_id%` | 键名 / `LATE` |
| `%cultivation_rank%` | Golden Core Formation Late-Stage |
| `%cultivation_level%` · `%cultivation_max_level%` | `14` / `27` |
| `%cultivation_is_max_level%` | 是 / 否 |
| `%cultivation_qi%` | `1240` |
| `%cultivation_qi_required%` | `2000`，圆满时为 `-` |
| `%cultivation_qi_percent%` | `62` |
| `%cultivation_qi_bar%` | `\|\|\|\|\|\|......` |
| `%cultivation_ready%` | 是 / 否 |
| `%cultivation_ready_type%` | `breakthrough`、`advancement` 或空 |

多数聊天格式真正想要的是 `%cultivation_rank%`。

## 状态

| 占位符 | 示例 |
| --- | --- |
| `%cultivation_meditating%` | 是 / 否 |
| `%cultivation_ritual%` | `breakthrough`、`advancement`、`none` |
| `%cultivation_ritual_percent%` | `41` |
| `%cultivation_qi_flow%` | 每秒汲取的灵气 |

## 种族、道与天赋树

| 占位符 | 示例 |
| --- | --- |
| `%cultivation_race%` · `_key` · `_id` | Demon |
| `%cultivation_dao%` · `_key` · `_id` | Lightning |
| `%cultivation_has_dao%` | 是 / 否 |
| `%cultivation_yin%` · `%cultivation_yang%` | `62` / `38` |
| `%cultivation_karma%` | 身负的业力 |
| `%cultivation_path%` · `_key` · `_id` | Righteous / Devil / Unaligned |
| `%cultivation_skill_points%` | 未分配的天赋点 |
| `%cultivation_skill_debt%` | 跌境后所欠的点数 |

## 宗门

| 占位符 | 示例 |
| --- | --- |
| `%cultivation_sect%` | 宗门名，无则为空 |
| `%cultivation_in_sect%` | 是 / 否 |
| `%cultivation_sect_rank%` · `_id` | Leader / Elder / Disciple |
| `%cultivation_sect_members%` | 门人数 |
| `%cultivation_sect_motto%` | 宗门训言 |
| `%cultivation_sect_has_hall%` | 是 / 否 |

宗门占位符取自以 UUID 为键的注册表而非玩家实体，故对**离线**玩家同样有效。

## 灵兽、洞府与脚下之地

| 占位符 | 示例 |
| --- | --- |
| `%cultivation_has_beast%` · `%cultivation_beast%` | 是 / species |
| `%cultivation_beast_level%` · `%cultivation_beast_summoned%` | `12` / 是 |
| `%cultivation_has_abode%` · `%cultivation_abode_spring%` | 是 / 已蓄灵气 |
| `%cultivation_vein_qi%` · `%cultivation_vein_max%` | 你所在区块的灵脉 |
| `%cultivation_vein_percent%` | `74` |
| `%cultivation_vein_tier%` | Normal / Rich / Dragon |

`vein_*` 一组**读取而不创建、不写入**任何数据，因此计分板每秒轮询亦无开销，也不会因此在地图上落下数据。

## 排行 —— 无需玩家

| 占位符 | 示例 |
| --- | --- |
| `%cultivation_top_name_1%` | 修为最高者之名 |
| `%cultivation_top_level_1%` · `%cultivation_top_qi_1%` | 其等级 / 已蓄灵气 |
| `%cultivation_top_realm_1%` · `%cultivation_top_stage_1%` | 其境界 |

末尾数字为名次，从 1 起算 —— `%cultivation_top_name_3%` 即第三名。这一组**完全不需要玩家上下文**，故可用于排行告示牌。名次超出已排名修士数量时返回空值而非报错，因此三人服务器上的前十榜会显示为空行。

## 关系型

供比较“说话者”与“观看者”的格式使用：

| 占位符 | 示例 |
| --- | --- |
| `%rel_cultivation_same_sect%` | 是 / 否 |
| `%rel_cultivation_sect_relation%` | `same` / `rival` / `none` |
| `%rel_cultivation_realm_difference%` | 二者相差 `+3` 级 |
| `%rel_cultivation_higher_realm%` | 是 / 否 |
| `%rel_cultivation_dueling%` | 二者此刻是否正在论道 |

## 开发者须知

占位符是在**被查询玩家所在世界的线程上**读取的 —— PlaceholderAPI 自己的文档将此责任交给调用方，需经 `player.getWorld().execute()`。修真模组的扩展从不写入且对每次查询都作了空值防护，故疏忽的调用方至多读到过时数据而不会崩溃，但仍应做对。

在编写依赖占位符的格式前，可先确认扩展已生效：

```java
if (CultivationAPI.isPlaceholderApiRegistered()) { ... }
```
