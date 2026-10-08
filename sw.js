self.addEventListener("install", (e) => {
  e.waitUntil(caches.open("first-field-v6").then((c) => c.addAll(["/", "/index.html", "/manifest.json"])));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open("first-field-v6").then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match("/")))
  );
});
