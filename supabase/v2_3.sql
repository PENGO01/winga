-- Niagize review #3 (20 Oct 2026). Additive: v2.0 and v2.1 apps keep working.
-- Customer sends payment details (claim), confirms delivery with a rating; team names a "Mteja mpya".

alter table public.orders add column if not exists claim_ref text;
alter table public.orders add column if not exists claim_name text;
alter table public.orders add column if not exists claim_channel text;
alter table public.orders add column if not exists claim_at timestamptz;
alter table public.orders add column if not exists rating smallint check (rating between 1 and 5);
alter table public.orders add column if not exists rating_note text;
alter table public.orders add column if not exists received_at timestamptz;

create or replace function public.get_order(c text)
returns jsonb language sql stable security definer set search_path to 'public' as $$
  select jsonb_build_object(
    'code', o.code, 'created_at', o.created_at, 'updated_at', o.updated_at, 'status', o.status, 'delivery', o.delivery, 'delivery_fee', o.delivery_fee,
    'subtotal', o.subtotal, 'agreed_total', o.agreed_total, 'priced', o.priced, 'items_count', o.items_count, 'history', o.history, 'pay_ref', o.pay_ref,
    'seen_at', case when public.is_admin() then o.seen_at end,
    'customer_name', case when public.is_admin() or o.customer_id = auth.uid() then o.customer_name end,
    'customer_phone', case when public.is_admin() or o.customer_id = auth.uid() then o.customer_phone end,
    'address', case when public.is_admin() or o.customer_id = auth.uid() then o.address end,
    'cancel_reason', o.cancel_reason, 'pay_name', case when public.is_admin() then o.pay_name end,
    'claim_ref', o.claim_ref, 'claim_channel', o.claim_channel, 'claim_at', o.claim_at,
    'claim_name', case when public.is_admin() or o.customer_id = auth.uid() then o.claim_name end,
    'rating', o.rating, 'received_at', o.received_at,
    'rating_note', case when public.is_admin() then o.rating_note end,
    'items', (select coalesce(jsonb_agg(jsonb_build_object('product_id', i.product_id, 'name', i.name, 'price', i.price, 'qty', i.qty, 'thumb', i.thumb, 'note', i.note) order by i.id), '[]'::jsonb) from public.order_items i where i.order_id = o.id),
    'payments', (select payments from public.shop where id = 1),
    'whatsapp', (select whatsapp from public.shop where id = 1))
  from public.orders o where o.code = upper(c);
$$;

-- customer: "nimelipa" details after the invoice (anyone holding the order code, like the tracking page)
create or replace function public.submit_payment(c text, ref text, payer text, channel text)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare o public.orders;
begin
  if length(trim(coalesce(ref,''))) < 3 then raise exception 'ref'; end if;
  if length(trim(coalesce(payer,''))) < 2 then raise exception 'payer'; end if;
  update public.orders set claim_ref = left(trim(ref),60), claim_name = left(trim(payer),60),
    claim_channel = nullif(left(trim(coalesce(channel,'')),40),''), claim_at = now(), updated_at = now()
  where code = upper(c) and status = 'invoiced' returning * into o;
  if o.id is null then raise exception 'status'; end if;
  return public.get_order(o.code);
end $$;

-- customer: "Nimepokea" closes a paid order and leaves a rating
create or replace function public.customer_received(c text, stars integer, note text default null)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
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
end $$;

-- team: give a "Mteja mpya" a name
create or replace function public.set_order_name(c text, name text)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare o public.orders;
begin
  if not public.is_admin() then raise exception 'not_team'; end if;
  if length(trim(coalesce(name,''))) < 2 then raise exception 'name'; end if;
  update public.orders set customer_name = left(trim(name),60), updated_at = now() where code = upper(c) returning * into o;
  if o.id is null then raise exception 'not_found'; end if;
  return public.get_order(o.code);
end $$;

-- dashboard: + pending / done counts and customers (first-time vs all who ordered)
create or replace function public.dashboard(days integer default 7)
returns jsonb language plpgsql stable security definer set search_path to 'public' as $$
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
    'p_new', (select count(*) from public.orders where created_at > since and status = 'new'),
    'pending', (select count(*) from public.orders where created_at > since and status in ('progress','invoiced','paid')),
    'done', (select count(*) from public.orders where created_at > since and status = 'done'),
    'cancelled', (select count(*) from public.orders where created_at > since and status = 'cancelled'),
    'customers', (select count(distinct coalesce(customer_id::text, customer_phone)) from public.orders where created_at > since and coalesce(customer_id::text, customer_phone) is not null),
    'new_customers', (select count(*) from (select coalesce(customer_id::text, customer_phone) k, min(created_at) f from public.orders where coalesce(customer_id::text, customer_phone) is not null group by 1) x where x.f > since),
    'rating', (select round(avg(rating)::numeric,1) from public.orders where rating is not null and created_at > since),
    'by_day', (select coalesce(jsonb_agg(jsonb_build_object('d', d::date, 'orders', (select count(*) from public.orders where created_at::date = d::date), 'visitors', (select count(distinct session) from public.events where type='visit' and at::date = d::date)) order by d), '[]'::jsonb)
               from generate_series((now() - make_interval(days => days - 1))::date, now()::date, interval '1 day') d),
    'top', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (select p.id, p.name, coalesce(p.thumbs[1], p.images[1]) thumb, count(e.id) views, p.ordered from public.products p left join public.events e on e.product_id = p.id and e.type = 'view' and e.at > since group by p.id order by p.ordered desc, count(e.id) desc limit 5) x)
  ) into r;
  return r;
end $$;

grant execute on function public.submit_payment(text,text,text,text) to anon, authenticated;
grant execute on function public.customer_received(text,integer,text) to anon, authenticated;
grant execute on function public.set_order_name(text,text) to authenticated;
