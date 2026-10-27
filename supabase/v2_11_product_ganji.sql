-- v2.11 (27 Oct 2026): Ganji per product, kept with the other private product data (owners only, never public).
alter table public.product_private add column if not exists ganji integer check (ganji >= 0);
