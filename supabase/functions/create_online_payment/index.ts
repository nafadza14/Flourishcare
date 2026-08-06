// Edge Function: create_online_payment
// Called from frontend (book.flourishcare.id) untuk membuat payment Sumopod QRIS.
// Deploy: supabase functions deploy create_online_payment
// Env vars di Supabase Dashboard → Edge Functions → Secrets:
//   SUMOPOD_API_KEY  = d6a15ec63382f08a6e0e0d2e6c313632f3f9c6539d75cd7624fcd0e67b9e1468
//   PUBLIC_APP_URL   = https://book.flourishcare.id
//   SUPABASE_SERVICE_ROLE_KEY = (dari Supabase dashboard)

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUMOPOD_URL = "https://api-pay.sumopod.com/api/v1/payments";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { booking_id } = await req.json();
    if (!booking_id) throw new Error("booking_id wajib");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Ambil booking
    const { data: booking, error: bookingErr } = await supabase
      .from("online_bookings")
      .select("*")
      .eq("id", booking_id)
      .single();
    if (bookingErr || !booking) throw new Error("Booking tidak ditemukan");
    if (booking.status !== "pending_payment") {
      throw new Error(`Booking status ${booking.status}, tidak bisa dibayar`);
    }

    // Hitung amount berdasarkan payment_type
    const amountToPay =
      booking.payment_type === "dp_50"
        ? Math.round(Number(booking.amount) / 2)
        : Number(booking.amount);

    const orderId = `${booking.code}-P${Date.now().toString().slice(-6)}`;
    const baseUrl = Deno.env.get("PUBLIC_APP_URL") ?? "https://book.flourishcare.id";

    // Call Sumopod
    const sumopodRes = await fetch(SUMOPOD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": Deno.env.get("SUMOPOD_API_KEY")!,
      },
      body: JSON.stringify({
        order_id: orderId,
        amount: amountToPay,
        currency: "IDR",
        expires_in_hours: 24,
        success_return_url: `${baseUrl}/success?booking=${booking.code}`,
        cancel_return_url: `${baseUrl}/cancel?booking=${booking.code}`,
        payment_method_type_code: "QRIS",
      }),
    });

    if (!sumopodRes.ok) {
      const errText = await sumopodRes.text();
      throw new Error(`Sumopod error ${sumopodRes.status}: ${errText}`);
    }

    const sumopodData = await sumopodRes.json();

    // Simpan payment record
    const { error: payErr } = await supabase.from("online_payments").insert({
      booking_id,
      provider: "sumopod",
      provider_ref: sumopodData.payment_id,
      order_id: orderId,
      amount: amountToPay,
      fee: sumopodData.fee ?? null,
      net_amount: sumopodData.net_amount ?? null,
      payment_method: "QRIS",
      payment_url: sumopodData.payment_link_url,
      status: "pending",
      raw_response: sumopodData,
      expires_at: sumopodData.expires_at,
    });
    if (payErr) throw new Error(`DB insert error: ${payErr.message}`);

    return new Response(
      JSON.stringify({
        payment_url: sumopodData.payment_link_url,
        payment_id: sumopodData.payment_id,
        amount: amountToPay,
        expires_at: sumopodData.expires_at,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
