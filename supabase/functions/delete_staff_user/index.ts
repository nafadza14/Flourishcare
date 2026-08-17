// Edge Function: delete_staff_user
// Hanya super_admin yang boleh memanggil. Hapus akun auth + row profiles + staff_profiles.
// Deploy: supabase functions deploy delete_staff_user

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");
    if (!jwt) throw new Error("Tidak ada Authorization header.");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseCaller = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: userData, error: userErr } = await supabaseCaller.auth.getUser();
    if (userErr || !userData?.user) throw new Error("Token tidak valid.");
    const callerId = userData.user.id;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    const { data: callerProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", callerId)
      .maybeSingle();
    if (!callerProfile || callerProfile.role !== "super_admin") {
      return new Response(JSON.stringify({ error: "Hanya super_admin yang boleh menghapus akun." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const target_user_id = String(body.user_id ?? "").trim();
    if (!target_user_id) throw new Error("user_id wajib diisi.");
    if (target_user_id === callerId) throw new Error("Tidak bisa menghapus akun sendiri.");

    // Hapus di staff_profiles (kalau ada) - cascade hapus schedules
    await supabaseAdmin.from("staff_profiles").delete().eq("profile_id", target_user_id);

    // Hapus di profiles
    await supabaseAdmin.from("profiles").delete().eq("id", target_user_id);

    // Hapus auth user (paling akhir)
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(target_user_id);
    if (delErr) {
      throw new Error(`Gagal hapus auth user: ${delErr.message}`);
    }

    // Audit log
    await supabaseAdmin.from("activity_logs").insert({
      actor_id: callerId,
      action: "user.delete",
      entity: "profiles",
      entity_id: target_user_id,
    });

    return new Response(JSON.stringify({ ok: true, deleted_user_id: target_user_id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
