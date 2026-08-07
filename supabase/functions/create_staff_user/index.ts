// Edge Function: create_staff_user
// Dipanggil oleh super_admin dari dashboard untuk membuat akun staf baru
// (admin_cabang, psikolog, terapis, karyawan) sekaligus profile-nya.
//
// Deploy: supabase functions deploy create_staff_user
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto-provided)

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ROLES = ["admin_cabang", "psikolog", "terapis", "karyawan"] as const;
type StaffRole = typeof ALLOWED_ROLES[number];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // 1. Ambil JWT caller & verify sebagai super_admin
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    if (!jwt) throw new Error("Tidak ada Authorization header.");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client dengan JWT caller (untuk verify identity)
    const supabaseCaller = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: userData, error: userErr } = await supabaseCaller.auth.getUser();
    if (userErr || !userData?.user) throw new Error("Token tidak valid.");
    const callerId = userData.user.id;

    // Cek role caller di tabel profiles
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const { data: callerProfile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", callerId)
      .maybeSingle();
    if (profileErr) throw new Error(`Gagal cek profile caller: ${profileErr.message}`);
    if (!callerProfile || callerProfile.role !== "super_admin") {
      return new Response(JSON.stringify({ error: "Hanya super_admin yang boleh membuat akun." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Parse & validasi input
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const full_name = String(body.full_name ?? "").trim();
    const role = body.role as StaffRole;
    const branch_id = body.branch_id ? String(body.branch_id) : null;
    const phone = body.phone ? String(body.phone).trim() : null;

    if (!email || !email.includes("@")) throw new Error("Email tidak valid.");
    if (password.length < 8) throw new Error("Password minimal 8 karakter.");
    if (!full_name) throw new Error("Nama lengkap wajib diisi.");
    if (!ALLOWED_ROLES.includes(role)) {
      throw new Error(`Role harus salah satu dari: ${ALLOWED_ROLES.join(", ")}.`);
    }

    // 3. Create auth user (auto-confirm email)
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role },
    });
    if (createErr || !created?.user) {
      throw new Error(`Gagal membuat akun: ${createErr?.message ?? "unknown error"}`);
    }

    // 4. Insert profile row
    const { error: insertErr } = await supabaseAdmin.from("profiles").insert({
      id: created.user.id,
      full_name,
      role,
      branch_id,
      phone,
      is_active: true,
    });
    if (insertErr) {
      // Rollback: hapus auth user kalau profile insert gagal
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      throw new Error(`Gagal simpan profile: ${insertErr.message}`);
    }

    // 5. Audit log
    await supabaseAdmin.from("activity_logs").insert({
      actor_id: callerId,
      action: "user.create",
      entity: "profiles",
      entity_id: created.user.id,
      metadata: { email, role, branch_id },
    });

    return new Response(
      JSON.stringify({
        ok: true,
        user_id: created.user.id,
        email,
        role,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
