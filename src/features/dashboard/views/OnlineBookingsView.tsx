import { useEffect, useState } from "react";
import { Video, Home, Phone, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";
import { formatRupiah } from "@/features/dashboard/queries";

type Row = {
  id: string;
  code: string;
  parent_name: string;
  parent_whatsapp: string;
  child_name: string;
  child_dob: string;
  mode: "online" | "homecare";
  psychologist_id: string;
  scheduled_at: string;
  amount: number;
  status: string;
  consultation_topic: string;
  homecare_address: string | null;
  created_at: string;
};

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  pending_payment: { text: "Menunggu Bayar", cls: "bg-yellow/10 text-yellow-700" },
  awaiting_confirmation: { text: "Menunggu Konfirmasi", cls: "bg-secondary/10 text-secondary" },
  confirmed: { text: "Dikonfirmasi", cls: "bg-green-100 text-green-700" },
  completed: { text: "Selesai", cls: "bg-primary/10 text-primary" },
  cancelled: { text: "Batal", cls: "bg-red/10 text-red" },
  expired: { text: "Kadaluarsa", cls: "bg-gray-100 text-gray-600" },
};

export function OnlineBookingsView() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("online_bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function confirm(id: string) {
    setUpdating(id);
    await supabase.from("online_bookings").update({ status: "confirmed" }).eq("id", id);
    setUpdating(null);
    void load();
  }

  async function cancel(id: string) {
    setUpdating(id);
    await supabase
      .from("online_bookings")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", id);
    setUpdating(null);
    void load();
  }

  if (loading) return <LoadingBlock />;
  if (rows.length === 0)
    return (
      <EmptyState
        title="Belum ada booking online"
        description="Booking dari subdomain book.flourishcare.id akan tampil di sini."
        icon={Video}
      />
    );

  return (
    <div className="space-y-3">
      {rows.map((b) => {
        const st = STATUS_LABEL[b.status] ?? { text: b.status, cls: "bg-gray-100 text-gray-600" };
        return (
          <div key={b.id} className="bg-white rounded-3xl border border-black/5 p-5 shadow-warm-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-xs text-text-secondary">{b.code}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${st.cls}`}>{st.text}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium inline-flex items-center gap-1">
                    {b.mode === "homecare" ? <Home size={11} /> : <Video size={11} />}
                    {b.mode === "homecare" ? "Homecare" : "Online"}
                  </span>
                </div>
                <p className="font-semibold text-base">{b.child_name}</p>
                <p className="text-xs text-text-secondary">
                  Orang tua: {b.parent_name} · {b.consultation_topic.replace(/_/g, " ")}
                </p>
              </div>
              <p className="font-heading font-bold text-primary text-lg whitespace-nowrap">
                {formatRupiah(Number(b.amount))}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-text-secondary bg-background rounded-2xl p-3">
              <div>
                <p className="uppercase tracking-wider text-[10px]">Jadwal</p>
                <p className="font-semibold text-text-primary">
                  {new Date(b.scheduled_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                </p>
                <p>{new Date(b.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <div>
                <p className="uppercase tracking-wider text-[10px]">WhatsApp</p>
                <a
                  href={`https://wa.me/${b.parent_whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-text-primary hover:text-primary inline-flex items-center gap-1"
                >
                  <Phone size={11} /> {b.parent_whatsapp}
                </a>
              </div>
              <div>
                <p className="uppercase tracking-wider text-[10px]">DOB Anak</p>
                <p className="font-semibold text-text-primary">
                  {new Date(b.child_dob).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
              <div>
                <p className="uppercase tracking-wider text-[10px]">Dibuat</p>
                <p className="font-semibold text-text-primary">
                  {new Date(b.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                </p>
              </div>
            </div>

            {b.mode === "homecare" && b.homecare_address && (
              <p className="text-xs text-text-secondary mt-3">
                <span className="font-semibold text-text-primary">Alamat:</span> {b.homecare_address}
              </p>
            )}

            {b.status === "awaiting_confirmation" && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-black/5">
                <button
                  onClick={() => confirm(b.id)}
                  disabled={updating === b.id}
                  className="text-xs px-4 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 flex items-center gap-1"
                >
                  {updating === b.id ? <Loader2 className="animate-spin" size={12} /> : null}
                  Konfirmasi
                </button>
                <button
                  onClick={() => cancel(b.id)}
                  disabled={updating === b.id}
                  className="text-xs px-4 py-2 rounded-full border-2 border-red text-red font-semibold hover:bg-red/10 disabled:opacity-50"
                >
                  Batalkan
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
