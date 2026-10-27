-- v2.9 (27 Oct 2026): photo orders, delivery address as one line, categories the winga can edit. Additive.
-- 1) a public "requests" photo inbox: anyone may ADD a photo under r/ (max 3 MB, images only); nobody but the team can change or delete
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('requests', 'requests', true, 3145728, array['image/jpeg','image/webp','image/png'])
on conflict (id) do update set public = true, file_size_limit = 3145728, allowed_mime_types = array['image/jpeg','image/webp','image/png'];
drop policy if exists requests_add on storage.objects;
create policy requests_add on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'requests' and (storage.foldername(name))[1] = 'r');
drop policy if exists requests_team on storage.objects;
create policy requests_team on storage.objects for delete to authenticated using (bucket_id = 'requests' and public.is_admin());

-- 2) the winga's own sub-categories (the 5 main groups stay fixed in the app)
alter table public.shop add column if not exists taxonomy jsonb;

-- 3) create_order_v2 = create_order + a one-line address + photo items {photo, note, qty}
create or replace function public.create_order_v2(items jsonb, delivery text, address_id uuid, name text, phone text, addr_line text default null)
returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare
  o public.orders; it jsonb; p public.products; q int; sub int := 0; cnt int := 0; v_priced boolean := true;
  uid uuid := auth.uid(); prof public.profiles; addr public.addresses; v_del text := delivery; ph text;
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; c text;
  pref text := 'https://omnigqtooirwmpmjgaio.supabase.co/storage/v1/object/public/requests/r/';
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
          case when addr.id is not null then jsonb_build_object('label',addr.label,'line',addr.line,'landmark',addr.landmark,'lat',addr.lat,'lng',addr.lng)
               when nullif(trim(coalesce(addr_line,'')),'') is not null then jsonb_build_object('line', left(trim(addr_line),200)) end,
          v_del, null, jsonb_build_array(jsonb_build_object('s','new','at',now())))
  returning * into o;
  for it in select * from jsonb_array_elements(items) loop
    q := greatest(1, least(99, coalesce((it->>'qty')::int, 1)));
    if it ? 'photo' then
      ph := it->>'photo';
      continue when ph is null or left(ph, length(pref)) <> pref;
      insert into public.order_items(order_id, product_id, name, price, qty, thumb, note)
      values (o.id, null, left(coalesce(nullif(trim(coalesce(it->>'note','')),''), 'Bidhaa kwa picha'), 80), null, q, ph, nullif(left(trim(coalesce(it->>'note','')), 200), ''));
      v_priced := false; cnt := cnt + q;
      continue;
    end if;
    begin
      select * into p from public.products pp where pp.id = (it->>'id')::uuid and pp.status = 'active';
    exception when invalid_text_representation then p := null;
    end;
    continue when p.id is null;
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
grant execute on function public.create_order_v2(jsonb,text,uuid,text,text,text) to anon, authenticated;
