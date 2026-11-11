# Changelog

Versions ship to `beta/` first. "Live" is the root (`/`, `/admin/`).

| Version | Date | What changed |
|---|---|---|
| **2.24.2** | 11 Nov | Sign-in: 4 wrong tries lock the name for 15 minutes (was 5); the error shows "1/4", "2/4", "3/4" in both apps (the Boss app showed a raw "{m}"). Database `login_fail` changed, see `2026-11-11_v2.24.2_login_4_tries.sql` |
| **2.24.1 live** | 11 Nov | Promote (branch `v2.24-promote`): `beta/` copied to the root, so `niagize.tz/` runs v2.24.1 on the live database. Root `shared/config.js` kept, `noindex` removed from the shop page (Boss app stays out of search), cache `winga-full-v43`, `og:image` on `niagize.tz` |
| **2.24.1** | 11 Nov | Kapu and Mimi: picking a category in the product row now shows its sub-categories underneath (same as the home filter), and tapping one filters the products |
| **2.24** | 11 Nov | Final polish (branch `v2.24-final-polish`): Hifadhi mark small and bottom-right on cards; new products get a gold frame (no label); **Weka kapuni** gold with black glyph on every screen, Agiza chap in ink; tab **Aina**; share = icon + "Share"; gold how-to bulb, guide opens for first-time visitors and now swipes as well as Endelea; yellow delivery-cost note before Tuma oda; payment list = what the winga offers (no banks); "Piga picha" camera input; order confirmation no longer forces WhatsApp (optional button); Boss order header shows the Mara badge on top; `niagize.tz` printed on shared cards |
| **2.23** | 11 Nov | Customer polish (branch `v2.23-customer-polish`): forgotten orders are dropped from the phone when the server no longer has them (NK-XDF6K); calmer copy ("Tumepokea, tunakurudia chap", login error with count, empty basket); product buttons **Tuulize / Tia kapuni (gold cart) / Agiza chap →**; "Cheki na hizi"; gold active tab; Mwonekano moved into settings (gear now on the guest profile too); **back swipe** closes sheets one level at a time; **Hifadhi** (save for later): on the phone for guests, synced for accounts (needs `2026-11-11_v2.23_favorites.sql`); light-theme street-grid backdrop; payment badges with the operators' logos supplied by Super Admin (Mixx by Yas, M-Pesa, Airtel Money, HaloPesa, Selcom in `beta/img/pay/`); Supabase library bundled in the repo and cached by the service worker (a slow network can no longer fall back to the demo shop); robots, sitemap, llms.txt, structured data; CI, PR template, ROADMAP, RELEASE |
| **2.22** | 10 Nov | Design polish (on `beta/`, branch `v2.22-polish`): buttons in three heights (48 / 40 / 36), all pills; hover, press, focus and disabled states; motion tokens (4 durations, 1 curve), sheets rise from the edge; visible field edges and focus ring; WhatsApp buttons neutral with a green glyph; link and status contrast fixed; Boss profile photo fixed; tab mark; no tinted boxes left. **Mzigo wa leo**: what came in today shows as one drop on the shop home (count, orders, Leo tag, share), borrowed from Crafd and Whatnot |
| **2.21** | 29 Oct | Dev environment: beta runs on `winga-dev` (full copy of live), DEV tag. Live cleared for the pilot (test orders and products removed). Domain move to niagize.tz prepared (branch `domain-move-v2`) |
| **2.20** | 29 Oct | Boss orders in three tabs by whose move it is; one search for order, name or phone; next step on every card. Open orders on Mimi with Lipa sasa / Nimepokea. Invoice picture first, payment numbers on one card. **Ongeza** button. Phone asked from every buyer without one. Unique order links for WhatsApp previews |
| **2.19** | 29 Oct | Order actions need proof of ownership (team, signed-in owner, or the order's WhatsApp number; lock after 5 wrong tries). Server refuses an invoice without number and place |
| **2.18** | 29 Oct | No "Nakurudia" step. "Fungua WhatsApp tena" retry after every hand-off. Payment channel list. Thank-you card after Nimepokea (stars optional). Track oda rebuilt |
| **2.17** | 29 Oct | Mini-pilot feedback: invoice opens the customer's own chat, branded invoice and thank-you cards, offline page, live field hints |
| **2.16** | 28 Oct | Audit fixes on the order path, colour tokens, calm motion, design skills vendored |
| **2.15** | 27 Oct | Calm pass: locked palette, one card / tag / button size, Feather icons |
| **2.10–2.14** | 27 Oct | Ganji (hidden margin) per order and product, 3D category icons, top customers, real-phone feedback R01–R52 |
| **2.4–2.6** | 21 Oct | Onest font, instant open, square photos, demo shop, similar products |
| **2.1–2.3** | 19–21 Oct | Striped-sun brand, order alerts (Web Push), WhatsApp hand-off page, team briefs, photo crop |
| **2.0** | 18 Oct | Orders in the app (NK-XXXXX), customer accounts, Boss dashboard, categories. **Currently live** |
| **1.2** | 18 Oct | Archive after 60 days, assistants, Selcom-style UI |
| **0.1** | 17 Oct | Winga Pocket (`/pocket/`) |
