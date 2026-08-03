/* Ported from the static site's assets/js/calculator.js by tools/port_tools.py.

   The logic is deliberately unchanged — it matches the mod's own Java — and
   only the wrapper differs: an ES module exporting init(lang) in place of an
   IIFE that read globals and waited for DOMContentLoaded. React calls init()
   from an effect once the markup it binds to is mounted.
*/
export function init(LANG) {
  /* Language, detected the same way site.js does it. */
  
    var L = {
      en: {
        realms: ["Body Refinement", "Qi Condensation", "Foundation Establishment",
                 "Golden Core Formation", "Nascent Soul", "Soul Formation", "Void Refinement"],
        stages: ["Early", "Middle", "Late", "Peak"],
        perHour: "Qi per hour", meditation: "meditation ", cores: " &middot; cores ",
        totalTo: "Total Qi to ", banked: "banked across every rung",
        timeTo: "Time to ", including: "including ", ofRituals: " min of rituals",
        at: "At ", hPerDay: " h/day", days: " days", realDays: "real-world days of play",
        thRankUp: "Rank-up", thQi: "Qi required", thTime: "Time",
        thCumQi: "Cumulative Qi", thCumTime: "Cumulative time",
        breakthrough: "breakthrough", min: " min", hr: " h", qi: " Qi", comma: ", "
      },
      zh: {
        realms: ["炼体期", "炼气期", "筑基期", "金丹期", "元婴期", "化神期", "炼虚期"],
        stages: ["初期", "中期", "后期", "圆满"],
        perHour: "每小时灵气", meditation: "打坐 ", cores: " &middot; 修行之核 ",
        totalTo: "至", banked: "逐级累计所需",
        timeTo: "耗时至", including: "含 ", ofRituals: " 分钟仪式",
        at: "每日 ", hPerDay: " 小时", days: " 天", realDays: "真实游玩天数",
        thRankUp: "升级", thQi: "所需灵气", thTime: "耗时",
        thCumQi: "累计灵气", thCumTime: "累计耗时",
        breakthrough: "突破", min: " 分钟", hr: " 小时", qi: " 灵气", comma: "·"
      }
    }[LANG];

    var REALMS = L.realms;
    var STAGES = L.stages;

    /* "Total Qi to Golden Core Formation" reads the other way round in Chinese:
       "至金丹期的总灵气". Both halves are in L, so the joins differ, not the text. */
    function toRealm(prefix, realm, suffix) {
      return LANG === "zh" ? prefix + realm + suffix : prefix + realm;
    }

    var f = {};
    function num(id) { var v = parseFloat(f[id].value); return isNaN(v) ? 0 : v; }

    function required(realm, stage) {
      var r = num("base") * Math.pow(num("realmMult"), realm) * Math.pow(num("subGrowth"), stage);
      if (stage === STAGES.length - 1) r *= num("btMult");
      return r * (1 - Math.min(num("qiCostRed"), 100) / 100);
    }

    /* Cores roll rarest-first and at most one drops per kill, so the expected
       value per kill is a chain of conditional probabilities, not a plain sum. */
    function coreQiPerKill() {
      var pd = num("divChance"), pp = num("profChance"), ps = num("spiritChance");
      return pd * num("divQi")
           + (1 - pd) * pp * num("profQi")
           + (1 - pd) * (1 - pp) * ps * num("spiritQi");
    }

    function rates() {
      var gain = (1 + num("race") / 100) * (1 + num("skillQi") / 100)
               * (1 + num("sect") / 100) * (1 + num("balance") / 100);
      var vein = num("drain") * num("talisman") * num("weather") * (num("uptime") / 100);
      var medPerHour = vein * 3600 * gain;
      var perKill = coreQiPerKill() * (f.coreWhileMeditating.checked ? num("coreBonus") : 1);
      var corePerHour = num("kills") * perKill * gain;
      return { gain: gain, medPerHour: medPerHour, corePerHour: corePerHour,
               perHour: medPerHour + corePerHour, perKill: perKill };
    }

    function ritualSeconds(realm, stage) {
      var mult = 1 - Math.min(num("ritualSpeed"), 100) / 100;
      return stage === STAGES.length - 1
        ? num("btSeconds") * Math.pow(num("btDurMult"), realm) * mult
        : num("advSeconds") * Math.pow(num("advDurMult"), realm) * mult;
    }

    function fmtHours(h) {
      if (!isFinite(h) || h <= 0) return "—";
      if (h < 1) return Math.round(h * 60) + L.min;
      if (h < 100) return (Math.round(h * 10) / 10) + L.hr;
      return Math.round(h).toLocaleString() + L.hr;
    }
    function fmtQi(q) {
      if (q >= 1e6) return (q / 1e6).toFixed(2) + "M";
      if (q >= 1e3) return Math.round(q).toLocaleString();
      return Math.round(q).toString();
    }

    function compute() {
      var r = rates();
      var target = parseInt(f.target.value, 10);
      var rows = [], cumQi = 0, cumHours = 0, cumRitual = 0, targetHours = null, targetQi = null;

      for (var realm = 0; realm < REALMS.length; realm++) {
        for (var stage = 0; stage < STAGES.length; stage++) {
          /* The final Peak has nothing above it to pay for. */
          if (realm === REALMS.length - 1 && stage === STAGES.length - 1) continue;
          var q = required(realm, stage);
          var hrs = r.perHour > 0 ? q / r.perHour : Infinity;
          var rit = ritualSeconds(realm, stage);
          cumQi += q; cumHours += hrs; cumRitual += rit;
          rows.push({
            realm: realm, stage: stage, isBreak: stage === STAGES.length - 1,
            q: q, hrs: hrs, cumQi: cumQi, cumHours: cumHours
          });
          if (realm + 1 === target && stage === STAGES.length - 1) {
            targetHours = cumHours + cumRitual / 3600;
            targetQi = cumQi;
          }
        }
      }

      /* Summary tiles */
      var perDay = num("perDay");
      var days = targetHours && perDay > 0 ? targetHours / perDay : null;
      f.out.innerHTML =
        tile(L.perHour, fmtQi(r.perHour), L.meditation + fmtQi(r.medPerHour) +
             L.cores + fmtQi(r.corePerHour)) +
        tile(toRealm(L.totalTo, REALMS[target], "的总灵气"), targetQi ? fmtQi(targetQi) : "—",
             L.banked) +
        tile(toRealm(L.timeTo, REALMS[target], ""), fmtHours(targetHours),
             L.including + Math.round(cumRitual / 60) + L.ofRituals) +
        tile(L.at + perDay + L.hPerDay, days ? (Math.round(days * 10) / 10) + L.days : "—",
             L.realDays);

      /* Per-rung table */
      var html = "<thead><tr><th>" + L.thRankUp + "</th><th>" + L.thQi + "</th><th>" + L.thTime +
                 "</th><th>" + L.thCumQi + "</th><th>" + L.thCumTime + "</th></tr></thead><tbody>";
      rows.forEach(function (x) {
        var next = x.isBreak
          ? REALMS[x.realm + 1] + L.comma + STAGES[0]
          : REALMS[x.realm] + L.comma + STAGES[x.stage + 1];
        html += "<tr" + (x.isBreak ? ' style="background:var(--accent-soft)"' : "") + ">" +
                "<td>" + REALMS[x.realm] + L.comma + STAGES[x.stage] +
                  ' <span style="color:var(--text-mut)">→ ' + next + "</span>" +
                  (x.isBreak ? ' <span class="chip crimson">' + L.breakthrough + "</span>" : "") + "</td>" +
                "<td>" + fmtQi(x.q) + "</td><td>" + fmtHours(x.hrs) + "</td>" +
                "<td>" + fmtQi(x.cumQi) + "</td><td>" + fmtHours(x.cumHours) + "</td></tr>";
      });
      f.table.innerHTML = html + "</tbody>";

      f.perKill.textContent = (Math.round(r.perKill * 100) / 100) + L.qi;
      f.gainMult.textContent = "×" + (Math.round(r.gain * 1000) / 1000);
    }

    function tile(k, v, sub) {
      return '<div class="stat"><span class="k">' + k + '</span><span class="v">' + v +
             "</span>" + (sub ? '<span class="k" style="margin-top:4px">' + sub + "</span>" : "") + "</div>";
    }

    function boot() {
      var form = document.getElementById("calc");
      if (!form) return;
      form.querySelectorAll("input, select").forEach(function (el) { f[el.dataset.k || el.id] = el; });
      f.out = document.getElementById("c-out");
      f.table = document.getElementById("c-table");
      f.perKill = document.getElementById("c-perkill");
      f.gainMult = document.getElementById("c-gainmult");
      f.coreWhileMeditating = document.getElementById("coreWhileMeditating");

      form.addEventListener("input", compute);
      document.getElementById("c-reset").addEventListener("click", function () {
        form.querySelectorAll("input[data-default]").forEach(function (el) {
          if (el.type === "checkbox") el.checked = el.dataset.default === "true";
          else el.value = el.dataset.default;
        });
        compute();
      });
      compute();
    }

  boot();
}
