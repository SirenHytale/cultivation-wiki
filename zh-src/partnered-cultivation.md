---
title: 双修
description: Cultivation 模组的双修：结为道侣的修士同坐共修，灵气更盛，阴阳之衡亦相牵引。
group: 天地人间
han: 侣
---

### 双修

**双修**让两名已**结为道侣**的修士同修共进。与道侣并肩打坐，两人自地脉汲取的灵气都比独修时更多 —— 且随着共坐，双方的阴阳之衡会相互牵引。此功能于 v0.6.0 加入。

**并无开启指令**。在道侣身旁坐下，二人同时打坐，双修自成。

> **需要 Marriage 模组。**未安装 `Siren:Marriage` 时，便无从判定谁是道侣，因此无论配置如何，整套功能都保持关闭。Cultivation 本身没有它也照常运行。

* * *

#### 如何结成

四项条件，缺一不可：

| 条件 | 说明 |
|:---|:---|
| **互为道侣** | 取自 Marriage 模组。不是「二人皆已婚」，而是彼此*互为*道侣。 |
| **二人皆在打坐** | 任一方起身，此次双修即止。 |
| **同一世界** | 身处他界的道侣，不算与你同坐。 |
| **相距在 `Partner-Radius-Blocks` 之内** | 默认 8 格。 |

结成之时，二人皆会得到提示。终止之时，仍在打坐的那一方会被告知 —— 起身的那位自己心里有数。

以 `/cultivation partner` 查看当前状态。它会指明你卡在哪一条，因此双修迟迟不成绝不会是个谜：未结道侣、道侣不在线、身处他界、相距太远，或是功能未启用。

* * *

#### 双修之效

**灵气更盛。**双修期间，二人各自从[灵脉](/cultivation/qi-gathering/)汲取的灵气乘以 `Partner-Qi-Multiplier`，默认为 1.25 倍。

此系数**与其余一切相乘**：地脉自身的品级、天候共鸣、[聚灵阵](/cultivation/formations/)、你的[洞府](/cultivation/dwelling/)，以及一头采集型[灵兽](/cultivation/beasts/)。一对道侣若在自家洞府之内、龙脉之上共坐，这些便层层叠乘 —— 默认系数刻意取得保守，正是为此。

**阴阳更稳。**共坐之时，双方的[阴阳之衡](/cultivation/dao/)各自朝对方偏移。一名已深陷阴极的修士，与偏阳的道侣同坐，便会被拉回中正 —— 也就避开了深偏所招致的[心魔劫](/cultivation/tribulations/)。

若二人之衡已在 `Partner-Convergence-Deadzone-Percent` 之内，则谁也不再偏移，因此稳定下来的一对不会来回震荡。这份牵引也**绝不会拉过头**：它只把差距合拢，然后停住，不会让二人反复互换阴阳。

你自身种族的阴阳偏性依然生效，因此偏阴的种族会抗拒被拉向阳 —— 是收敛得更慢，而非不收敛。

* * *

#### 设置

全部位于 `Society/PartnerConfig.json`。

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| `Partnered-Cultivation-Enabled` | true | 整套功能。没有 Marriage 模组时本就无效。 |
| `Partner-Radius-Blocks` | 8 | 二人须坐得多近。 |
| `Partner-Qi-Multiplier` | 1.25 | 各自的灵气倍率。与其余所有倍率相乘。 |
| `Partner-Unlock-Realm` | `BODY_REFINEMENT` | 双修所需境界。默认等于不设门槛。 |
| `Partner-Convergence-Enabled` | true | 阴阳之衡是否相互牵引。 |
| `Partner-Convergence-Shift-Per-Tick` | 0.2 | 每 tick 牵引的力度。与地脉自身的阴阳偏移同一量级。 |
| `Partner-Convergence-Deadzone-Percent` | 1 | 差距低于此值时双方都不再偏移。 |

默认刻意不设门槛。双修是给同行者的酬报，而非需要挣来的里程碑；设了门槛，反倒只会惩罚那些一同起步的道侣。

其余内容见[宗门社群配置页](/cultivation/config/society/)。
