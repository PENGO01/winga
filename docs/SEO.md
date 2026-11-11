# Being found: Google, Bing and AI answers (niagize.tz)

**Why searching "niagize.tz" shows nothing:** a new domain is unknown to Google until you tell it, the beta is `noindex`, and the shop is one JavaScript page with `#p-id` links that search engines treat as the same URL. Fix in this order.

## Do now (about 30 minutes, free)
1. **Google Search Console** → add property `niagize.tz` (DNS TXT check) → submit `https://niagize.tz/sitemap.xml` → "Request indexing" for the home page.
2. **Bing Webmaster Tools** → import from Search Console. Bing also feeds several AI assistants.
3. **Google Business Profile**: create "Niagize Kariakoo" (online store / service area Dar es Salaam). This is what wins the brand search.
4. Put `https://niagize.tz` in every WhatsApp status, Instagram and TikTok bio. Real links from real accounts are the strongest signal for a new site.
5. At promote time remove `noindex` (meta tag in `index.html`; the `_headers` rule only covers `/beta/*`).

Already in the repo: `robots.txt`, `sitemap.xml`, `llms.txt`, canonical + hreflang + `WebSite`/`Store` structured data in `beta/index.html`.

## Next build (biggest gain)
Per-product pages: a small script reads active products (Supabase REST, anon key) and writes `/p/<id>.html` with the name, price (TSh), photo, `Product` + `Offer` JSON-LD and an "Agiza" button back into the app, plus one `<url>` each in `sitemap.xml`. Until then Google sees one page.

## AI answer engines (AIO)
- `llms.txt` and open `robots.txt` rules for GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot are in place.
- Write plain facts once, in text (not only images): what you sell, where, how to pay, delivery area, prices. Assistants quote text.
- Keep name, address and phone identical on the site, Google Business Profile and social pages.

## PWA speed with no big server (2026 checklist)
| Area | Do |
|---|---|
| Caching | Service worker: cache-first for the app shell and images, stale-while-revalidate for product JSON, network-first for orders. Bump the cache name each release. |
| First paint | Inline critical CSS (already), `<link rel="preconnect">` to the Supabase host and image host, `fetchpriority="high"` on the first product image, `loading="lazy"` on the rest. |
| Images | Serve small thumbs in lists (400px, done) and 1080px only on the product page; WebP/AVIF; always `width`/`height` (done) to stop layout jumps. |
| Fonts | Self-host, subset to Latin, `font-display: swap`, preload the one body weight. |
| JavaScript | Ship the Supabase library from the repo (P-060), load Fuse search only when the search box is first focused, no frameworks. |
| Rendering | `content-visibility: auto` on long lists, `aspect-ratio` on cards, animate only `transform`/`opacity`. |
| Data | Ask Supabase for needed columns only, paginate, cache the list in `localStorage` and refresh quietly (done for orders). Respect `navigator.connection.saveData`. |
| Offline | Cached shop opens offline with "Jaribu tena" (never the demo). |
| Measure | Lighthouse on a mid-range Android profile (slow 4G), target LCP < 2.5 s, CLS < 0.1, INP < 200 ms. Use PageSpeed Insights on the real URL. |
| Free tier | Cloudflare Pages or GitHub Pages for static files, Supabase free tier for data; Cloudflare in front gives caching and HTTP/3 at no cost. |
