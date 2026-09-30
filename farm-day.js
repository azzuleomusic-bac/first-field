(function farmDay() {
  var SAVE = "first-field-v1";
  var DAY = "first-field-day";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function readSave() {
    try { return JSON.parse(localStorage.getItem(SAVE) || "{}"); }
    catch (e) { return {}; }
  }
  function writeSave(s) {
    try { localStorage.setItem(SAVE, JSON.stringify(s)); } catch (e) {}
  }
  function readDay() {
    try { return JSON.parse(localStorage.getItem(DAY) || "null"); }
    catch (e) { return null; }
  }
  function writeDay(d) {
    try { localStorage.setItem(DAY, JSON.stringify(d)); } catch (e) {}
  }
  function snap(s) {
    var plots = s.plots || [];
    var growing = 0, ready = 0, empty = 0;
    plots.forEach(function (p) {
      if (!p.crop) empty++;
      else if (p.crop.stage === "ready") ready++;
      else growing++;
    });
    return {
      water: s.water || 0,
      corn: s.corn || 0,
      carrots: s.carrots || 0,
      milk: s.milk || 0,
      eggs: s.eggs || 0,
      wool: s.wool || 0,
      hair: s.horseHair || 0,
      ready: ready,
      empty: empty,
      growing: growing
    };
  }
  function freshDay() {
    return {
      key: todayKey(),
      harvest: { need: 3, have: 0 },
      water: { need: 8, have: 0 },
      collect: { need: 1, have: 0 },
      claimed: false
    };
  }
  function ensureDay() {
    var d = readDay();
    if (!d || d.key !== todayKey()) d = freshDay();
    writeDay(d);
    return d;
  }
  function done(task) { return task.have >= task.need; }
  function allDone(d) { return done(d.harvest) && done(d.water) && done(d.collect); }
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }
  function renderBoard(d) {
    var box = document.getElementById("chore-board");
    if (!box) return;
    function row(label, t) {
      var ok = done(t);
      return "<li class=\"" + (ok ? "ok" : "") + "\">" + (ok ? "✓ " : "○ ") + label + " <b>" + Math.min(t.have, t.need) + "/" + t.need + "</b></li>";
    }
    var body = "<h3>Today on the field</h3><ul>" +
      row("Harvest ready crops", d.harvest) +
      row("Fill the water can", d.water) +
      row("Collect milk, eggs, wool or hair", d.collect) +
      "</ul>";
    if (d.claimed) body += "<p class=\"note\">Chores done. Come back tomorrow.</p>";
    else if (allDone(d)) body += "<button type=\"button\" class=\"ghost\" id=\"chore-claim\">Claim 2 carrot seeds + 8 water</button>";
    else body += "<p class=\"note\">Finish the three jobs. Reward is seeds and water.</p>";
    box.innerHTML = body;
    var btn = document.getElementById("chore-claim");
    if (btn) btn.onclick = function (ev) {
      ev.stopPropagation();
      claim();
    };
  }
  function claim() {
    var d = ensureDay();
    if (d.claimed || !allDone(d)) return;
    var s = readSave();
    s.carrotSeeds = (s.carrotSeeds || 0) + 2;
    s.water = (s.water || 0) + 8;
    d.claimed = true;
    writeDay(d);
    writeSave(s);
    toast("Chores done — +2 carrot seeds, +8 water");
    renderBoard(d);
  }
  function tickFrom(prev, next) {
    var d = ensureDay();
    if (d.claimed) { renderBoard(d); return; }
    var harvested = Math.max(0, prev.ready - next.ready);
    if (next.empty > prev.empty) harvested = Math.max(harvested, next.empty - prev.empty);
    if (harvested) d.harvest.have += harvested;
    var waterGain = Math.max(0, next.water - prev.water);
    if (waterGain) d.water.have += waterGain;
    var goods = (next.milk + next.eggs + next.wool + next.hair) - (prev.milk + prev.eggs + prev.wool + prev.hair);
    if (goods > 0) d.collect.have += goods;
    writeDay(d);
    renderBoard(d);
  }
  ready(function () {
    var wrap = document.getElementById("app");
    if (!wrap || document.getElementById("chore-board")) return;
    var style = document.createElement("style");
    style.textContent = [
      "#chore-board{position:absolute;left:8px;bottom:8px;z-index:11;width:min(230px,calc(100% - 16px));background:rgba(14,22,12,0.92);border:1px solid rgba(232,195,106,0.28);border-radius:12px;padding:8px 10px;color:#f4ead4;font-size:12px;pointer-events:auto}",
      "#chore-board h3{margin:0 0 6px;font-size:12px;letter-spacing:.04em;color:#e8c36a}",
      "#chore-board ul{list-style:none;margin:0;padding:0}",
      "#chore-board li{margin:0 0 4px}",
      "#chore-board li.ok{opacity:.7}",
      "#chore-board .note{margin:6px 0 0;opacity:.8}",
      "#chore-board button{margin-top:8px;width:100%}",
      "@media (max-height:700px){#chore-board{font-size:11px;padding:6px 8px}}"
    ].join("");
    document.head.appendChild(style);
    var box = document.createElement("div");
    box.id = "chore-board";
    var field = document.getElementById("field-wrap") || wrap;
    field.appendChild(box);
    var d = ensureDay();
    renderBoard(d);
    var prev = snap(readSave());
    setInterval(function () {
      var now = snap(readSave());
      tickFrom(prev, now);
      prev = now;
    }, 900);
  });
})();
