/* Winga service worker: offline shell + receive photos shared from WhatsApp */
const SHELL = "winga-shell-v2";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("winga-shell") && k !== SHELL).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Share target: WhatsApp → Share → Winga
  if (e.request.method === "POST" && url.pathname.endsWith("/share")) {
    e.respondWith((async () => {
      try {
        const form = await e.request.formData();
        const files = form.getAll("media").filter(f => f && f.size);
        const cache = await caches.open("winga-share");
        if (files[0]) await cache.put("./_share/file0", new Response(files[0], { headers: { "content-type": files[0].type || "image/jpeg" } }));
        const meta = { title: form.get("title") || "", text: form.get("text") || "", url: form.get("url") || "", files: files.map(f => f.type) };
        await cache.put("./_share/meta", new Response(JSON.stringify(meta), { headers: { "content-type": "application/json" } }));
      } catch (err) {}
      return Response.redirect("./?share=1", 303);
    })());
    return;
  }
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  // App shell: network first (so updates arrive), cache fallback (so it works offline in Kariakoo)
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(SHELL).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
