import { useState } from "react";
import { motion } from "framer-motion";
import { FileSearch, ShieldCheck, KeyRound, Loader2, ChevronRight, User2, Calendar, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { fadeUp } from "@/lib/motion";
import type { Child, ProgressNote, SessionRow } from "@/types/database";

type Step = "form" | "otp" | "result" | "error";

type Snapshot = {
  child: Pick<Child, "id" | "full_name" | "nickname" | "dob" | "primary_condition">;
  therapist_name: string | null;
  sessions_done: number;
  sessions_total: number;
  upcoming: Array<Pick<SessionRow, "id" | "scheduled_at">>;
  notes: Array<Pick<ProgressNote, "id" | "title" | "summary" | "created_at" | "metrics">>;
};

export function Progress() {
  const [step, setStep] = useState<Step>("form");
  const [rm, setRm] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.functions.invoke("progress_request_otp", {
        body: { rm_number: rm.trim(), patient_name: name.trim() },
      });
      if (err) throw err;
      setStep("otp");
    } catch (err: unknown) {
      setError("Data tidak ditemukan atau layanan sedang tidak tersedia. Silakan hubungi admin klinik.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data, error: err } = await supabase.functions.invoke("progress_verify_otp", {
        body: { rm_number: rm.trim(), otp: otp.trim() },
      });
      if (err) throw err;
      const token = (data as { progress_token?: string })?.progress_token;
      if (!token) throw new Error("Token tidak diterima");
      sessionStorage.setItem("progress_token", token);

      const { data: snap, error: snapErr } = await supabase.functions.invoke("progress_snapshot", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (snapErr) throw snapErr;
      setSnapshot(snap as Snapshot);
      setStep("result");
    } catch (err: unknown) {
      setError("Kode verifikasi salah atau sudah kadaluarsa. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("form");
    setRm("");
    setName("");
    setOtp("");
    setSnapshot(null);
    setError(null);
    sessionStorage.removeItem("progress_token");
  }

  return (
    <div className="min-h-[70vh] bg-background">
      <section className="pt-12 pb-12 md:pt-20 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <FileSearch size={26} />
          </div>
          <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Progress Layanan</p>
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">
            Pantau <span className="text-primary">Progres Anak</span> Anda
          </h1>
          <p className="text-text-secondary">
            Masukkan Nomor Rekam Medis (RM) dan Nama Pasien untuk melihat catatan progres terkini.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          key={step}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-primary/10 shadow-sm"
        >
          {step === "form" && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label htmlFor="rm" className="block text-sm font-medium text-text-primary mb-1.5">
                  Nomor Rekam Medis
                </label>
                <input
                  id="rm"
                  type="text"
                  value={rm}
                  onChange={(e) => setRm(e.target.value)}
                  required
                  placeholder="Contoh: FC-RM-2607-0001"
                  className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1.5">
                  Nama Pasien (sesuai data klinik)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Nama lengkap anak"
                  className="w-full rounded-xl border border-primary/20 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {error && (
                <div className="text-sm text-red bg-red/10 border border-red/20 rounded-xl px-4 py-3">{error}</div>
              )}
              <Button type="submit" className="w-full rounded-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} /> Memproses…
                  </>
                ) : (
                  <>
                    Kirim Kode Verifikasi <ChevronRight size={18} className="ml-1" />
                  </>
                )}
              </Button>
              <p className="text-xs text-text-secondary flex items-center gap-1.5 justify-center">
                <ShieldCheck size={14} className="text-primary" />
                Kode akan dikirim ke WhatsApp/email orang tua terdaftar.
              </p>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <KeyRound size={20} />
                </div>
                <h2 className="text-lg font-heading font-bold mb-1">Masukkan Kode Verifikasi</h2>
                <p className="text-sm text-text-secondary">6 digit kode telah dikirim ke kontak terdaftar.</p>
              </div>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full text-center text-2xl tracking-[0.5em] font-mono rounded-xl border border-primary/20 bg-background px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {error && (
                <div className="text-sm text-red bg-red/10 border border-red/20 rounded-xl px-4 py-3">{error}</div>
              )}
              <Button type="submit" className="w-full rounded-full" size="lg" disabled={loading || otp.length !== 6}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} /> Memverifikasi…
                  </>
                ) : (
                  "Verifikasi"
                )}
              </Button>
              <button type="button" onClick={reset} className="text-xs text-text-secondary hover:text-primary underline block mx-auto">
                Kembali & ubah data
              </button>
            </form>
          )}

          {step === "result" && snapshot && <SnapshotView snapshot={snapshot} onSignOut={reset} />}
        </motion.div>
      </section>
    </div>
  );
}

function SnapshotView({ snapshot, onSignOut }: { snapshot: Snapshot; onSignOut: () => void }) {
  const percent = snapshot.sessions_total > 0
    ? Math.min(100, Math.round((snapshot.sessions_done / snapshot.sessions_total) * 100))
    : 0;

  return (
    <div className="space-y-6">
      <header className="text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          <User2 size={22} />
        </div>
        <h2 className="text-xl font-heading font-bold">{snapshot.child.full_name}</h2>
        {snapshot.child.primary_condition && (
          <p className="text-sm text-text-secondary mt-1">Program: {snapshot.child.primary_condition}</p>
        )}
      </header>

      <div className="bg-background rounded-2xl p-5 border border-primary/10">
        <p className="text-xs uppercase tracking-wider text-text-secondary mb-2">Progres Sesi</p>
        <div className="flex items-baseline justify-between mb-2">
          <p className="text-3xl font-heading font-extrabold text-primary">
            {snapshot.sessions_done}
            <span className="text-text-secondary text-lg font-medium"> / {snapshot.sessions_total || "—"}</span>
          </p>
          {snapshot.therapist_name && (
            <p className="text-xs text-text-secondary">Terapis: {snapshot.therapist_name}</p>
          )}
        </div>
        <div className="h-2 rounded-full bg-primary/10 overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-primary" /> Jadwal Berikutnya
        </h3>
        {snapshot.upcoming.length === 0 ? (
          <p className="text-sm text-text-secondary">Belum ada jadwal berikutnya.</p>
        ) : (
          <ul className="space-y-2">
            {snapshot.upcoming.slice(0, 3).map((s) => (
              <li key={s.id} className="text-sm bg-background rounded-xl px-4 py-3 border border-primary/10">
                {new Date(s.scheduled_at).toLocaleString("id-ID", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="font-heading font-bold flex items-center gap-2 mb-3">
          <ClipboardList size={16} className="text-primary" /> Catatan Progres
        </h3>
        {snapshot.notes.length === 0 ? (
          <p className="text-sm text-text-secondary">Terapis Anda akan menulis catatan progres setelah beberapa sesi pertama.</p>
        ) : (
          <ul className="space-y-3">
            {snapshot.notes.map((n) => (
              <li key={n.id} className="bg-background rounded-xl p-4 border border-primary/10">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{n.title}</h4>
                  <span className="text-xs text-text-secondary">
                    {new Date(n.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{n.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-2 border-t border-primary/10 flex justify-between items-center">
        <p className="text-xs text-text-secondary">Sesi berakhir dalam 30 menit.</p>
        <button onClick={onSignOut} className="text-xs text-primary font-semibold hover:underline">
          Keluar
        </button>
      </div>
    </div>
  );
}
