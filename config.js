/* 2026-09-30-phone-fit-2 */
(function fitSheets() {
  var css =
    "#market-panel,#craft-panel,#barn-panel,#silo-panel,#worth-panel,#shed-panel,#log-panel{" +
    "position:fixed!important;left:50%!important;transform:translateX(-50%)!important;" +
    "top:calc(var(--safe-top) + 58px)!important;" +
    "bottom:calc(var(--safe-bot) + 200px)!important;" +
    "max-height:none!important;height:auto!important;" +
    "overflow-y:auto!important;-webkit-overflow-scrolling:touch!important}" +
    "#mine-panel,#forest-panel{" +
    "position:fixed!important;left:50%!important;transform:translateX(-50%)!important;" +
    "top:calc(var(--safe-top) + 58px)!important;" +
    "bottom:calc(var(--safe-bot) + 16px)!important;" +
    "max-height:none!important}" +
    "#market-history{max-height:none}" +
    "@media (max-height:700px){" +
    "#market-panel,#craft-panel,#barn-panel,#silo-panel,#worth-panel,#shed-panel,#log-panel{" +
    "top:calc(var(--safe-top) + 50px)!important;bottom:calc(var(--safe-bot) + 176px)!important}" +
    "}";
  var s = document.createElement("style");
  s.setAttribute("data-fit", "phone");
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
})();

window.FF = {
  updates: [
    "Sep 30 \u2014 Small phones: Market sits between the header and the buttons. Scroll inside the window.",
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
