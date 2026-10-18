-- Niagize Kariakoo v2 (2026-10-18): categories + sub-categories, tags, quality stars, orders,
-- customer accounts (username + 6-digit PIN via the "account" edge function), addresses, events, dashboard.
-- Run after schema.sql. Edge functions: supabase/functions/team, supabase/functions/account.

-- products
alter table public.products add column if not exists subcategory text;
alter table public.products add column if not exists tags text[] not null default '{}';
alter table public.products add column if not exists rating smallint not null default 2 check (rating between 1 and 3);
alter table public.products add column if not exists ordered integer not null default 0;
-- shop delivery fees
alter table public.shop add column if not exists fee_fasta integer;
alter table public.shop add column if not exists fee_leo integer;

-- accounts
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (username ~ '^[a-z0-9_.]{3,20}$'),
  full_name text not null default '', whatsapp text, email text,
  kind text not null default 'customer' check (kind in ('customer','staff')),
  verified boolean not null default false, created_at timestamptz not null default now());
alter table public.profiles enable row level security;
create policy profiles_own_read on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_own_edit on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from authenticated;
grant update (whatsapp, email) on public.profiles to authenticated;
create table if not exists public.login_attempts (username text primary key, fails integer not null default 0, locked_until timestamptz);
alter table public.login_attempts enable row level security;
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  label text not null default '', line text not null, landmark text, lat double precision, lng double precision,
  accepted_terms boolean not null default false check (accepted_terms), created_at timestamptz not null default now());
alter table public.addresses enable row level security;
create policy addresses_own on public.addresses for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), code text unique not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  customer_id uuid references auth.users(id) on delete set null, customer_name text, customer_phone text, address jsonb,
  delivery text not null default 'fasta' check (delivery in ('fasta','leo')), delivery_fee integer,
  subtotal integer not null default 0, priced boolean not null default true, items_count integer not null default 0,
  status text not null default 'new' check (status in ('new','progress','invoiced','paid','done','cancelled')),
  pay_ref text, pay_name text, cancel_reason text, handled_by uuid, history jsonb not null default '[]'::jsonb);
create table if not exists public.order_items (
  id bigserial primary key, order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null, name text not null, price integer,
  qty integer not null check (qty between 1 and 99), thumb text);
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
create policy orders_team on public.orders for select to authenticated using (public.is_admin());
create policy orders_own on public.orders for select to authenticated using (customer_id = auth.uid());
create policy order_items_team on public.order_items for select to authenticated using (public.is_admin());
create policy order_items_own on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid()));

-- events
create table if not exists public.events (id bigserial primary key, at timestamptz not null default now(),
  type text not null check (type in ('visit','view','cart','chat','order')), product_id uuid references public.products(id) on delete set null, session text);
alter table public.events enable row level security;
create policy events_team on public.events for select to authenticated using (public.is_admin());

-- functions (bodies as deployed; see the live database with pg_get_functiondef for the exact text)
--   log_event(t, pid, sid)              anon + authenticated: insert visit/view/cart/chat
--   create_order(items, delivery, address_id, name, phone)   anon + authenticated: prices read from products, code NK-XXXXX
--   get_order(code)                     anon + authenticated: phone and address only for the team or the order's owner
--   set_order(code, status, ref, payer, reason, phone, fee)  team only: moves status, appends history
--   dashboard(days)                     team only: visitors, views, carts, chats, orders, paid, sales, by_day, top
