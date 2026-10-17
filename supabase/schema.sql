-- Winga full version · Week 1 schema
-- Shop (public), products (public price), product_private (Boss Deus's cost, never public),
-- admins (Super Admin + Boss Deus), storage bucket "products" (public read, admin write).

-- ---------- shop settings (single row) ----------
create table if not exists public.shop (
  id          int primary key default 1 check (id = 1),
  name        text not null default 'Winga',
  tagline     text default 'Bidhaa za Kariakoo, mlangoni kwako',
  whatsapp    text,               -- shop WhatsApp, e.g. 2557XXXXXXXX
  lipa        text,               -- Lipa Namba
  lipa_name   text,
  network     text,
  instagram   text,                          -- unused since review #1 (kept for old data)
  payments    jsonb not null default '[]'::jsonb, -- [{provider, number, name}]: M-PESA, AIRTEL MONEY, HALOPESA, MIXX BY YAS, CRDB, NMB, SELCOM
  updated_at  timestamptz default now()
);
insert into public.shop (id) values (1) on conflict (id) do nothing;

-- ---------- admins ----------
create table if not exists public.admins (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  name     text,
  role     text not null default 'boss' check (role in ('super_admin','boss')),  -- super_admin owns the platform; boss runs the shop
  added_at timestamptz default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------- products ----------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  refreshed_at  timestamptz not null default now(),  -- shown for 24 days after this
  name          text not null,
  description   text,
  category      text not null default 'nyingine',
  price         int,                                  -- null = "Uliza bei"
  sizes         text,
  colors        text,
  images        text[] not null default '{}',          -- storage paths, full size
  thumbs        text[] not null default '{}',          -- storage paths, ~360px
  status        text not null default 'active' check (status in ('active','soldout','hidden')),
  asks          int not null default 0,
  created_by    uuid default auth.uid()
);
create index if not exists products_live_idx on public.products (status, refreshed_at desc);

-- Boss Deus's private numbers. Customers can never read this table.
create table if not exists public.product_private (
  product_id  uuid primary key references public.products(id) on delete cascade,
  cost        int,
  supplier    text,
  note        text
);

-- ---------- row level security ----------
alter table public.shop            enable row level security;
alter table public.admins          enable row level security;
alter table public.products        enable row level security;
alter table public.product_private enable row level security;

drop policy if exists shop_read   on public.shop;
drop policy if exists shop_write  on public.shop;
create policy shop_read  on public.shop for select using (true);
create policy shop_write on public.shop for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists admins_self on public.admins;
create policy admins_self on public.admins for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists products_public_read on public.products;
drop policy if exists products_admin_all   on public.products;
create policy products_public_read on public.products for select
  using (status <> 'hidden' and refreshed_at > now() - interval '24 days');
create policy products_admin_all on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists private_admin_all on public.product_private;
create policy private_admin_all on public.product_private for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Customers may bump the "asks" counter only (used to spot popular / missing items).
create or replace function public.ask_product(pid uuid) returns void
language sql security definer set search_path = public as $$
  update public.products set asks = asks + 1 where id = pid and status <> 'hidden';
$$;
revoke all on function public.ask_product(uuid) from public;
grant execute on function public.ask_product(uuid) to anon, authenticated;

-- ---------- storage ----------
-- Public bucket: photos are served by public URL; no select policy, so the bucket can't be listed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('products','products', true, 5242880, array['image/jpeg','image/png','image/webp'])
  on conflict (id) do update set public = true;

create policy products_img_write  on storage.objects for insert to authenticated with check (bucket_id = 'products' and public.is_admin());
create policy products_img_update on storage.objects for update to authenticated using (bucket_id = 'products' and public.is_admin());
create policy products_img_delete on storage.objects for delete to authenticated using (bucket_id = 'products' and public.is_admin());

-- ---------- admins ----------
-- Create the accounts in Dashboard → Authentication → Users → Add user (tick "Auto Confirm User"), then:
-- insert into public.admins (user_id, name, role) select id, 'Boss Deus', 'boss' from auth.users where email = 'boss@example.com';
