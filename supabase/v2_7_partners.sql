-- v2.7 (26 Oct 2026): partner review. Additive, safe to run twice.
-- 1) price drops (same as v2_6_price_drop.sql)
alter table public.products add column if not exists prev_price integer;
alter table public.products add column if not exists price_drop_at timestamptz;
create or replace function public.products_price_drop() returns trigger language plpgsql set search_path to 'public' as $$
begin
  if new.price is distinct from old.price then
    if old.price is not null and new.price is not null and new.price < old.price then
      new.prev_price := greatest(old.price, coalesce(case when old.price_drop_at > now() - interval '14 days' then old.prev_price end, 0));
      new.price_drop_at := now();
    else
      new.prev_price := null; new.price_drop_at := null;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists products_price_drop on public.products;
create trigger products_price_drop before update of price on public.products for each row execute function public.products_price_drop();

-- 2) the customer can fix their WhatsApp number on an open order (wrong digit, new number).
--    Allowed until payment; each change is written to the order history so the team sees it.
create or replace function public.set_order_phone(c text, phone text)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare o public.orders; p text := regexp_replace(coalesce(phone,''), '\D', '', 'g');
begin
  if p !~ '^[1-9][0-9]{10,14}$' then raise exception 'phone'; end if;
  update public.orders set customer_phone = p, updated_at = now(),
    history = coalesce(history,'[]'::jsonb) || jsonb_build_array(jsonb_build_object('s','phone','at',now(),'by', case when public.is_admin() then 'team' else 'customer' end))
  where code = upper(c) and status in ('new','progress','invoiced') returning * into o;
  if o.id is null then raise exception 'status'; end if;
  return public.get_order(o.code);
end $$;
grant execute on function public.set_order_phone(text,text) to anon, authenticated;

-- 3) get_order: + last 3 digits of the number (so a guest can check it) + the assistant serving the order
do $mig$
declare d text := pg_get_functiondef('public.get_order(text)'::regprocedure); n text;
begin
  if position('phone_tail' in d) > 0 then return; end if;
  n := replace(d, $o$'whatsapp', (select whatsapp from public.shop where id = 1))$o$,
    $n$'whatsapp', (select whatsapp from public.shop where id = 1),
    'phone_tail', right(o.customer_phone, 3),
    'served_by', (select a.name from public.admins a where a.user_id = o.handled_by and a.role = 'assistant'))$n$);
  if n = d then raise exception 'get_order pattern not found'; end if;
  execute n;
end $mig$;

-- 4) hygiene from the security check: the new-order trigger function is not an API
revoke execute on function public.notify_new_order() from public, anon, authenticated;
