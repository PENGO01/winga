-- Niagize v2.1 data tidy-up. NOT yet applied: waits for Super Admin's OK (it rewrites live rows).
-- Until then the v2.1 apps map the old keys on the fly (see normalize() in shared/core.js).
update public.products set subcategory = 'gadgets' where category = 'electronics' and coalesce(subcategory,'') <> 'phones';
update public.products set subcategory = null where category = 'other';
update public.products set subcategory = 'men' where category = 'shoes' and subcategory = 'sport';
update public.products set subcategory = 'kidswear' where category = 'kids' and subcategory = 'toys';
update public.products set subcategory = 'women' where category = 'fashion' and subcategory = 'kitenge';
update public.products set status = 'archived' where status in ('hidden','soldout');
