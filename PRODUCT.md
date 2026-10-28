# Niagize Kariakoo (code name Winga): product brief

## What it is
A single-winga online shop for Kariakoo, Dar es Salaam. One trusted winga (the shop owner, "Boss Deus") shares one link; customers browse his products and order, and the order finishes on WhatsApp. It is not a marketplace.

## Who uses it
- **Customers.** Mostly on mobile and 4G, often on iPhone or mid-range Android. They know M-Pesa and Selcom, and they want a price, a photo and a fast way to ask or order.
- **Boss Deus (owner).** Adds about 30 products a day from his phone gallery, turns orders into invoices, tracks payment and delivery, and sees his hidden margin (Ganji).
- **Assistants (wasaidizi).** Add and edit products, and work orders. They can't delete, change settings or see Ganji.
- **Super Admin.** The project owner. Never put a real name in the product or this repo.

## Surfaces
- `index.html`: the shop (browse, product, basket, order tracking, Mimi/profile).
- `admin/index.html`: the Boss app (dashboard, orders, products, customers, settings, team).
- `admin/o.html`: handoff page from the WhatsApp order link.
- `shared/core.js` holds every screen word plus the data layer (Supabase). `shared/style.css` is the shared look.
- `beta/` is the copy under test. The root is the live site.

## Stack and constraints
- Plain HTML + JS PWAs, no build step, GitHub Pages (moving to Cloudflare). No frameworks; don't add one.
- Supabase (Postgres + Row Level Security) is the source of truth for roles and prices.
- Keep pages light: one font family, Feather inline SVG icons, photos as small JPEG thumbs.

## What matters (NFX rules)
Metrics 50%, onboarding 40%, features 10%. Innovate on go-to-market; borrow the basics.
A design change is good when it gets more visits to "Tuma oda", more orders to paid, and fewer mistakes on the Boss's invoice. Looking different doesn't count.

## Design system
See `DESIGN.md`. It's locked: refine inside it.
