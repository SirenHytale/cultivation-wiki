/* ---------------------------------------------------------------------------
   Qi / breakthrough calculator.

   The curve is the mod's own, ported from CultivationManager.getQiRequiredForNext:

     required = Base-Qi-Requirement
              * Realm-Base-Multiplier  ^ realmIndex
              * Substage-Growth-Rate   ^ stageIndex
     and, on the Peak stage only, * Realm-Breakthrough-Multiplier
     then     * (1 - skill-tree Qi cost reduction)

   Income mirrors CultivationMeditationSystem + CultivationManager.addQi: the
   vein-side multipliers (talisman, weather) scale the drawn amount, and the
   gain-side ones (race, skill tree, sect, Yin-Yang balance) scale everything
   banked, cores included.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  var REALMS = ["Body Refinement", "Qi Condensation", "Foundation Establishment",
                "Golden Core Formation", "Nascent Soul", "Soul Formation", "Void Refinement"];
  var STAGES = ["Early", "Middle", "Late", "Peak"];

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
    if (h < 1) return Math.round(h * 60) + " min";
    if (h < 100) return (Math.round(h * 10) / 10) + " h";
    return Math.round(h).toLocaleString() + " h";
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
      tile("Qi per hour", fmtQi(r.perHour), "meditation " + fmtQi(r.medPerHour) +
           " &middot; cores " + fmtQi(r.corePerHour)) +
      tile("Total Qi to " + REALMS[target], targetQi ? fmtQi(targetQi) : "—",
           "banked across every rung") +
      tile("Time to " + REALMS[target], fmtHours(targetHours),
           "including " + Math.round(cumRitual / 60) + " min of rituals") +
      tile("At " + perDay + " h/day", days ? (Math.round(days * 10) / 10) + " days" : "—",
           "real-world days of play");

    /* Per-rung table */
    var html = "<thead><tr><th>Rank-up</th><th>Qi required</th><th>Time</th>" +
               "<th>Cumulative Qi</th><th>Cumulative time</th></tr></thead><tbody>";
    rows.forEach(function (x) {
      var next = x.isBreak
        ? REALMS[x.realm + 1] + ", Early"
        : REALMS[x.realm] + ", " + STAGES[x.stage + 1];
      html += "<tr" + (x.isBreak ? ' style="background:var(--accent-soft)"' : "") + ">" +
              "<td>" + REALMS[x.realm] + ", " + STAGES[x.stage] +
                ' <span style="color:var(--text-mut)">→ ' + next + "</span>" +
                (x.isBreak ? ' <span class="chip crimson">breakthrough</span>' : "") + "</td>" +
              "<td>" + fmtQi(x.q) + "</td><td>" + fmtHours(x.hrs) + "</td>" +
              "<td>" + fmtQi(x.cumQi) + "</td><td>" + fmtHours(x.cumHours) + "</td></tr>";
    });
    f.table.innerHTML = html + "</tbody>";

    f.perKill.textContent = (Math.round(r.perKill * 100) / 100) + " Qi";
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

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
