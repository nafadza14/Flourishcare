import { useEffect, useMemo, useState } from "react";
import { LineChart, Loader2, Printer, Plus, Eye, X, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";
import { useAuth } from "@/providers/AuthProvider";
import { printWithTitle, isoDate } from "@/lib/print";

type Child = { id: string; rm_number: string; full_name: string };

type Activity = { activity: string; duration: string; assistance: string; response: string };

type Report = {
  id: string;
  child_id: string;
  therapy_date: string;
  session_number: number | null;
  total_sessions: number | null;
  therapist_name: string;
  mood: "baik" | "cukup" | "kurang_tenang" | null;
  energy: "tinggi" | "sedang" | "rendah" | null;
  activities: Activity[] | null;
  obstacles: string[] | null;
  home_program: string | null;
  notes: string | null;
  created_at: string;
};

const MOOD_OPTS: Array<{ v: NonNullable<Report["mood"]>; l: string }> = [
  { v: "baik", l: "Baik" },
  { v: "cukup", l: "Cukup" },
  { v: "kurang_tenang", l: "Kurang Tenang" },
];
const ENERGY_OPTS: Array<{ v: NonNullable<Report["energy"]>; l: string }> = [
  { v: "tinggi", l: "Tinggi" },
  { v: "sedang", l: "Sedang" },
  { v: "rendah", l: "Rendah" },
];
const OBSTACLES = [
  "menolak",
  "terdistraksi",
  "tantrum",
  "menangis",
  "sulit_transisi",
  "sensitif_sensori",
  "agresif",
  "tidak_ada",
];

export function DevelopmentReportsView() {
  const { profile } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [detail, setDetail] = useState<Report | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: kids } = await supabase
        .from("children")
        .select("id, rm_number, full_name")
        .not("rm_number", "is", null)
        .order("full_name");
      setChildren(kids ?? []);
      const { data: rpts } = await supabase
        .from("development_reports")
        .select("*")
        .order("therapy_date", { ascending: false });
      setReports((rpts as Report[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const child = useMemo(() => children.find((c) => c.id === selectedChild) ?? null, [children, selectedChild]);
  const childReports = useMemo(() => reports.filter((r) => r.child_id === selectedChild), [reports, selectedChild]);

  async function refresh() {
    const { data } = await supabase.from("development_reports").select("*").order("therapy_date", { ascending: false });
    setReports((data as Report[]) ?? []);
  }

  if (loading) return <LoadingBlock label="Memuat data…" />;
  if (!children.length)
    return (
      <EmptyState
        icon={LineChart}
        title="Belum ada pasien dengan RM"
        description="Pasien di sini hanya yang sudah mengisi Form Pendaftaran (assessment.flourishcare.id) dan sudah diberi Nomor RM oleh admin di tab Pendaftaran Pasien. Data booking online tidak muncul di sini."
      />
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
      <aside className="bg-white rounded-2xl border border-black/5 p-3">
        <h3 className="font-heading font-bold text-sm px-2 py-2 text-text-secondary">Pasien</h3>
        <ul className="space-y-1 max-h-[70vh] overflow-y-auto">
          {children.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setSelectedChild(c.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedChild === c.id ? "bg-primary text-white" : "hover:bg-primary/5"
                }`}
              >
                <p className="font-semibold truncate">{c.full_name}</p>
                <p className="text-[11px] opacity-80">{c.rm_number}</p>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section>
        {!child ? (
          <EmptyState icon={LineChart} title="Pilih pasien" description="Pilih pasien untuk melihat laporan perkembangan." />
        ) : (
          <div className="bg-white rounded-2xl border border-black/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading font-extrabold text-xl">{child.full_name}</h2>
                <p className="text-xs text-text-secondary">RM {child.rm_number} · FRM-008 Laporan Perkembangan</p>
              </div>
              <Button size="sm" className="rounded-full" onClick={() => setFormOpen(true)}>
                <Plus size={16} className="mr-1" /> Laporan Baru
              </Button>
            </div>

            {childReports.length === 0 ? (
              <p className="text-sm text-text-secondary italic py-8 text-center">Belum ada laporan perkembangan.</p>
            ) : (
              <ul className="space-y-2">
                {childReports.map((r) => (
                  <li key={r.id} className="border border-black/5 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">
                        Sesi {r.session_number ?? "-"}
                        {r.total_sessions ? `/${r.total_sessions}` : ""} · {new Date(r.therapy_date).toLocaleDateString("id-ID")}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Terapis: {r.therapist_name} · Mood: {r.mood ?? "-"} · Energi: {r.energy ?? "-"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => setDetail(r)}>
                      <Eye size={14} className="mr-1" /> Detail
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {formOpen && child && (
          <ReportForm
            child={child}
            defaultTherapist={profile?.full_name ?? ""}
            therapistId={profile?.id ?? ""}
            onClose={() => setFormOpen(false)}
            onSaved={() => {
              setFormOpen(false);
              refresh();
            }}
          />
        )}
        {detail && <ReportDetail report={detail} child={child!} onClose={() => setDetail(null)} />}
      </section>
    </div>
  );
}

function ReportForm({
  child,
  defaultTherapist,
  therapistId,
  onClose,
  onSaved,
}: {
  child: Child;
  defaultTherapist: string;
  therapistId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [therapyDate, setTherapyDate] = useState(new Date().toISOString().slice(0, 10));
  const [sessionNumber, setSessionNumber] = useState<string>("");
  const [totalSessions, setTotalSessions] = useState<string>("12");
  const [therapistName, setTherapistName] = useState(defaultTherapist);
  const [mood, setMood] = useState<Report["mood"]>("baik");
  const [energy, setEnergy] = useState<Report["energy"]>("sedang");
  const [activities, setActivities] = useState<Activity[]>([{ activity: "", duration: "", assistance: "", response: "" }]);
  const [obstacles, setObstacles] = useState<string[]>([]);
  const [homeProgram, setHomeProgram] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  function toggleObstacle(o: string) {
    setObstacles((prev) => (prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]));
  }

  async function submit() {
    setError(null);
    if (!therapistId) {
      setError("Profil terapis belum ter-load. Refresh halaman lalu coba lagi.");
      return;
    }
    setSaving(true);
    const sesNum = sessionNumber ? Number(sessionNumber) : null;
    const sesTot = totalSessions ? Number(totalSessions) : 12;
    const { error } = await supabase.from("development_reports").insert({
      child_id: child.id,
      therapist_id: therapistId,           // WAJIB (NOT NULL) — referensi profiles(id)
      therapy_date: therapyDate,
      session_no: sesNum,                   // kolom asli migrasi
      session_number: sesNum,               // kolom alias (backward compat)
      session_total: sesTot,                // kolom asli migrasi
      total_sessions: sesTot,               // kolom alias (backward compat)
      therapist_name: therapistName,
      mood,
      energy,
      activities,
      obstacles,
      home_program: homeProgram || null,
      notes: notes || null,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-lg">Laporan Perkembangan Baru</h3>
            <p className="text-xs text-text-secondary">{child.full_name} · RM {child.rm_number}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Field label="Tanggal Terapi">
              <input type="date" value={therapyDate} onChange={(e) => setTherapyDate(e.target.value)} className="input" />
            </Field>
            <Field label="Sesi Ke-">
              <input type="number" value={sessionNumber} onChange={(e) => setSessionNumber(e.target.value)} className="input" placeholder="1" />
            </Field>
            <Field label="Dari Total">
              <input type="number" value={totalSessions} onChange={(e) => setTotalSessions(e.target.value)} className="input" placeholder="12" />
            </Field>
            <Field label="Nama Terapis">
              <input value={therapistName} onChange={(e) => setTherapistName(e.target.value)} className="input" />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Mood">
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTS.map((o) => (
                  <Pill key={o.v} active={mood === o.v} onClick={() => setMood(o.v)}>
                    {o.l}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="Energi">
              <div className="flex flex-wrap gap-2">
                {ENERGY_OPTS.map((o) => (
                  <Pill key={o.v} active={energy === o.v} onClick={() => setEnergy(o.v)}>
                    {o.l}
                  </Pill>
                ))}
              </div>
            </Field>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-heading font-bold text-sm">Aktivitas Sesi</h4>
              <button
                onClick={() =>
                  setActivities((a) => [...a, { activity: "", duration: "", assistance: "", response: "" }])
                }
                className="text-primary text-xs font-semibold hover:underline"
              >
                + Tambah aktivitas
              </button>
            </div>
            <div className="space-y-2">
              {activities.map((a, i) => (
                <div key={i} className="border border-black/10 rounded-xl p-3 grid grid-cols-1 md:grid-cols-[1fr_100px_140px_1fr_28px] gap-2">
                  <input
                    placeholder="Aktivitas"
                    value={a.activity}
                    onChange={(e) => setActivities((arr) => arr.map((x, idx) => (idx === i ? { ...x, activity: e.target.value } : x)))}
                    className="input"
                  />
                  <input
                    placeholder="Durasi"
                    value={a.duration}
                    onChange={(e) => setActivities((arr) => arr.map((x, idx) => (idx === i ? { ...x, duration: e.target.value } : x)))}
                    className="input"
                  />
                  <input
                    placeholder="Bantuan (mandiri/verbal/fisik)"
                    value={a.assistance}
                    onChange={(e) => setActivities((arr) => arr.map((x, idx) => (idx === i ? { ...x, assistance: e.target.value } : x)))}
                    className="input"
                  />
                  <input
                    placeholder="Respon anak"
                    value={a.response}
                    onChange={(e) => setActivities((arr) => arr.map((x, idx) => (idx === i ? { ...x, response: e.target.value } : x)))}
                    className="input"
                  />
                  <button
                    onClick={() => setActivities((arr) => arr.filter((_, idx) => idx !== i))}
                    className="text-red hover:bg-red/10 rounded-lg p-1 self-center"
                    aria-label="Hapus"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm mb-2">Hambatan Selama Sesi</h4>
            <div className="flex flex-wrap gap-2">
              {OBSTACLES.map((o) => (
                <Pill key={o} active={obstacles.includes(o)} onClick={() => toggleObstacle(o)}>
                  {o.replace(/_/g, " ")}
                </Pill>
              ))}
            </div>
          </div>

          <Field label="Home Program (aktivitas untuk orang tua)">
            <textarea rows={3} value={homeProgram} onChange={(e) => setHomeProgram(e.target.value)} className="input" />
          </Field>

          <Field label="Catatan Terapis">
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="input" />
          </Field>

          {error && <p className="text-sm text-red">{error}</p>}
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-2">
          <Button variant="outline" className="rounded-full" onClick={onClose}>
            Batal
          </Button>
          <Button className="rounded-full" onClick={submit} disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-1" size={16} /> : <Check size={16} className="mr-1" />}
            Simpan Laporan
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReportDetail({ report, child, onClose }: { report: Report; child: Child; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:static print:bg-white print:p-0">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto print:max-h-none print:rounded-none print:shadow-none">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between print:hidden">
          <h3 className="font-heading font-extrabold text-lg">Detail Laporan Perkembangan</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() =>
                printWithTitle(
                  `FRM-008_${child?.rm_number ?? "RM"}_${(child?.full_name ?? "").replace(/\s+/g, "-")}_${isoDate(report.therapy_date)}`
                )
              }
            >
              <Printer size={14} className="mr-1" /> Cetak/PDF
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 print:p-8 space-y-4 text-sm">
          <div className="hidden print:flex items-center justify-between border-b pb-4 mb-4">
            <img src="/mitra-diani-logo.png" alt="Mitra Diani" className="h-12" />
            <div className="text-center">
              <p className="font-heading font-extrabold">FLOURISH-FRM-008</p>
              <p className="text-xs">Laporan Perkembangan</p>
            </div>
            <img src="/flourishcare-logo.svg" alt="FlourishCare" className="h-12" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Row k="Nama Anak" v={child.full_name} />
            <Row k="Nomor RM" v={child.rm_number} />
            <Row k="Tanggal Terapi" v={new Date(report.therapy_date).toLocaleDateString("id-ID")} />
            <Row k="Sesi" v={`${report.session_number ?? "-"} / ${report.total_sessions ?? "-"}`} />
            <Row k="Terapis" v={report.therapist_name} />
            <Row k="Mood" v={report.mood ?? "-"} />
            <Row k="Energi" v={report.energy ?? "-"} />
          </div>

          <section>
            <h4 className="font-heading font-bold mb-1">Aktivitas Sesi</h4>
            {report.activities && report.activities.length > 0 ? (
              <table className="w-full text-xs border">
                <thead className="bg-background">
                  <tr>
                    <th className="border p-2 text-left">Aktivitas</th>
                    <th className="border p-2 text-left">Durasi</th>
                    <th className="border p-2 text-left">Bantuan</th>
                    <th className="border p-2 text-left">Respon</th>
                  </tr>
                </thead>
                <tbody>
                  {report.activities.map((a, i) => (
                    <tr key={i}>
                      <td className="border p-2">{a.activity}</td>
                      <td className="border p-2">{a.duration}</td>
                      <td className="border p-2">{a.assistance}</td>
                      <td className="border p-2">{a.response}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="italic text-text-secondary">-</p>
            )}
          </section>

          <section>
            <h4 className="font-heading font-bold mb-1">Hambatan</h4>
            <p>{report.obstacles && report.obstacles.length > 0 ? report.obstacles.map((o) => o.replace(/_/g, " ")).join(", ") : "-"}</p>
          </section>

          <section>
            <h4 className="font-heading font-bold mb-1">Home Program</h4>
            <p className="whitespace-pre-wrap">{report.home_program ?? "-"}</p>
          </section>

          <section>
            <h4 className="font-heading font-bold mb-1">Catatan</h4>
            <p className="whitespace-pre-wrap">{report.notes ?? "-"}</p>
          </section>

          <div className="pt-6 grid grid-cols-2 gap-8 print:mt-12">
            <div className="text-center">
              <p className="text-xs mb-16">Orang Tua/Wali</p>
              <p className="border-t pt-1 text-xs">(_____________________)</p>
            </div>
            <div className="text-center">
              <p className="text-xs mb-16">Terapis</p>
              <p className="border-t pt-1 text-xs">({report.therapist_name})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-text-secondary mb-1">{label}</span>
      {children}
    </label>
  );
}
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        active ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-black/10 hover:border-primary"
      }`}
    >
      {children}
    </button>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="text-[11px] text-text-secondary uppercase tracking-wide">{k}</p>
      <p className="font-semibold">{v}</p>
    </div>
  );
}
