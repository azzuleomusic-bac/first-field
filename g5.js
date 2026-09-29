    window.addEventListener("beforeunload", save);
    setInterval(save, 5000);

    load();
    layout();
    last = now();
    render();
    requestAnimationFrame(loop);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    }
  })();
