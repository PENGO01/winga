-- Mini-pilot reset (29 Oct 2026). Run in Supabase → SQL Editor.
-- A full copy already sits in schema backup_20261029 (46 products, 33 orders, shop, categories, users list, photo list).
-- Keeps: Super Admin + Boss Deus logins, shop name/tagline, categories. Clears everything else.
-- Photos: after this, Storage → products bucket → select all → Delete (SQL can't remove the files themselves).
begin;
delete from public.order_private;
delete from public.order_items;
delete from public.orders;
delete from public.product_private;
delete from public.products;
delete from public.addresses;
delete from public.events;
delete from public.push_subs;
delete from public.login_attempts;
delete from public.admins where role not in ('super_admin','boss');
delete from public.profiles where id not in (select user_id from public.admins);
delete from auth.users where id not in (select user_id from public.admins);
update public.shop set whatsapp = null, lipa = null, lipa_name = null, network = null, instagram = null,
  payments = '[]'::jsonb, fee_fasta = null, fee_leo = null, updated_at = now();
commit;
-- Check: select (select count(*) from products) p, (select count(*) from orders) o, (select count(*) from auth.users) u;  → 0, 0, 2
