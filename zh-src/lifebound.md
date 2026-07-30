---
title: 本命法宝
description: Cultivation 模组的本命法宝：绑定、升级曲线、战斗加成、觉醒，以及易主后的处置。
group: 功法与法宝
han: 術
---

### 本命法宝

**本命法宝**是一件与某位玩家本人（而非其物品类型）相系的兵器或护甲 —— 它会在战斗中升级，其加成也随之增长。

#### 绑定一件器物

手持该物品执行 `/cultivation bind` 即可与之相系。对**你自己已绑定**的物品再次执行该指令，会将其重置回 1 级 —— 因此若该物已升过 1 级，单敲此令只会示警，并点明你即将失去的等级。唯有 `/cultivation bind confirm` 才真正落刀。仍停在 1 级的法宝本无可失，重炼时便不再多问。

- **兵器**在每一次命中时获取经验（击中任何生物即可，不必击杀），升级后造成更高伤害。
- **护甲**在挺过攻击时获取经验，升级后减免更多受到的伤害。
- 物品的等级直接显示在其名称中，工具提示会写明它当前究竟提供了多少加成 —— 没有任何隐藏数值。

#### 升级曲线

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| `LifeBound-Base-Xp-Requirement` | 75 | 由 1 级升至 2 级所需的经验。 |
| `LifeBound-Xp-Growth-Rate` | 1.07 | 每提升一级，经验需求的累乘倍率。 |
| `LifeBound-Max-Level` | 100 | 达到后停止获取经验 —— 并就此觉醒。 |

两项经验倍率都以一次攻击**最终**造成或承受的伤害为基数，且在兵器加成与护甲减免结算之后计算：

- `LifeBound-Weapon-Xp-Per-Damage-Dealt`：0.15 —— 造成 20 点伤害即得 3 点经验。
- `LifeBound-Armor-Xp-Per-Damage-Taken`：0.1 —— **仅当穿戴者挺过这次攻击时**才会触发。

天赋树第八层的「本命法宝经验」超脱节点会同时倍增这两项速率。

#### 战斗加成

| 配置项 | 默认值 | 说明 |
|:---|:---|:---|
| `LifeBound-Weapon-Damage-Percent-Per-Level` | 1.0 | 每级所增加的伤害百分比。 |
| `LifeBound-Weapon-Max-Damage-Percent` | 100 | 单件兵器伤害加成的硬上限。 |
| `LifeBound-Armor-Reduction-Percent-At-Max-Level` | 55 | 单件护甲在满级时的减免，自 1 级的 0% 线性增长 —— 50 级的护甲提供其中一半。 |
| `LifeBound-Armor-Max-Damage-Reduction-Percent` | 60 | 全身所有本命护甲**合计**减免的硬上限。 |

那道 60% 的合计上限之所以存在，是为了让一整套满级本命护甲无论穿戴多少件，都无法逼近伤害免疫。

#### 觉醒

一件本命法宝达到 `LifeBound-Max-Level` 后便会**觉醒**，并在通常的上限之上再获一项最终增益：

- `Awakened-Bonus-Percent`（10）：兵器为额外伤害百分比，护甲为额外减伤百分比。
- `Awakened-Proc-Chance`（0.25）：每次兵器命中有 25% 概率迸发一阵灵气粒子。

由于觉醒加成是在**上限之后**施加的，一件觉醒兵器可以超过 `LifeBound-Weapon-Max-Damage-Percent`，一套觉醒护甲也可以越过 60% 的合计上限 —— 这正是将一件器物一路带到 100 级的回报。

#### 易主之后

若一件本命法宝落到了别的玩家手中 —— 交易、掉落后被拾取 —— 其处置由 `LifeBound-Reset-On-Transfer`（默认 true）决定：

- **true**：新持有者下一次用它命中时，物品会静默地重新绑定至其人，等级与经验归零。
- **false**：物品永久绑定于原主，对任何其他人分文不予。

| 指令 | 说明 | 权限 |
|:---|:---|:---|
| `/cultivation bind [confirm]` | 绑定手持物品。对自己 1 级以上的法宝只会示警；加 `confirm` 才将其重置为 1 级。 | `cultivation` |
| `/cultivation admin setlifebound {player} {level} [xp]` | 强制设定手持本命法宝的等级（可选经验）。 | `cultivation` |

本页所有数值均位于 `Arts/LifeBoundConfig.json` —— 详见[功法配置](/cultivation/config/arts/)。
