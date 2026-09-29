window.FF = {
  starterSats: 30,
  pack30Bonus: 20,
  wellMs: 4000,
  cornGrowMs: 20000,
  carrotGrowMs: 30000,
  cowMs: 25000,
  chickenMs: 15000,
  horseMs: 20000,
  wellMax: 10,
  canPerWell: 20,
  siloBase: 50,
  siloMaxUpgrades: 3,
  cowFeed: { corn: 5, water: 3, milk: 3 },
  chickenFeed: { corn: 2, water: 1, eggs: 2 },
  horseFeed: { carrots: 3, water: 2, hair: 2 },
  pudding: { milk: 4, eggs: 3, sellSats: 2 },
  prices: {
    well: 15,
    plot: 10,
    cow: 5,
    chicken: 3,
    horse: 8,
    expandBase: 20,
    silo: 25,
    siloUpgrade: 20
  },
  sell: {
    milk: { qty: 5, sats: 1 },
    water: { qty: 50, sats: 1 },
    eggs: { qty: 8, sats: 1 },
    hair: { qty: 1, sats: 2 },
    carrots: { qty: 10, sats: 1 },
    corn: { qty: 40, sats: 1 }
  },
  buy: {
    water: { sats: 1, qty: 25 },
    carrotSeeds: { sats: 1, qty: 5 },
    cornSeeds: { sats: 1, qty: 10 }
  },
  updates: [
    "Sep 29 \u2014 Animals tab: cow (not extra cow).",
    "Sep 29 \u2014 Market Assets: Animals and Structures.",
    "Sep 29 \u2014 Horse shed and chicken coop appear when you buy the first animal.",
    "Sep 29 \u2014 Carrot seeds 5 for 1 sat. Horse 8 sats. 1 hair \u2192 2 sats."
  ]
};

(function () {
  function relabel() {
    var silo = document.getElementById("buy-silo");
    if (silo) {
      var row = silo.closest(".row");
      var span = row && row.querySelector("span");
      if (span) span.textContent = window.FF.prices.silo + " \u26A1 sats \u2192 grain silo";
    }
    var corn = document.getElementById("buy-corn-seeds");
    if (corn) {
      var row = corn.closest(".row");
      var span = row && row.querySelector("span");
      if (span) span.textContent = "1 \u26A1 sat \u2192 " + window.FF.buy.cornSeeds.qty + " \uD83C\uDF3D seeds";
    }
    var carrot = document.getElementById("buy-carrot-seeds");
    if (carrot) {
      var row = carrot.closest(".row");
      var span = row && row.querySelector("span");
      if (span) span.textContent = "1 \u26A1 sat \u2192 " + window.FF.buy.carrotSeeds.qty + " \uD83C\uDF51 seeds";
    }
    var cow = document.getElementById("buy-cow");
    if (cow) {
      var row = cow.closest(".row");
      var span = row && row.querySelector("span");
      if (span) span.textContent = window.FF.prices.cow + " \u26A1 sats \u2192 cow";
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", relabel);
  else relabel();
  setTimeout(relabel, 50);
})();
