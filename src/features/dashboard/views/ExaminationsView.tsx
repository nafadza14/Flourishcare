import { useEffect, useState } from "react";
import { FileText, Plus, Printer, X, Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";
import { fetchAssessedChildren } from "@/features/dashboard/queries";
import type { Child } from "@/types/database";
import { printWithTitle, isoDate } from "@/lib/print";

type Exam = {
  id: string;
  child_id: string;
  examination_date: string;
  patient_age: string | null;
  chief_complaint: string | null;
  diagnosis: string | null;
  general_condition: Record<string, unknown>;
  language_aspects: Record<string, string>;
  motor_aspects: Record<string, string>;
  sensory_aspects: Record<string, string>;
  other_aspects: Record<string, unknown>;
  follow_up_plan: string[];
  additional_notes: string | null;
  subjective_info: string | null;
  objective_info: string | null;
  conclusion: string | null;
  created_at: string;
};

const LEVELS = [
  { v: "belum_berkembang", l: "Belum Berkembang" },
  { v: "mulai_berkembang", l: "Mulai Berkembang" },
  { v: "kurang_optimal", l: "Kurang Optimal" },
  { v: "optimal", l: "Optimal" },
];

const FOLLOW_UP_OPTIONS = [
  { v: "observasi_berkala", l: "Observasi berkala" },
  { v: "ases_lanjutan", l: "Ases lanjutan" },
  { v: "rujukan_medis", l: "Rujukan medis" },
  { v: "BT", l: "BT" },
  { v: "OT", l: "OT" },
  { v: "TW", l: "TW" },
  { v: "FT", l: "FT" },
  { v: "SI", l: "SI" },
];

export function ExaminationsView() {
  const { role } = useAuth();
  const canWrite = role === "super_admin" || role === "psikolog";

  const [children, setChildren] = useState<Child[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [detailExam, setDetailExam] = useState<Exam | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Hanya anak yang sudah mengisi assessment DAN sudah diberi RM oleh admin.
      // Anak dari booking online (belum punya RM) tidak muncul di sini.
      const data = await fetchAssessedChildren(500);
      setChildren(data);
      if (data[0]) setSelected(data[0].id);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      const { data } = await supabase
        .from("medical_examinations")
        .select("*")
        .eq("child_id", selected)
        .order("examination_date", { ascending: false });
      setExams((data as Exam[]) ?? []);
    })();
  }, [selected, showForm]);

  if (loading) return <LoadingBlock />;
  if (children.length === 0)
    return (
      <EmptyState
        title="Belum ada pasien dengan RM"
        description="Pasien di sini hanya yang sudah mengisi Form Pendaftaran (assessment.flourishcare.id) dan sudah diberi Nomor RM oleh admin di tab Pendaftaran Pasien. Data booking online tidak muncul di sini."
        icon={FileText}
      />
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Sidebar list pasien */}
      <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden max-h-[70vh] overflow-y-auto">
        {children.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={`w-full text-left px-4 py-3 hover:bg-background transition-colors ${selected === c.id ? "bg-primary/5" : ""}`}
          >
            <p className="text-sm font-semibold">{c.full_name}</p>
            <p className="text-xs text-text-secondary font-mono">{c.rm_number}</p>
          </button>
        ))}
      </div>

      <div className="md:col-span-2 space-y-4">
        {selected && canWrite && (
          <Button onClick={() => setShowForm(true)} className="rounded-full shadow-warm">
            <Plus size={14} className="mr-1" /> Buat Laporan Pemeriksaan Baru (FRM-005)
          </Button>
        )}

        {exams.length === 0 ? (
          <EmptyState title="Belum ada laporan pemeriksaan" description="Klik tombol di atas untuk membuat laporan pertama." icon={FileText} />
        ) : (
          <div className="space-y-3">
            {exams.map((ex) => (
              <div key={ex.id} className="bg-white rounded-2xl border border-black/5 p-4 shadow-warm-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-sm">
                      Pemeriksaan {new Date(ex.examination_date).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                    {ex.diagnosis && <p className="text-xs text-primary mt-1">Diagnosa: {ex.diagnosis}</p>}
                    {ex.chief_complaint && <p className="text-xs text-text-secondary mt-1 line-clamp-2">{ex.chief_complaint}</p>}
                    {ex.follow_up_plan.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ex.follow_up_plan.map((p) => (
                          <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{p.replace(/_/g, " ")}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setDetailExam(ex)} className="rounded-full border-2">
                    Detail
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && selected && (
        <ExaminationForm
          childId={selected}
          child={children.find((c) => c.id === selected)}
          onClose={() => setShowForm(false)}
          onSaved={() => setShowForm(false)}
        />
      )}
      {detailExam && (
        <ExaminationDetail exam={detailExam} child={children.find((c) => c.id === detailExam.child_id)} onClose={() => setDetailExam(null)} />
      )}
    </div>
  );
}

// ============ Form Create Examination ============

function ExaminationForm({ childId, child, onClose, onSaved }: { childId: string; child: Child | undefined; onClose: () => void; onSaved: () => void }) {
  const { profile } = useAuth();

  const [examDate, setExamDate] = useState(new Date().toISOString().slice(0, 10));
  const [age, setAge] = useState("");
  const [complaint, setComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [langAspects, setLangAspects] = useState<Record<string, string>>({ joint_attention: "", respon_panggil: "" });
  const [langNotes, setLangNotes] = useState({ ekspresif: "", reseptif: "" });
  const [motor, setMotor] = useState<Record<string, string>>({ motorik_kasar: "", motorik_halus: "" });
  const [sensory, setSensory] = useState<Record<string, string>>({
    taktil: "", visual: "", auditori: "", gustatori: "", olfactory: "",
    proprioceptive: "", introsceptive: "", vestibular: "",
  });
  const [control, setControl] = useState("");
  const [regulasi, setRegulasi] = useState("");
  const [adaptasi, setAdaptasi] = useState("");
  const [followUp, setFollowUp] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function toggleFollowUp(v: string) {
    setFollowUp((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }

  async function save() {
    if (!profile) return;
    setSaving(true);
    setErr(null);
    const { error } = await supabase.from("medical_examinations").insert({
      child_id: childId,
      examiner_id: profile.id,
      examination_date: examDate,
      patient_age: age || null,
      chief_complaint: complaint || null,
      diagnosis: diagnosis || null,
      language_aspects: { ...langAspects, ekspresif: langNotes.ekspresif, reseptif: langNotes.reseptif },
      motor_aspects: motor,
      sensory_aspects: sensory,
      other_aspects: {
        control_impulse: control,
        regulasi_emosi: regulasi,
        kemampuan_adaptasi: adaptasi,
      },
      follow_up_plan: followUp,
      additional_notes: notes || null,
      subjective_info: subjective || null,
      objective_info: objective || null,
      conclusion: conclusion || null,
      signed_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) setErr(error.message);
    else onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-warm-lg">
        <div className="sticky top-0 bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="font-heading font-bold text-lg">Laporan Pemeriksaan (FRM-005)</h2>
            <p className="text-xs text-text-secondary">Pasien: {child?.full_name} · RM {child?.rm_number}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose} className="rounded-full"><X size={16} /></Button>
        </div>

        <div className="p-6 space-y-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Tanggal Pemeriksaan"><input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className={inputCls} /></Field>
            <Field label="Usia (contoh: 5 tahun 3 bulan)"><input type="text" value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} /></Field>
          </div>
          <Field label="Keluhan Awal"><textarea rows={2} value={complaint} onChange={(e) => setComplaint(e.target.value)} className={textareaCls} /></Field>
          <Field label="Diagnosa"><input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className={inputCls} /></Field>

          <SectionHeader title="Aspek Bahasa" />
          <LevelPicker label="Joint Attention" value={langAspects.joint_attention} onChange={(v) => setLangAspects({ ...langAspects, joint_attention: v })} />
          <LevelPicker label="Respon Panggil" value={langAspects.respon_panggil} onChange={(v) => setLangAspects({ ...langAspects, respon_panggil: v })} />
          <Field label="Bahasa Ekspresif (deskripsi)"><textarea rows={2} value={langNotes.ekspresif} onChange={(e) => setLangNotes({ ...langNotes, ekspresif: e.target.value })} className={textareaCls} placeholder="Reflexive vocation, pointing, babbling, echolalia, true speech, komunikasi 2 arah, dst" /></Field>
          <Field label="Bahasa Reseptif"><textarea rows={2} value={langNotes.reseptif} onChange={(e) => setLangNotes({ ...langNotes, reseptif: e.target.value })} className={textareaCls} placeholder="Kemampuan memahami perintah" /></Field>

          <SectionHeader title="Aspek Motorik" />
          <LevelPicker label="Motorik Kasar" value={motor.motorik_kasar} onChange={(v) => setMotor({ ...motor, motorik_kasar: v })} />
          <LevelPicker label="Motorik Halus" value={motor.motorik_halus} onChange={(v) => setMotor({ ...motor, motorik_halus: v })} />

          <SectionHeader title="Aspek Sensorik" />
          {[
            { k: "taktil", l: "Taktil (Peraba)" },
            { k: "visual", l: "Visual (Penglihatan)" },
            { k: "auditori", l: "Auditori (Pendengaran)" },
            { k: "gustatori", l: "Gustatori (Perasa/Mulut)" },
            { k: "olfactory", l: "Olfactory (Penciuman)" },
            { k: "proprioceptive", l: "Proprioceptive" },
            { k: "introsceptive", l: "Introsceptive" },
            { k: "vestibular", l: "Vestibular" },
          ].map((s) => (
            <LevelPicker key={s.k} label={s.l} value={sensory[s.k] ?? ""} onChange={(v) => setSensory({ ...sensory, [s.k]: v })} />
          ))}

          <SectionHeader title="Aspek Lainnya" />
          <Field label="Control Impulse"><input type="text" value={control} onChange={(e) => setControl(e.target.value)} className={inputCls} placeholder="Impulsif / aktif / mampu perencanaan gerak" /></Field>
          <Field label="Regulasi Emosi"><input type="text" value={regulasi} onChange={(e) => setRegulasi(e.target.value)} className={inputCls} placeholder="Belum optimal / butuh koregulasi / adaptif" /></Field>
          <Field label="Kemampuan Adaptasi"><input type="text" value={adaptasi} onChange={(e) => setAdaptasi(e.target.value)} className={inputCls} placeholder="Berulang dominan / menarik diri / butuh bantuan / mampu" /></Field>

          <SectionHeader title="Rencana Lanjutan" />
          <div className="flex flex-wrap gap-2">
            {FOLLOW_UP_OPTIONS.map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => toggleFollowUp(o.v)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
                  followUp.includes(o.v) ? "bg-primary/10 border-primary text-primary" : "bg-white border-black/10 text-text-secondary hover:border-primary/40"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>

          <Field label="Catatan Tambahan"><textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={textareaCls} /></Field>
          <Field label="Informasi Subjektif (Prenatal, natal, postnatal, dll)"><textarea rows={3} value={subjective} onChange={(e) => setSubjective(e.target.value)} className={textareaCls} /></Field>
          <Field label="Informasi Objektif (Hasil observasi)"><textarea rows={3} value={objective} onChange={(e) => setObjective(e.target.value)} className={textareaCls} /></Field>
          <Field label="Kesimpulan"><textarea rows={3} value={conclusion} onChange={(e) => setConclusion(e.target.value)} className={textareaCls} /></Field>

          {err && <div className="text-sm text-red bg-red/10 border border-red/20 rounded-2xl px-4 py-3">{err}</div>}

          <div className="flex justify-end gap-2 pt-4 border-t border-black/5">
            <Button variant="outline" onClick={onClose} className="rounded-full border-2">Batal</Button>
            <Button onClick={save} disabled={saving} className="rounded-full shadow-warm">
              {saving ? <><Loader2 className="animate-spin mr-2" size={14} /> Menyimpan…</> : <><Save size={14} className="mr-2" /> Simpan Laporan</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Detail Modal ============

function ExaminationDetail({ exam, child, onClose }: { exam: Exam; child: Child | undefined; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto print:static print:bg-white print:p-0">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-warm-lg print:shadow-none print:rounded-none">
        <div className="sticky top-0 bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between rounded-t-3xl print:hidden">
          <h2 className="font-heading font-bold text-lg">Laporan Pemeriksaan</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                printWithTitle(
                  `FRM-005_${child?.rm_number ?? "RM"}_${(child?.full_name ?? "").replace(/\s+/g, "-")}_${isoDate(exam.examination_date)}`
                )
              }
              className="rounded-full border-2"
            >
              <Printer size={14} className="mr-1" /> Print / PDF
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose} className="rounded-full"><X size={16} /></Button>
          </div>
        </div>

        <div className="p-6 md:p-8 text-sm space-y-4">
          <div className="hidden print:block text-center mb-6 pb-4 border-b-2 border-black">
            <div className="flex justify-center gap-4 items-center mb-3">
              <img src="/mitra-diani-logo.png" alt="Mitra Diani" style={{ height: 60 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              <img src="/logo.png" alt="FlourishCare" style={{ height: 60 }} />
            </div>
            <h1 className="text-2xl font-bold">Laporan Pemeriksaan</h1>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-black/10">
            <div><strong>Nama:</strong> {child?.full_name ?? "-"}</div>
            <div><strong>Tanggal:</strong> {new Date(exam.examination_date).toLocaleDateString("id-ID")}</div>
            <div><strong>Usia:</strong> {exam.patient_age ?? "-"}</div>
            <div><strong>Diagnosa:</strong> {exam.diagnosis ?? "-"}</div>
          </div>

          {exam.chief_complaint && <DetailRow label="Keluhan Awal" value={exam.chief_complaint} />}
          <DetailSection title="Aspek Bahasa">
            {Object.entries(exam.language_aspects).map(([k, v]) => (
              <DetailRow key={k} label={k.replace(/_/g, " ")} value={String(v || "-")} />
            ))}
          </DetailSection>
          <DetailSection title="Aspek Motorik">
            {Object.entries(exam.motor_aspects).map(([k, v]) => (
              <DetailRow key={k} label={k.replace(/_/g, " ")} value={String(v || "-")} />
            ))}
          </DetailSection>
          <DetailSection title="Aspek Sensorik">
            {Object.entries(exam.sensory_aspects).map(([k, v]) => (
              <DetailRow key={k} label={k.replace(/_/g, " ")} value={String(v || "-")} />
            ))}
          </DetailSection>
          <DetailSection title="Aspek Lainnya">
            {Object.entries(exam.other_aspects).map(([k, v]) => (
              <DetailRow key={k} label={k.replace(/_/g, " ")} value={String(v || "-")} />
            ))}
          </DetailSection>
          {exam.follow_up_plan.length > 0 && (
            <div>
              <p className="font-bold mb-1">Rencana Lanjutan:</p>
              <div className="flex flex-wrap gap-1">
                {exam.follow_up_plan.map((p) => (
                  <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{p}</span>
                ))}
              </div>
            </div>
          )}
          {exam.additional_notes && <DetailRow label="Catatan Tambahan" value={exam.additional_notes} />}
          {exam.subjective_info && <DetailRow label="Informasi Subjektif" value={exam.subjective_info} />}
          {exam.objective_info && <DetailRow label="Informasi Objektif" value={exam.objective_info} />}
          {exam.conclusion && <DetailRow label="Kesimpulan" value={exam.conclusion} />}
        </div>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-heading font-bold text-base pb-1 mb-2 border-b border-primary/30 text-primary">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-1">
      <span className="w-40 flex-shrink-0 text-text-secondary capitalize text-xs">{label}</span>
      <span className="flex-1 whitespace-pre-line">{value}</span>
    </div>
  );
}

// ============ Small helpers ============
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>
      {children}
    </div>
  );
}
function SectionHeader({ title }: { title: string }) {
  return <h3 className="font-heading font-bold text-base pb-1 mb-2 border-b border-primary/30 text-primary mt-4">{title}</h3>;
}
function LevelPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((lv) => (
          <button
            key={lv.v}
            type="button"
            onClick={() => onChange(lv.v)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${
              value === lv.v ? "bg-primary/10 border-primary text-primary" : "bg-white border-black/10 text-text-secondary hover:border-primary/40"
            }`}
          >
            {lv.l}
          </button>
        ))}
      </div>
    </Field>
  );
}
const inputCls = "w-full rounded-xl border border-black/10 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
const textareaCls = "w-full rounded-2xl border border-black/10 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";
