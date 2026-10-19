-- Niagize Kariakoo v2.1 (Oct 2026). Applied 19 Oct 2026. Additive only, so the v2.0 apps keep working.
-- Data rewrites (categories, hidden -> archived) live in v2_1_data.sql.
-- 1. Categories: Urembo (accessories), Viatu without Raba, Mama & Watoto without Midoli (Mama -> Mzazi),
--    Nguo & Fashion without Vitenge, Electronics = Simu + Vifaa (gadgets), Nyingine has no sub-groups.
-- 2. Hidden is folded into Archive.
-- 3. Orders: per-item notes (Maelekezo), agreed total after bargaining, delivery fee set per order,
--    "seen" time so a new order moves to Nakurudia 2 minutes after the team opens it.

alter table public.order_items add column if not exists note text check (note is null or length(note) <= 200);
alter table public.orders add column if not exists agreed_total integer check (agreed_total is null or agreed_total >= 0);
alter table public.orders add column if not exists seen_at timestamptz;

-- create_order: fee is now set by the team per order (starts empty); each item may carry a short note.
create or replace function public.create_order(items jsonb, delivery text default 'fasta', address_id uuid default null, name text default null, phone text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  o public.orders; it jsonb; p public.products; q int; sub int := 0; cnt int := 0; v_priced boolean := true;
  uid uuid := auth.uid(); prof public.profiles; addr public.addresses; v_del text := delivery;
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; c text;
begin
  if jsonb_typeof(items) <> 'array' or jsonb_array_length(items) = 0 or jsonb_array_length(items) > 30 then raise exception 'items'; end if;
  if v_del is null or v_del not in ('fasta','leo') then v_del := 'fasta'; end if;
  if uid is not null then
    select * into prof from public.profiles where id = uid;
    if address_id is not null then select * into addr from public.addresses a where a.id = address_id and a.user_id = uid; end if;
  end if;
  loop
    c := 'NK-'; for i in 1..5 loop c := c || substr(alphabet, 1 + floor(random()*length(alphabet))::int, 1); end loop;
    exit when not exists (select 1 from public.orders x where x.code = c);
  end loop;
  insert into public.orders(code, customer_id, customer_name, customer_phone, address, delivery, delivery_fee, history)
  values (c, uid, coalesce(nullif(prof.full_name,''), left(name,60)), coalesce(prof.whatsapp, left(phone,20)),
          case when addr.id is not null then jsonb_build_object('label',addr.label,'line',addr.line,'landmark',addr.landmark,'lat',addr.lat,'lng',addr.lng) end,
          v_del, null, jsonb_build_array(jsonb_build_object('s','new','at',now())))
  returning * into o;
  for it in select * from jsonb_array_elements(items) loop
    begin
      select * into p from public.products pp where pp.id = (it->>'id')::uuid and pp.status = 'active';
    exception when invalid_text_representation then p := null;
    end;
    continue when p.id is null;
    q := greatest(1, least(99, coalesce((it->>'qty')::int, 1)));
    insert into public.order_items(order_id, product_id, name, price, qty, thumb, note)
    values (o.id, p.id, p.name, p.price, q, coalesce(p.thumbs[1], p.images[1]), nullif(left(trim(coalesce(it->>'note','')), 200), ''));
    if p.price is null then v_priced := false; else sub := sub + p.price * q; end if;
    cnt := cnt + q;
    update public.products pp set ordered = pp.ordered + q, asks = pp.asks + 1 where pp.id = p.id;
  end loop;
  if cnt = 0 then raise exception 'no_items'; end if;
  update public.orders x set subtotal = sub, items_count = cnt, priced = v_priced where x.id = o.id;
  insert into public.events(type) values ('order');
  return jsonb_build_object('code', c, 'subtotal', sub, 'fee', null, 'priced', v_priced, 'count', cnt);
end $$;

create or replace function public.get_order(c text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'code', o.code, 'created_at', o.created_at, 'status', o.status, 'delivery', o.delivery, 'delivery_fee', o.delivery_fee,
    'subtotal', o.subtotal, 'agreed_total', o.agreed_total, 'priced', o.priced, 'items_count', o.items_count, 'history', o.history, 'pay_ref', o.pay_ref,
    'seen_at', case when public.is_admin() then o.seen_at end,
    'customer_name', case when public.is_admin() or o.customer_id = auth.uid() then o.customer_name end,
    'customer_phone', case when public.is_admin() or o.customer_id = auth.uid() then o.customer_phone end,
    'address', case when public.is_admin() or o.customer_id = auth.uid() then o.address end,
    'cancel_reason', o.cancel_reason, 'pay_name', case when public.is_admin() then o.pay_name end,
    'items', (select coalesce(jsonb_agg(jsonb_build_object('product_id', i.product_id, 'name', i.name, 'price', i.price, 'qty', i.qty, 'thumb', i.thumb, 'note', i.note) order by i.id), '[]'::jsonb) from public.order_items i where i.order_id = o.id),
    'payments', (select payments from public.shop where id = 1),
    'whatsapp', (select whatsapp from public.shop where id = 1))
  from public.orders o where o.code = upper(c);
$$;

-- set_order_v2: everything set_order (v2.0) does, plus agreed total and "seen". v2.0 keeps calling set_order.
create or replace function public.set_order_v2(c text, st text, ref text default null, payer text default null, reason text default null,
  phone text default null, fee integer default null, total integer default null, clear_total boolean default false, seen boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare o public.orders;
begin
  if not public.is_admin() then raise exception 'not_team'; end if;
  if st not in ('new','progress','invoiced','paid','done','cancelled') then raise exception 'status'; end if;
  if fee is not null and (fee < 0 or fee > 10000000) then raise exception 'fee'; end if;
  if total is not null and (total < 0 or total > 100000000) then raise exception 'total'; end if;
  if st = 'cancelled' and nullif(trim(coalesce(reason,'')),'') is null and not exists (select 1 from public.orders x where x.code = upper(c) and x.status = 'cancelled') then raise exception 'reason'; end if;
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
  if o.id is null then raise exception 'not_found'; end if;
  return public.get_order(o.code);
end $$;
revoke all on function public.set_order_v2(text,text,text,text,text,text,integer,integer,boolean,boolean) from public, anon;
grant execute on function public.set_order_v2(text,text,text,text,text,text,integer,integer,boolean,boolean) to authenticated;

-- A new order the team has opened moves to Nakurudia (progress) after 2 minutes on its own.
create or replace function public.auto_progress() returns integer language sql security definer set search_path = public as $$
  with a as (update public.orders set status = 'progress', updated_at = now(),
               history = history || jsonb_build_array(jsonb_build_object('s','progress','at',now(),'auto',true))
             where status = 'new' and seen_at is not null and seen_at < now() - interval '2 minutes' returning 1)
  select count(*)::int from a;
$$;
revoke all on function public.auto_progress() from public, anon, authenticated;
select cron.schedule('niagize-auto-progress', '* * * * *', 'select public.auto_progress()');

create or replace function public.order_total(o public.orders) returns integer language sql immutable as $$
  select coalesce(o.agreed_total, o.subtotal + coalesce(o.delivery_fee, 0));
$$;

create or replace function public.dashboard(days integer default 7)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare since timestamptz := now() - make_interval(days => days); r jsonb;
begin
  if not public.is_admin() then raise exception 'not_team'; end if;
  select jsonb_build_object(
    'visitors', (select count(distinct session) from public.events where type = 'visit' and at > since),
    'views', (select count(*) from public.events where type = 'view' and at > since),
    'carts', (select count(*) from public.events where type = 'cart' and at > since),
    'chats', (select count(*) from public.events where type = 'chat' and at > since),
    'orders', (select count(*) from public.orders where created_at > since),
    'paid', (select count(*) from public.orders where created_at > since and status in ('paid','done')),
    'sales', (select coalesce(sum(public.order_total(o)),0) from public.orders o where created_at > since and status in ('paid','done')),
    'open', (select count(*) from public.orders where status in ('new','progress','invoiced','paid')),
    'new', (select count(*) from public.orders where status = 'new'),
    'by_day', (select coalesce(jsonb_agg(jsonb_build_object('d', d::date, 'orders', (select count(*) from public.orders where created_at::date = d::date), 'visitors', (select count(distinct session) from public.events where type='visit' and at::date = d::date)) order by d), '[]'::jsonb)
               from generate_series((now() - make_interval(days => days - 1))::date, now()::date, interval '1 day') d),
    'top', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (select p.id, p.name, coalesce(p.thumbs[1], p.images[1]) thumb, count(e.id) views, p.ordered from public.products p left join public.events e on e.product_id = p.id and e.type = 'view' and e.at > since group by p.id order by p.ordered desc, count(e.id) desc limit 5) x)
  ) into r;
  return r;
end $$;

alter function public.order_total(public.orders) set search_path = public;

-- Count wrong passwords atomically so parallel guesses can't slip past the 5-try lock (found in stress test, 19 Oct).
create or replace function public.login_fail(k text) returns jsonb language sql security definer set search_path = public as $$
  insert into public.login_attempts as la (username, fails, locked_until) values (k, 1, null)
  on conflict (username) do update set
    fails = case when la.locked_until is not null and la.locked_until <= now() then 1 else la.fails + 1 end,
    locked_until = case when la.locked_until is not null and la.locked_until <= now() then null
                        when la.fails + 1 >= 5 then coalesce(la.locked_until, now() + interval '15 minutes')
                        else la.locked_until end
  returning jsonb_build_object('fails', la.fails, 'locked_until', la.locked_until);
$$;
revoke all on function public.login_fail(text) from public, anon, authenticated;
