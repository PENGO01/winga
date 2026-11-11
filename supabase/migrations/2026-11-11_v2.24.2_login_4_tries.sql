-- Ran on winga-dev, then winga (live), 11 Nov 2026. v2.24.2: lock a sign-in name after 4 wrong tries (was 5).
-- The account edge function still reports left = 5 - fails; the apps show tries used = 5 - left, out of 4.
CREATE OR REPLACE FUNCTION public.login_fail(k text)
 RETURNS jsonb
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  insert into public.login_attempts as la (username, fails, locked_until) values (k, 1, null)
  on conflict (username) do update set
    fails = case when la.locked_until is not null and la.locked_until <= now() then 1 else la.fails + 1 end,
    locked_until = case when la.locked_until is not null and la.locked_until <= now() then null
                        when la.fails + 1 >= 4 then coalesce(la.locked_until, now() + interval '15 minutes')
                        else la.locked_until end
  returning jsonb_build_object('fails', la.fails, 'locked_until', la.locked_until);
$function$;
-- Undo: run the same statement with ">= 5" in place of ">= 4".
