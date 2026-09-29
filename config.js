window.FF = {
  starterSats: 30,
  pack30Bonus: 20,
  wellMs: 4000,
  cornGrowMs: 20000,
  carrotGrowMs: 30000,
  cowMs: 25000,
  chickenMs: 15000,
  wellMax: 10,
  canPerWell: 30,
  siloBase: 50,
  siloMaxUpgrades: 3,
  cowFeed: { corn: 5, water: 3, milk: 3 },
  chickenFeed: { corn: 2, water: 1, eggs: 2 },
  pudding: { milk: 4, eggs: 3, sellSats: 2 },
  prices: {
    well: 15,
    plot: 10,
    cow: 5,
    chicken: 3,
    expandBase: 20,
    silo: 25,
    siloUpgrade: 20
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
    cornSeeds: { sats: 1, qty: 10 }
  }
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
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", relabel);
  else relabel();
  setTimeout(relabel, 50);
})();
