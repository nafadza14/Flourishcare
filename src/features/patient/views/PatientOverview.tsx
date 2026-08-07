import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Wallet, CheckCircle2, ArrowUpRight, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import {
  fetchPatientBookings,
  fetchPatientSummary,
  formatRupiah,
  type PatientBooking,
} from "@/features/patient/queries";
import { BOOKING_ONLINE_URL } from "@/config/constants";

export function PatientOverview() {
  const { session } = useAuth();
  const [summary, setSummary] = useState({ total_bookings: 0, total_paid_amount: 0, upcoming_count: 0, completed_count: 0 });
  const [upcoming, setUpcoming] = useState<PatientBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [s, b] = await Promise.all([fetchPatientSummary(), fetchPatientBookings()]);
        if (cancelled) return;
        setSummary(s);
        setUpcoming(
          b
            .filter((x) => new Date(x.scheduled_at) >= new Date() && ["confirmed", "awaiting_confirmation"].includes(x.status))
            .slice(0, 3)
        );
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const name = session?.user.user_metadata?.full_name || session?.user.email?.split("@")[0] || "Anda";

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white rounded-3xl border border-black/5 p-6 shadow-warm-sm">
        <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-1">Selamat datang</p>
        <h2 className="text-2xl md:text-3xl font-heading font-bold">Halo, {name} 👋</h2>
        <p className="text-sm text-text-secondary mt-1">
          Pantau perjalanan tumbuh kembang si kecil melalui portal ini.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={CalendarClock} label="Sesi Mendatang" value={summary.upcoming_count} loading={loading} />
        <StatCard icon={CheckCircle2} label="Sesi Selesai" value={summary.completed_count} loading={loading} />
        <StatCard icon={Video} label="Total Booking" value={summary.total_bookings} loading={loading} />
        <StatCard icon={Wallet} label="Total Dibayar" value={formatRupiah(summary.total_paid_amount)} loading={loading} />
      </div>

      {/* Upcoming */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-lg">Sesi Terdekat</h3>
          <Button asChild size="sm" variant="ghost" className="rounded-full text-primary">
            <Link to="/portal/bookings">Lihat semua <ArrowUpRight size={14} className="ml-1" /></Link>
          </Button>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-black/5 p-8 text-center text-text-secondary text-sm">Memuat…</div>
        ) : upcoming.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/5 p-8 text-center">
            <Sparkles className="mx-auto mb-2 text-primary" size={24} />
            <p className="text-sm text-text-secondary mb-3">Belum ada sesi terjadwal.</p>
            <Button asChild className="rounded-full">
              <a href={BOOKING_ONLINE_URL} target="_blank" rel="noopener noreferrer">
                Booking Konsultasi Baru
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <div key={b.id} className="bg-white rounded-3xl border border-black/5 p-5 shadow-warm-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-text-secondary font-mono mb-1">{b.code}</p>
                    <p className="font-semibold">{b.child_name}</p>
                    <p className="text-xs text-text-secondary">
                      {new Date(b.scheduled_at).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long" })}
                      &nbsp;·&nbsp;
                      {new Date(b.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${b.mode === "homecare" ? "bg-secondary/20 text-secondary" : "bg-primary/10 text-primary"}`}>
                    {b.mode === "homecare" ? "Homecare" : "Online"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking CTA */}
      <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 flex items-center gap-4 flex-wrap">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="font-semibold">Butuh konsultasi baru?</p>
          <p className="text-sm text-text-secondary">Booking sesi online atau homecare kapan saja.</p>
        </div>
        <Button asChild className="rounded-full shadow-warm">
          <a href={BOOKING_ONLINE_URL} target="_blank" rel="noopener noreferrer">
            Booking Sekarang
          </a>
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: number | string;
  loading: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-warm-sm">
      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
        <Icon size={16} />
      </div>
      <p className="text-xs text-text-secondary">{label}</p>
      <p className="text-xl md:text-2xl font-heading font-extrabold mt-1">
        {loading ? "…" : value}
      </p>
    </div>
  );
}
