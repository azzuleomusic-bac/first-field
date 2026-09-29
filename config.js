window.FF = {
  starterSats: 30,
  pack30Bonus: 20,
  wellMs: 4000,
  cornGrowMs: 20000,
  carrotGrowMs: 30000,
  cowMs: 25000,
  chickenMs: 15000,
  horseMs: 20000,
  sheepMs: 22000,
  wellMax: 10,
  canPerWell: 20,
  siloBase: 50,
  siloMaxUpgrades: 3,
  cowFeed: { corn: 6, water: 4, milk: 3 },
  chickenFeed: { corn: 2, water: 1, eggs: 2 },
  horseFeed: { carrots: 3, water: 4, hair: 2 },
  sheepFeed: { corn: 3, water: 2, wool: 3 },
  pudding: { milk: 4, eggs: 3, sellSats: 2 },
  prices: {
    well: 15,
    plot: 10,
    cow: 7,
    chicken: 3,
    horse: 8,
    sheep: 4,
    expandBase: 20,
    silo: 25,
    siloUpgrade: 20
  },
  sell: {
    milk: { qty: 5, sats: 1 },
    water: { qty: 50, sats: 1 },
    eggs: { qty: 8, sats: 1 },
    hair: { qty: 1, sats: 2 },
    wool: { qty: 4, sats: 1 },
    carrots: { qty: 10, sats: 1 },
    corn: { qty: 40, sats: 1 }
  },
  buy: {
    water: { sats: 1, qty: 25 },
    carrotSeeds: { sats: 1, qty: 5 },
    cornSeeds: { sats: 1, qty: 10 }
  },
  updates: [
    "Sep 29 \u2014 Sheep 4 sats. Cow 7 sats. 4 wool \u2192 1 sat.",
    "Sep 29 \u2014 Cow feed 6 corn + 4 water. Horse 3 carrots + 4 water.",
    "Sep 29 \u2014 Animals listed expensive first."
  ]
};

(function () {
  function relabel() {
    function row(id, text) {
      var btn = document.getElementById(id);
      if (!btn) return;
      var span = btn.closest(".row") && btn.closest(".row").querySelector("span");
      if (span) span.textContent = text;
    }
    row("buy-silo", window.FF.prices.silo + " \u26A1 sats \u2192 grain silo");
    row("buy-cow", window.FF.prices.cow + " \u26A1 sats \u2192 cow");
    row("buy-sheep", window.FF.prices.sheep + " \u26A1 sats \u2192 sheep");
    row("buy-horse", window.FF.prices.horse + " \u26A1 sats \u2192 horse");
    row("buy-chicken", window.FF.prices.chicken + " \u26A1 sats \u2192 chicken");
    row("buy-corn-seeds", "1 \u26A1 sat \u2192 " + window.FF.buy.cornSeeds.qty + " \uD83C\uDF3D seeds");
    row("buy-carrot-seeds", "1 \u26A1 sat \u2192 " + window.FF.buy.carrotSeeds.qty + " \uD83C\uDF51 seeds");
    row("sell-wool", window.FF.sell.wool.qty + " \uD83E\uDDF6 wool \u2192 " + window.FF.sell.wool.sats + " \u26A1 sat");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", relabel);
  else relabel();
  setTimeout(relabel, 50);
})();
