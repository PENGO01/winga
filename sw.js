/* Winga service worker: app shell offline (network first, cache fallback). Data and photos come from Supabase. */
const SHELL = "winga-full-v21";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./shared/style.css", "./shared/core.js", "./shared/config.js",
  "./admin/", "./admin/index.html", "./admin/manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-boss-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith("winga-full") && x !== SHELL).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
/* product photos never change (each upload gets a new name), so keep them on the phone: instant on scroll and back */
const IMG = "wimg-v1", IMG_MAX = 400;
function trimImg() { caches.open(IMG).then(c => c.keys().then(k => { if (k.length > IMG_MAX) return Promise.all(k.slice(0, k.length - IMG_MAX).map(r => c.delete(r))); })); }
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method === "GET" && u.pathname.includes("/storage/v1/object/public/products/")) {
    e.respondWith(caches.open(IMG).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === "opaque") { c.put(e.request, r.clone()); trimImg(); } return r; }))));
    return;
  }
  if (e.request.method !== "GET" || u.origin !== location.origin || u.pathname.includes("/pocket/")) return;
  /* instant open: the app files saved at install answer at once; a new version installs in the background
     (every release renames SHELL) and is used from the next open */
  const shell = e.request.mode === "navigate" || FILES.some(f => new URL(f, self.registration.scope).pathname === u.pathname);
  if (shell && !u.search.includes("demo")) {
    e.respondWith(caches.open(SHELL).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => c.match("./index.html")))));
    return;
  }
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(SHELL).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});

/* order alerts: show the push, and a tap opens that order in the app (focusing it if it's already open) */
self.addEventListener("push", e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  const icon = new URL("icon-boss-192.png", self.registration.scope).href;
  e.waitUntil(self.registration.showNotification(d.title || "Niagize", { body: d.body || "", tag: d.tag || "niagize", renotify: true, icon, badge: icon, data: { url: d.url || new URL("admin/", self.registration.scope).href } }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || new URL("admin/", self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    const app = list.find(c => c.url.includes("/admin/"));
    if (app) { app.postMessage({ type: "open", url }); return app.focus(); }
    return clients.openWindow(url);
  }));
});
