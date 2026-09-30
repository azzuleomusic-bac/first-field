/* 2026-09-30-phone-fit */
(function fitSheets() {
  var css =
    "footer{max-height:min(42vh,280px);overflow-y:auto;-webkit-overflow-scrolling:touch}" +
    "#market-panel,#shed-panel,#log-panel,#craft-panel,#barn-panel,#silo-panel,#worth-panel,#mine-panel,#forest-panel{" +
    "max-height:calc(100svh - var(--safe-top) - var(--safe-bot) - 168px);overflow-y:auto;-webkit-overflow-scrolling:touch}" +
    "#forest-panel .sheet-card,#gear-pick .gear-pick-card{" +
    "max-height:calc(100svh - var(--safe-top) - var(--safe-bot) - 24px);overflow-y:auto;-webkit-overflow-scrolling:touch}" +
    "@media (max-height:620px){footer{max-height:min(34vh,220px)}" +
    "#market-panel,#shed-panel,#log-panel,#craft-panel,#barn-panel,#silo-panel,#worth-panel,#mine-panel,#forest-panel{" +
    "max-height:calc(100svh - var(--safe-top) - var(--safe-bot) - 132px)}}";
  var s = document.createElement("style");
  s.setAttribute("data-fit", "phone");
  s.textContent = css;
  (document.head || document.documentElement).appendChild(s);
})();

window.FF = {
  updates: [
    "Sep 30 \u2014 Small phones: Market / Craft / Mine / Forest / Barn scroll inside the window. Farm layout unchanged.",
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
