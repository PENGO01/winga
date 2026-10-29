/* Winga service worker: app shell offline (network first, cache fallback). Data and photos come from Supabase. */
const SHELL = "winga-beta-v37";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./shared/style.css", "./shared/core.js", "./shared/config.js",
  "./admin/", "./admin/index.html", "./admin/manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-boss-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith("winga-beta") && x !== SHELL).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
/* product photos never change (each upload gets a new name), so keep them on the phone: instant on scroll and back */
const IMG = "wimg-v1", IMG_MAX = 400;
function trimImg() { caches.open(IMG).then(c => c.keys().then(k => { if (k.length > IMG_MAX) return Promise.all(k.slice(0, k.length - IMG_MAX).map(r => c.delete(r))); })); }
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  /* product photos + the app's own pictures (category icons, how-to slides): keep on the phone, instant next time */
  if (e.request.method === "GET" && (u.pathname.includes("/storage/v1/object/public/products/") || (u.origin === location.origin && /\/(cat|how)\/[^/]+\.webp$/.test(u.pathname)))) {
    e.respondWith(caches.open(IMG).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === "opaque") { c.put(e.request, r.clone()); trimImg(); } return r; }))));
    return;
  }
  if (e.request.method !== "GET" || u.origin !== location.origin || u.pathname.includes("/pocket/")) return;
  /* instant open: the app files saved at install answer at once; a new version installs in the background
     (every release renames SHELL) and is used from the next open */
  const shell = e.request.mode === "navigate" || FILES.some(f => new URL(f, self.registration.scope).pathname === u.pathname);
  if (shell && !u.search.includes("demo")) {
    e.respondWith(caches.open(SHELL).then(c => c.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => c.match("./index.html").then(x => x || offline())))));
    return;
  }
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(SHELL).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});

/* v2.17: nothing cached and no network → a calm offline page, never a blank screen */
const OFFLINE = '<!doctype html><html lang="sw"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Niagize</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#121212;color:#F2F2F2;font:16px/1.45 system-ui,-apple-system,sans-serif;text-align:center;padding:24px}b{display:block;font-size:20px;margin:14px 0 6px}p{margin:0 0 18px;color:#A8A8A8}button{border:0;border-radius:999px;background:#FFC62D;color:#121212;font:600 15px system-ui;padding:13px 26px}</style></head><body><div><svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#FFC62D" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0"/><circle cx="12" cy="19" r="1"/><path d="M3 3l18 18"/></svg><b>Hakuna mtandao</b><p>Washa data au Wi-Fi, kisha jaribu tena.<br>No internet. Turn on data or Wi-Fi.</p><button onclick="location.reload()">Jaribu tena</button></div></body></html>';
function offline() { return new Response(OFFLINE, { headers: { "Content-Type": "text/html; charset=utf-8" } }); }

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
