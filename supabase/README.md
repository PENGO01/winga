# Database (Supabase)

Two projects in the same organisation, both Frankfurt:

| Project | Ref | Used by |
|---|---|---|
| `winga` (live) | `omnigqtooirwmpmjgaio` | root shop and Boss app, `niagize.tz/` |
| `winga-dev` | `zgpaitukibhmikhazgvk` | `beta/`, `niagize.tz/beta/` |

## Folders
- `baseline/`: the first two schemas (v1 on 17 Oct, v2 orders and accounts on 18 Oct). History, not a way to rebuild today's database.
- `migrations/`: every change since, named `YYYY-MM-DD_version_what.sql`. The first comment line says where and when it ran.
- `functions/`: edge functions `account` (sign-up, sign-in, passwords), `team` (assistants), `notify` (Web Push and briefs).
- `dev/`: the environment plan and the dev schema. To rebuild a database from scratch, follow `dev/README.md`.

## Rules
1. A change runs on **winga-dev first**, then on live, and is saved here the same day.
2. Changes stay additive while the live root runs an older app (v2.0 until promoted).
3. Anything that deletes data on live is run only with the Super Admin's OK.

## What ran on 29 Oct 2026
| File | Live | Dev |
|---|---|---|
| `2026-10-29_v2.16_invoice_needs_address.sql` | ✓ | ✓ |
| `2026-10-29_v2.18_received_skip_rating.sql` | ✓ (replaced by v2.19) | |
| `2026-10-29_v2.19_order_owner_check.sql` | ✓ | ✓ |
| `2026-10-29_v2.20_owner_by_number.sql` | ✓ | ✓ |
| `2026-10-29_live_clean_test_orders.sql` | ✓ | (dev keeps the copy) |
| `2026-10-29_live_clear_products.sql` | ✓ | (dev keeps the copy) |
| `2026-10-29_v2.19_rollback.sql` | undo only | |

The live database still has a `backup_20261029` schema (a copy taken that morning, before any clean-up).
