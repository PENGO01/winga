-- v2.18 (NOT RUN YET — run in Supabase SQL editor after review)
-- "Nimepokea" can close an order without stars ("Ruka, funga oda"). Stars stay 1–5 when given.
-- Additive: v2.0 live and the v2.16/2.17 beta keep working (they always send stars).
create or replace function public.customer_received(c text, stars integer, note text default null)
returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare o public.orders;
begin
  if stars is not null and (stars < 1 or stars > 5) then raise exception 'stars'; end if;
  update public.orders set
    status = 'done', received_at = coalesce(received_at, now()), rating = coalesce(stars, rating),
    rating_note = case when stars is null then rating_note else nullif(left(trim(coalesce(note,'')),300),'') end, updated_at = now(),
    history = history || case when status = 'done' then '[]'::jsonb else jsonb_build_array(jsonb_build_object('s','done','at',now(),'by','customer')) end
  where code = upper(c) and status in ('paid','done') returning * into o;
  if o.id is null then raise exception 'status'; end if;
  return public.get_order(o.code);
end $function$;
