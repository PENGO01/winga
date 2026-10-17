<p align="center">
  <img src="docs/banner.png" alt="Niagize Kariakoo: Bidhaa za Kariakoo, mlangoni kwako. One trusted winga, his whole market in one link." width="100%">
</p>

<p align="center">
  <a href="https://pengo01.github.io/winga/"><b>Open the shop</b></a> ·
  <a href="https://pengo01.github.io/winga/admin/">Boss side</a> ·
  <a href="#how-it-works">How it works</a> ·
  <a href="#principles">Principles</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="LICENSE">MIT License</a>
</p>

---

## Why it exists

In Kariakoo, a **winga** is the person who knows which shop has the stock, what the real price is today, and who sells fakes. A good one sits in 200+ supplier WhatsApp groups and posts what he finds to his status. Customers see it, message him, bargain, pay, and a boda brings it.

It works. But it lives in WhatsApp status that disappears in 24 hours, in a phone gallery, and in his head. A customer can't browse. He can't see what sold. Nothing builds up.

**Niagize Kariakoo turns one trusted winga's status into a shop that stays.** Not a marketplace. One winga, his market, one link.

## What it does

<p align="center">
  <img src="docs/screens.png" alt="Five screens: the customer shop, a product page, Boss's three-step setup, adding products from photos, and the product list with 7-day freshness." width="100%">
</p>

| Side | Screen | What it does |
|---|---|---|
| Mteja (customer) | **Duka** | Categories on top, search at the bottom where the thumb is, a three-step "how to order" strip on the first visit |
| Mteja | **Bidhaa** | Photos, price (or "Uliza bei"), sizes, colours. **Agiza kupitia WhatsApp** opens the winga's chat with the product and link already written |
| Boss | **Hatua 3** | Setup that guides itself: WhatsApp number, first three products, share the link |
| Boss | **Ongeza picha** | Pick many photos from the gallery at once. Name, category, price, next. Several photos can become one product. Uploads run in the background |
| Boss | **Bado ipo?** | Every product shows for 7 days, then hides itself. One tap keeps it another week. Sold out, hide, delete |

The winga's inside price (**Bei yako ya ndani**) is stored in a private table no customer can ever read.

## How it works

```mermaid
flowchart LR
    G["200+ supplier<br/>WhatsApp groups"] -- "Save photo" --> PH["Boss's<br/>photo gallery"]
    PH -- "Ongeza picha" --> B["Boss side<br/>name · price · cost"]
    B --> DB[("Supabase<br/>products · private cost · photos")]
    DB --> S["Shop link<br/>browse · filter · search"]
    IG["Instagram /<br/>WhatsApp status"] -- "shared link" --> S
    S -- "Agiza kupitia WhatsApp" --> W["Boss's WhatsApp<br/>bargain · pay · boda"]
```

Today, ordering finishes on WhatsApp, where customers already are. In-app orders come only after the numbers show customers actually tap "order" (see [Roadmap](#roadmap)).

## Use it

**Customers:** open **https://pengo01.github.io/winga/**. On a phone, add it to the Home Screen to come back in one tap.

**Boss (iPhone):**
1. Open **https://pengo01.github.io/winga/admin/** in **Safari**, tap **Share → Add to Home Screen**.
2. Open **Niagize Boss** from the Home Screen and sign in. Accounts are created by the Super Admin.
3. Follow **Hatua 3**: WhatsApp number, three products, share the link.

> On iPhone, "Share → app" from WhatsApp isn't possible for web apps (WebKit limitation), so photos come from the gallery: in WhatsApp, hold a photo → **Save**, then **Ongeza picha**.

**Super Admin:** creates accounts in Supabase (Authentication → Users → Add user, *Auto Confirm*) and grants a role in `public.admins` (`super_admin` or `boss`).

## Principles

1. **Augment WhatsApp, never replace it.** It's where the winga and his customers live.
2. **One winga, not a marketplace.** His trust is the product.
3. **Protect his edge.** Suppliers and inside prices are never shown to customers.
4. **Fresh or hidden.** Stale stock breaks trust; products expire unless confirmed.
5. **Don't hold money.** Payments happen outside the app. We record, we don't touch.
6. **Borrow the basics, innovate on go-to-market.** Shop grids and order flows are solved problems; reach and trust are not.

## Under the hood

| | |
|---|---|
| **Frontend** | Plain HTML + JavaScript, no build step, hosted on GitHub Pages. Works offline from cache |
| **Backend** | Supabase: Postgres, Auth (email + password), Storage for photos |
| **Security** | Row Level Security: visitors read live products only; costs live in `product_private` (admins only); only admins upload or edit. See [`supabase/schema.sql`](supabase/schema.sql) |
| **Photos** | Shrunk on the phone before upload: 1080 px full, 400 px thumbnail |
| **Search** | Fuse.js fuzzy search, so "kiatu" finds "viatu" |
| **Language** | Kiswahili first, English toggle |

```
index.html             customer shop
admin/                 Boss side (Niagize Boss)
shared/                core.js (language, data layer), style.css, config.js (public Supabase URL + anon key)
supabase/schema.sql    tables, security rules, storage bucket
pocket/                v0.1: the original single-winga pocket tool (where this started)
docs/                  README images
```

The anon key in `shared/config.js` is public by design. Row Level Security decides who can read or change what.

## Roadmap

Effort follows one rule: **metrics 50% · onboarding 40% · features 10%.**

```
 ✅ Shop + Boss side ──► ✅ Onboarding pass 1 ──► ▶ Metrics ──► In-app orders ──► Delivery · rating · reorder · alerts ──► WhatsApp forward bot · Instagram cards
```

- **Metrics next:** visits, product views, order taps, products added per day, days active.
- **In-app orders** (bargain, invoice, payment proof, verify) ship only if metrics show customers tap "order".

## Where it started

Niagize Kariakoo grew out of **Winga Pocket** (`/pocket/`), a phone-only tool for a winga's catalog, margin math and orders. Field feedback from a working winga turned it into a shop customers can browse. The pocket tool still works at **https://pengo01.github.io/winga/pocket/**.

## Contributing

Open source under the [MIT License](LICENSE). Issues and pull requests are welcome, especially from people who know Kariakoo, wingas, or Tanzanian payments. Keep the principles: if a change takes power away from the winga, it doesn't belong here.

---

<p align="center"><sub>Built in Dar es Salaam for the wingas of Kariakoo. MIT licensed.</sub></p>
