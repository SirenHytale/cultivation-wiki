/* Edit this file directly — it is the source. It was originally ported from the
   pre-Next site, which no longer exists.

   The logic matches the mod's own Java and should be changed only when the mod
   changes. It is an ES module exporting init(lang); React calls init() from an
   effect once the markup it binds to (lib/tools/shells.ts) is mounted, which is
   why it queries the DOM rather than rendering anything itself.
*/
import DATA from "../data/skilltree.json";

export function init(LANG) {
  /* ---------- language --------------------------------------------------
       Branch and stat names are NOT translated in lib/data/skilltree.json: that
       file is generated straight from the mod's English registry by
       `npm run skilltree`, so a re-run would wipe anything added there. The
       Chinese names live here instead, keyed by the registry's own keys, and
       fall back to the English label when a key is missing. */
  
    var ZH_BRANCH = {
      VITALITY: "体魄", RESILIENCE: "韧性", MIGHT: "力道", WARDING: "护体",
      INSIGHT: "悟性", HARMONY: "和合", SWIFTNESS: "疾行", ENDURANCE: "耐力",
      SPIRIT: "灵识"
    };
    var ZH_STAT = {
      HEALTH: "生命上限", MANA: "法力", STAMINA: "体力", BREATH: "屏息",
      MOVE_SPEED_PERCENT: "移动速度", DAMAGE_PERCENT: "伤害",
      QI_GAIN_PERCENT: "灵气获取", RITUAL_SPEED_PERCENT: "仪式速度",
      DAMAGE_REDUCTION_PERCENT: "减伤", QI_COST_REDUCTION_PERCENT: "灵气消耗降低",
      LIFEBOUND_XP_GAIN_PERCENT: "本命法宝经验", VEIN_DRAIN_RADIUS: "灵脉汲取半径"
    };
    var STR = {
      en: {
        planner: "Skill tree build planner", points: "POINTS",
        noPrereq: "prerequisite not taken", noPoints: "not enough points",
        removeFirst: "remove later nodes first",
        tier: "Tier", point: " point", pointsSuffix: " points",
        dual: " &middot; dual prerequisite",
        empty: "No nodes allocated yet — click a tier-1 node on any branch to begin."
      },
      zh: {
        planner: "天赋树加点模拟", points: "点数",
        noPrereq: "前置节点未点", noPoints: "天赋点不足",
        removeFirst: "请先移除其后的节点",
        tier: "第", point: " 点", pointsSuffix: " 点",
        dual: " &middot; 双前置",
        empty: "尚未分配任何节点 —— 点击任一分支的第 1 层节点即可开始。"
      }
    }[LANG];

    function branchLabel(b) { return (LANG === "zh" && ZH_BRANCH[b.key]) || b.label; }
    function statLabel(k) {
      return (LANG === "zh" && ZH_STAT[k]) || DATA.statLabels[k] || k;
    }
    /* "Tier 5" in English, "第 5 层" in Chinese — the ordinal sits differently. */
    function tierLabel(t) { return LANG === "zh" ? STR.tier + " " + t + " 层" : STR.tier + " " + t; }

    var NODES = DATA.nodes;
    var BY_ID = {};
    NODES.forEach(function (n, i) { n._i = i; BY_ID[n.id] = n; });
    var BRANCH = {};
    DATA.branches.forEach(function (b) { BRANCH[b.key] = b; });

    /* Radius per tier — the eight rings, plus room for the hub medallion. */
    var R = { 1: 82, 2: 126, 3: 170, 4: 214, 5: 264, 6: 314, 7: 370, 8: 424 };
    var CX = 524, CY = 524, SIZE = 1048;

    var selected = Object.create(null);
    var els = {};

    /* ---------- budget ---------------------------------------------------- */
    function budget() {
      var realm = +els.realm.value, stage = +els.stage.value;
      var ppa = +els.ppa.value || 0, ppb = +els.ppb.value || 0;
      var rankUps = realm * 4 + stage;      // rungs climbed from Body Refinement, Early
      return rankUps * ppa + realm * ppb;   // every rung pays ppa; breakthroughs add ppb
    }
    function spent() {
      var t = 0;
      for (var id in selected) t += BY_ID[id].cost;
      return t;
    }

    /* ---------- allocation rules ------------------------------------------ */
    function prereqsMet(n) {
      if (n.prereq && !selected[n.prereq]) return false;
      if (n.prereq2 && !selected[n.prereq2]) return false;
      return true;
    }
    function dependents(id) {
      return NODES.filter(function (n) {
        return selected[n.id] && (n.prereq === id || n.prereq2 === id);
      });
    }
    function canSelect(n) {
      if (selected[n.id]) return false;
      if (!prereqsMet(n)) return STR.noPrereq;
      if (spent() + n.cost > budget()) return STR.noPoints;
      return true;
    }

    function toggle(n) {
      if (selected[n.id]) {
        if (dependents(n.id).length) return;   // would orphan a later node
        delete selected[n.id];
      } else {
        if (canSelect(n) !== true) return;
        selected[n.id] = 1;
      }
      render();
      writeUrl();
    }

    /* ---------- share URL -------------------------------------------------- */
    function encode() {
      var bytes = new Uint8Array(Math.ceil(NODES.length / 8));
      NODES.forEach(function (n, i) { if (selected[n.id]) bytes[i >> 3] |= 1 << (i & 7); });
      var s = "";
      for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
      return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    function decode(str) {
      try {
        var b = atob(str.replace(/-/g, "+").replace(/_/g, "/"));
        selected = Object.create(null);
        NODES.forEach(function (n, i) {
          if (i >> 3 < b.length && (b.charCodeAt(i >> 3) >> (i & 7)) & 1) selected[n.id] = 1;
        });
        /* A shared build may arrive with prerequisites missing (hand-edited URL,
           or data regenerated since). Drop anything unreachable rather than
           rendering an impossible tree. */
        var changed = true;
        while (changed) {
          changed = false;
          for (var id in selected) {
            if (!prereqsMet(BY_ID[id])) { delete selected[id]; changed = true; }
          }
        }
      } catch (e) { console.warn("[planner] bad build string", e); }
    }

    function writeUrl() {
      var q = "r=" + els.realm.value + "&s=" + els.stage.value + "&b=" + encode();
      history.replaceState(null, "", location.pathname + "#" + q);
    }
    function readUrl() {
      var h = location.hash.replace(/^#/, "");
      if (!h) return;
      var p = {};
      h.split("&").forEach(function (kv) { var a = kv.split("="); p[a[0]] = a[1] || ""; });
      if (p.r !== undefined && els.realm.querySelector('option[value="' + p.r + '"]')) els.realm.value = p.r;
      if (p.s !== undefined && els.stage.querySelector('option[value="' + p.s + '"]')) els.stage.value = p.s;
      if (p.b) decode(p.b);
    }

    /* ---------- geometry --------------------------------------------------- */
    function pos(angleDeg, radius) {
      var a = angleDeg * Math.PI / 180;         /* 0 = up, clockwise (matches the game) */
      return { x: CX + radius * Math.sin(a), y: CY - radius * Math.cos(a) };
    }
    function nodeRadius(n) { return n.tier === 8 ? 17 : (n.tier >= 5 ? 11 : 13); }

    /* ---------- rendering -------------------------------------------------- */
    var svgNS = "http://www.w3.org/2000/svg";
    function el(tag, attrs) {
      var e = document.createElementNS(svgNS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    }

    function buildSvg() {
      var svg = el("svg", { viewBox: "0 0 " + SIZE + " " + SIZE, role: "application",
                            "aria-label": STR.planner });

      var gEdges = el("g", {}), gNodes = el("g", {});
      svg.appendChild(gEdges); svg.appendChild(gNodes);

      /* hub */
      svg.appendChild(el("circle", { cx: CX, cy: CY, r: 46, fill: "var(--ink-800)",
                                     stroke: "var(--gold-600)", "stroke-width": 2 }));
      var hub = el("text", { x: CX, y: CY - 6, class: "hub", "font-size": "26" });
      hub.textContent = "0";
      svg.appendChild(hub);
      var hubSub = el("text", { x: CX, y: CY + 16, class: "hub", "font-size": "11",
                                fill: "var(--text-mut)", "letter-spacing": "2" });
      hubSub.textContent = STR.points;
      svg.appendChild(hubSub);
      els.hub = hub;

      /* branch glyphs just outside the last ring */
      DATA.branches.forEach(function (b) {
        var p = pos(b.angle, R[8] + 38);
        var t = el("text", { x: p.x, y: p.y, class: "spoke-label", fill: b.color });
        t.textContent = b.glyph;
        svg.appendChild(t);
        var l = el("text", { x: p.x, y: p.y + 20, class: "spoke-label", fill: "var(--text-mut)",
                             "font-size": "10", "font-family": "var(--font-display)",
                             "letter-spacing": "1.5" });
        l.textContent = LANG === "zh" ? branchLabel(b) : b.label.toUpperCase();
        svg.appendChild(l);
      });

      NODES.forEach(function (n) {
        var p = pos(n.angle, R[n.tier]);
        n._p = p;
        /* edge back to each prerequisite */
        [n.prereq, n.prereq2].forEach(function (pid) {
          if (!pid) return;
          var q = BY_ID[pid];
          var qp = pos(q.angle, R[q.tier]);
          var e = el("path", { class: "edge", d: "M" + qp.x + "," + qp.y + " L" + p.x + "," + p.y });
          e.dataset.from = pid; e.dataset.to = n.id;
          gEdges.appendChild(e);
        });

        /* Each node is a focusable role="button", so it needs an accessible
           name — the visual label lives only in the hover tooltip, which a
           screen reader never sees. */
        var g = el("g", { class: "node", tabindex: "0", role: "button",
                          "aria-label": nodeAria(n) });
        g.dataset.id = n.id;
        var c = el("circle", { class: "ring", cx: p.x, cy: p.y, r: nodeRadius(n),
                               stroke: BRANCH[n.branch].color, "fill-opacity": 0.25 });
        g.appendChild(c);
        if (n.tier === 8) {
          g.appendChild(el("circle", { cx: p.x, cy: p.y, r: nodeRadius(n) + 5, fill: "none",
                                       stroke: BRANCH[n.branch].color, "stroke-width": 1,
                                       "stroke-opacity": 0.5 }));
        }
        gNodes.appendChild(g);
      });

      return svg;
    }

    function label(b) {
      var v = (Math.round(b.amount * 10) / 10);
      return (b.pct ? "+" + v + "%" : "+" + v) + " " + statLabel(b.stat);
    }

    function render() {
      var cap = budget(), used = spent();
      els.spent.textContent = used;
      els.cap.textContent = cap;
      els.budgetBox.classList.toggle("over", used > cap);
      els.hub.textContent = used;

      document.querySelectorAll(".tree-stage .node").forEach(function (g) {
        var n = BY_ID[g.dataset.id];
        var on = !!selected[n.id];
        var avail = !on && prereqsMet(n);
        g.classList.toggle("on", on);
        g.classList.toggle("avail", avail);
        g.classList.toggle("locked", !on && !avail);
        var c = g.querySelector("circle.ring");
        c.setAttribute("fill", on ? BRANCH[n.branch].color : "var(--ink-800)");
        c.setAttribute("fill-opacity", on ? 1 : 0.25);
        g.setAttribute("aria-pressed", on ? "true" : "false");
      });
      document.querySelectorAll(".tree-stage .edge").forEach(function (e) {
        e.classList.toggle("on", !!(selected[e.dataset.from] && selected[e.dataset.to]));
      });

      renderTotals();
    }

    function renderTotals() {
      var totals = {};
      for (var id in selected) {
        BY_ID[id].bonuses.forEach(function (b) {
          totals[b.stat] = (totals[b.stat] || 0) + b.amount;
        });
      }
      var keys = Object.keys(totals).sort(function (a, b) { return totals[b] - totals[a]; });
      els.totals.innerHTML = keys.length
        ? keys.map(function (k) {
            var pct = DATA.percentStats.indexOf(k) > -1;
            var v = Math.round(totals[k] * 10) / 10;
            return '<div class="stat"><span class="k">' + statLabel(k) +
                   '</span><span class="v">' + (pct ? "+" + v + "%" : "+" + v) + "</span></div>";
          }).join("")
        : '<p style="color:var(--text-mut);margin:0">' + STR.empty + '</p>';

      /* per-branch spend */
      var per = {};
      for (var id2 in selected) per[BY_ID[id2].branch] = (per[BY_ID[id2].branch] || 0) + BY_ID[id2].cost;
      els.branches.innerHTML = DATA.branches.map(function (b) {
        var v = per[b.key] || 0;
        return '<div class="bar-row" style="--fill:' + b.color + '">' +
               "<span>" + branchLabel(b) + '</span><span class="bar"><i style="width:' +
               (v / 28 * 100) + '%"></i></span><span>' + v + "/28</span></div>";
      }).join("");
    }

    /* Plain-text equivalent of the tooltip, for the node's aria-label. Built
       from the same helpers so the two can never describe a node differently. */
    function nodeAria(n) {
      var bonuses = n.bonuses.map(label).join(", ");
      return branchLabel(BRANCH[n.branch]) + " " + tierLabel(n.tier) + ", " +
             n.cost + (n.cost === 1 ? STR.point : STR.pointsSuffix) +
             (bonuses ? ": " + bonuses : "");
    }

    /* ---------- tooltip ---------------------------------------------------- */
    function tipHtml(n) {
      var b = BRANCH[n.branch];
      var lines = n.bonuses.map(function (x) { return '<span class="t-bonus">' + label(x) + "</span>"; });
      var state = "";
      if (!selected[n.id]) {
        var why = canSelect(n);
        if (why !== true) state = '<span class="t-warn">' + why + "</span>";
      } else if (dependents(n.id).length) {
        state = '<span class="t-warn">' + STR.removeFirst + "</span>";
      }
      return '<span class="t-name">' + branchLabel(b) + " &middot; " + tierLabel(n.tier) + "</span>" +
             '<span class="t-meta">' + n.cost + (n.cost === 1 ? STR.point : STR.pointsSuffix) +
             (n.prereq2 ? STR.dual : "") + "</span>" +
             "<div>" + lines.join("<br>") + "</div>" + (state ? "<div>" + state + "</div>" : "");
    }

    function showTip(n, evt) {
      var stage = els.stage_, t = els.tip;
      t.innerHTML = tipHtml(n);
      t.classList.add("show");
      var r = stage.getBoundingClientRect();
      var x = evt.clientX - r.left + 14, y = evt.clientY - r.top + 14;
      if (x + t.offsetWidth > r.width) x -= t.offsetWidth + 28;
      if (y + t.offsetHeight > r.height) y -= t.offsetHeight + 28;
      t.style.left = x + "px";
      t.style.top = y + "px";
    }

    /* ---------- boot ------------------------------------------------------- */
    function boot() {
      els.stage_ = document.querySelector(".tree-stage");
      if (!els.stage_) return;
      els.realm = document.getElementById("p-realm");
      els.stage = document.getElementById("p-stage");
      els.ppa = document.getElementById("p-ppa");
      els.ppb = document.getElementById("p-ppb");
      els.spent = document.getElementById("p-spent");
      els.cap = document.getElementById("p-cap");
      els.budgetBox = document.querySelector(".budget");
      els.totals = document.getElementById("p-totals");
      els.branches = document.getElementById("p-branches");
      els.tip = document.createElement("div");
      els.tip.className = "tip";
      els.stage_.appendChild(els.tip);

      els.stage_.insertBefore(buildSvg(), els.tip);

      els.stage_.addEventListener("click", function (e) {
        var g = e.target.closest(".node");
        if (g) toggle(BY_ID[g.dataset.id]);
      });
      els.stage_.addEventListener("keydown", function (e) {
        var g = e.target.closest && e.target.closest(".node");
        if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggle(BY_ID[g.dataset.id]); }
      });
      els.stage_.addEventListener("mousemove", function (e) {
        var g = e.target.closest(".node");
        if (g) showTip(BY_ID[g.dataset.id], e);
        else els.tip.classList.remove("show");
      });
      els.stage_.addEventListener("mouseleave", function () { els.tip.classList.remove("show"); });

      [els.realm, els.stage, els.ppa, els.ppb].forEach(function (f) {
        f.addEventListener("input", function () { render(); writeUrl(); });
      });

      document.getElementById("p-reset").addEventListener("click", function () {
        selected = Object.create(null); render(); writeUrl();
      });
      document.getElementById("p-share").addEventListener("click", function () {
        var url = location.href;
        var done = document.getElementById("p-copied");
        function flash() { done.classList.add("show"); setTimeout(function () { done.classList.remove("show"); }, 1600); }
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(flash, flash);
        else flash();
      });

      readUrl();
      render();
    }

  boot();
}
