(function diveModes() {
  var KEY = "first-field-dive";
  var SAVE = "first-field-v1";
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveDive(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }
  function readFarm() {
    try { return JSON.parse(localStorage.getItem(SAVE) || "{}"); } catch (e) { return {}; }
  }
  function writeFarm(s) {
    try { localStorage.setItem(SAVE, JSON.stringify(s)); } catch (e) {}
  }
  function defaults(d) {
    d.mineZone = d.mineZone || "shallow";
    d.forestZone = d.forestZone || "trail";
    if (typeof d.pickDur !== "number") d.pickDur = 20;
    if (typeof d.axeDur !== "number") d.axeDur = 20;
    if (typeof d.ironPick !== "boolean") d.ironPick = false;
    if (typeof d.hideWrap !== "boolean") d.hideWrap = false;
    d.deepOre = d.deepOre || 0;
    d.darkHide = d.darkHide || 0;
    return d;
  }
  function hasSword(farm) { return !!(farm.gearSword || (farm.swords || 0) > 0); }
  function clothed(farm) {
    return !!(farm.gearPants || farm.gearShirt || farm.gearBeanie);
  }
  function mineGate(zone, d, farm) {
    if (zone === "deep" && !d.ironPick) return "Need an iron pick (craft deep ore).";
    if (zone === "sealed" && !(d.ironPick && hasSword(farm))) return "Sealed shaft needs iron pick + stone sword.";
    return "";
  }
  function forestGate(zone, d, farm) {
    if (zone === "thicket" && !clothed(farm)) return "Thicket needs a shirt, pants, or beanie on.";
    if (zone === "dark" && !(d.hideWrap && hasSword(farm))) return "Dark wood needs hide wrap + stone sword.";
    return "";
  }
  function applyTimes(d) {
    if (!window.FF) window.FF = {};
    FF.mineMs = ({ shallow: 5000, deep: 9000, sealed: 14000 })[d.mineZone] || 5000;
    FF.forestMs = ({ trail: 5000, thicket: 8000, dark: 12000 })[d.forestZone] || 5000;
  }
  function paintZones(d) {
    document.querySelectorAll("[data-mine-zone]").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-mine-zone") === d.mineZone);
    });
    document.querySelectorAll("[data-forest-zone]").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-forest-zone") === d.forestZone);
    });
    var mp = document.getElementById("dive-pick-dur");
    if (mp) mp.textContent = "Pick " + d.pickDur + "/20" + (d.ironPick ? " · iron" : "");
    var fa = document.getElementById("dive-axe-dur");
    if (fa) fa.textContent = "Axe " + d.axeDur + "/20" + (d.hideWrap ? " · hide wrap" : "");
    var ore = document.getElementById("dive-ore-count");
    if (ore) ore.textContent = "Deep ore " + d.deepOre + " · Dark hide " + d.darkHide;
  }
  function inject() {
    if (document.getElementById("mine-zones")) return;
    var style = document.createElement("style");
    style.textContent = ".dive-zones{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.dive-zones button{flex:1;min-height:40px;font-size:12px;border-radius:10px;border:1px solid rgba(232,195,106,.35);background:#1c2416;color:#f4ead4}.dive-zones button.on{border-color:#e8c36a;color:#e8c36a}.dive-meta{font-size:11px;opacity:.8;margin:0 0 8px}";
    document.head.appendChild(style);
    var mineStatus = document.getElementById("mine-status");
    if (mineStatus) {
      var box = document.createElement("div");
      box.innerHTML = '<p class="dive-meta" id="dive-pick-dur"></p><div class="dive-zones" id="mine-zones"><button type="button" data-mine-zone="shallow">Shallow</button><button type="button" data-mine-zone="deep">Deep</button><button type="button" data-mine-zone="sealed">Sealed</button></div>';
      mineStatus.after(box);
    }
    var forestStatus = document.getElementById("forest-status");
    if (forestStatus) {
      var box2 = document.createElement("div");
      box2.innerHTML = '<p class="dive-meta" id="dive-axe-dur"></p><div class="dive-zones" id="forest-zones"><button type="button" data-forest-zone="trail">Trail</button><button type="button" data-forest-zone="thicket">Thicket</button><button type="button" data-forest-zone="dark">Dark wood</button></div>';
      forestStatus.after(box2);
    }
    var weapons = document.getElementById("csec-weapons");
    if (weapons && !document.getElementById("craft-iron-pick")) {
      var extra = document.createElement("div");
      extra.innerHTML = '<div class="row"><span>8 deep ore + 4 lumber → iron pick (opens Deep)</span><button type="button" id="craft-iron-pick">Make iron pick</button></div><div class="row"><span>6 dark hide + 4 wool → hide wrap (opens Dark wood)</span><button type="button" id="craft-hide-wrap">Make hide wrap</button></div><div class="row"><span>Repair pick — 3 rocks + 1 lumber</span><button type="button" id="craft-fix-pick">Repair pick</button></div><div class="row"><span>Repair axe — 3 lumber</span><button type="button" id="craft-fix-axe">Repair axe</button></div><p class="dive-meta" id="dive-ore-count"></p>';
      weapons.appendChild(extra);
    }
    var market = document.getElementById("market-panel");
    if (market && !document.getElementById("sell-deep-ore")) {
      var sell = document.createElement("div");
      sell.className = "row";
      sell.innerHTML = '<span>Sell 3 deep ore — 4 sats</span><button type="button" id="sell-deep-ore">Sell ore</button>';
      var sell2 = document.createElement("div");
      sell2.className = "row";
      sell2.innerHTML = '<span>Sell 3 dark hide — 4 sats</span><button type="button" id="sell-dark-hide">Sell hide</button>';
      var close = market.querySelector("#market-close");
      if (close) { market.insertBefore(sell, close); market.insertBefore(sell2, close); }
      else { market.appendChild(sell); market.appendChild(sell2); }
    }
  }
  function hook(d) {
    var mz = document.getElementById("mine-zones");
    if (mz) mz.addEventListener("click", function (ev) {
      var z = ev.target.getAttribute("data-mine-zone");
      if (!z) return;
      var g = mineGate(z, d, readFarm());
      if (g) { toast(g); return; }
      d.mineZone = z; saveDive(d); applyTimes(d); paintZones(d);
      toast(z);
    });
    var fz = document.getElementById("forest-zones");
    if (fz) fz.addEventListener("click", function (ev) {
      var z = ev.target.getAttribute("data-forest-zone");
      if (!z) return;
      var g = forestGate(z, d, readFarm());
      if (g) { toast(g); return; }
      d.forestZone = z; saveDive(d); applyTimes(d); paintZones(d);
      toast(z);
    });
    function blockIf(el, check) {
      if (!el) return;
      el.addEventListener("click", function (ev) {
        var msg = check();
        if (!msg) return;
        ev.stopImmediatePropagation();
        ev.preventDefault();
        toast(msg);
      }, true);
    }
    blockIf(document.getElementById("btn-mine"), function () {
      applyTimes(d);
      var g = mineGate(d.mineZone, d, readFarm());
      if (g) return g;
      if (d.mineZone !== "shallow" && d.pickDur <= 0) return "Pick is worn out. Repair at Craft.";
      if (d.mineZone !== "shallow") { d.pickDur = Math.max(0, d.pickDur - 1); saveDive(d); paintZones(d); }
      return "";
    });
    blockIf(document.getElementById("btn-forest"), function () {
      applyTimes(d);
      var g = forestGate(d.forestZone, d, readFarm());
      if (g) return g;
      if (d.forestZone !== "trail" && d.axeDur <= 0) return "Axe is worn out. Repair at Craft.";
      if (d.forestZone !== "trail") { d.axeDur = Math.max(0, d.axeDur - 1); saveDive(d); paintZones(d); }
      return "";
    });
    var loot = document.getElementById("loot-text");
    if (loot) {
      new MutationObserver(function () {
        var t = loot.textContent || "";
        if (/deep ore|dark hide/i.test(t)) return;
        if (/rock|mine/i.test(t) && (d.mineZone === "deep" || d.mineZone === "sealed")) {
          var n = d.mineZone === "sealed" ? 3 : 2;
          d.deepOre += n; saveDive(d); paintZones(d);
          loot.textContent = t + " + " + n + " deep ore";
        }
        if (/lumber|chop/i.test(t) && (d.forestZone === "thicket" || d.forestZone === "dark")) {
          var n2 = d.forestZone === "dark" ? 3 : 2;
          d.darkHide += n2; saveDive(d); paintZones(d);
          loot.textContent = t + " + " + n2 + " dark hide";
        }
      }).observe(loot, { childList: true, characterData: true, subtree: true });
    }
    function bind(id, fn) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("click", fn);
    }
    bind("craft-iron-pick", function () {
      if (d.ironPick) { toast("You already have an iron pick"); return; }
      if (d.deepOre < 8) { toast("Need 8 deep ore"); return; }
      var farm = readFarm();
      if ((farm.lumber || 0) < 4) { toast("Need 4 lumber"); return; }
      farm.lumber -= 4; writeFarm(farm);
      d.deepOre -= 8; d.ironPick = true; d.pickDur = 20; saveDive(d); paintZones(d);
      toast("Iron pick ready. Deep mine is open.");
    });
    bind("craft-hide-wrap", function () {
      if (d.hideWrap) { toast("You already have a hide wrap"); return; }
      if (d.darkHide < 6) { toast("Need 6 dark hide"); return; }
      var farm = readFarm();
      if ((farm.wool || 0) < 4) { toast("Need 4 wool"); return; }
      farm.wool -= 4; writeFarm(farm);
      d.darkHide -= 6; d.hideWrap = true; saveDive(d); paintZones(d);
      toast("Hide wrap on. Dark wood can open.");
    });
    bind("craft-fix-pick", function () {
      var farm = readFarm();
      if ((farm.rocks || 0) < 3 || (farm.lumber || 0) < 1) { toast("Need 3 rocks + 1 lumber"); return; }
      farm.rocks -= 3; farm.lumber -= 1; writeFarm(farm);
      d.pickDur = 20; saveDive(d); paintZones(d); toast("Pick repaired");
    });
    bind("craft-fix-axe", function () {
      var farm = readFarm();
      if ((farm.lumber || 0) < 3) { toast("Need 3 lumber"); return; }
      farm.lumber -= 3; writeFarm(farm);
      d.axeDur = 20; saveDive(d); paintZones(d); toast("Axe repaired");
    });
    bind("sell-deep-ore", function () {
      if (d.deepOre < 3) { toast("Need 3 deep ore"); return; }
      var farm = readFarm();
      farm.sats = (farm.sats || 0) + 4;
      farm.marketLog = farm.marketLog || [];
      farm.marketLog.unshift({ at: Date.now(), text: "Sold 3 deep ore +4 sats" });
      writeFarm(farm);
      d.deepOre -= 3; saveDive(d); paintZones(d);
      toast("+4 sats. Could have been an iron pick.");
    });
    bind("sell-dark-hide", function () {
      if (d.darkHide < 3) { toast("Need 3 dark hide"); return; }
      var farm = readFarm();
      farm.sats = (farm.sats || 0) + 4;
      farm.marketLog = farm.marketLog || [];
      farm.marketLog.unshift({ at: Date.now(), text: "Sold 3 dark hide +4 sats" });
      writeFarm(farm);
      d.darkHide -= 3; saveDive(d); paintZones(d); toast("+4 sats");
    });
  }
  ready(function () {
    var d = defaults(load());
    saveDive(d);
    inject();
    applyTimes(d);
    paintZones(d);
    hook(d);
  });
})();
