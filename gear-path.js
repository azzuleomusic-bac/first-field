(function gearPath() {
  var KEY = "first-field-dive";
  var SAVE = "first-field-v1";
  var COST = { shallow: 1, deep: 3, sealed: 6, trail: 1, thicket: 3, dark: 6 };

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function D() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveD(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }
  function F() {
    try { return JSON.parse(localStorage.getItem(SAVE) || "{}"); } catch (e) { return {}; }
  }
  function saveF(s) {
    try { localStorage.setItem(SAVE, JSON.stringify(s)); } catch (e) {}
  }
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, 2400);
  }
  function energy() {
    var s = F();
    return typeof s.sats === "number" ? s.sats : 0;
  }
  function spendEnergy(n) {
    var s = F();
    if ((s.sats || 0) < n) return false;
    s.sats -= n;
    s.marketLog = s.marketLog || [];
    s.marketLog.unshift({ at: Date.now(), text: "Adventure −" + n + " energy" });
    saveF(s);
    var pill = document.getElementById("stat-sats");
    if (pill) pill.textContent = "\u26a1 " + s.sats + " sats";
    return true;
  }
  function addEnergy(n, why) {
    var s = F();
    s.sats = (s.sats || 0) + n;
    s.marketLog = s.marketLog || [];
    s.marketLog.unshift({ at: Date.now(), text: why });
    saveF(s);
    var pill = document.getElementById("stat-sats");
    if (pill) pill.textContent = "\u26a1 " + s.sats + " sats";
  }
  function norm(d) {
    d.blade = d.blade || 0;
    d.pickT = d.ironPick ? Math.max(d.pickT || 0, 1) : (d.pickT || 0);
    d.mail = d.hideWrap ? Math.max(d.mail || 0, 1) : (d.mail || 0);
    d.ring = d.ring || 0;
    d.steel = d.steel || 0;
    d.ash = d.ash || 0;
    d.adAt = d.adAt || 0;
    return d;
  }
  function paint(d) {
    var el = document.getElementById("gear-path-status");
    if (!el) return;
    var blades = ["none", "stone", "iron blade", "steel fang", "night edge"];
    var picks = ["wood", "iron pick", "steel pick", "core pick"];
    var mails = ["cloth", "hide wrap", "iron mail", "night cloak"];
    var rings = ["none", "copper", "bone", "sun seal"];
    el.textContent = blades[d.blade] + " \u00b7 " + picks[d.pickT] + " \u00b7 " + mails[d.mail] + " \u00b7 " + rings[d.ring] +
      " \u00b7 shards " + d.steel + " \u00b7 ash " + d.ash;
  }

  ready(function () {
    var d = norm(D());
    saveD(d);

    var weapons = document.getElementById("csec-weapons");
    if (weapons && !document.getElementById("gear-path-status")) {
      var box = document.createElement("div");
      box.innerHTML =
        '<p id="gear-path-status" style="font-size:11px;opacity:.85;margin:8px 0"></p>' +
        '<div class="row"><span>12 deep ore + stone sword \u2192 iron blade</span><button type="button" id="mk-blade2">Iron blade</button></div>' +
        '<div class="row"><span>8 steel shards + iron blade \u2192 steel fang</span><button type="button" id="mk-blade3">Steel fang</button></div>' +
        '<div class="row"><span>10 night ash + steel fang \u2192 night edge</span><button type="button" id="mk-blade4">Night edge</button></div>' +
        '<div class="row"><span>10 steel shards + iron pick \u2192 steel pick</span><button type="button" id="mk-pick2">Steel pick</button></div>' +
        '<div class="row"><span>12 night ash + steel pick \u2192 core pick</span><button type="button" id="mk-pick3">Core pick</button></div>' +
        '<div class="row"><span>8 steel shards + hide wrap \u2192 iron mail</span><button type="button" id="mk-mail2">Iron mail</button></div>' +
        '<div class="row"><span>10 night ash + iron mail \u2192 night cloak</span><button type="button" id="mk-mail3">Night cloak</button></div>' +
        '<div class="row"><span>4 deep ore \u2192 copper ring</span><button type="button" id="mk-ring1">Copper ring</button></div>' +
        '<div class="row"><span>6 dark hide + copper ring \u2192 bone ring</span><button type="button" id="mk-ring2">Bone ring</button></div>' +
        '<div class="row"><span>8 night ash + bone ring \u2192 sun seal</span><button type="button" id="mk-ring3">Sun seal</button></div>';
      weapons.appendChild(box);
    }
    paint(d);

    var hud = document.getElementById("app");
    if (hud && !document.getElementById("btn-watch-ad")) {
      var ad = document.createElement("button");
      ad.type = "button";
      ad.id = "btn-watch-ad";
      ad.className = "ghost";
      ad.textContent = "Watch ad +⚡5";
      ad.style.cssText = "position:absolute;right:8px;top:86px;z-index:12;font-size:12px";
      hud.appendChild(ad);
      ad.onclick = function () {
        d = norm(D());
        var wait = 90000 - (Date.now() - (d.adAt || 0));
        if (wait > 0) { toast("Ad rest " + Math.ceil(wait / 1000) + "s"); return; }
        d.adAt = Date.now();
        saveD(d);
        addEnergy(5, "Watched ad +5 energy");
        toast("+5 ⚡ energy (ad stub)");
      };
    }

    function need(ok, msg) { if (!ok) { toast(msg); return false; } return true; }
    function bind(id, fn) {
      var el = document.getElementById(id);
      if (el) el.onclick = fn;
    }
    bind("mk-blade2", function () {
      d = norm(D());
      var s = F();
      if (!need(s.gearSword || (s.swords || 0) > 0 || d.blade >= 1, "Need a stone sword first")) return;
      if (!need((d.deepOre || 0) >= 12, "Need 12 deep ore")) return;
      if (d.blade >= 2) { toast("Already have iron blade or better"); return; }
      d.deepOre -= 12; d.blade = 2; saveD(d); paint(d); toast("Iron blade");
    });
    bind("mk-blade3", function () {
      d = norm(D());
      if (!need(d.blade >= 2, "Need iron blade")) return;
      if (!need(d.steel >= 8, "Need 8 steel shards from Sealed mine")) return;
      if (d.blade >= 3) { toast("Already better"); return; }
      d.steel -= 8; d.blade = 3; saveD(d); paint(d); toast("Steel fang");
    });
    bind("mk-blade4", function () {
      d = norm(D());
      if (!need(d.blade >= 3, "Need steel fang")) return;
      if (!need(d.ash >= 10, "Need 10 night ash from Dark wood")) return;
      d.ash -= 10; d.blade = 4; saveD(d); paint(d); toast("Night edge");
    });
    bind("mk-pick2", function () {
      d = norm(D());
      if (!need(d.ironPick || d.pickT >= 1, "Need iron pick")) return;
      if (!need(d.steel >= 10, "Need 10 steel shards")) return;
      if (d.pickT >= 2) { toast("Already better"); return; }
      d.steel -= 10; d.pickT = 2; saveD(d); paint(d); toast("Steel pick");
    });
    bind("mk-pick3", function () {
      d = norm(D());
      if (!need(d.pickT >= 2, "Need steel pick")) return;
      if (!need(d.ash >= 12, "Need 12 night ash")) return;
      d.ash -= 12; d.pickT = 3; saveD(d); paint(d); toast("Core pick");
    });
    bind("mk-mail2", function () {
      d = norm(D());
      if (!need(d.hideWrap || d.mail >= 1, "Need hide wrap")) return;
      if (!need(d.steel >= 8, "Need 8 steel shards")) return;
      if (d.mail >= 2) { toast("Already better"); return; }
      d.steel -= 8; d.mail = 2; saveD(d); paint(d); toast("Iron mail");
    });
    bind("mk-mail3", function () {
      d = norm(D());
      if (!need(d.mail >= 2, "Need iron mail")) return;
      if (!need(d.ash >= 10, "Need 10 night ash")) return;
      d.ash -= 10; d.mail = 3; saveD(d); paint(d); toast("Night cloak");
    });
    bind("mk-ring1", function () {
      d = norm(D());
      if (!need((d.deepOre || 0) >= 4, "Need 4 deep ore")) return;
      if (d.ring >= 1) { toast("Already better"); return; }
      d.deepOre -= 4; d.ring = 1; saveD(d); paint(d); toast("Copper ring");
    });
    bind("mk-ring2", function () {
      d = norm(D());
      if (!need(d.ring >= 1, "Need copper ring")) return;
      if (!need((d.darkHide || 0) >= 6, "Need 6 dark hide")) return;
      d.darkHide -= 6; d.ring = 2; saveD(d); paint(d); toast("Bone ring");
    });
    bind("mk-ring3", function () {
      d = norm(D());
      if (!need(d.ring >= 2, "Need bone ring")) return;
      if (!need(d.ash >= 8, "Need 8 night ash")) return;
      d.ash -= 8; d.ring = 3; saveD(d); paint(d); toast("Sun seal");
    });

    function zoneOf(kind) {
      d = norm(D());
      return kind === "mine" ? (d.mineZone || "shallow") : (d.forestZone || "trail");
    }
    function blockEnergy(btn, kind) {
      if (!btn) return;
      btn.addEventListener("click", function (ev) {
        var z = zoneOf(kind);
        var c = COST[z] || 1;
        if (energy() >= c) {
          spendEnergy(c);
          return;
        }
        ev.stopImmediatePropagation();
        ev.preventDefault();
        toast("Need ⚡" + c + " energy. Sell goods or watch an ad.");
      }, true);
    }
    blockEnergy(document.getElementById("btn-mine"), "mine");
    blockEnergy(document.getElementById("btn-forest"), "forest");

    var loot = document.getElementById("loot-text");
    if (loot) {
      new MutationObserver(function () {
        var t = loot.textContent || "";
        if (/shard|ash/i.test(t)) return;
        d = norm(D());
        if (/rock|mine|ore/i.test(t) && d.mineZone === "sealed") {
          d.steel += 2; saveD(d); paint(d);
          loot.textContent = t + " + 2 steel shards";
        }
        if (/lumber|chop|hide/i.test(t) && d.forestZone === "dark") {
          d.ash += 2; saveD(d); paint(d);
          loot.textContent = t + " + 2 night ash";
        }
      }).observe(loot, { childList: true, characterData: true, subtree: true });
    }
  });
})();
