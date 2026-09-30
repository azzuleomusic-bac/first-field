/* 2026-09-30-apple-tree */
window.FF = window.FF || {};
window.FF.updates = [
  "Sep 30 \u2014 Apple tree: 5 sats in Assets \u2192 Farming. 5 water, 20s, 3 apples. Auto waters and harvests.",
  "Sep 30 \u2014 Harvest pops \ud83c\udf4e +3 (same float on water, corn, milk, eggs, wool, hair).",
  "Sep 30 \u2014 Farm grid: hold to move shows cells. Plot/tree/well 2\u00d72, silo 2\u00d73, barns 3\u00d73. Snap on drop.",
  "Sep 30 \u2014 Clean farm packs on the grid. No room on buy offers clean first, then expand.",
  "Sep 30 \u2014 Empty plots: dark raked topsoil, not flat brown.",
  "Sep 30 \u2014 Well is wider (less bottle-shaped). Full well stays bright, no pulse.",
  "Sep 30 \u2014 Farm grass is mottled turf with grain.",
  "Sep 30 \u2014 Test: wells fill at 2 seconds per water."
];
window.FF.starterSats = 30;
window.FF.pack30Bonus = 20;
window.FF.wellMs = 2000;
window.FF.cornGrowMs = 20000;
window.FF.carrotGrowMs = 30000;
window.FF.cowMs = 25000;
window.FF.chickenMs = 15000;
window.FF.wellMax = 10;
window.FF.canPerWell = 30;
window.FF.cowFeed = { corn: 5, water: 3, milk: 3 };
window.FF.chickenFeed = { corn: 2, water: 1, eggs: 2 };
window.FF.pudding = { milk: 4, eggs: 3, sellSats: 2 };
window.FF.prices = { well: 15, plot: 10, cow: 5, chicken: 3, expandBase: 20 };
window.FF.sell = {
  milk: { qty: 5, sats: 1 },
  water: { qty: 50, sats: 1 },
  eggs: { qty: 8, sats: 1 },
  carrots: { qty: 10, sats: 1 },
  corn: { qty: 40, sats: 1 }
};
window.FF.buy = {
  water: { sats: 1, qty: 25 },
  carrotSeeds: { sats: 1, qty: 10 },
  cornSeeds: { sats: 1, qty: 20 }
};
