(function campCook() {
  var KEY = "first-field-dive";
  var SAVE = "first-field-v1";
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function dive() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveD(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }
  function farm() {
    try { return JSON.parse(localStorage.getItem(SAVE) || "{}"); } catch (e) { return {}; }
  }
  function saveF(s) {
    try { localStorage.setItem(SAVE, JSON.stringify(s)); } catch (e) {}
  }
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }
  function paint(d) {
    var n = document.getElementById("camp-ration-n");
    if (n) n.textContent = "Rations " + (d.rations || 0) + (d.boots ? " \u00b7 hide boots" : "");
  }
  ready(function () {
    var d = dive();
    if (typeof d.rations !== "number") d.rations = 0;
    if (typeof d.boots !== "boolean") d.boots = false;
    saveD(d);

    var kitchen = document.getElementById("csec-kitchen");
    if (kitchen && !document.getElementById("craft-ration")) {
      var row = document.createElement("div");
      row.className = "row";
      row.innerHTML = '<span>2 corn + 1 milk \u2192 1 ration (next dive faster)</span><button type="button" id="craft-ration">Cook ration</button>';
      kitchen.appendChild(row);
      var meta = document.createElement("p");
      meta.id = "camp-ration-n";
      meta.style.cssText = "font-size:11px;opacity:.8";
      kitchen.appendChild(meta);
    }
    var weapons = document.getElementById("csec-weapons");
    if (weapons && !document.getElementById("craft-boots")) {
      var b = document.createElement("div");
      b.className = "row";
      b.innerHTML = '<span>5 dark hide + 2 lumber \u2192 hide boots (hard dives wear tools less)</span><button type="button" id="craft-boots">Make hide boots</button>';
      weapons.appendChild(b);
    }
    paint(d);

    var cr = document.getElementById("craft-ration");
    if (cr) cr.onclick = function () {
      var s = farm();
      if ((s.corn || 0) < 2 || (s.milk || 0) < 1) { toast("Need 2 corn + 1 milk"); return; }
      s.corn -= 2; s.milk -= 1; saveF(s);
      d = dive(); d.rations = (d.rations || 0) + 1; saveD(d); paint(d);
      toast("Ration packed. Next dive is quicker.");
    };
    var cb = document.getElementById("craft-boots");
    if (cb) cb.onclick = function () {
      d = dive();
      if (d.boots) { toast("Already wearing hide boots"); return; }
      if ((d.darkHide || 0) < 5) { toast("Need 5 dark hide"); return; }
      var s = farm();
      if ((s.lumber || 0) < 2) { toast("Need 2 lumber"); return; }
      s.lumber -= 2; saveF(s);
      d.darkHide -= 5; d.boots = true; saveD(d); paint(d);
      toast("Hide boots on. Tools last longer in hard zones.");
    };

    function eatRation() {
      d = dive();
      if ((d.rations || 0) < 1 || !window.FF) return;
      d.rations -= 1;
      saveD(d);
      paint(d);
      FF.mineMs = Math.round((FF.mineMs || 5000) * 0.7);
      FF.forestMs = Math.round((FF.forestMs || 5000) * 0.7);
      toast("Ration used — this run is faster.");
    }
    function maybeSkipWear(el, zoneOk) {
      if (!el) return;
      el.addEventListener("click", function () {
        d = dive();
        if (d.boots && zoneOk() && Math.random() < 0.5) {
          d.pickDur = Math.min(20, (d.pickDur || 0) + 1);
          d.axeDur = Math.min(20, (d.axeDur || 0) + 1);
          saveD(d);
        }
        eatRation();
      }, true);
    }
    maybeSkipWear(document.getElementById("btn-mine"), function () {
      return (dive().mineZone || "shallow") !== "shallow";
    });
    maybeSkipWear(document.getElementById("btn-forest"), function () {
      return (dive().forestZone || "trail") !== "trail";
    });
  });
})();
