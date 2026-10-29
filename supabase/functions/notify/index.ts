// Niagize notify: Web Push to the team's phones.
//  - action "order" (called by the database on every new order, protected by the x-niagize-hook secret)
//      → "Oda mpya · NK-XXXXX" to every team member who switched notifications on; tapping opens that order.
//  - action "test"  (called from the Boss app with the member's own sign-in) → a test notification to their own phones.
//  - action "brief" (called by the database at 09:30 and 13:30 Dar es Salaam time, and every 30 min for critical findings,
//      protected by the hook secret) → the day's numbers / what needs action, to the owners (boss + super admin).
//  - action "setup" (anyone) → makes the VAPID keys once and returns the public key. Keys never leave the database.
// Deployed with verify_jwt = false: the hook secret or the caller's token is checked here.
// v2.21: SUBJECT is the shop's own address (niagize.tz). Source of truth for both projects (winga, winga-dev).
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { makeVapidKeys, sendPush } from "./webpush.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const SUBJECT = "https://niagize.tz/";
const money = (n: number) => Math.round(n || 0).toLocaleString("en-US");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  let b: Record<string, string> = {};
  try { b = await req.json(); } catch { return json({ error: "bad_json" }, 400); }

  // keys: made once, kept in the private schema
  const { data: cfg0, error: ce } = await admin.rpc("push_admin_config");
  if (ce || !cfg0) return json({ error: "config" }, 500);
  let cfg = cfg0 as { vapid_public: string | null; vapid_private: JsonWebKey | null; hook_secret: string };
  if (!cfg.vapid_public) {
    const k = await makeVapidKeys();
    await admin.rpc("push_admin_set_keys", { pub: k.publicKey, priv: k.privateJwk });
    const { data: again } = await admin.rpc("push_admin_config");
    cfg = again as typeof cfg;
  }
  if (b.action === "setup") return json({ ok: true, publicKey: cfg.vapid_public });
  const vapid = { privateJwk: cfg.vapid_private as JsonWebKey, publicKey: cfg.vapid_public as string, subject: SUBJECT };

  async function deliver(subs: { id: string; endpoint: string; p256dh: string; auth: string; app_url: string | null }[], make: (s: { app_url: string | null }) => unknown) {
    let sent = 0, gone = 0, failed = 0;
    await Promise.all(subs.map(async (s) => {
      let st = 0;
      try { st = await sendPush(s, make(s), vapid); } catch (_) { st = 0; }
      if (st >= 200 && st < 300) { sent++; await admin.from("push_subs").update({ last_ok: new Date().toISOString(), fails: 0 }).eq("id", s.id); }
      else if (st === 404 || st === 410) { gone++; await admin.from("push_subs").delete().eq("id", s.id); }
      else { failed++; await admin.from("push_subs").update({ fails: 1 }).eq("id", s.id); }
    }));
    return { sent, gone, failed, total: subs.length };
  }

  if (b.action === "order") {
    if (!cfg.hook_secret || req.headers.get("x-niagize-hook") !== cfg.hook_secret) return json({ error: "hook" }, 401);
    const code = String(b.code ?? "").toUpperCase();
    const { data: o } = await admin.from("orders").select("code,customer_name,items_count,subtotal,priced,delivery").eq("code", code).maybeSingle();
    if (!o) return json({ error: "not_found" }, 404);
    const { data: team } = await admin.from("admins").select("user_id");
    const ids = (team ?? []).map((t) => t.user_id);
    if (!ids.length) return json({ ok: true, total: 0 });
    const { data: subs } = await admin.from("push_subs").select("id,endpoint,p256dh,auth,app_url").in("user_id", ids);
    const who = o.customer_name || "Mteja mpya";
    const body = `${who} · bidhaa ${o.items_count}` + (o.subtotal ? ` · TSh ${money(o.subtotal)}` : "") + (o.delivery === "leo" ? " · Utumwe Leo" : "");
    const r = await deliver(subs ?? [], (s) => ({ title: `Oda mpya · ${o.code}`, body, tag: o.code, url: (s.app_url || SUBJECT + "admin/") + "#o-" + o.code }));
    return json({ ok: true, ...r });
  }

  if (b.action === "brief") {
    if (!cfg.hook_secret || req.headers.get("x-niagize-hook") !== cfg.hook_secret) return json({ error: "hook" }, 401);
    const kind = b.kind === "critical" ? "critical" : "daily";
    const { data: br, error: be } = await admin.rpc("team_brief", { kind });
    if (be || !br) return json({ error: "brief" }, 500);
    if (!br.send) return json({ ok: true, sent: 0, quiet: true });
    const { data: owners } = await admin.from("admins").select("user_id").in("role", ["boss", "super_admin"]);
    const ids = (owners ?? []).map((t) => t.user_id);
    if (!ids.length) return json({ ok: true, total: 0 });
    const { data: subs } = await admin.from("push_subs").select("id,endpoint,p256dh,auth,app_url").in("user_id", ids);
    const r = await deliver(subs ?? [], (s) => ({ title: br.title, body: br.body, tag: br.tag || "brief", url: (s.app_url || SUBJECT + "admin/") + (br.code ? "#o-" + br.code : "#b=" + encodeURIComponent(br.title + "\n" + br.body)) }));
    return json({ ok: true, kind, ...r });
  }

  if (b.action === "test") {
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: u } = await admin.auth.getUser(token);
    if (!u?.user) return json({ error: "auth" }, 401);
    const { data: subs } = await admin.from("push_subs").select("id,endpoint,p256dh,auth,app_url").eq("user_id", u.user.id);
    const r = await deliver(subs ?? [], (s) => ({ title: "Arifa ziko tayari ✓", body: "Oda mpya zitakufikia hapa. Gusa kufungua Niagize.", tag: "test", url: s.app_url || SUBJECT + "admin/" }));
    return json({ ok: true, ...r });
  }
  return json({ error: "action" }, 400);
});
