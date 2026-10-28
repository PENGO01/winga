-- Winga v2.17 rollback: puts the three order functions back exactly as they were live on 28 Oct 2026.
-- Run only if v2.17 misbehaves. Also roll the beta client back (git revert the v2.17 commit).
begin;

drop function if exists public.set_order_phone(text, text, text);
drop function if exists public.submit_payment(text, text, text, text, text);
drop function if exists public.customer_received(text, integer, text, text);

CREATE OR REPLACE FUNCTION public.customer_received(c text, stars integer, note text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare o public.orders;
begin
  if stars is null or stars < 1 or stars > 5 then raise exception 'stars'; end if;
  update public.orders set
    status = 'done', received_at = coalesce(received_at, now()), rating = stars,
    rating_note = nullif(left(trim(coalesce(note,'')),300),''), updated_at = now(),
    history = history || case when status = 'done' then '[]'::jsonb else jsonb_build_array(jsonb_build_object('s','done','at',now(),'by','customer')) end
  where code = upper(c) and status in ('paid','done') returning * into o;
  if o.id is null then raise exception 'status'; end if;
  return public.get_order(o.code);
end $function$;

CREATE OR REPLACE FUNCTION public.set_order_phone(c text, phone text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare o public.orders; p text := regexp_replace(coalesce(phone,''), '\D', '', 'g');
begin
  if p !~ '^[1-9][0-9]{10,14}$' then raise exception 'phone'; end if;
  update public.orders set customer_phone = p, updated_at = now(),
    history = coalesce(history,'[]'::jsonb) || jsonb_build_array(jsonb_build_object('s','phone','at',now(),'by', case when public.is_admin() then 'team' else 'customer' end))
  where code = upper(c) and status in ('new','progress','invoiced') returning * into o;
  if o.id is null then raise exception 'status'; end if;
  return public.get_order(o.code);
end $function$;

CREATE OR REPLACE FUNCTION public.submit_payment(c text, ref text, payer text, channel text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare o public.orders;
begin
  if length(trim(coalesce(ref,''))) < 3 then raise exception 'ref'; end if;
  if length(trim(coalesce(payer,''))) < 2 then raise exception 'payer'; end if;
  update public.orders set claim_ref = left(trim(ref),60), claim_name = left(trim(payer),60),
    claim_channel = nullif(left(trim(coalesce(channel,'')),40),''), claim_at = now(), updated_at = now()
  where code = upper(c) and status = 'invoiced' returning * into o;
  if o.id is null then raise exception 'status'; end if;
  return public.get_order(o.code);
end $function$;

grant execute on function public.set_order_phone(text, text) to anon, authenticated;
grant execute on function public.submit_payment(text, text, text, text) to anon, authenticated;
grant execute on function public.customer_received(text, integer, text) to anon, authenticated;

commit;
