/* Winga service worker: app shell offline (network first, cache fallback). Data and photos come from Supabase. */
const SHELL = "winga-full-v5";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./shared/style.css", "./shared/core.js", "./shared/config.js",
  "./admin/", "./admin/index.html", "./admin/manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-boss-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith("winga-full") && x !== SHELL).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin || u.pathname.includes("/pocket/")) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(SHELL).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
