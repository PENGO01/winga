-- v2.12 (27 Oct 2026): run once in the Supabase SQL Editor. Includes v2.11 (Ganji per product) so one run does both.
-- 1) Ganji per product, private (owners only)
alter table public.product_private add column if not exists ganji integer check (ganji >= 0);
-- 2) 13:30 brief adds: 💰 Ganji ya wiki: TSh X (oda N)
CREATE OR REPLACE FUNCTION public.team_brief(kind text DEFAULT 'daily'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  tz text := 'Africa/Dar_es_Salaam';
  day0 timestamptz := (date_trunc('day', now() at time zone tz)) at time zone tz;
  f jsonb := '[]'::jsonb; fresh jsonb := '[]'::jsonb; r record; k text;
  n_new int; n_pend int; n_done int; sales bigint; visitors int; live int; claims int;
  shop_wa text; gj bigint; gj_n int;
begin
  for r in select code, created_at from public.orders where status = 'new' and seen_at is null and created_at < now() - interval '20 minutes' and created_at > now() - interval '2 days' order by created_at loop
    f := f || jsonb_build_object('key', 'unseen:' || r.code, 'code', r.code, 'text', r.code || ' haijafunguliwa (dak ' || floor(extract(epoch from now() - r.created_at) / 60) || ')');
  end loop;
  for r in select code from public.orders where status = 'invoiced' and claim_at is not null and claim_at < now() - interval '30 minutes' loop
    f := f || jsonb_build_object('key', 'claim:' || r.code, 'code', r.code, 'text', r.code || ': mteja amelipa, hakiki malipo');
  end loop;
  for r in select o.code from public.orders o where o.status = 'paid' and coalesce((select max((h->>'at')::timestamptz) from jsonb_array_elements(o.history) h where h->>'s' = 'paid'), o.updated_at) < now() - interval '24 hours' loop
    f := f || jsonb_build_object('key', 'paidlong:' || r.code, 'code', r.code, 'text', r.code || ': imelipwa zaidi ya saa 24, bado haijakamilika');
  end loop;
  select whatsapp into shop_wa from public.shop where id = 1;
  if coalesce(shop_wa, '') = '' then f := f || jsonb_build_object('key', 'nowa:' || to_char(now() at time zone tz, 'YYYY-MM-DD'), 'text', 'Namba ya WhatsApp ya duka haipo'); end if;

  if kind = 'critical' then
    for r in select value v from jsonb_array_elements(f) loop
      k := r.v->>'key';
      insert into private.brief_sent(key) values (k) on conflict do nothing;
      if found then fresh := fresh || r.v; end if;
    end loop;
    if jsonb_array_length(fresh) = 0 then return jsonb_build_object('send', false); end if;
    return jsonb_build_object('send', true, 'title', '⚠️ Niagize · ' || jsonb_array_length(fresh) || ' za kushughulikia',
      'body', (select string_agg(x->>'text', E'\n') from jsonb_array_elements(fresh) x),
      'code', case when jsonb_array_length(fresh) = 1 then fresh->0->>'code' end, 'tag', 'critical');
  end if;

  select count(*) filter (where status = 'new'), count(*) filter (where status in ('progress','invoiced','paid')), count(*) filter (where status = 'done')
    into n_new, n_pend, n_done from public.orders where created_at >= day0;
  select coalesce(sum(public.order_total(o)), 0) into sales from public.orders o where created_at >= day0 and status in ('paid','done');
  select count(distinct session) into visitors from public.events where type = 'visit' and at >= day0;
  select count(*) into live from public.products where status = 'active';
  select count(*) into claims from public.orders where status = 'invoiced' and claim_at is not null;
  -- v2.12: the winga's Ganji for the last 7 days (saved on the order, else from the products' Ganji). Owners only receive this brief.
  select count(*) filter (where g is not null), coalesce(sum(g), 0) into gj_n, gj from (
    select coalesce(op.ganji, (select sum(pp.ganji * oi.qty) from public.order_items oi join public.product_private pp on pp.product_id = oi.product_id where oi.order_id = o.id and pp.ganji is not null)) g
    from public.orders o left join public.order_private op on op.order_id = o.id
    where o.created_at >= day0 - interval '6 days' and o.status <> 'cancelled') x;
  for r in select value v from jsonb_array_elements(f) loop insert into private.brief_sent(key) values (r.v->>'key') on conflict do nothing; end loop;
  return jsonb_build_object('send', true, 'tag', 'brief',
    'title', case when extract(hour from now() at time zone tz) < 12 then 'Asubuhi' else 'Mchana' end
      || ' · oda ' || (n_new + n_pend + n_done) || ' · TSh ' || to_char(sales, 'FM999,999,999'),
    'body', n_new || ' mpya · ' || n_pend || ' zinasubiri · ' || n_done || ' zimekamilika'
      || E'\nWateja wapya ' || visitors || ' · Kuna bidhaa ' || live
      || case when extract(hour from now() at time zone tz) >= 12 and gj_n > 0 then E'\n💰 Ganji ya wiki: TSh ' || to_char(gj, 'FM999,999,999') || ' (oda ' || gj_n || ')' else '' end
      || case when claims > 0 then E'\n' || claims || ' wamelipa, hakiki malipo' else '' end
      || case when jsonb_array_length(f) > 0 then E'\n⚠️ ' || (select string_agg(x->>'text', ' · ') from (select x from jsonb_array_elements(f) x limit 3) y) else '' end);
end $function$;
revoke all on function public.team_brief(text) from public, anon, authenticated;
