# Niagize environments

| | Live (production) | Dev |
|---|---|---|
| Web | `niagize.tz/` (shop) · `niagize.tz/admin/` (Boss) | `niagize.tz/beta/` · `niagize.tz/beta/admin/` (DEV tag) |
| Supabase project | `winga` · `omnigqtooirwmpmjgaio` | `winga-dev` · `zgpaitukibhmikhazgvk` |
| App settings | `shared/config.js` | `beta/shared/config.js` (`env: "dev"`) |
| Data | real customers and orders | full copy of live as of 29 Oct 2026, test freely |
| Push / brief | order alerts + 09:30, 13:30, critical briefs | order alerts only, titled `[DEV]`; no briefs |
| Photos | live storage | new uploads go to dev storage; copied products point at live photos |

```
 code ──► branch ──► main ──► /beta/ (dev DB) ──► test on phones ──► promote to / (live DB)
 database change ──► run on winga-dev ──► test ──► run on winga ──► log in supabase/
```

## Rules
1. Every SQL change runs on **dev first**, then live, and is saved in `supabase/` with the date.
2. The beta never points at live again; real customers only ever see `/`.
3. Promoting to live = copy the tested `beta/` files to the root, keep the root `shared/config.js`.
4. Dev can be refreshed from live whenever needed (same steps as below).

## How dev was built (29 Oct 2026)
- `01_schema.sql`: tables, constraints, indexes (generated from the live catalog).
- Functions, triggers, RLS policies, grants, storage buckets and rules, cron: copied from the live catalog with
  `pg_get_functiondef` / `pg_policies` / `aclexplode`; only the notify-hook URL and the photo-order prefix point at dev.
- Edge functions `team`, `account`, `notify` deployed from the live source (`supabase/functions/`).
- Data: auth users (same logins), shop, team, profiles, addresses, products (photos → live URLs), product Ganji,
  orders, order lines, order Ganji, events.

## Live clean-up before the pilot (needs your confirmation)
`pilot_clean_test_orders.sql`: deletes test orders and their trail on live; keeps shop, team, accounts, addresses
and products (order/ask counters reset). Dev keeps the full copy.
