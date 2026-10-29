-- Run 29 Oct 2026 (Super Admin): live starts with an empty shelf. Products stay in winga-dev.
-- Photo files are kept in live storage on purpose: dev's copied products show them.
delete from public.product_private;
delete from public.products;
