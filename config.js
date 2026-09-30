window.FF = {
  updates: [
    "Sep 30 — Tap the sats pill for the in-game wallet + trade log.",
    "Sep 30 — Empty plots: dark raked topsoil, not flat brown.",
    "Sep 30 — Well is wider (less bottle-shaped). Full well stays bright, no pulse.",
    "Sep 30 — Farm grass is mottled turf with grain.",
    "Sep 30 — Test: wells fill at 2 seconds per water."
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
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function readSave() {
    try { return JSON.parse(localStorage.getItem("first-field-v1") || "{}"); }
    catch (e) { return {}; }
  }
  function fill() {
    const save = readSave();
    const sats = typeof save.sats === "number" ? save.sats : 0;
    const bal = document.getElementById("wallet-bal");
    if (bal) bal.textContent = "⚡ " + sats + " sats";
    const pill = document.getElementById("stat-sats");
    if (pill && /sats/.test(pill.textContent || "")) {
      const live = pill.textContent.replace(/[^\d-]/g, "");
      if (live !== "" && bal) bal.textContent = "⚡ " + live + " sats";
    }
    const ul = document.getElementById("wallet-history");
    if (!ul) return;
    const rows = Array.isArray(save.marketLog) ? save.marketLog.slice(0, 20) : [];
    if (!rows.length) {
      ul.innerHTML = "<li>No trades yet. Sell at the market to fill this log.</li>";
      return;
    }
    ul.innerHTML = rows.map(function (r) {
      const d = new Date(r.at || Date.now());
      const tstr = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      return "<li>" + tstr + " — " + (r.text || "") + "</li>";
    }).join("");
  }
  function openWallet() {
    const pan = document.getElementById("wallet-panel");
    if (!pan) return;
    const on = pan.classList.contains("open");
    pan.classList.toggle("open", !on);
    pan.setAttribute("aria-hidden", on ? "true" : "false");
    if (!on) fill();
  }
  ready(function () {
    if (document.getElementById("wallet-panel")) return;
    const style = document.createElement("style");
    style.textContent = [
      "#stat-sats{cursor:pointer}",
      "#wallet-panel{display:none;position:absolute;top:48px;left:8px;width:min(300px,calc(100% - 16px));max-height:55%;overflow:auto;z-index:20;background:rgba(14,22,12,0.94);border:1px solid rgba(232,195,106,0.3);border-radius:14px;padding:10px 12px 12px;color:#f4ead4}",
      "#wallet-panel.open{display:block}",
      "#wallet-panel .bal{font-size:20px;color:#e8c36a;margin:4px 0 6px}",
      "#wallet-panel .note{font-size:11px;opacity:.8;margin:0 0 10px}",
      "#wallet-panel .ghost[disabled]{opacity:.45}",
      "#wallet-history{list-style:none;margin:0;padding:0;font-size:12px}",
      "#wallet-history li{margin-bottom:6px}"
    ].join("");
    document.head.appendChild(style);
    const pan = document.createElement("div");
    pan.id = "wallet-panel";
    pan.setAttribute("aria-hidden", "true");
    pan.innerHTML = '<h3>Wallet</h3><div class="bal" id="wallet-bal">⚡ 0 sats</div><p class="note">In-game / virtual sats. No real Bitcoin. ZBD send comes later.</p><button type="button" class="ghost" id="wallet-send" disabled>Send sats (ZBD later)</button><h3 style="margin-top:12px">Recent trades</h3><ul id="wallet-history"></ul><button type="button" class="ghost" id="wallet-close">Close</button>';
    const wrap = document.getElementById("field-wrap") || document.getElementById("app") || document.body;
    wrap.appendChild(pan);
    const pill = document.getElementById("stat-sats");
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
