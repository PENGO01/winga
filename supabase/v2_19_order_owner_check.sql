-- Niagize v2.19 (2026-10-29): order actions need more than the order code (the v2.17 owner check,
-- merged with v2.18: Nimepokea may close an order without stars).
-- Security review findings #1-3: set_order_phone, submit_payment and customer_received
-- trusted anyone who knew the code (NK-XXXXX). Now the caller must be:
--   the team, or
--   the signed-in customer who owns the order, or
--   a guest who proves the WhatsApp number already on the order (full number, any format).
-- Five wrong proofs on one order lock it for 15 minutes (reuses login_attempts, key "order:<code>").
-- A guest order with no number on file can be given one (nothing to prove yet); after that, proof is needed.
--
-- Wrong proof RETURNS {"error":"owner"|"locked"} instead of raising, so the failed attempt is
-- recorded (a raise would roll the count back). The beta client (beta/shared/core.js, v2.17)
-- turns that into an Error. Old clients still work for the team and signed-in customers;
-- guests need the v2.17 client.
--
-- Run 29 Oct 2026 (Super Admin go). Undo: supabase/v2_19_rollback.sql

begin;

-- 1. helpers -------------------------------------------------------------------------------

create or replace function public.norm_phone(p text) returns text
language sql immutable set search_path = public as $$
  select case
    when d = '' then null
    when left(d, 1) = '0' then '255' || substr(d, 2)
    when length(d) = 9 then '255' || d
    else d end
  from (select regexp_replace(coalesce(p, ''), '\D', '', 'g') as d) x;
$$;

-- 'ok' | 'owner' | 'locked'. Records a failure when the proof is wrong.
create or replace function public.order_caller(o public.orders, proof text) returns text
language plpgsql security definer set search_path = public as $$
declare k text := 'order:' || o.code; lk public.login_attempts;
begin
  if public.is_admin() then return 'ok'; end if;
  if o.customer_id is not null then
    return case when o.customer_id = auth.uid() then 'ok' else 'owner' end;
  end if;
  if o.customer_phone is null then return 'ok'; end if;                -- guest, nothing on file yet
  select * into lk from public.login_attempts where username = k;
  if lk.locked_until is not null and lk.locked_until > now() then return 'locked'; end if;
  if public.norm_phone(proof) = public.norm_phone(o.customer_phone) then
    if lk.username is not null then delete from public.login_attempts where username = k; end if;
    return 'ok';
  end if;
  perform public.login_fail(k);
  return 'owner';
end $$;

revoke all on function public.norm_phone(text) from public;
revoke all on function public.order_caller(public.orders, text) from public, anon, authenticated;
grant execute on function public.norm_phone(text) to anon, authenticated;

-- 2. the three order actions, now with "proof" --------------------------------------------
-- Old signatures are dropped so calls without proof resolve to the new ones (proof defaults to null).

drop function if exists public.set_order_phone(text, text);
drop function if exists public.submit_payment(text, text, text, text);
drop function if exists public.customer_received(text, integer, text);

create function public.set_order_phone(c text, phone text, proof text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare o public.orders; p text := regexp_replace(coalesce(phone,''), '\D', '', 'g'); who text;
begin
  if p !~ '^[1-9][0-9]{10,14}$' then raise exception 'phone'; end if;
  select * into o from public.orders where code = upper(c) and status in ('new','progress','invoiced');
  if o.id is null then raise exception 'status'; end if;
  who := public.order_caller(o, proof);
  if who <> 'ok' then return jsonb_build_object('error', who); end if;
  update public.orders set customer_phone = p, updated_at = now(),
    history = coalesce(history,'[]'::jsonb) || jsonb_build_array(jsonb_build_object('s','phone','at',now(),'by', case when public.is_admin() then 'team' else 'customer' end))
  where id = o.id;
  return public.get_order(o.code);
end $$;

create function public.submit_payment(c text, ref text, payer text, channel text, proof text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare o public.orders; who text;
begin
  if length(trim(coalesce(ref,''))) < 3 then raise exception 'ref'; end if;
  if length(trim(coalesce(payer,''))) < 2 then raise exception 'payer'; end if;
  select * into o from public.orders where code = upper(c) and status = 'invoiced';
  if o.id is null then raise exception 'status'; end if;
  who := public.order_caller(o, proof);
  if who <> 'ok' then return jsonb_build_object('error', who); end if;
  update public.orders set claim_ref = left(trim(ref),60), claim_name = left(trim(payer),60),
    claim_channel = nullif(left(trim(coalesce(channel,'')),40),''), claim_at = now(), updated_at = now()
  where id = o.id;
  return public.get_order(o.code);
end $$;

create function public.customer_received(c text, stars integer, note text default null, proof text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare o public.orders; who text;
begin
  if stars is not null and (stars < 1 or stars > 5) then raise exception 'stars'; end if;
  select * into o from public.orders where code = upper(c) and status in ('paid','done');
  if o.id is null then raise exception 'status'; end if;
  who := public.order_caller(o, proof);
  if who <> 'ok' then return jsonb_build_object('error', who); end if;
  update public.orders set
    status = 'done', received_at = coalesce(received_at, now()), rating = coalesce(stars, rating),
    rating_note = case when stars is null then rating_note else nullif(left(trim(coalesce(note,'')),300),'') end, updated_at = now(),
    history = history || case when status = 'done' then '[]'::jsonb else jsonb_build_array(jsonb_build_object('s','done','at',now(),'by','customer')) end
  where id = o.id;
  return public.get_order(o.code);
end $$;

revoke all on function public.set_order_phone(text, text, text) from public;
revoke all on function public.submit_payment(text, text, text, text, text) from public;
revoke all on function public.customer_received(text, integer, text, text) from public;
grant execute on function public.set_order_phone(text, text, text) to anon, authenticated;
grant execute on function public.submit_payment(text, text, text, text, text) to anon, authenticated;
grant execute on function public.customer_received(text, integer, text, text) to anon, authenticated;

commit;

-- 3. checks to run after (expect: 3 rows, each with proof; order_caller not callable by anon) ---
-- select proname, pg_get_function_identity_arguments(oid), has_function_privilege('anon', oid, 'EXECUTE')
--   from pg_proc where proname in ('set_order_phone','submit_payment','customer_received','order_caller');
--
-- Rollback: supabase/v2_19_rollback.sql
