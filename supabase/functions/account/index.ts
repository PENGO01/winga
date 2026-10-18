// Niagize accounts: sign up / sign in with username + 6-digit PIN, change PIN or contacts, delete account.
// Usernames map to a login email kept on the server. Five wrong PINs lock the username for 15 minutes.
// Deployed with verify_jwt = false (sign up / sign in have no token yet); the other actions check the token themselves.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const USER = /^[a-z0-9_.]{3,20}$/;
const PIN = /^[0-9]{6}$/;
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

  async function session(email: string, pin: string) {
    const { data, error } = await pub().auth.signInWithPassword({ email, password: pin });
    if (error || !data.session) return null;
    return { access_token: data.session.access_token, refresh_token: data.session.refresh_token };
  }
  async function caller() {
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!token) return null;
    const { data } = await admin.auth.getUser(token);
    return data.user ?? null;
  }

  if (b.action === "signup") {
    const username = String(b.username ?? "").trim().toLowerCase();
    const pin = String(b.pin ?? "");
    const full_name = String(b.full_name ?? "").trim().slice(0, 60);
    const whatsapp = phone(b.whatsapp);
    const email = String(b.email ?? "").trim().toLowerCase();
    if (!USER.test(username)) return json({ error: "username" }, 400);
    if (!PIN.test(pin)) return json({ error: "pin" }, 400);
    if (full_name.length < 2) return json({ error: "name" }, 400);
    if (whatsapp.length < 12) return json({ error: "whatsapp" }, 400);
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "email" }, 400);
    const { data: taken } = await admin.from("profiles").select("id").eq("username", username).maybeSingle();
    if (taken) return json({ error: "taken" }, 409);
    const loginEmail = `${username}@users.niagize.app`;
    const { data: made, error: ce } = await admin.auth.admin.createUser({ email: loginEmail, password: pin, email_confirm: true, user_metadata: { name: full_name } });
    if (ce || !made.user) return json({ error: "create_failed", detail: ce?.message }, 400);
    const { error: pe } = await admin.from("profiles").insert({ id: made.user.id, username, full_name, whatsapp, email: email || null, kind: "customer" });
    if (pe) { await admin.auth.admin.deleteUser(made.user.id); return json({ error: "save_failed" }, 500); }
    const s = await session(loginEmail, pin);
    return json({ ok: true, session: s });
  }

  if (b.action === "login") {
    const login = String(b.login ?? "").trim().toLowerCase();
    const pin = String(b.pin ?? "");
    if (!login || !pin) return json({ error: "missing" }, 400);
    let email = login;
    const key = login;
    const { data: lock } = await admin.from("login_attempts").select("*").eq("username", key).maybeSingle();
    if (lock?.locked_until && new Date(lock.locked_until) > new Date()) return json({ error: "locked", until: lock.locked_until }, 429);
    if (!login.includes("@")) {
      const { data: prof } = await admin.from("profiles").select("id").eq("username", login).maybeSingle();
      if (prof) { const { data: u } = await admin.auth.admin.getUserById(prof.id); email = u?.user?.email ?? ""; } else email = "";
    }
    const s = email ? await session(email, pin) : null;
    if (!s) {
      const fails = (lock?.fails ?? 0) + 1;
      await admin.from("login_attempts").upsert({ username: key, fails: fails >= 5 ? 0 : fails, locked_until: fails >= 5 ? new Date(Date.now() + 15 * 60e3).toISOString() : null });
      return json({ error: fails >= 5 ? "locked" : "wrong", left: Math.max(0, 5 - fails) }, 401);
    }
    if (lock) await admin.from("login_attempts").delete().eq("username", key);
    return json({ ok: true, session: s });
  }

  const me = await caller();
  if (!me) return json({ error: "auth" }, 401);

  if (b.action === "set_pin") {
    const pin = String(b.pin ?? "");
    if (!PIN.test(pin)) return json({ error: "pin" }, 400);
    const username = String(b.username ?? "").trim().toLowerCase();
    if (username) {
      if (!USER.test(username)) return json({ error: "username" }, 400);
      const { data: taken } = await admin.from("profiles").select("id").eq("username", username).neq("id", me.id).maybeSingle();
      if (taken) return json({ error: "taken" }, 409);
      const { data: mine } = await admin.from("profiles").select("id").eq("id", me.id).maybeSingle();
      if (mine) await admin.from("profiles").update({ username }).eq("id", me.id);
      else await admin.from("profiles").insert({ id: me.id, username, full_name: String(me.user_metadata?.name ?? ""), kind: "staff", verified: true });
    }
    const { error } = await admin.auth.admin.updateUserById(me.id, { password: pin });
    if (error) return json({ error: "pin_failed", detail: error.message }, 400);
    return json({ ok: true });
  }

  if (b.action === "contacts") {
    const patch: Record<string, unknown> = { verified: false };
    if (b.whatsapp !== undefined) { const w = phone(b.whatsapp); if (w.length < 12) return json({ error: "whatsapp" }, 400); patch.whatsapp = w; }
    if (b.email !== undefined) { const e = String(b.email).trim().toLowerCase(); if (e && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return json({ error: "email" }, 400); patch.email = e || null; }
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
