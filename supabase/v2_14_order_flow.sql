-- v2.14 (27 Oct 2026) · P-038 feedback: run once in the Supabase SQL Editor.
-- 1) Ganji per item on an order (owners only, same private table as the order Ganji)
alter table public.order_private add column if not exists items jsonb;

-- 2) The winga can add the delivery place on an order that has none (an invoice needs it)
create or replace function public.set_order_address(c text, line text)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare o public.orders;
begin
  if not public.is_admin() then raise exception 'not_team'; end if;
  if nullif(trim(coalesce(line,'')),'') is null or length(trim(line)) < 3 then raise exception 'line'; end if;
  update public.orders set address = coalesce(address,'{}'::jsonb) || jsonb_build_object('line', left(trim(line),200)), updated_at = now()
   where code = upper(c) and status in ('new','progress','invoiced','paid') returning * into o;
  if o.id is null then raise exception 'not_found'; end if;
  return public.get_order(o.code);
end $$;
revoke all on function public.set_order_address(text,text) from public, anon;
grant execute on function public.set_order_address(text,text) to authenticated;

-- 3) Delivery update ("mzigo uko njiani"): a dated line in the order history, shown to the customer
create or replace function public.add_order_event(c text, ev text, note text default null)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare o public.orders;
begin
  if not public.is_admin() then raise exception 'not_team'; end if;
  if ev not in ('ship') then raise exception 'event'; end if;
  update public.orders set history = history || jsonb_build_array(jsonb_build_object('s', ev, 'at', now(), 'note', left(coalesce(note,''),200))), updated_at = now()
   where code = upper(c) and status in ('paid') returning * into o;
  if o.id is null then raise exception 'not_found'; end if;
  return public.get_order(o.code);
end $$;
revoke all on function public.add_order_event(text,text,text) from public, anon;
grant execute on function public.add_order_event(text,text,text) to authenticated;

-- 4) Prices are locked once the invoice has gone: fee / total change only while the order is new or in progress.
--    (To change a price after the invoice, move the order back to "progress" first: Rudisha.)
create or replace function public.set_order_v2(c text, st text, ref text DEFAULT NULL::text, payer text DEFAULT NULL::text, reason text DEFAULT NULL::text, phone text DEFAULT NULL::text, fee integer DEFAULT NULL::integer, total integer DEFAULT NULL::integer, clear_total boolean DEFAULT false, seen boolean DEFAULT false)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare o public.orders; cur text;
begin
  if not public.is_admin() then raise exception 'not_team'; end if;
  if st not in ('new','progress','invoiced','paid','done','cancelled') then raise exception 'status'; end if;
  if fee is not null and (fee < 0 or fee > 10000000) then raise exception 'fee'; end if;
  if total is not null and (total < 0 or total > 100000000) then raise exception 'total'; end if;
  if nullif(phone,'') is not null and phone !~ '^[1-9][0-9]{10,14}$' then raise exception 'phone'; end if;
  select status into cur from public.orders where code = upper(c);
  if cur is null then raise exception 'not_found'; end if;
  if cur in ('done','cancelled') and st <> cur then raise exception 'closed'; end if;
  if (fee is not null or total is not null or clear_total) and cur not in ('new','progress') then raise exception 'locked'; end if;
  if st = 'cancelled' and nullif(trim(coalesce(reason,'')),'') is null and cur <> 'cancelled' then raise exception 'reason'; end if;
  update public.orders set
    status = st, updated_at = now(), handled_by = auth.uid(),
    pay_ref = coalesce(nullif(left(ref,60),''), pay_ref), pay_name = coalesce(nullif(left(payer,60),''), pay_name),
    cancel_reason = case when st = 'cancelled' then coalesce(nullif(left(trim(reason),200),''), cancel_reason) else cancel_reason end,
    customer_phone = coalesce(nullif(left(phone,20),''), customer_phone),
    delivery_fee = coalesce(fee, delivery_fee),
    agreed_total = case when clear_total then null else coalesce(total, agreed_total) end,
    seen_at = case when seen then coalesce(seen_at, now()) else seen_at end,
    history = history || case when status = st then '[]'::jsonb else jsonb_build_array(jsonb_build_object('s', st, 'at', now())) end
  where code = upper(c) returning * into o;
  return public.get_order(o.code);
end $function$;
