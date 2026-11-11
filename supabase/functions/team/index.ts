// Niagize team: a shop owner (boss or super admin) adds or removes assistants, or resets a password.
// The caller's own token proves who they are; the service key (server-side only) creates the account.
// v2.25: "add" also gives the assistant a sign-in name (from their name), the super admin can reset the boss,
// and an owner can reset a customer's password ("reset_customer") after a "forgot password" WhatsApp.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const okPass = (p: string) => p.length >= 6 && p.length <= 72;
const phone = (p: string) => { let d = String(p || "").replace(/\D/g, ""); if (d.startsWith("0")) d = "255" + d.slice(1); else if (d.length === 9) d = "255" + d; return d; };

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

  // a free sign-in name made from a person's name: "Boss Drew" -> "bossdrew", then bossdrew2, bossdrew3 ...
  async function freeUsername(name: string) {
    let base = name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "").slice(0, 16);
    if (base.length < 3) base = (base + "staff").slice(0, 16);
    for (let i = 1; i < 50; i++) {
      const u = i === 1 ? base : base + i;
      const { data } = await admin.from("profiles").select("id").eq("username", u).maybeSingle();
      if (!data) return u;
    }
    return base + Math.floor(Math.random() * 9000 + 1000);
  }

  if (body.action === "add") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim().slice(0, 40);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "email" }, 400);
    if (password.length < 6) return json({ error: "password_short" }, 400);
    if (!name) return json({ error: "name" }, 400);
    const { data: made, error: ce } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name } });
    if (ce || !made.user) return json({ error: /already/i.test(ce?.message ?? "") ? "exists" : "create_failed" }, 400);
    const { error: ie } = await admin.from("admins").insert({ user_id: made.user.id, name, role: "assistant" });
    if (ie) { await admin.auth.admin.deleteUser(made.user.id); return json({ error: "save_failed" }, 500); }
    // a sign-in name too, so the assistant can type it instead of the email (v2.25)
    const username = await freeUsername(name);
    await admin.from("profiles").insert({ id: made.user.id, username, full_name: name, kind: "staff", verified: true });
    return json({ ok: true, user_id: made.user.id, name, email, username });
  }

  if (body.action === "remove") {
    const id = String(body.user_id ?? "");
    const { data: row } = await admin.from("admins").select("role").eq("user_id", id).maybeSingle();
    if (!row || row.role !== "assistant") return json({ error: "not_assistant" }, 400);
    await admin.from("admins").delete().eq("user_id", id);
    await admin.from("profiles").delete().eq("id", id);
    await admin.auth.admin.deleteUser(id);
    return json({ ok: true });
  }

  // an owner sets a new password for an assistant who forgot theirs; the super admin may also reset the boss
  if (body.action === "reset") {
    const id = String(body.user_id ?? "");
    const password = String(body.password ?? "");
    if (!okPass(password)) return json({ error: "password_short" }, 400);
    const { data: row } = await admin.from("admins").select("role").eq("user_id", id).maybeSingle();
    let allowed = !!row && row.role === "assistant";
    if (row && row.role === "boss") { const { data: isSuper } = await asCaller.rpc("is_super"); allowed = isSuper === true; }
    if (!allowed) return json({ error: "not_assistant" }, 400);
    const { error } = await admin.auth.admin.updateUserById(id, { password });
    if (error) return json({ error: "reset_failed" }, 400);
    await admin.from("login_attempts").delete().eq("username", String(body.login ?? "").toLowerCase());
    return json({ ok: true });
  }

  // v2.25: a customer asked on WhatsApp ("Umesahau neno la siri?"); the owner finds them by @username or WhatsApp
  // number and sets a new password. Staff accounts are never reset here.
  if (body.action === "reset_customer") {
    const login = String(body.login ?? "").trim().toLowerCase().replace(/^@/, "");
    const password = String(body.password ?? "");
    if (!login) return json({ error: "login" }, 400);
    if (!okPass(password)) return json({ error: "password_short" }, 400);
    const w = phone(login);
    let q = admin.from("profiles").select("id,username,full_name,whatsapp,kind");
    q = /^[0-9+ ]+$/.test(login) && w.length >= 12 ? q.eq("whatsapp", w) : q.eq("username", login);
    const { data: rows } = await q.limit(2);
    const p = rows && rows.length === 1 ? rows[0] : null;
    if (!p) return json({ error: "not_found" }, 404);
    const { data: staff } = await admin.from("admins").select("user_id").eq("user_id", p.id).maybeSingle();
    if (staff || p.kind !== "customer") return json({ error: "not_customer" }, 400);
    const { error } = await admin.auth.admin.updateUserById(p.id, { password });
    if (error) return json({ error: "reset_failed" }, 400);
    await admin.from("login_attempts").delete().in("username", [p.username, p.whatsapp].filter(Boolean));
    return json({ ok: true, name: p.full_name, username: p.username, whatsapp: p.whatsapp });
  }

  if (body.action === "list") {
    const { data: isSuper } = await asCaller.rpc("is_super");
    const { data: rows } = await admin.from("admins").select("user_id,name,role,added_at").order("added_at");
    const out = [];
    for (const r of rows ?? []) {
      if (r.role === "super_admin" && isSuper !== true) continue;   // the super admin stays out of a boss's list
      const { data: u } = await admin.auth.admin.getUserById(r.user_id);
      const { data: pr } = await admin.from("profiles").select("username").eq("id", r.user_id).maybeSingle();
      out.push({ ...r, email: u?.user?.email ?? "", username: pr?.username ?? null });
    }
    return json({ ok: true, team: out });
  }
  return json({ error: "action" }, 400);
});
