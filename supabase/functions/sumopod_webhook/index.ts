// Edge Function: sumopod_webhook
// Endpoint yang dipanggil Sumopod ketika status payment berubah.
// Setup: di Sumopod dashboard, arahkan webhook ke:
//   https://<project>.supabase.co/functions/v1/sumopod_webhook
// Deploy: supabase functions deploy sumopod_webhook --no-verify-jwt

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const payload = await req.json();
    // Sumopod payload format (asumsi): { payment_id, order_id, status, amount, ... }
    const { payment_id, order_id, status } = payload;
    if (!payment_id && !order_id) throw new Error("payload tanpa identifier");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Map Sumopod status → internal payment_status enum
    const statusMap: Record<string, string> = {
      paid: "paid",
      success: "paid",
      settlement: "paid",
      pending: "pending",
      failed: "failed",
      expired: "expired",
      cancelled: "failed",
    };
    const internalStatus = statusMap[String(status).toLowerCase()] ?? "pending";

    // Update payment record
    const { error } = await supabase
      .from("online_payments")
      .update({
        status: internalStatus,
        raw_response: payload,
        paid_at: internalStatus === "paid" ? new Date().toISOString() : null,
      })
      .or(`provider_ref.eq.${payment_id},order_id.eq.${order_id}`);

    if (error) throw new Error(`DB update error: ${error.message}`);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
