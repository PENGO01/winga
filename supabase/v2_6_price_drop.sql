-- v2.6.3 (21 Oct 2026): price drops. When Boss lowers a price, the old one is kept and shown struck through (Temu style)
-- for 14 days. Raising a price (or going back up past the old one) clears it. Additive only.
alter table public.products add column if not exists prev_price integer;
alter table public.products add column if not exists price_drop_at timestamptz;

create or replace function public.products_price_drop() returns trigger language plpgsql set search_path to 'public' as $$
begin
  if new.price is distinct from old.price then
    if old.price is not null and new.price is not null and new.price < old.price then
      -- keep the highest recent price as the "was" price, so two cuts in a row still show the full saving
      new.prev_price := greatest(old.price, coalesce(case when old.price_drop_at > now() - interval '14 days' then old.prev_price end, 0));
      new.price_drop_at := now();
    else
      new.prev_price := null; new.price_drop_at := null;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists products_price_drop on public.products;
create trigger products_price_drop before update of price on public.products for each row execute function public.products_price_drop();
