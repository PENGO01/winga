-- Niagize live (winga, omnigqtooirwmpmjgaio): remove test orders before the pilot. Run 29 Oct 2026 (Super Admin OK).
-- A full copy of everything below lives in winga-dev (zgpaitukibhmikhazgvk) since 29 Oct 2026.
-- Kept: shop settings, team, customer accounts and addresses, products (their order/ask counters reset to 0).
begin;
delete from public.order_private;
delete from public.order_items;
delete from public.orders;
delete from public.events;
delete from public.login_attempts;
delete from private.brief_sent;
update public.products set ordered = 0, asks = 0 where ordered <> 0 or asks <> 0;
drop function if exists public.tmp_dev_export(text);   -- one-off export used to copy data to dev (already disabled)
commit;
