-- v2.20 (29 Oct 2026): a signed-in customer's order can also be proven with its WhatsApp number.
-- Why: a buyer who ordered signed in, then pays from another phone / signed out / another account, was refused
-- ("Imeshindikana") with no way through. Same rule and lock as guests: the full number on the order, 5 wrong = 15 min.
-- Undo: re-run order_caller from supabase/migrations/2026-10-29_v2.19_order_owner_check.sql
create or replace function public.order_caller(o public.orders, proof text) returns text
language plpgsql security definer set search_path = public as $$
declare k text := 'order:' || o.code; lk public.login_attempts;
begin
  if public.is_admin() then return 'ok'; end if;
  if o.customer_id is not null and o.customer_id = auth.uid() then return 'ok'; end if;
  if o.customer_phone is null then
    return case when o.customer_id is null then 'ok' else 'owner' end;   -- guest with nothing on file yet
  end if;
  select * into lk from public.login_attempts where username = k;
  if lk.locked_until is not null and lk.locked_until > now() then return 'locked'; end if;
  if public.norm_phone(proof) = public.norm_phone(o.customer_phone) then
    if lk.username is not null then delete from public.login_attempts where username = k; end if;
    return 'ok';
  end if;
  if proof is not null then perform public.login_fail(k); end if;   -- no number sent: ask, don't count it
  return 'owner';
end $$;
revoke all on function public.order_caller(public.orders, text) from public, anon, authenticated;
