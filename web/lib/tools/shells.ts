/* Edit this file directly — it is the source. It was originally lifted verbatim
   from the pre-Next site, which no longer exists.

   The two tool pages are form markup whose ids and data-* attributes are a
   contract with planner.js / calculator.js, which query the DOM for them. That
   is why this stayed markup instead of becoming JSX: transcribing ~15 KB of
   inputs would risk a silent typo breaking a binding. It is still
   server-rendered — a build-time constant, not a fetch.

   Change an id or a data-* attribute here and you must change it in the
   matching tool module too.
*/

export const plannerEn = `<div class="page-eyebrow">
      <span>Tools</span><span class="sep">/</span><span>Skill Tree Planner</span>
      <span class="sep">·</span><span class="han-dim">演</span>
    </div>

    <h1>Skill Tree Planner</h1>
    <p class="page-lede">
      All 117 nodes across the nine branches, checked against the points your realm actually
      grants. Click to allocate, click again to refund. Your build lives in the URL — copy it
      from the address bar and anyone who opens it sees exactly what you planned.
    </p>

    <div class="tool-bar">
      <div class="field">
        <label for="p-realm">Realm</label>
        <select id="p-realm">
          <option value="0">Body Refinement</option>
          <option value="1">Qi Condensation</option>
          <option value="2">Foundation Establishment</option>
          <option value="3">Golden Core Formation</option>
          <option value="4">Nascent Soul</option>
          <option value="5">Soul Formation</option>
          <option value="6" selected>Void Refinement</option>
        </select>
      </div>
      <div class="field">
        <label for="p-stage">Stage</label>
        <select id="p-stage">
          <option value="0">Early</option>
          <option value="1">Middle</option>
          <option value="2">Late</option>
          <option value="3" selected>Peak</option>
        </select>
      </div>
      <div class="field">
        <label for="p-ppa">Points / advancement</label>
        <input id="p-ppa" type="number" min="0" max="20" step="1" value="1">
      </div>
      <div class="field">
        <label for="p-ppb">Extra / breakthrough</label>
        <input id="p-ppb" type="number" min="0" max="20" step="1" value="2">
      </div>
      <div class="budget" style="margin-left:auto">
        <span class="spent" id="p-spent">0</span>
        <span class="of">of <strong id="p-cap">39</strong> points</span>
      </div>
    </div>

    <div class="tree-stage"></div>

    <div class="tool-actions">
      <button class="btn" id="p-share">Copy build link</button>
      <button class="btn ghost" id="p-reset">Reset</button>
      <span class="copied" id="p-copied">Link copied</span>
    </div>

    <h2>Build Totals</h2>
    <div class="readout" id="p-totals"></div>

    <h2>Points by Branch</h2>
    <p>A single branch costs <strong>28 points</strong> to complete. The whole tree costs
      <strong>252</strong> — far beyond any budget, which is the point.</p>
    <div id="p-branches"></div>

    <h2>How the Budget Works</h2>
    <p>
      Every rank-up grants <code>Points-Per-Advancement</code>. A rank-up that is also a
      <strong>realm breakthrough</strong> grants <code>Points-Per-Breakthrough</code> on top of it,
      so a breakthrough is worth 3 points at the defaults and an ordinary advancement 1.
    </p>
    <p>
      Climbing from Body Refinement (Early) to Void Refinement (Peak) is 27 rank-ups, six of them
      breakthroughs — <strong>39 points</strong> at default settings. Both numbers are editable
      above, so you can plan against a server that has retuned them.
    </p>

    <div class="note">
      <span class="note-title">Reading the tree</span>
      Tiers 1–4 run straight out along each branch's spoke and cost 1 point each. Tier 5 forks in
      two directions, borrowing a neighbouring branch's stat; tiers 6 and 7 continue each fork at
      larger values. The single tier-8 <strong>Transcendence</strong> capstone sits back on the
      spoke and is the tree's only <strong>dual-prerequisite</strong> node — it needs both
      spoke-adjacent tier-7 nodes before it will open.
    </div>

    <div class="note tip">
      <span class="note-title">Sharing a build</span>
      The URL updates as you click. It encodes your realm, your stage and every allocated node, so
      a link is a complete, reproducible build. Opening a link with impossible allocations (a
      hand-edited URL, say) quietly drops anything whose prerequisites are missing.
    </div>

    <div class="note warn">
      <span class="note-title">Server settings can change this</span>
      Node costs and stat values here are the mod's shipped defaults, read straight from its skill
      tree registry. A server that has retuned <code>SkillTreeConfig</code> — or an add-on that
      replaces progression entirely — will not match. Check <a href="/config-cultivation/">the
      config page</a> for what your server is actually running.
    </div>`;

export const plannerZh = `<div class="page-eyebrow">
      <span>工具</span><span class="sep">/</span><span>天赋加点模拟</span>
      <span class="sep">·</span><span class="han-dim">演</span>
    </div>

    <h1>天赋树加点模拟</h1>
    <p class="page-lede">
      九条分支上的全部 117 个节点，按你的境界实际授予的天赋点核算。点击分配，再点击返还。
      你的配点方案就存在网址里 —— 从地址栏复制走，任何人打开它，看到的都是你所规划的样子。
    </p>

    <div class="tool-bar">
      <div class="field">
        <label for="p-realm">境界</label>
        <select id="p-realm">
          <option value="0">炼体期</option>
          <option value="1">炼气期</option>
          <option value="2">筑基期</option>
          <option value="3">金丹期</option>
          <option value="4">元婴期</option>
          <option value="5">化神期</option>
          <option value="6" selected>炼虚期</option>
        </select>
      </div>
      <div class="field">
        <label for="p-stage">阶段</label>
        <select id="p-stage">
          <option value="0">初期</option>
          <option value="1">中期</option>
          <option value="2">后期</option>
          <option value="3" selected>圆满</option>
        </select>
      </div>
      <div class="field">
        <label for="p-ppa">每次晋阶点数</label>
        <input id="p-ppa" type="number" min="0" max="20" step="1" value="1">
      </div>
      <div class="field">
        <label for="p-ppb">突破额外点数</label>
        <input id="p-ppb" type="number" min="0" max="20" step="1" value="2">
      </div>
      <div class="budget" style="margin-left:auto">
        <span class="spent" id="p-spent">0</span>
        <span class="of">/ <strong id="p-cap">39</strong> 点</span>
      </div>
    </div>

    <div class="tree-stage"></div>

    <div class="tool-actions">
      <button class="btn" id="p-share">复制配点链接</button>
      <button class="btn ghost" id="p-reset">重置</button>
      <span class="copied" id="p-copied">链接已复制</span>
    </div>

    <h2>配点总计</h2>
    <div class="readout" id="p-totals"></div>

    <h2>各分支点数</h2>
    <p>点满单独一条分支需 <strong>28 点</strong>。整棵树需 <strong>252 点</strong> ——
      远超任何预算，而这正是它的用意所在。</p>
    <div id="p-branches"></div>

    <h2>预算是怎么算的</h2>
    <p>
      每一次升级授予 <code>Points-Per-Advancement</code>。同时也是<strong>境界突破</strong>的那次升级，
      还会在其之上再授予 <code>Points-Per-Breakthrough</code>，因此按默认值算，
      一次突破值 3 点，而一次寻常晋阶值 1 点。
    </p>
    <p>
      从炼体期（初期）爬到炼虚期（圆满）共 27 次升级，其中六次是突破 ——
      按默认设置合计 <strong>39 点</strong>。这两个数字都可在上方编辑，
      因此你也能对着一台重调过参的服务器来规划。
    </p>

    <div class="note">
      <span class="note-title">如何看这棵树</span>
      第 1–4 层沿各分支的辐条笔直向外，每个 1 点。第 5 层向两个方向分叉，借取相邻分支的属性；
      第 6、7 层沿各自的分叉继续，数值更大。唯一的第 8 层<strong>超脱</strong>顶点节点退回辐条之上，
      是全树唯一的<strong>双前置</strong>节点 —— 它需要辐条两侧的第 7 层节点都点上，才肯开启。
    </div>

    <div class="note tip">
      <span class="note-title">分享一套配点</span>
      网址会随你的点击更新。它编码了你的境界、阶段与每一个已分配的节点，因此一条链接就是一套
      完整、可复现的配点。若打开的链接含有不可能的分配（比如手工改过的网址），
      任何前置缺失的节点都会被悄悄丢掉。
    </div>

    <div class="note warn">
      <span class="note-title">服务器设置会改变这一切</span>
      此处的节点消耗与属性数值是模组的出厂默认值，直接读自其天赋树注册表。
      重调过 <code>SkillTreeConfig</code> 的服务器 —— 或者一个彻底替换了进阶体系的扩展 ——
      都不会与之相符。你的服务器实际跑的是什么，请查<a href="/zh/config-cultivation/">配置页</a>。
    </div>`;

export const calculatorEn = `<div class="page-eyebrow">
      <span>Tools</span><span class="sep">/</span><span>Qi Calculator</span>
      <span class="sep">·</span><span class="han-dim">算</span>
    </div>

    <h1>Qi &amp; Breakthrough Calculator</h1>
    <p class="page-lede">
      Every rung's Qi cost and how long it actually takes to climb. Defaults are the shipped
      values — change any of them to match your own server and the whole table re-costs itself.
    </p>

    <form id="calc" autocomplete="off">

      <h2>Target</h2>
      <div class="tool-bar">
        <div class="field">
          <label for="target">Realm to reach</label>
          <select id="target" data-k="target">
            <option value="1">Qi Condensation</option>
            <option value="2">Foundation Establishment</option>
            <option value="3">Golden Core Formation</option>
            <option value="4" selected>Nascent Soul</option>
            <option value="5">Soul Formation</option>
            <option value="6">Void Refinement</option>
          </select>
        </div>
        <div class="field">
          <label for="perDay">Hours played / day</label>
          <input id="perDay" data-k="perDay" type="number" min="0.5" max="24" step="0.5" value="3" data-default="3">
        </div>
      </div>

      <div class="readout" id="c-out"></div>

      <h2>The Qi Curve</h2>
      <p>From <code>Config.json</code>. These four values decide the entire cost of the climb.</p>
      <div class="tool-bar">
        <div class="field">
          <label for="base">Base-Qi-Requirement</label>
          <input id="base" data-k="base" type="number" step="1" value="175" data-default="175">
        </div>
        <div class="field">
          <label for="realmMult">Realm-Base-Multiplier</label>
          <input id="realmMult" data-k="realmMult" type="number" step="0.05" value="4.25" data-default="4.25">
        </div>
        <div class="field">
          <label for="subGrowth">Substage-Growth-Rate</label>
          <input id="subGrowth" data-k="subGrowth" type="number" step="0.05" value="1.55" data-default="1.55">
        </div>
        <div class="field">
          <label for="btMult">Realm-Breakthrough-Multiplier</label>
          <input id="btMult" data-k="btMult" type="number" step="0.1" value="5.5" data-default="5.5">
        </div>
        <div class="field">
          <label for="qiCostRed">Qi cost reduction %</label>
          <input id="qiCostRed" data-k="qiCostRed" type="number" min="0" max="40" step="1" value="0" data-default="0">
          <span class="hint">tier-8 nodes, capped at 40</span>
        </div>
      </div>

      <h2>Gathering Rate</h2>
      <p>
        Meditation draws <code>Spirit-Vein-Drain-Per-Second</code> from the vein, scaled by your
        talisman and the weather. Uptime is the honest lever — nobody meditates 100% of the time,
        because veins run dry and you have to move.
      </p>
      <div class="tool-bar">
        <div class="field">
          <label for="drain">Drain / second</label>
          <input id="drain" data-k="drain" type="number" step="0.05" value="2.75" data-default="2.75">
        </div>
        <div class="field">
          <label for="uptime">Meditation uptime %</label>
          <input id="uptime" data-k="uptime" type="number" min="0" max="100" step="5" value="60" data-default="60">
        </div>
        <div class="field">
          <label for="talisman">Talisman multiplier</label>
          <input id="talisman" data-k="talisman" type="number" step="0.05" value="1" data-default="1">
        </div>
        <div class="field">
          <label for="weather">Weather multiplier</label>
          <input id="weather" data-k="weather" type="number" step="0.05" value="1" data-default="1">
          <span class="hint">1.15 ambient, 1.5 matched</span>
        </div>
      </div>

      <h2>Qi Gain Bonuses</h2>
      <p>These scale <strong>everything</strong> you bank, cores included.</p>
      <div class="tool-bar">
        <div class="field">
          <label for="race">Race Qi gain %</label>
          <input id="race" data-k="race" type="number" step="1" value="10" data-default="10">
          <span class="hint">Human +10, Demon −10, Deity +5</span>
        </div>
        <div class="field">
          <label for="skillQi">Skill tree Qi gain %</label>
          <input id="skillQi" data-k="skillQi" type="number" step="1" value="0" data-default="0">
          <span class="hint">Insight branch</span>
        </div>
        <div class="field">
          <label for="sect">Sect hall bonus %</label>
          <input id="sect" data-k="sect" type="number" step="1" value="0" data-default="0">
          <span class="hint">5 rich, 8 dragon</span>
        </div>
        <div class="field">
          <label for="balance">Yin-Yang balance %</label>
          <input id="balance" data-k="balance" type="number" step="1" value="0" data-default="0">
          <span class="hint">up to 10 when centred</span>
        </div>
        <div class="field">
          <label>Combined</label>
          <div style="padding:7px 0"><strong id="c-gainmult">×1</strong></div>
        </div>
      </div>

      <h2>Cultivation Cores</h2>
      <p>
        Cores roll <strong>rarest-first</strong> and at most one drops per kill, so the expected
        value per kill is a chain of conditional rolls rather than a plain sum.
      </p>
      <div class="tool-bar">
        <div class="field">
          <label for="kills">Kills / hour</label>
          <input id="kills" data-k="kills" type="number" min="0" step="5" value="0" data-default="0">
        </div>
        <div class="field">
          <label for="spiritChance">Spirit chance</label>
          <input id="spiritChance" data-k="spiritChance" type="number" step="0.005" value="0.12" data-default="0.12">
        </div>
        <div class="field">
          <label for="spiritQi">Spirit Qi</label>
          <input id="spiritQi" data-k="spiritQi" type="number" step="1" value="30" data-default="30">
        </div>
        <div class="field">
          <label for="profChance">Profound chance</label>
          <input id="profChance" data-k="profChance" type="number" step="0.005" value="0.035" data-default="0.035">
        </div>
        <div class="field">
          <label for="profQi">Profound Qi</label>
          <input id="profQi" data-k="profQi" type="number" step="1" value="80" data-default="80">
        </div>
        <div class="field">
          <label for="divChance">Divine chance</label>
          <input id="divChance" data-k="divChance" type="number" step="0.001" value="0.008" data-default="0.008">
        </div>
        <div class="field">
          <label for="divQi">Divine Qi</label>
          <input id="divQi" data-k="divQi" type="number" step="1" value="220" data-default="220">
        </div>
        <div class="field">
          <label for="coreBonus">Meditation bonus</label>
          <input id="coreBonus" data-k="coreBonus" type="number" step="0.05" value="1.1" data-default="1.1">
        </div>
        <div class="field">
          <label for="coreWhileMeditating">Absorb while meditating</label>
          <input id="coreWhileMeditating" type="checkbox" checked data-default="true" style="width:20px;height:20px;min-width:0">
        </div>
        <div class="field">
          <label>Expected per kill</label>
          <div style="padding:7px 0"><strong id="c-perkill">—</strong></div>
        </div>
      </div>

      <h2>Ritual Time</h2>
      <p>
        Small next to the gathering, but real — and it scales hard with realm. Ritual speed nodes
        multiply the duration by <code>1 − speed%</code>.
      </p>
      <div class="tool-bar">
        <div class="field">
          <label for="advSeconds">Advancement seconds</label>
          <input id="advSeconds" data-k="advSeconds" type="number" step="1" value="8" data-default="8">
        </div>
        <div class="field">
          <label for="advDurMult">Advancement × / realm</label>
          <input id="advDurMult" data-k="advDurMult" type="number" step="0.05" value="1.3" data-default="1.3">
        </div>
        <div class="field">
          <label for="btSeconds">Breakthrough seconds</label>
          <input id="btSeconds" data-k="btSeconds" type="number" step="1" value="24" data-default="24">
        </div>
        <div class="field">
          <label for="btDurMult">Breakthrough × / realm</label>
          <input id="btDurMult" data-k="btDurMult" type="number" step="0.05" value="1.35" data-default="1.35">
        </div>
        <div class="field">
          <label for="ritualSpeed">Ritual speed %</label>
          <input id="ritualSpeed" data-k="ritualSpeed" type="number" min="0" max="90" step="1" value="0" data-default="0">
        </div>
      </div>

      <div class="tool-actions">
        <button class="btn ghost" id="c-reset" type="button">Reset to defaults</button>
      </div>
    </form>

    <h2>Every Rung</h2>
    <table id="c-table"></table>

    <h2>How This Is Calculated</h2>
    <p>The curve is the mod's own formula, not an approximation of it:</p>
    <pre><code>required = Base-Qi-Requirement
         × Realm-Base-Multiplier  ^ realmIndex
         × Substage-Growth-Rate   ^ stageIndex
         × Realm-Breakthrough-Multiplier   (Peak stage only)
         × (1 − Qi cost reduction)</code></pre>
    <p>
      Because the realm multiplier is an exponent, each realm costs several times the last —
      the reason Void Refinement is a server event and not a weekend.
    </p>

    <div class="note warn">
      <span class="note-title">What this cannot know</span>
      <p>Uptime is an estimate, and it is the number that moves the answer most. The model assumes
        you can sustain your chosen uptime indefinitely, but a real vein depletes: meditation
        drains 2.75/second against 1.5/second of regeneration, so a single chunk cannot feed you
        forever no matter how long you sit.</p>
      <p style="margin-bottom:0">Formations, Cave Abodes, Gatherer beasts, Qi Gathering Pills and
        Spirit Springs all add Qi this model does not include. Treat the result as a floor on
        speed, not a promise.</p>
    </div>

    <div class="note tip">
      <span class="note-title">Planning a server's pacing</span>
      Set uptime to what your players realistically do, pick your target realm, and read the
      "days" tile. If it is wildly off from the arc you want, <code>Realm-Base-Multiplier</code> is
      the strongest single lever — see <a href="/presets/">Tuning Presets</a>.
    </div>`;

export const calculatorZh = `<div class="page-eyebrow">
      <span>工具</span><span class="sep">/</span><span>灵气计算器</span>
      <span class="sep">·</span><span class="han-dim">算</span>
    </div>

    <h1>灵气与突破计算器</h1>
    <p class="page-lede">
      每一级的灵气消耗，以及爬上去实际要花多久。默认值即出厂数值 —— 把其中任何一项改成你自己服务器的，
      整张表都会重新计价。
    </p>

    <form id="calc" autocomplete="off">

      <h2>目标</h2>
      <div class="tool-bar">
        <div class="field">
          <label for="target">欲达境界</label>
          <select id="target" data-k="target">
            <option value="1">炼气期</option>
            <option value="2">筑基期</option>
            <option value="3">金丹期</option>
            <option value="4" selected>元婴期</option>
            <option value="5">化神期</option>
            <option value="6">炼虚期</option>
          </select>
        </div>
        <div class="field">
          <label for="perDay">每日游玩小时数</label>
          <input id="perDay" data-k="perDay" type="number" min="0.5" max="24" step="0.5" value="3" data-default="3">
        </div>
      </div>

      <div class="readout" id="c-out"></div>

      <h2>灵气曲线</h2>
      <p>来自 <code>Config.json</code>。这四个数值决定了整条攀爬之路的全部代价。</p>
      <div class="tool-bar">
        <div class="field">
          <label for="base">Base-Qi-Requirement</label>
          <input id="base" data-k="base" type="number" step="1" value="175" data-default="175">
        </div>
        <div class="field">
          <label for="realmMult">Realm-Base-Multiplier</label>
          <input id="realmMult" data-k="realmMult" type="number" step="0.05" value="4.25" data-default="4.25">
        </div>
        <div class="field">
          <label for="subGrowth">Substage-Growth-Rate</label>
          <input id="subGrowth" data-k="subGrowth" type="number" step="0.05" value="1.55" data-default="1.55">
        </div>
        <div class="field">
          <label for="btMult">Realm-Breakthrough-Multiplier</label>
          <input id="btMult" data-k="btMult" type="number" step="0.1" value="5.5" data-default="5.5">
        </div>
        <div class="field">
          <label for="qiCostRed">灵气消耗降低 %</label>
          <input id="qiCostRed" data-k="qiCostRed" type="number" min="0" max="40" step="1" value="0" data-default="0">
          <span class="hint">第 8 层节点，上限 40</span>
        </div>
      </div>

      <h2>采气速率</h2>
      <p>
        打坐按 <code>Spirit-Vein-Drain-Per-Second</code> 从灵脉汲取，并受你的符箓与天候缩放。
        在场率是最诚实的那根杠杆 —— 没有人能百分之百地打坐，因为灵脉会干，而你得挪窝。
      </p>
      <div class="tool-bar">
        <div class="field">
          <label for="drain">每秒汲取</label>
          <input id="drain" data-k="drain" type="number" step="0.05" value="2.75" data-default="2.75">
        </div>
        <div class="field">
          <label for="uptime">打坐在场率 %</label>
          <input id="uptime" data-k="uptime" type="number" min="0" max="100" step="5" value="60" data-default="60">
        </div>
        <div class="field">
          <label for="talisman">符箓倍率</label>
          <input id="talisman" data-k="talisman" type="number" step="0.05" value="1" data-default="1">
        </div>
        <div class="field">
          <label for="weather">天候倍率</label>
          <input id="weather" data-k="weather" type="number" step="0.05" value="1" data-default="1">
          <span class="hint">环境 1.15，相合 1.5</span>
        </div>
      </div>

      <h2>灵气获取加成</h2>
      <p>这些会缩放你所入账的<strong>一切</strong>，修行之核也在内。</p>
      <div class="tool-bar">
        <div class="field">
          <label for="race">种族灵气获取 %</label>
          <input id="race" data-k="race" type="number" step="1" value="10" data-default="10">
          <span class="hint">人族 +10，魔族 −10，神族 +5</span>
        </div>
        <div class="field">
          <label for="skillQi">天赋树灵气获取 %</label>
          <input id="skillQi" data-k="skillQi" type="number" step="1" value="0" data-default="0">
          <span class="hint">悟性分支</span>
        </div>
        <div class="field">
          <label for="sect">宗门大殿加成 %</label>
          <input id="sect" data-k="sect" type="number" step="1" value="0" data-default="0">
          <span class="hint">丰灵脉 5，龙脉 8</span>
        </div>
        <div class="field">
          <label for="balance">阴阳之衡 %</label>
          <input id="balance" data-k="balance" type="number" step="1" value="0" data-default="0">
          <span class="hint">居中时最高 10</span>
        </div>
        <div class="field">
          <label>合计</label>
          <div style="padding:7px 0"><strong id="c-gainmult">×1</strong></div>
        </div>
      </div>

      <h2>修行之核</h2>
      <p>
        修行之核按<strong>最稀有的先判</strong>，且一次击杀至多掉落一枚，
        因此每次击杀的期望值是一串条件判定的连乘，而非简单相加。
      </p>
      <div class="tool-bar">
        <div class="field">
          <label for="kills">每小时击杀数</label>
          <input id="kills" data-k="kills" type="number" min="0" step="5" value="0" data-default="0">
        </div>
        <div class="field">
          <label for="spiritChance">灵核概率</label>
          <input id="spiritChance" data-k="spiritChance" type="number" step="0.005" value="0.12" data-default="0.12">
        </div>
        <div class="field">
          <label for="spiritQi">灵核灵气</label>
          <input id="spiritQi" data-k="spiritQi" type="number" step="1" value="30" data-default="30">
        </div>
        <div class="field">
          <label for="profChance">玄核概率</label>
          <input id="profChance" data-k="profChance" type="number" step="0.005" value="0.035" data-default="0.035">
        </div>
        <div class="field">
          <label for="profQi">玄核灵气</label>
          <input id="profQi" data-k="profQi" type="number" step="1" value="80" data-default="80">
        </div>
        <div class="field">
          <label for="divChance">神核概率</label>
          <input id="divChance" data-k="divChance" type="number" step="0.001" value="0.008" data-default="0.008">
        </div>
        <div class="field">
          <label for="divQi">神核灵气</label>
          <input id="divQi" data-k="divQi" type="number" step="1" value="220" data-default="220">
        </div>
        <div class="field">
          <label for="coreBonus">打坐加成</label>
          <input id="coreBonus" data-k="coreBonus" type="number" step="0.05" value="1.1" data-default="1.1">
        </div>
        <div class="field">
          <label for="coreWhileMeditating">打坐时吸收</label>
          <input id="coreWhileMeditating" type="checkbox" checked data-default="true" style="width:20px;height:20px;min-width:0">
        </div>
        <div class="field">
          <label>每次击杀期望</label>
          <div style="padding:7px 0"><strong id="c-perkill">—</strong></div>
        </div>
      </div>

      <h2>仪式耗时</h2>
      <p>
        与采气相比不值一提，却是实打实的 —— 而且随境界急剧缩放。仪式速度节点会把时长
        乘以 <code>1 − 速度%</code>。
      </p>
      <div class="tool-bar">
        <div class="field">
          <label for="advSeconds">晋阶秒数</label>
          <input id="advSeconds" data-k="advSeconds" type="number" step="1" value="8" data-default="8">
        </div>
        <div class="field">
          <label for="advDurMult">晋阶 × / 境界</label>
          <input id="advDurMult" data-k="advDurMult" type="number" step="0.05" value="1.3" data-default="1.3">
        </div>
        <div class="field">
          <label for="btSeconds">突破秒数</label>
          <input id="btSeconds" data-k="btSeconds" type="number" step="1" value="24" data-default="24">
        </div>
        <div class="field">
          <label for="btDurMult">突破 × / 境界</label>
          <input id="btDurMult" data-k="btDurMult" type="number" step="0.05" value="1.35" data-default="1.35">
        </div>
        <div class="field">
          <label for="ritualSpeed">仪式速度 %</label>
          <input id="ritualSpeed" data-k="ritualSpeed" type="number" min="0" max="90" step="1" value="0" data-default="0">
        </div>
      </div>

      <div class="tool-actions">
        <button class="btn ghost" id="c-reset" type="button">恢复默认值</button>
      </div>
    </form>

    <h2>逐级明细</h2>
    <table id="c-table"></table>

    <h2>这是怎么算出来的</h2>
    <p>此处的曲线是模组自己的公式，而非对它的近似：</p>
    <pre><code>所需 = Base-Qi-Requirement
     × Realm-Base-Multiplier  ^ 境界序号
     × Substage-Growth-Rate   ^ 阶段序号
     × Realm-Breakthrough-Multiplier   （仅圆满阶段）
     × (1 − 灵气消耗降低)</code></pre>
    <p>
      正因为境界倍率是一个指数，每一个境界的代价都数倍于前一个 ——
      这也正是炼虚期是一桩服务器级大事、而非一个周末成果的缘由。
    </p>

    <div class="note warn">
      <span class="note-title">这个模型算不到的东西</span>
      <p>在场率是一个估计值，而它恰是最能左右答案的那个数。模型假定你能无限期维持你所选的在场率，
        但真实的灵脉是会枯竭的：打坐每秒汲取 2.75，而恢复每秒只有 1.5，因此无论你坐多久，
        单独一个区块都喂不饱你。</p>
      <p style="margin-bottom:0">阵法、洞府、聚灵兽、聚气丹与灵泉都会带来这个模型未曾计入的灵气。
        请把结果当作速度的下限，而非一句承诺。</p>
    </div>

    <div class="note tip">
      <span class="note-title">为服务器规划节奏</span>
      把在场率设成你的玩家实际能做到的水平，选定目标境界，然后读那块「天数」的方块。
      若它与你想要的曲线相去甚远，<code>Realm-Base-Multiplier</code> 是单个最有力的杠杆 ——
      见<a href="/zh/presets/">调参预设</a>。
    </div>`;
