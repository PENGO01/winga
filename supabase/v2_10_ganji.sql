-- v2.10 (27 Oct 2026): "Ganji" = the winga's own top-up / service amount on an order (the real gain).
-- Kept in its own table so customers can never read it (orders are partly readable by the customer who placed them).
-- Owners (boss, super admin) only; assistants don't see it.
create table if not exists public.order_private (
  order_id uuid primary key references public.orders(id) on delete cascade,
  ganji integer not null default 0 check (ganji >= 0),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid()
);
alter table public.order_private enable row level security;
drop policy if exists order_private_owner on public.order_private;
create policy order_private_owner on public.order_private for all to authenticated using (public.is_owner()) with check (public.is_owner());
grant select, insert, update, delete on public.order_private to authenticated;
