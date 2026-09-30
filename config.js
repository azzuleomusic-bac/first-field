window.FF = {
  updates: [
    "Sep 30 \u2014 Wallet now logs +/\u2212 sats when you buy or sell, plus a line when you return from idle.",
    "Sep 30 \u2014 Tap the sats pill for the in-game wallet + trade log.",
    "Sep 30 \u2014 Empty plots: dark raked topsoil, not flat brown.",
    "Sep 30 \u2014 Well is wider (less bottle-shaped). Full well stays bright, no pulse.",
    "Sep 30 \u2014 Farm grass is mottled turf with grain.",
    "Sep 30 \u2014 Test: wells fill at 2 seconds per water."
  ],
  starterSats: 30,
  pack30Bonus: 20,
  wellMs: 2000,
  cornGrowMs: 20000,
  carrotGrowMs: 30000,
  cowMs: 25000,
  chickenMs: 15000,
  wellMax: 10,
  canPerWell: 30,
  cowFeed: { corn: 5, water: 3, milk: 3 },
  chickenFeed: { corn: 2, water: 1, eggs: 2 },
  pudding: { milk: 4, eggs: 3, sellSats: 2 },
  prices: {
    well: 15,
    plot: 10,
    cow: 5,
    chicken: 3,
    expandBase: 20
  },
  sell: {
    milk: { qty: 5, sats: 1 },
    water: { qty: 50, sats: 1 },
    eggs: { qty: 8, sats: 1 },
    carrots: { qty: 10, sats: 1 },
    corn: { qty: 40, sats: 1 }
  },
  buy: {
    water: { sats: 1, qty: 25 },
    carrotSeeds: { sats: 1, qty: 10 },
    cornSeeds: { sats: 1, qty: 20 }
  }
};

(function bootWallet() {
  var SAVE = "first-field-v1";
  var LEDGER = "first-field-ledger";
  var lastSats = null;
  var idleNoted = false;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); }
    catch (e) { return null; }
  }
  function readSave() { return readJson(SAVE) || {}; }
  function readLedger() {
    var rows = readJson(LEDGER);
    return Array.isArray(rows) ? rows : [];
  }
  function writeLedger(rows) {
    try { localStorage.setItem(LEDGER, JSON.stringify(rows.slice(0, 40))); }
    catch (e) {}
  }
  function pushLedger(entry) {
    var rows = readLedger();
    var last = rows[0];
    if (last && last.text === entry.text && Math.abs((last.at || 0) - entry.at) < 1500) return;
    rows.unshift(entry);
    writeLedger(rows);
  }
  function fmtAway(ms) {
    var m = Math.max(1, Math.round(ms / 60000));
    if (m < 60) return m + " min";
    var h = Math.round(m / 60 * 10) / 10;
    return h + "h";
  }
  function noteIdle() {
    if (idleNoted) return;
    idleNoted = true;
    var save = readSave();
    var last = save.lastTick || save.savedAt;
    if (!last) return;
    var away = Date.now() - last;
    if (away < 2 * 60 * 1000) return;
    var cap = 6 * 60 * 60 * 1000;
    var used = Math.min(away, cap);
    pushLedger({
      at: Date.now(),
      delta: 0,
      bal: typeof save.sats === "number" ? save.sats : 0,
      text: "Returned after " + fmtAway(away) + " \u2014 farm kept ticking" + (away > cap ? " (capped 6h)" : "")
    });
  }
  function watchSaves() {
    var raw = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key, val) {
      raw(key, val);
      if (key !== SAVE) return;
      try {
        var s = JSON.parse(val);
        var sats = typeof s.sats === "number" ? s.sats : 0;
        if (lastSats === null) { lastSats = sats; return; }
        if (sats === lastSats) return;
        var delta = sats - lastSats;
        lastSats = sats;
        var log = Array.isArray(s.marketLog) && s.marketLog[0] ? s.marketLog[0].text : "";
        var text = log || (delta > 0 ? "Sats in" : "Sats out");
        pushLedger({ at: Date.now(), delta: delta, bal: sats, text: text });
      } catch (e) {}
    };
    var s0 = readSave();
    if (typeof s0.sats === "number") lastSats = s0.sats;
  }
  function fill() {
    var save = readSave();
    var sats = typeof save.sats === "number" ? save.sats : 0;
    var bal = document.getElementById("wallet-bal");
    var pill = document.getElementById("stat-sats");
    if (pill && /sats/.test(pill.textContent || "")) {
      var live = pill.textContent.replace(/[^\d-]/g, "");
      if (live !== "") sats = Number(live) || sats;
    }
    if (bal) bal.textContent = "\u26a1 " + sats + " sats";
    var ul = document.getElementById("wallet-history");
    if (!ul) return;
    var rows = readLedger();
    if (!rows.length && Array.isArray(save.marketLog)) {
      rows = save.marketLog.slice(0, 20).map(function (r) {
        return { at: r.at, delta: 0, bal: sats, text: r.text || "" };
      });
    }
    if (!rows.length) {
      ul.innerHTML = "<li>No sat moves yet. Buy or sell, then open this again.</li>";
      return;
    }
    ul.innerHTML = rows.map(function (r) {
      var d = new Date(r.at || Date.now());
      var tstr = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      var sign = "";
      var cls = "";
      if (r.delta > 0) { sign = "<b class=\"up\">+" + r.delta + "</b> "; cls = "gain"; }
      else if (r.delta < 0) { sign = "<b class=\"dn\">" + r.delta + "</b> "; cls = "loss"; }
      return "<li class=\"" + cls + "\">" + tstr + " \u2014 " + sign + (r.text || "") + "</li>";
    }).join("");
  }
  function openWallet() {
    var pan = document.getElementById("wallet-panel");
    if (!pan) return;
    var on = pan.classList.contains("open");
    pan.classList.toggle("open", !on);
    pan.setAttribute("aria-hidden", on ? "true" : "false");
    if (!on) fill();
  }
  ready(function () {
    watchSaves();
    noteIdle();
    if (document.getElementById("wallet-panel")) return;
    var style = document.createElement("style");
    style.textContent = [
      "#stat-sats{cursor:pointer}",
      "#wallet-panel{display:none;position:absolute;top:48px;left:8px;width:min(300px,calc(100% - 16px));max-height:55%;overflow:auto;z-index:20;background:rgba(14,22,12,0.94);border:1px solid rgba(232,195,106,0.3);border-radius:14px;padding:10px 12px 12px;color:#f4ead4}",
      "#wallet-panel.open{display:block}",
      "#wallet-panel .bal{font-size:20px;color:#e8c36a;margin:4px 0 6px}",
      "#wallet-panel .note{font-size:11px;opacity:.8;margin:0 0 10px}",
      "#wallet-panel .ghost[disabled]{opacity:.45}",
      "#wallet-history{list-style:none;margin:0;padding:0;font-size:12px}",
      "#wallet-history li{margin-bottom:6px}",
      "#wallet-history .up{color:#8fd18f}",
      "#wallet-history .dn{color:#e08a72}"
    ].join("");
    document.head.appendChild(style);
    var pan = document.createElement("div");
    pan.id = "wallet-panel";
    pan.setAttribute("aria-hidden", "true");
    pan.innerHTML = '<h3>Wallet</h3><div class="bal" id="wallet-bal">\u26a1 0 sats</div><p class="note">In-game / virtual sats. No real Bitcoin. ZBD send comes later.</p><button type="button" class="ghost" id="wallet-send" disabled>Send sats (ZBD later)</button><h3 style="margin-top:12px">Sat ledger</h3><ul id="wallet-history"></ul><button type="button" class="ghost" id="wallet-close">Close</button>';
    var wrap = document.getElementById("field-wrap") || document.getElementById("app") || document.body;
    wrap.appendChild(pan);
    var pill = document.getElementById("stat-sats");
    if (pill) {
      pill.setAttribute("role", "button");
      pill.addEventListener("click", function (ev) {
        ev.stopPropagation();
        openWallet();
      });
    }
    document.getElementById("wallet-close").addEventListener("click", function (ev) {
      ev.stopPropagation();
      pan.classList.remove("open");
      pan.setAttribute("aria-hidden", "true");
    });
    document.addEventListener("pointerdown", function (ev) {
      if (!pan.classList.contains("open")) return;
      if (ev.target.closest("#wallet-panel, #stat-sats")) return;
      pan.classList.remove("open");
      pan.setAttribute("aria-hidden", "true");
    });
  });
})();
