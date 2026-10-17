// Niagize team: a shop owner (boss or super admin) adds or removes assistants.
// The caller's own token proves who they are; the service key (server-side only) creates the account.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const auth = req.headers.get("Authorization") ?? "";
  const asCaller = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const admin = createClient(url, service, { auth: { persistSession: false } });

  const { data: owner, error: oe } = await asCaller.rpc("is_owner");
  if (oe || owner !== true) return json({ error: "not_owner" }, 403);

  let body: Record<string, string> = {};
  try { body = await req.json(); } catch { return json({ error: "bad_json" }, 400); }

  if (body.action === "add") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim().slice(0, 40);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "email" }, 400);
    if (password.length < 8) return json({ error: "password_short" }, 400);
    if (!name) return json({ error: "name" }, 400);
    const { data: made, error: ce } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name } });
    if (ce || !made.user) return json({ error: /already/i.test(ce?.message ?? "") ? "exists" : "create_failed" }, 400);
    const { error: ie } = await admin.from("admins").insert({ user_id: made.user.id, name, role: "assistant" });
    if (ie) { await admin.auth.admin.deleteUser(made.user.id); return json({ error: "save_failed" }, 500); }
    return json({ ok: true, user_id: made.user.id, name, email });
  }

  if (body.action === "remove") {
    const id = String(body.user_id ?? "");
    const { data: row } = await admin.from("admins").select("role").eq("user_id", id).maybeSingle();
    if (!row || row.role !== "assistant") return json({ error: "not_assistant" }, 400);
    await admin.from("admins").delete().eq("user_id", id);
    await admin.auth.admin.deleteUser(id);
    return json({ ok: true });
  }

  if (body.action === "list") {
    const { data: isSuper } = await asCaller.rpc("is_super");
    const { data: rows } = await admin.from("admins").select("user_id,name,role,added_at").order("added_at");
    const out = [];
    for (const r of rows ?? []) {
      if (r.role === "super_admin" && isSuper !== true) continue;   // the super admin stays out of a boss's list
      const { data: u } = await admin.auth.admin.getUserById(r.user_id);
      out.push({ ...r, email: u?.user?.email ?? "" });
    }
    return json({ ok: true, team: out });
  }
  return json({ error: "action" }, 400);
});
