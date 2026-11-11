-- v2.23 (11 Nov 2026): saved items ("Hifadhi") for signed-in customers.
-- Guests keep theirs on the phone; on sign-in the app merges both ways. Apply on the DEV database first.
-- Each customer sees and changes only their own rows. The shop team can count saves per product (metrics) but not see who saved.
create table if not exists public.favorites (
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
create index if not exists favorites_product_idx on public.favorites (product_id);
alter table public.favorites enable row level security;
drop policy if exists favorites_own_read   on public.favorites;
drop policy if exists favorites_own_insert on public.favorites;
drop policy if exists favorites_own_update on public.favorites;
drop policy if exists favorites_own_delete on public.favorites;
create policy favorites_own_read   on public.favorites for select to authenticated using (user_id = auth.uid());
create policy favorites_own_insert on public.favorites for insert to authenticated with check (user_id = auth.uid());
create policy favorites_own_update on public.favorites for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy favorites_own_delete on public.favorites for delete to authenticated using (user_id = auth.uid());
-- counts per product for the Boss (no user ids leave the database)
create or replace function public.favorite_counts() returns table(product_id uuid, saves bigint)
language sql stable security definer set search_path = public as $$
  select f.product_id, count(*) from public.favorites f where public.is_admin() group by f.product_id;
$$;
revoke all on function public.favorite_counts() from public, anon;
grant execute on function public.favorite_counts() to authenticated;
-- Undo: drop function public.favorite_counts(); drop table public.favorites;
