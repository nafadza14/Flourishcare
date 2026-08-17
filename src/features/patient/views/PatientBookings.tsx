import { useEffect, useState } from "react";
import { CalendarClock, Video, Home, MapPin, User2, Link2, ExternalLink } from "lucide-react";
import { fetchPatientBookings, formatRupiah, type PatientBooking } from "@/features/patient/queries";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  pending_payment: { text: "Menunggu Bayar", cls: "bg-yellow/10 text-yellow-700" },
  awaiting_confirmation: { text: "Menunggu Konfirmasi", cls: "bg-secondary/10 text-secondary" },
  confirmed: { text: "Dikonfirmasi", cls: "bg-green-100 text-green-700" },
  completed: { text: "Selesai", cls: "bg-primary/10 text-primary" },
  cancelled: { text: "Batal", cls: "bg-red/10 text-red" },
  expired: { text: "Kadaluarsa", cls: "bg-gray-100 text-gray-600" },
};

const HOMECARE_LABEL: Record<string, string> = {
  bt: "BT Psikolog",
  si: "SI",
  ot: "OT",
  tw: "TW",
};

export function PatientBookings() {
  const [rows, setRows] = useState<PatientBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchPatientBookings();
        if (!cancelled) setRows(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingBlock />;
  if (rows.length === 0)
    return <EmptyState title="Belum ada booking" description="Booking konsultasi Anda akan tampil di sini." icon={CalendarClock} />;

  const upcoming = rows.filter((b) => new Date(b.scheduled_at) >= new Date() && b.status !== "cancelled" && b.status !== "expired");
  const past = rows.filter((b) => !upcoming.includes(b));

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <section>
          <h3 className="font-heading font-bold text-lg mb-3">Sesi Mendatang & Aktif</h3>
          <div className="space-y-3">
            {upcoming.map((b) => <BookingCard key={b.id} b={b} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h3 className="font-heading font-bold text-lg mb-3">Riwayat Kunjungan</h3>
          <div className="space-y-3">
            {past.map((b) => <BookingCard key={b.id} b={b} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function BookingCard({ b }: { b: PatientBooking }) {
  const st = STATUS_LABEL[b.status] ?? { text: b.status, cls: "bg-gray-100 text-gray-600" };
  const isPaid = ["confirmed", "awaiting_confirmation", "completed"].includes(b.status);
  const isOnline = b.mode === "online";
  return (
    <div className="bg-white rounded-3xl border border-black/5 p-5 shadow-warm-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-xs text-text-secondary">{b.code}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${st.cls}`}>{st.text}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium inline-flex items-center gap-1">
              {b.mode === "homecare" ? <Home size={11} /> : <Video size={11} />}
              {b.mode === "homecare"
                ? `Homecare${b.homecare_service ? ` ${HOMECARE_LABEL[b.homecare_service] ?? b.homecare_service.toUpperCase()}` : ""}`
                : "Online"}
            </span>
          </div>
          <p className="font-semibold text-base">{b.child_name}</p>
          <p className="text-xs text-text-secondary">Topik: {b.consultation_topic.replace(/_/g, " ")}</p>
        </div>
        <p className="font-heading font-bold text-primary text-lg whitespace-nowrap">
          {formatRupiah(Number(b.amount))}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-text-secondary bg-background rounded-2xl p-3">
        <div>
          <p className="uppercase tracking-wider text-[10px]">Jadwal</p>
          <p className="font-semibold text-text-primary">
            {new Date(b.scheduled_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <p>{new Date(b.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</p>
        </div>
        <div>
          <p className="uppercase tracking-wider text-[10px]">Durasi</p>
          <p className="font-semibold text-text-primary">{b.duration_min} menit</p>
        </div>
        {b.psychologist_name && (
          <div className="col-span-2 md:col-span-1">
            <p className="uppercase tracking-wider text-[10px]">Psikolog / Terapis</p>
            <p className="font-semibold text-text-primary flex items-center gap-1">
              <User2 size={11} className="text-primary" /> {b.psychologist_name}
            </p>
          </div>
        )}
      </div>

      {b.mode === "homecare" && b.homecare_address && (
        <p className="text-xs text-text-secondary mt-3 flex items-start gap-1">
          <MapPin size={12} className="text-primary flex-shrink-0 mt-0.5" />
          <span>{b.homecare_address}</span>
        </p>
      )}

      {/* Meeting link untuk online yang sudah dibayar */}
      {isOnline && isPaid && (
        <div className="mt-3 pt-3 border-t border-black/5">
          {b.meeting_url ? (
            <div className="flex items-center justify-between gap-3 bg-green-50 rounded-2xl p-3 border border-green-200">
              <div className="flex items-center gap-2 min-w-0">
                <Link2 size={16} className="text-green-700 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-green-700 font-semibold">Link Konsultasi</p>
                  <a
                    href={b.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline font-medium truncate block"
                    title={b.meeting_url}
                  >
                    {b.meeting_url}
                  </a>
                </div>
              </div>
              <a
                href={b.meeting_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-2 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 inline-flex items-center gap-1 shrink-0"
              >
                <ExternalLink size={12} /> Join
              </a>
            </div>
          ) : (
            <div className="bg-yellow-50 rounded-2xl p-3 border border-yellow-200 text-xs text-yellow-800 flex items-center gap-2">
              <Link2 size={14} /> Admin akan mengirim link konsultasi (Zoom/Meet) sebelum sesi dimulai.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
