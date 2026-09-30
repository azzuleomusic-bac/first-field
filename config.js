(function loadExtra(){
  ["dive.js","wallet.js","camp.js"].forEach(function(src){
    if (document.querySelector('script[data-src="'+src+'"]')) return;
    var s=document.createElement("script");
    s.src=src;
    s.setAttribute("data-src",src);
    (document.head||document.documentElement).appendChild(s);
  });
})();

window.FF = {
  updates: [
    "Sep 30 \u2014 Kitchen ration (2 corn + 1 milk) speeds the next mine or forest run. Hide boots cut tool wear.",
    "Sep 30 \u2014 Mine: Shallow / Deep / Sealed. Forest: Trail / Thicket / Dark wood. Gear opens doors.",
    "Sep 30 \u2014 Deep ore and dark hide: sell for sats or craft iron pick / hide wrap. Tools wear; repair at Craft.",
    "Sep 30 \u2014 Empty plots: dark raked topsoil, not flat brown.",
    "Sep 30 \u2014 Well is wider (less bottle-shaped). Full well stays bright, no pulse.",
    "Sep 30 \u2014 Farm grass is mottled turf with grain.",
    "Sep 30 \u2014 Test: wells fill at 2 seconds per water.",
    "Sep 30 \u2014 Tap the sats pill for the in-game wallet + trade log."
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
  prices: { well: 15, plot: 10, cow: 5, chicken: 3, expandBase: 20 },
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
