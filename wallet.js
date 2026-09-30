(function bootWallet() {
  var SAVE = "first-field-v1";
  var LEDGER = "first-field-ledger";
  var lastSats = null;
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function readSave() {
    try { return JSON.parse(localStorage.getItem(SAVE) || "{}"); } catch (e) { return {}; }
  }
  function readLedger() {
    try {
      var rows = JSON.parse(localStorage.getItem(LEDGER) || "[]");
      return Array.isArray(rows) ? rows : [];
    } catch (e) { return []; }
  }
  function fill() {
    var save = readSave();
    var sats = typeof save.sats === "number" ? save.sats : 0;
    var pill = document.getElementById("stat-sats");
    if (pill && /sats/.test(pill.textContent || "")) {
      var live = pill.textContent.replace(/[^\d-]/g, "");
      if (live !== "") sats = Number(live) || sats;
    }
    var bal = document.getElementById("wallet-bal");
    if (bal) bal.textContent = "\u26a1 " + sats + " sats";
    var ul = document.getElementById("wallet-history");
    if (!ul) return;
    var rows = readLedger();
    if (!rows.length && Array.isArray(save.marketLog)) rows = save.marketLog.slice(0, 20).map(function (r) {
      return { at: r.at, text: r.text || "", delta: 0 };
    });
    if (!rows.length) { ul.innerHTML = "<li>No sat moves yet.</li>"; return; }
    ul.innerHTML = rows.map(function (r) {
      var t = new Date(r.at || Date.now()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      var sign = r.delta > 0 ? "<b class=\"up\">+" + r.delta + "</b> " : r.delta < 0 ? "<b class=\"dn\">" + r.delta + "</b> " : "";
      return "<li>" + t + " \u2014 " + sign + (r.text || "") + "</li>";
    }).join("");
  }
  function openWallet() {
    var pan = document.getElementById("wallet-panel");
    if (!pan) return;
    var on = pan.classList.contains("open");
    pan.classList.toggle("open", !on);
    if (!on) fill();
  }
  ready(function () {
    if (document.getElementById("wallet-panel")) return;
    var style = document.createElement("style");
    style.textContent = "#stat-sats{cursor:pointer}#wallet-panel{display:none;position:absolute;top:48px;left:8px;width:min(300px,calc(100% - 16px));max-height:55%;overflow:auto;z-index:20;background:rgba(14,22,12,0.94);border:1px solid rgba(232,195,106,0.3);border-radius:14px;padding:10px 12px;color:#f4ead4}#wallet-panel.open{display:block}#wallet-panel .bal{font-size:20px;color:#e8c36a}#wallet-history{list-style:none;margin:0;padding:0;font-size:12px}#wallet-history .up{color:#8fd18f}#wallet-history .dn{color:#e08a72}";
    document.head.appendChild(style);
    var pan = document.createElement("div");
    pan.id = "wallet-panel";
    pan.innerHTML = '<h3>Wallet</h3><div class="bal" id="wallet-bal">\u26a1 0 sats</div><p class="note">In-game / virtual sats. ZBD later.</p><button type="button" class="ghost" id="wallet-send" disabled>Send sats (ZBD later)</button><h3>Sat ledger</h3><ul id="wallet-history"></ul><button type="button" class="ghost" id="wallet-close">Close</button>';
    (document.getElementById("field-wrap") || document.body).appendChild(pan);
    var pill = document.getElementById("stat-sats");
    if (pill) pill.addEventListener("click", function (ev) { ev.stopPropagation(); openWallet(); });
    document.getElementById("wallet-close").onclick = function () { pan.classList.remove("open"); };
    document.addEventListener("pointerdown", function (ev) {
      if (!pan.classList.contains("open")) return;
      if (ev.target.closest("#wallet-panel, #stat-sats")) return;
      pan.classList.remove("open");
    });
  });
})();
