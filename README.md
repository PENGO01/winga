<p align="center">
  <img src="docs/banner.png" alt="Niagize Kariakoo: Bidhaa za Kariakoo, mlangoni kwako. One trusted winga, his whole market in one link." width="100%">
</p>

<p align="center">
  <a href="https://niagize.tz/"><b>Open the shop</b></a> ·
  <a href="https://niagize.tz/admin/">Boss app</a> ·
  <a href="#how-an-order-flows">How an order flows</a> ·
  <a href="#environments">Environments</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="LICENSE">MIT License</a>
</p>

<p align="center"><sub>Moving to <b>niagize.tz</b>. Until it is live, the same apps run at <a href="https://pengo01.github.io/winga/">pengo01.github.io/winga</a>.</sub></p>

---

## Why it exists

In Kariakoo, a **winga** is the person who knows which shop has the stock, what the real price is today, and who sells fakes. A good one sits in 200+ supplier WhatsApp groups and posts what he finds to his status. Customers see it, message him, bargain, pay, and a boda brings it.

It works. But it lives in WhatsApp status that disappears in 24 hours, in a phone gallery, and in his head. A customer can't browse. He can't see what sold. Nothing builds up.

**Niagize Kariakoo turns one trusted winga's status into a shop that stays.** Not a marketplace. One winga, his market, one link.

## What it does

<p align="center">
  <img src="docs/screens.png" alt="Six screens: the shop home, a product page, paying an order, Track oda on Mimi, the Boss dashboard and the Boss order list." width="100%">
</p>

| Side | Screen | What it does |
|---|---|---|
| Mteja | **Nyumbani** | New-in strip, category chips, two-column grid with price, stars and how many ordered. Fuzzy search ("kiatu" finds "viatu") |
| Mteja | **Bidhaa** | Square photos, price, description, similar items. **Chat nasi · Ongeza · Agiza sasa** |
| Mteja | **Kapu → Tuma oda** | Quantities, a note per item, Inaharaka / Utumwe Leo, delivery place, WhatsApp number. Creates order **NK-XXXXX** and opens the seller's WhatsApp with it |
| Mteja | **Oda** | Status timeline; after the invoice: the invoice picture, every payment number on one card, "Umeshalipa?" (channel, receipt, payer), Nimepokea + optional stars, thank-you card |
| Mteja | **Mimi** | Open orders with the next step (Lipa sasa / Nimepokea), Track oda, optional account, addresses, help |
| Boss | **Nyumbani** | Sales, orders, visitors, conversion, customer funnel, hidden Ganji (margin), top products, team briefs at 09:30 and 13:30 |
| Boss | **Oda** | Three tabs by whose move it is: **Mpya** (send the invoice) · **Inafanyiwa kazi** (invoice sent until delivered) · **Zimekamilika**. One search for order, name or phone |
| Boss | **Ongeza / Bidhaa** | Pick photos, square crop, category + sub-category, price, Ganji per product. Archive after 60 days |
| Boss | **Profile** | Shop settings (WhatsApp, payment numbers), categories, assistants, order alerts |

## How an order flows

```
 Mteja                         WhatsApp                          Boss app
 Kapu → Tuma oda ─────────────► "Oda NK-XXXXX" + link ──────────► Mpya: fee, place → Tuma invoice
 Oda page: invoice + pay card ◄─ invoice text (to his own chat) ◄─┘
 Umeshalipa? (receipt) ───────► "Nimelipia NK-XXXXX" ───────────► Hakiki malipo → Imelipwa
 Nimepokea (+ stars) ◄─────────  delivery details ◄─────────────── Tuma mzigo → Imekamilika
 Kadi ya asante pops ◄────────── thank-you link ◄──────────────────┘
```

Money never passes through the app: customers pay the winga's own mobile-money or bank numbers, the app records the receipt and the winga confirms it. Every WhatsApp hand-off leaves a "Fungua WhatsApp tena" bar, so a slow network is never a dead end.

## Use it

**Customers:** open the shop link and add it to the Home Screen.

**Boss (iPhone):**
1. Open the Boss app in **Safari**, tap **Share → Add to Home Screen**.
2. Open **Niagize** from the Home Screen and sign in (username + password; accounts come from the Super Admin).
3. Turn on order alerts from the Home card (iOS 16.4+, Home Screen app only).

> On iPhone, web apps can't receive "Share → app" from WhatsApp (WebKit limitation), so photos come from the gallery: in WhatsApp, hold a photo → **Save**, then **Ongeza picha**.

## Environments

| | Live | Dev |
|---|---|---|
| Web | `niagize.tz/` · `niagize.tz/admin/` | `niagize.tz/beta/` · `niagize.tz/beta/admin/` (**DEV** tag) |
| Database | Supabase `winga` | Supabase `winga-dev`, a full copy of live as of 29 Oct 2026 |
| Code | root files | `beta/` |

```
 branch ──► main ──► /beta/ on dev ──► test on phones ──► promote beta/ to the root (live)
 SQL ─────► winga-dev first ──► test ──► winga (live) ──► saved in supabase/migrations/
```

Details and rules: [`supabase/dev/README.md`](supabase/dev/README.md). The live root still runs **v2.0** until v2.21 is promoted.

## Principles

1. **Augment WhatsApp, never replace it.** It's where the winga and his customers live.
2. **One winga, not a marketplace.** His trust is the product.
3. **Protect his edge.** Suppliers, costs and Ganji are never shown to customers or assistants.
4. **Fresh or hidden.** Stale stock breaks trust; products archive after 60 days unless renewed.
5. **Don't hold money.** Payments happen outside the app. We record, we don't touch.
6. **Borrow the basics, innovate on go-to-market.** Shop grids and order flows are solved problems; reach and trust are not.

## Under the hood

| | |
|---|---|
| **Frontend** | Plain HTML + JavaScript PWAs, no build step. Hosted on Cloudflare (from `main`), GitHub Pages as fallback. Opens instantly from cache, works offline |
| **Backend** | Supabase: Postgres, Auth, Storage, Edge Functions (`account`, `team`, `notify`), pg_cron |
| **Security** | Row Level Security on every table; prices and totals come from the database; order actions need the team, the signed-in owner, or the WhatsApp number on the order (5 wrong tries lock it for 15 minutes) |
| **Alerts** | Web Push (VAPID, no third party): new orders, morning and afternoon briefs, critical warnings |
| **Photos** | Shrunk and square-cropped on the phone: 1080 px full, 400 px thumbnail |
| **Language** | Kiswahili first (short, M-Pesa style), English switch. Every word lives in one table in `shared/core.js` |
| **Design** | Locked system in [`DESIGN.md`](DESIGN.md): ink, one gold action per screen, cyan for "you are here", Onest, Feather icons |

```
index.html, admin/, shared/   live shop + Boss app (v2.0 until promoted)
beta/                         the version under test, on the dev database (v2.21)
  index.html                  shop
  admin/index.html, o.html    Boss app, WhatsApp order hand-off page
  shared/                     core.js (words + data layer), style.css, config.js (dev)
supabase/
  baseline/                   the first two schemas (17–18 Oct)
  migrations/                 every later change, dated, with what ran where
  functions/                  edge functions: account, team, notify
  dev/                        environment plan + dev schema
tests/                        Playwright checks (demo mode, no network)
pocket/                       v0.1: the original Winga Pocket tool
docs/                         README images, review sheets
```

The anon keys in `config.js` are public by design. Row Level Security decides who can read or change what.

## Roadmap

Effort follows one rule: **metrics 50% · onboarding 40% · features 10%.**

```
 ✅ Shop + Boss ─► ✅ Orders, accounts, dashboard ─► ✅ Invoices, payment proof, Ganji, alerts ─► ✅ Dev environment
 ─► ▶ niagize.tz + go-live with Boss Deus ─► Learn from real orders ─► Delivery partners ─► WhatsApp forward bot · Instagram cards
```

What changed and when: [`CHANGELOG.md`](CHANGELOG.md).

## Where it started

Niagize Kariakoo grew out of **Winga Pocket** (`/pocket/`), a phone-only tool for a winga's catalog, margin math and orders. Field feedback from a working winga turned it into a shop customers can browse.

## Contributing

Open source under the [MIT License](LICENSE). Issues and pull requests are welcome, especially from people who know Kariakoo, wingas, or Tanzanian payments. Keep the principles: if a change takes power away from the winga, it doesn't belong here.

---

<p align="center"><sub>Built in Dar es Salaam for the wingas of Kariakoo. MIT licensed.</sub></p>
