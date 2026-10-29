-- v2.16 wave 3: run 29 Oct 2026 (Super Admin go) together with v2.19.
-- v2.16 wave 3 (fix 12): the server, not only the app, refuses an invoice without a customer number and a delivery place.
-- Only set_order_v2 changes (used by the beta). The live v2.0 app calls set_order, which is untouched.
-- Safe to re-run. Undo: re-run the previous definition (saved below the line at the end of this file as a comment).
create or replace function public.set_order_v2(c text, st text, ref text default null, payer text default null, reason text default null, phone text default null, fee integer default null, total integer default null, clear_total boolean default false, seen boolean default false)
 returns jsonb language plpgsql security definer set search_path to 'public'
as $function$
declare o public.orders; cur text; cur_phone text; cur_addr text;
begin
  if not public.is_admin() then raise exception 'not_team'; end if;
  if st not in ('new','progress','invoiced','paid','done','cancelled') then raise exception 'status'; end if;
  if fee is not null and (fee < 0 or fee > 10000000) then raise exception 'fee'; end if;
  if total is not null and (total < 0 or total > 100000000) then raise exception 'total'; end if;
  if nullif(phone,'') is not null and phone !~ '^[1-9][0-9]{10,14}$' then raise exception 'phone'; end if;
  select status, customer_phone, coalesce(address->>'line','') into cur, cur_phone, cur_addr from public.orders where code = upper(c);
  if cur is null then raise exception 'not_found'; end if;
  if cur in ('done','cancelled') and st <> cur then raise exception 'closed'; end if;
  if (fee is not null or total is not null or clear_total) and cur not in ('new','progress') then raise exception 'locked'; end if;
  if st = 'cancelled' and nullif(trim(coalesce(reason,'')),'') is null and cur <> 'cancelled' then raise exception 'reason'; end if;
  -- new in v2.16: an invoice needs a number and a delivery place
  if st = 'invoiced' and cur in ('new','progress') then
    if coalesce(nullif(phone,''), nullif(cur_phone,'')) is null then raise exception 'need_phone'; end if;
    if length(trim(cur_addr)) < 3 then raise exception 'need_address'; end if;
  end if;
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
