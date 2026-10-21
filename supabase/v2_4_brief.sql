-- Niagize review #4 (21 Oct 2026): the team brief.
-- 09:30 and 13:30 Dar es Salaam time: a push to the owners' phones with the day's numbers + anything that needs action.
-- Every 30 minutes (07:00–21:00): a push only when something critical is new (each finding is sent once).
-- Additive. The notify edge function (action "brief") calls team_brief() and sends the result.

create table if not exists private.brief_sent (key text primary key, at timestamptz not null default now());

create or replace function public.team_brief(kind text default 'daily')
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  tz text := 'Africa/Dar_es_Salaam';
  day0 timestamptz := (date_trunc('day', now() at time zone tz)) at time zone tz;
  f jsonb := '[]'::jsonb; fresh jsonb := '[]'::jsonb; r record; k text;
  n_new int; n_pend int; n_done int; sales bigint; visitors int; live int; claims int;
  shop_wa text;
begin
  -- findings that need someone now
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

  -- daily numbers (today, Dar es Salaam time)
  select count(*) filter (where status = 'new'), count(*) filter (where status in ('progress','invoiced','paid')), count(*) filter (where status = 'done')
    into n_new, n_pend, n_done from public.orders where created_at >= day0;
  select coalesce(sum(public.order_total(o)), 0) into sales from public.orders o where created_at >= day0 and status in ('paid','done');
  select count(distinct session) into visitors from public.events where type = 'visit' and at >= day0;
  select count(*) into live from public.products where status = 'active';
  select count(*) into claims from public.orders where status = 'invoiced' and claim_at is not null;
  -- mark today's findings as sent so the 30-minute check doesn't repeat them
  for r in select value v from jsonb_array_elements(f) loop insert into private.brief_sent(key) values (r.v->>'key') on conflict do nothing; end loop;
  return jsonb_build_object('send', true, 'tag', 'brief',
    -- v2.6.2: the numbers sit in the title so the lock-screen preview is readable; tap opens the full brief in the app
    'title', case when extract(hour from now() at time zone tz) < 12 then 'Asubuhi' else 'Mchana' end
      || ' · oda ' || (n_new + n_pend + n_done) || ' · TSh ' || to_char(sales, 'FM999,999,999'),
    'body', n_new || ' mpya · ' || n_pend || ' zinasubiri · ' || n_done || ' zimekamilika'
      || E'\nWateja wapya ' || visitors || ' · Kuna bidhaa ' || live
      || case when claims > 0 then E'\n' || claims || ' wamelipa, hakiki malipo' else '' end
      || case when jsonb_array_length(f) > 0 then E'\n⚠️ ' || (select string_agg(x->>'text', ' · ') from (select x from jsonb_array_elements(f) x limit 3) y) else '' end);
end $$;
revoke all on function public.team_brief(text) from public, anon, authenticated;
grant execute on function public.team_brief(text) to service_role;

-- the caller cron uses: sends the brief through the notify function
create or replace function public.send_brief(kind text) returns void language plpgsql security definer set search_path to 'public' as $$
declare s text;
begin
  select hook_secret into s from private.push_config where id = 1;
  perform net.http_post(url := 'https://omnigqtooirwmpmjgaio.supabase.co/functions/v1/notify',
    body := jsonb_build_object('action', 'brief', 'kind', kind),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-niagize-hook', s), timeout_milliseconds := 8000);
end $$;
revoke all on function public.send_brief(text) from public, anon, authenticated;

-- schedule (UTC): 06:30 = 09:30 EAT, 10:30 = 13:30 EAT; critical every 30 min 07:00–21:00 EAT (04–18 UTC)
select cron.schedule('niagize-brief-0930', '30 6 * * *', $$select public.send_brief('daily')$$);
select cron.schedule('niagize-brief-1330', '30 10 * * *', $$select public.send_brief('daily')$$);
select cron.schedule('niagize-critical', '*/30 4-18 * * *', $$select public.send_brief('critical')$$);
