# Roadmap

Order of work follows the NFX rule: **metrics 50%, onboarding 40%, features 10%.** Move a line to *Done* with its version when it ships.

## Now (beta, v2.23)
- Save for later ("Hifadhi"): on-phone for guests, synced for accounts (run `supabase/migrations/2026-11-11_v2.23_favorites.sql` on dev)
- Back swipe, calmer copy, gold "you are here" tab, settings in one place
- Search visibility: robots, sitemap, structured data, llms.txt (see `docs/SEO.md`)

## Next
- P-060: ship the Supabase library inside the repo so a slow network never shows the demo shop
- Per-product pages that search engines can read (build step writes `/p/<id>.html` + sitemap)
- Official operator logos in `beta/img/pay/` (from each operator's merchant kit)
- Price-drop alert for saved items (trigger `products_price_drop` already exists)
- Promote beta to root (steps in `docs/RELEASE.md`)

## Later
- Boss view: saves per product (`favorite_counts()`), best metric for what to restock
- Order-status push for customers

## Done
- v2.22: design polish, "Mzigo wa leo"
