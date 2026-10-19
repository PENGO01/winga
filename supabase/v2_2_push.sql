-- Niagize v2.2 order alerts (Web Push). Applied 19 Oct 2026.
-- Keys and the hook secret live in a private schema the API can't see; the notify edge function makes the
-- VAPID keys on first run. Every new order pings notify via pg_net after the order commits.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.push_config (
  id int primary key default 1 check (id = 1),
  vapid_public text,
  vapid_private jsonb,
  hook_secret text not null default encode(extensions.gen_random_bytes(24), 'hex')
);
insert into private.push_config (id) values (1) on conflict do nothing;

create table if not exists public.push_subs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  endpoint text not null unique check (endpoint ~ '^https://'),
  p256dh text not null, auth text not null,
  app_url text check (app_url is null or app_url ~ '^https?://'),
  ua text, created_at timestamptz not null default now(), last_ok timestamptz, fails int not null default 0
);
alter table public.push_subs enable row level security;
create policy push_subs_own_read on public.push_subs for select to authenticated using (user_id = auth.uid());
create policy push_subs_own_add on public.push_subs for insert to authenticated with check (user_id = auth.uid() and public.is_admin());
create policy push_subs_own_update on public.push_subs for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy push_subs_own_delete on public.push_subs for delete to authenticated using (user_id = auth.uid());

create or replace function public.push_public_key() returns text language sql stable security definer set search_path = public as $$
  select vapid_public from private.push_config where id = 1;
$$;
grant execute on function public.push_public_key() to anon, authenticated;

create or replace function public.push_admin_config() returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object('vapid_public', vapid_public, 'vapid_private', vapid_private, 'hook_secret', hook_secret) from private.push_config where id = 1;
$$;
create or replace function public.push_admin_set_keys(pub text, priv jsonb) returns boolean language sql security definer set search_path = public as $$
  with u as (update private.push_config set vapid_public = pub, vapid_private = priv where id = 1 and vapid_public is null returning 1) select exists(select 1 from u);
$$;
revoke all on function public.push_admin_config() from public, anon, authenticated;
revoke all on function public.push_admin_set_keys(text, jsonb) from public, anon, authenticated;
grant execute on function public.push_admin_config() to service_role;
grant execute on function public.push_admin_set_keys(text, jsonb) to service_role;

create or replace function public.notify_new_order() returns trigger language plpgsql security definer set search_path = public as $$
declare s text;
begin
  select hook_secret into s from private.push_config where id = 1;
  perform net.http_post(
    url := 'https://omnigqtooirwmpmjgaio.supabase.co/functions/v1/notify',
    body := jsonb_build_object('action', 'order', 'code', new.code),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-niagize-hook', s),
    timeout_milliseconds := 8000);
  return new;
exception when others then
  return new;   -- a notification problem must never block an order
end $$;
create trigger orders_notify after insert on public.orders for each row execute function public.notify_new_order();
