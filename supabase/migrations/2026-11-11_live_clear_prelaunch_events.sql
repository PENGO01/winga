-- Ran on winga (live) only, 11 Nov 2026, with Super Admin's OK. Launch: the dashboard visitor count starts at go-live (12:00 EAT = 09:00 UTC).
create schema if not exists backup_20261111;
create table backup_20261111.events as select * from public.events where at < timestamptz '2026-11-11 09:00:00+00';
delete from public.events where at < timestamptz '2026-11-11 09:00:00+00';
-- Undo: insert into public.events select * from backup_20261111.events;
