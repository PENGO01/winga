# Niagize Kariakoo: design system (locked v2.1, enforced from v2.15)

This is the source of truth for every screen in the shop (`index.html`) and the Boss app (`admin/`).
The design skills in `.claude/skills/` (Impeccable, Hallmark, Taste, Web Design Guidelines) read this file first.
Refine inside this system. Don't replace it.

## Mode
Operate, not Persuade. People finish a task on a phone over 4G in Kariakoo: browse, add to basket, order, and (for the Boss) invoice. That makes clarity, speed and familiar mobile-money patterns (M-Pesa / Selcom) more important than expression.

## Colour: one job each
| Token | Value (light / dark) | Job |
|---|---|---|
| `--ink` | #242424 / #F2F2F2 | Text |
| `--navy` | #121212 / #0B0B0B | The shell: header and bottom nav |
| `--jua` | #FFC62D | Gold. **The one main action on a screen**, a selected chip, rating stars, counters |
| `--cyan` / `--cyan-text` | #53C4D1 / #1C7F8B | "You are here": current step, new, links |
| `--paper` `--card` `--sunk` `--line` | sand (light) / greys (dark) | Everything else. Neutral surfaces only |
| `--faint` | #736750 / #8C8C8C | Muted text; passes 4.5:1 on every surface |
| `--red` | #B8392A / #F08A7A | Error text and the cancel X only |
| `--wa` | #1FA855 | The WhatsApp glyph only |

Rules:
- No tinted cards: no green, red or gold backgrounds on a card. Meaning rides on a dot, an outline or an icon.
- Every colour goes through a token in `:root` in `shared/style.css`. No literal hex or rgba in a component rule.
- Dark and light are both first-class. Light mode's main button is ink; dark mode's is gold.

## Type
One family: Onest at 400, 500, 600 and 800. Inputs are 16px, so iPhone doesn't zoom. Prices use the same font.

## Sizes
| Element | Size |
|---|---|
| Card | radius 16, padding 14 |
| Field | 48 high, radius 12 |
| Footer button | 48 high, pill |
| Round footer icon | 48 |
| Icon button | 40 round (`.fi`), 32 small |
| Tag (`.tag`) | 28 high, radius 8; `.tag.sm` 22 |
| Spacing | 4px scale preferred (4, 8, 12, 16, 20, 24) |

## Components
- `.tag`: neutral chip, Feather icon plus a short word. `.tag.hot` has a gold outline (Inaharaka). `.tag.cy` has a cyan outline.
- `.ost` status pill (v2.17): neutral pill with a status light, traffic-light / macOS colours: `--st-new` red = new (act now), `--st-work` yellow = in progress / invoiced, `--st-ok` green = paid / done, `--st-off` grey = cancelled. These four are the only saturated colours outside gold, and only on status dots.
- `.timeline`: done steps ink, current step cyan.
- Bottom bars: round 48px icons on the left, one gold pill filling the rest. Every button the same height.
- Order page second actions (v2.17): labelled chips above the timeline (Tuma invoice tena, Kadi ya invoice, Rudisha oda, Tuma taarifa za delivery). The footer keeps only X + the gold action, so it never shrinks.
- Live field hint (v2.17): a quiet box under a phone or email field says what's missing while typing ("Bado tarakimu 5", "Endelea kuandika email") and hides when complete.
- Loading (v2.17): the spinner replaces an icon in place; anything slower than 0.5 s also shows the centred sun box.
- Cards and previews (v2.17): invoice and thank-you images have the ink brand band with the striped sun and an ink footer with the tagline; JPEG ~100 kB. Link previews use `beta/og-v3.jpg` (65 kB).
- Headers (v2.16): shop = logo + share + language; Boss = logo + stage dot + avatar. Theme lives in Mimi (shop) and the Boss profile; language and tips too in the Boss profile.
- Boss dashboard (v2.16): opens on the job ("Oda N mpya zinakusubiri" + one gold Fungua), then KPIs as a divided list (label left, value right, no icon circles), then the funnel.
- Shop product card: the whole card is one button (photo, name, price, stars + sold count). No buttons inside a card.

## Icons and words
- Icons are Feather (feathericons.com, MIT), stroke ~2, `currentColor`. **No emoji on screens.** WhatsApp message texts may keep emoji.
- Prefer an icon to a word where the icon is clear.
- Screen text is short Kiswahili in M-Pesa / Selcom tone (Kiswanglish is OK), with English as the switch. Every word lives in the table in `shared/core.js`.
- **Separator (v2.16):** on screen, two facts sit side by side with no glyph: the first in ink, the second muted (`--faint`) after a small gap. Use `W.pair("a · b")` for a string, or `' <span class="pair2">…</span>'` in markup. Dates read "28 Okt, 18:59". Plain text (WhatsApp messages, toasts, page titles) keeps " · ". The tagline keeps its own " . ".
- **Category 3D icons (v2.16):** Fluent 3D images appear only on category screens (the shop's Category tab and the Boss's Product Categories), on neutral `--sunk` discs with no gradient or shadow. Everywhere else uses Feather line icons.
## Order page (Boss): 3 cards and a footer
1. **Customer**: name, number, delivery place. A missing field is an input inside the same card.
2. **Items**: the urgency tag (Inaharaka / Utumwe Leo) sits right under the items.
3. **Money**: delivery fee, Jumla, and Ganji yako · Faida yako (lock icon, owners only).
4. **Footer**: X, reopen, invoice card or rider as round icons, plus one gold action.

## Never
Gradient text, glassmorphism, a card inside a card, emoji as icons, decorative status dots, invented numbers or testimonials, `transition: all`, animating width or height.
