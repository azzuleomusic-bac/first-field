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

(function applyLayout() {
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  ready(function () {
    var stats = document.querySelector(".stats");
    if (stats && !document.getElementById("stat-water")) {
      var w = document.createElement("div");
      w.className = "pill water";
      w.id = "stat-water";
      w.textContent = "\uD83D\uDCA7 0/30";
      stats.insertBefore(w, stats.firstChild);
    }
    var barn = document.getElementById("tool-barn");
    var craft = document.getElementById("tool-craft");
    var market = document.getElementById("tool-sell");
    var farm = document.getElementById("mode-farm");
    if (barn && craft && market && farm) {
      var row1 = market.parentElement;
      var row2 = farm.parentElement;
      if (row1 && row2) {
        row1.innerHTML = "";
        row1.appendChild(craft);
        row1.appendChild(market);
        row2.innerHTML = "";
        row2.appendChild(farm);
        row2.appendChild(barn);
      }
    }
  });
})();
