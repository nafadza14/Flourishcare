import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { fadeUp } from "@/lib/motion";
import { useWizard } from "../wizardContext";
import { Stepper } from "../Stepper";

type Psi = {
  id: string;
  title: string;
  slug: string;
  photo_url: string | null;
};

type Slot = { slot_time: string; is_available: boolean };

const DAY_NAMES = ["S", "S", "R", "K", "J", "S", "M"]; // Sun-Sat display; kita pakai Sun-first: S M S R K J S
const DAY_HEADERS = ["S", "S", "R", "K", "J", "S", "M"];
// Kalender kita mulai dari Sunday: index 0..6 = Sun..Sat
const DAY_HEADERS_SUN = ["M", "S", "S", "R", "K", "J", "S"]; // Min, Sen, Sel, Rab, Kam, Jum, Sab

export function StepSchedule() {
  const navigate = useNavigate();
  const { data, update } = useWizard();

  const [psychs, setPsychs] = useState<Psi[]>([]);
  const [loadingPsi, setLoadingPsi] = useState(true);

  const [scheduledDays, setScheduledDays] = useState<number[]>([]); // day_of_week available
  const [monthCursor, setMonthCursor] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Redirect kembali kalau step 1 belum lengkap
  useEffect(() => {
    if (!data.parent_name || !data.child_name || !data.child_dob || !data.child_gender || !data.consultation_topic) {
      navigate("/book/profile", { replace: true });
    }
  }, [data, navigate]);

  // Ambil daftar psikolog
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingPsi(true);
      const { data: rows } = await supabase
        .from("staff_profiles")
        .select("id,title,slug,photo_url")
        .eq("is_visible", true)
        .order("display_order");
      if (cancelled) return;
      const list = (rows ?? []) as Psi[];
      setPsychs(list);
      if (!data.psychologist_id && list[0]) {
        update({ psychologist_id: list[0].id, psychologist_name: list[0].title });
      }
      setLoadingPsi(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ambil day_of_week yang tersedia untuk psikolog terpilih
  useEffect(() => {
    if (!data.psychologist_id) return;
    (async () => {
      const { data: rows } = await supabase
        .from("psychologist_schedules")
        .select("day_of_week")
        .eq("staff_id", data.psychologist_id)
        .eq("is_active", true);
      const uniq = Array.from(new Set((rows ?? []).map((r) => r.day_of_week as number)));
      setScheduledDays(uniq);
    })();
  }, [data.psychologist_id]);

  // Ambil slot ketika tanggal dipilih.
  // Coba RPC dulu; kalau gagal / kosong, fallback ke generate client-side dari schedule.
  useEffect(() => {
    if (!data.psychologist_id || !data.scheduled_date) {
      setSlots([]);
      return;
    }
    (async () => {
      setLoadingSlots(true);
      try {
        const { data: rows, error } = await supabase.rpc("online_available_slots", {
          p_staff_id: data.psychologist_id,
          p_date: data.scheduled_date,
        });
        if (!error && rows && (rows as Slot[]).length > 0) {
          setSlots(rows as Slot[]);
          return;
        }
        // Fallback: generate manual dari psychologist_schedules
        const dow = new Date(data.scheduled_date + "T00:00:00").getDay();
        const { data: schedRows } = await supabase
          .from("psychologist_schedules")
          .select("start_time,end_time,session_duration_min")
          .eq("staff_id", data.psychologist_id)
          .eq("day_of_week", dow)
          .eq("is_active", true);

        const generated: Slot[] = [];
        for (const s of schedRows ?? []) {
          const dur = s.session_duration_min as number;
          const [sh, sm] = (s.start_time as string).split(":").map(Number);
          const [eh, em] = (s.end_time as string).split(":").map(Number);
          const startMin = sh * 60 + sm;
          const endMin = eh * 60 + em;
          for (let t = startMin; t + dur <= endMin; t += dur) {
            const h = Math.floor(t / 60);
            const m = t % 60;
            generated.push({
              slot_time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`,
              is_available: true,
            });
          }
        }

        // Filter slot yang sudah di-book (best-effort — hanya kelihatan booking milik user + admin, tapi cukup untuk UX)
        const { data: bookedRows } = await supabase
          .from("online_bookings")
          .select("scheduled_at")
          .eq("psychologist_id", data.psychologist_id)
          .gte("scheduled_at", `${data.scheduled_date}T00:00:00`)
          .lt("scheduled_at", `${data.scheduled_date}T23:59:59`)
          .not("status", "in", "(cancelled,expired)");

        const bookedTimes = new Set(
          (bookedRows ?? []).map((b) => {
            const d = new Date(b.scheduled_at as string);
            return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:00`;
          })
        );

        setSlots(
          generated.map((s) => ({
            ...s,
            is_available: !bookedTimes.has(s.slot_time),
          }))
        );
      } finally {
        setLoadingSlots(false);
      }
    })();
  }, [data.psychologist_id, data.scheduled_date]);

  const monthMatrix = useMemo(() => buildMonthMatrix(monthCursor), [monthCursor]);

  function selectPsi(p: Psi) {
    update({ psychologist_id: p.id, psychologist_name: p.title, scheduled_date: "", scheduled_time: "" });
  }

  function selectDate(d: Date) {
    if (!isDayAvailable(d)) return;
    const iso = d.toISOString().slice(0, 10);
    update({ scheduled_date: iso, scheduled_time: "" });
  }

  function isDayAvailable(d: Date): boolean {
    if (d.getMonth() !== monthCursor.getMonth()) return false;
    if (d < startOfToday()) return false;
    return scheduledDays.includes(d.getDay());
  }

  function submit() {
    if (!data.scheduled_date || !data.scheduled_time) return;
    navigate("/book/payment");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-[2rem] p-6 md:p-10 border border-black/5 shadow-warm">
        <Stepper current={2} />

        <div className="mt-6 mb-6 flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-background text-text-secondary">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Pilih Jadwal</h1>
            <p className="text-sm text-text-secondary">Pilih psikolog dan waktu yang tersedia.</p>
          </div>
        </div>

        {/* Pilih Psikolog */}
        <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-3">Pilih Psikolog</p>
        {loadingPsi ? (
          <div className="py-8 text-center text-text-secondary"><Loader2 className="animate-spin inline mr-2" size={16} /> Memuat…</div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(3, psychs.length || 1)} gap-3 mb-8`}>
            {psychs.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPsi(p)}
                className={`rounded-3xl border p-4 text-center transition-colors ${
                  data.psychologist_id === p.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-black/10 bg-white hover:border-primary/40"
                }`}
              >
                <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-black/5">
                  {p.photo_url ? (
                    <img src={p.photo_url} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary/40">
                      <Users size={28} />
                    </div>
                  )}
                </div>
                <p className="font-heading font-semibold text-sm leading-tight">{p.title}</p>
                <p className="text-xs text-primary mt-1">Tersedia</p>
              </button>
            ))}
          </div>
        )}

        <hr className="border-black/5 mb-6" />

        {/* Calendar + Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background rounded-3xl p-4 md:p-5 border border-black/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-primary" />
                <span className="font-semibold text-sm">
                  {monthCursor.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center"
                  onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}
                  type="button"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center"
                  onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}
                  type="button"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-secondary mb-2">
              {DAY_HEADERS_SUN.map((d, i) => (
                <div key={i} className="py-1 font-semibold">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {monthMatrix.map((d, i) => {
                const inMonth = d.getMonth() === monthCursor.getMonth();
                const available = inMonth && isDayAvailable(d);
                const selected = data.scheduled_date === d.toISOString().slice(0, 10);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!available}
                    onClick={() => selectDate(d)}
                    className={`aspect-square rounded-full text-sm font-semibold transition-colors ${
                      selected
                        ? "bg-primary text-white shadow-warm"
                        : available
                        ? "text-text-primary hover:bg-primary/10"
                        : "text-text-secondary/30 cursor-not-allowed"
                    }`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mt-4 text-xs text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Jadwal tersedia
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-primary" />
              <span className="font-semibold text-sm">Waktu Sesi</span>
            </div>

            {!data.scheduled_date ? (
              <div className="p-6 bg-background rounded-3xl border border-black/5 text-sm text-text-secondary text-center">
                Pilih tanggal terlebih dahulu.
              </div>
            ) : loadingSlots ? (
              <div className="p-6 text-sm text-text-secondary text-center"><Loader2 className="animate-spin inline mr-2" size={14} /> Memuat slot…</div>
            ) : slots.length === 0 ? (
              <div className="p-6 bg-background rounded-3xl border border-black/5 text-sm text-text-secondary text-center">
                Tidak ada slot pada tanggal ini.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {slots.map((s) => {
                  const label = s.slot_time.slice(0, 5); // HH:MM
                  const selected = data.scheduled_time === label;
                  return (
                    <button
                      key={s.slot_time}
                      type="button"
                      disabled={!s.is_available}
                      onClick={() => update({ scheduled_time: label })}
                      className={`rounded-2xl border py-3 text-sm font-semibold transition-colors ${
                        selected
                          ? "bg-primary/10 border-primary text-primary ring-2 ring-primary/20"
                          : s.is_available
                          ? "bg-white border-black/10 hover:border-primary/40"
                          : "bg-black/5 border-black/10 text-text-secondary/50 cursor-not-allowed"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            <Button
              type="button"
              disabled={!data.scheduled_date || !data.scheduled_time}
              onClick={submit}
              size="lg"
              className="w-full rounded-full shadow-warm mt-6"
            >
              Lanjut ke Pembayaran
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildMonthMatrix(cursor: Date): Date[] {
  // Return 42 days (6 weeks) starting from Sunday of the week containing first-of-month.
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const startOffset = first.getDay(); // 0 = Sunday
  const start = new Date(first);
  start.setDate(1 - startOffset);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }
  return days;
}
