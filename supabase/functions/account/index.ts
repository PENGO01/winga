// Niagize accounts (v2.1): sign up / sign in with username + password, change password or contacts,
// finish a Google sign-in, delete account. Usernames map to a login email kept on the server.
// Five wrong passwords lock the username for 15 minutes. A WhatsApp number or username already on file
// is reported as "duplicate" so the app can offer sign in / reset instead of a second account.
// Deployed with verify_jwt = false (sign up / sign in have no token yet); the other actions check the token themselves.
// v2.0 apps send "pin" instead of "password"; both are accepted.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const USER = /^[a-z0-9_.]{3,20}$/;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const okPass = (p: string) => typeof p === "string" && p.length >= 6 && p.length <= 72;
const phone = (p: string) => { let d = String(p || "").replace(/\D/g, ""); if (d.startsWith("0")) d = "255" + d.slice(1); else if (d.length === 9) d = "255" + d; return d; };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const pub = () => createClient(url, anonKey, { auth: { persistSession: false } });
  let b: Record<string, string> = {};
  try { b = await req.json(); } catch { return json({ error: "bad_json" }, 400); }
  const pass = String(b.password ?? b.pin ?? "");

  async function session(email: string, pw: string) {
    const { data, error } = await pub().auth.signInWithPassword({ email, password: pw });
    if (error || !data.session) return null;
    return { access_token: data.session.access_token, refresh_token: data.session.refresh_token };
  }
  async function caller() {
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!token) return null;
    const { data } = await admin.auth.getUser(token);
    return data.user ?? null;
  }
  async function duplicate(username: string, whatsapp: string, exceptId?: string) {
    let q = admin.from("profiles").select("id,username,whatsapp").or(`username.eq.${username},whatsapp.eq.${whatsapp}`);
    if (exceptId) q = q.neq("id", exceptId);
    const { data } = await q.limit(1);
    if (!data || !data.length) return null;
    return data[0].username === username ? "taken" : "duplicate";
  }

  if (b.action === "signup") {
    const username = String(b.username ?? "").trim().toLowerCase();
    const full_name = String(b.full_name ?? "").trim().slice(0, 60);
    const whatsapp = phone(b.whatsapp);
    const email = String(b.email ?? "").trim().toLowerCase();
    if (full_name.length < 2) return json({ error: "name" }, 400);
    if (!USER.test(username)) return json({ error: "username" }, 400);
    if (whatsapp.length < 12 || whatsapp.length > 15) return json({ error: "whatsapp" }, 400);
    if (email && !EMAIL.test(email)) return json({ error: "email" }, 400);
    if (!okPass(pass)) return json({ error: "password" }, 400);
    const dup = await duplicate(username, whatsapp);
    if (dup) return json({ error: dup }, 409);
    const loginEmail = `${username}@users.niagize.app`;
    const { data: made, error: ce } = await admin.auth.admin.createUser({ email: loginEmail, password: pass, email_confirm: true, user_metadata: { name: full_name } });
    if (ce || !made.user) return json({ error: /already/i.test(ce?.message ?? "") ? "taken" : "create_failed" }, 400);
    const { error: pe } = await admin.from("profiles").insert({ id: made.user.id, username, full_name, whatsapp, email: email || null, kind: "customer" });
    if (pe) { await admin.auth.admin.deleteUser(made.user.id); return json({ error: /duplicate|unique/i.test(pe.message) ? "taken" : "save_failed" }, 409); }
    const s = await session(loginEmail, pass);
    return json({ ok: true, session: s });
  }

  if (b.action === "login") {
    const login = String(b.login ?? "").trim().toLowerCase().replace(/^@/, "");
    if (!login || !pass) return json({ error: "missing" }, 400);
    let email = login;
    const key = login.slice(0, 80);
    const { data: lock } = await admin.from("login_attempts").select("*").eq("username", key).maybeSingle();
    if (lock?.locked_until && new Date(lock.locked_until) > new Date()) return json({ error: "locked", until: lock.locked_until }, 429);
    if (!login.includes("@")) {
      const { data: prof } = await admin.from("profiles").select("id").eq("username", login).maybeSingle();
      if (prof) { const { data: u } = await admin.auth.admin.getUserById(prof.id); email = u?.user?.email ?? ""; } else email = "";
    }
    const s = email ? await session(email, pass) : null;
    if (!s) {
      // counted in one database step, so guesses sent in parallel can't slip past the lock
      const { data: f } = await admin.rpc("login_fail", { k: key });
      const fails = Number(f?.fails ?? 1), locked = !!f?.locked_until && new Date(f.locked_until) > new Date();
      return json({ error: locked ? "locked" : "wrong", left: Math.max(0, 5 - fails) }, locked ? 429 : 401);
    }
    // a correct password only counts if the name isn't locked by guesses that landed meanwhile
    const { data: lock2 } = await admin.from("login_attempts").select("locked_until").eq("username", key).maybeSingle();
    if (lock2?.locked_until && new Date(lock2.locked_until) > new Date()) return json({ error: "locked", until: lock2.locked_until }, 429);
    await admin.from("login_attempts").delete().eq("username", key);
    return json({ ok: true, session: s });
  }

  const me = await caller();
  if (!me) return json({ error: "auth" }, 401);

  // finish a Google (or any OAuth) sign-in: the user exists but has no profile yet
  if (b.action === "complete") {
    const { data: has } = await admin.from("profiles").select("id").eq("id", me.id).maybeSingle();
    if (has) return json({ ok: true, already: true });
    const username = String(b.username ?? "").trim().toLowerCase();
    const full_name = String(b.full_name ?? me.user_metadata?.full_name ?? me.user_metadata?.name ?? "").trim().slice(0, 60);
    const whatsapp = phone(b.whatsapp);
    if (full_name.length < 2) return json({ error: "name" }, 400);
    if (!USER.test(username)) return json({ error: "username" }, 400);
    if (whatsapp.length < 12 || whatsapp.length > 15) return json({ error: "whatsapp" }, 400);
    const dup = await duplicate(username, whatsapp);
    if (dup) return json({ error: dup }, 409);
    const { error: pe } = await admin.from("profiles").insert({ id: me.id, username, full_name, whatsapp, email: me.email ?? null, kind: "customer", verified: !!me.email_confirmed_at });
    if (pe) return json({ error: "save_failed" }, 500);
    return json({ ok: true });
  }

  // change password (staff and customers); staff may also pick a username here
  if (b.action === "set_pin" || b.action === "set_password") {
    if (!okPass(pass)) return json({ error: "password" }, 400);
    // assistants don't change their own password: the boss resets it for them (team "reset")
    const { data: staffRow } = await admin.from("admins").select("role").eq("user_id", me.id).maybeSingle();
    if (staffRow?.role === "assistant") return json({ error: "assistant" }, 403);
    // v2.1+ (set_password) proves the current password first; v2.0's set_pin is left as it was
    if (b.action === "set_password") {
      const current = String(b.current ?? "");
      if (!current || !me.email || !(await session(me.email, current))) return json({ error: "current" }, 401);
    }
    const username = String(b.username ?? "").trim().toLowerCase();
    if (username) {
      if (!USER.test(username)) return json({ error: "username" }, 400);
      const { data: taken } = await admin.from("profiles").select("id").eq("username", username).neq("id", me.id).maybeSingle();
      if (taken) return json({ error: "taken" }, 409);
      const { data: mine } = await admin.from("profiles").select("id").eq("id", me.id).maybeSingle();
      if (mine) await admin.from("profiles").update({ username }).eq("id", me.id);
      else await admin.from("profiles").insert({ id: me.id, username, full_name: String(me.user_metadata?.name ?? ""), kind: "staff", verified: true });
    }
    const { error } = await admin.auth.admin.updateUserById(me.id, { password: pass });
    if (error) return json({ error: "pin_failed", detail: error.message }, 400);
    return json({ ok: true });
  }

  if (b.action === "contacts") {
    const patch: Record<string, unknown> = { verified: false };
    if (b.whatsapp !== undefined) {
      const w = phone(b.whatsapp); if (w.length < 12 || w.length > 15) return json({ error: "whatsapp" }, 400);
      const { data: other } = await admin.from("profiles").select("id").eq("whatsapp", w).neq("id", me.id).limit(1);
      if (other && other.length) return json({ error: "duplicate" }, 409);
      patch.whatsapp = w;
    }
    if (b.email !== undefined) { const e = String(b.email).trim().toLowerCase(); if (e && !EMAIL.test(e)) return json({ error: "email" }, 400); patch.email = e || null; }
    await admin.from("profiles").update(patch).eq("id", me.id);
    return json({ ok: true, verification: "pending" });
  }

  if (b.action === "delete") {
    const { data: staff } = await admin.from("admins").select("user_id").eq("user_id", me.id).maybeSingle();
    if (staff) return json({ error: "staff" }, 400);
    const { error } = await admin.auth.admin.deleteUser(me.id);
    if (error) return json({ error: "delete_failed" }, 500);
    return json({ ok: true });
  }
  return json({ error: "action" }, 400);
});
