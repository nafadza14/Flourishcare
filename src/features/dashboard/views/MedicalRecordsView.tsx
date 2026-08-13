import { useEffect, useState } from "react";
import { FileText, Loader2, Stethoscope, LineChart, ClipboardList, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchAssessedChildren, fetchMedicalRecords, fetchProgressNotes } from "@/features/dashboard/queries";
import type { Child, MedicalRecord, ProgressNote } from "@/types/database";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";

type Exam = {
  id: string;
  child_id: string;
  examination_date: string;
  chief_complaint: string | null;
  diagnosis: string | null;
  conclusion: string | null;
  follow_up_plan: string[] | null;
  additional_notes: string | null;
  created_at: string;
};

type DevReport = {
  id: string;
  child_id: string;
  therapy_date: string;
  session_no: number | null;
  session_number: number | null;
  session_total: number | null;
  total_sessions: number | null;
  therapist_name: string | null;
  mood: string | null;
  energy: string | null;
  activities: Array<{ activity?: string; duration?: string; assistance?: string; response?: string }> | null;
  obstacles: string[] | null;
  home_program: string | null;
  notes: string | null;
  created_at: string;
};

export function MedicalRecordsView() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [notes, setNotes] = useState<ProgressNote[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [reports, setReports] = useState<DevReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchAssessedChildren(200);
        if (!cancelled) {
          setChildren(data);
          if (data.length > 0) setSelected(data[0].id);
        }
      } catch {
        if (!cancelled) setChildren([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    (async () => {
      setDetailLoading(true);
      try {
        const [rec, prog, examRes, devRes] = await Promise.all([
          fetchMedicalRecords(selected),
          fetchProgressNotes(selected),
          supabase
            .from("medical_examinations")
            .select("id, child_id, examination_date, chief_complaint, diagnosis, conclusion, follow_up_plan, additional_notes, created_at")
            .eq("child_id", selected)
            .order("examination_date", { ascending: false }),
          supabase
            .from("development_reports")
            .select("*")
            .eq("child_id", selected)
            .order("therapy_date", { ascending: false }),
        ]);
        if (!cancelled) {
          setRecords(rec);
          setNotes(prog);
          setExams((examRes.data as Exam[]) ?? []);
          setReports((devRes.data as DevReport[]) ?? []);
        }
      } catch {
        if (!cancelled) {
          setRecords([]);
          setNotes([]);
          setExams([]);
          setReports([]);
        }
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  if (loading) return <LoadingBlock />;
  if (children.length === 0)
    return (
      <EmptyState
        title="Belum ada pasien dengan RM"
        description="Rekam medis hanya untuk pasien yang sudah mengisi Form Pendaftaran dan diberi Nomor RM. Data booking online tidak muncul di sini."
        icon={FileText}
      />
    );

  const selectedChild = children.find((c) => c.id === selected);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl border border-primary/10 divide-y divide-primary/10 overflow-hidden max-h-[80vh] overflow-y-auto">
        {children.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={`w-full text-left px-4 py-3 hover:bg-background/60 transition-colors ${
              selected === c.id ? "bg-primary/5" : ""
            }`}
          >
            <p className="text-sm font-semibold">{c.full_name}</p>
            <p className="text-xs text-text-secondary font-mono">{c.rm_number}</p>
          </button>
        ))}
      </div>

      <div className="md:col-span-2 space-y-4">
        {selectedChild && (
          <div className="bg-white rounded-2xl border border-primary/10 p-5">
            <h2 className="font-heading font-extrabold text-xl">{selectedChild.full_name}</h2>
            <p className="text-xs text-text-secondary font-mono">RM {selectedChild.rm_number}</p>
          </div>
        )}

        {detailLoading ? (
          <div className="bg-white rounded-2xl border border-primary/10 p-8 text-center text-text-secondary text-sm">
            <Loader2 className="animate-spin mx-auto mb-2" size={18} /> Memuat…
          </div>
        ) : (
          <>
            {/* FRM-005 Pemeriksaan */}
            <section className="bg-white rounded-2xl border border-primary/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold flex items-center gap-2">
                  <Stethoscope size={18} className="text-primary" />
                  Laporan Pemeriksaan (FRM-005)
                </h3>
                <span className="text-xs text-text-secondary">{exams.length} laporan</span>
              </div>
              {exams.length === 0 ? (
                <p className="text-sm text-text-secondary italic">
                  Belum ada laporan pemeriksaan. Buat di tab <span className="font-semibold">Pemeriksaan</span>.
                </p>
              ) : (
                <ul className="space-y-3">
                  {exams.map((e) => (
                    <li key={e.id} className="border-l-2 border-primary/40 pl-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold">
                          {new Date(e.examination_date).toLocaleDateString("id-ID", {
                            day: "2-digit", month: "long", year: "numeric",
                          })}
                        </p>
                        {e.diagnosis && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {e.diagnosis}
                          </span>
                        )}
                      </div>
                      {e.chief_complaint && (
                        <p className="text-sm text-text-secondary mt-1">
                          <span className="font-semibold">Keluhan:</span> {e.chief_complaint}
                        </p>
                      )}
                      {e.conclusion && (
                        <p className="text-sm text-text-secondary mt-1">
                          <span className="font-semibold">Kesimpulan:</span> {e.conclusion}
                        </p>
                      )}
                      {e.follow_up_plan && e.follow_up_plan.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {e.follow_up_plan.map((f, i) => (
                            <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-background border border-black/10">
                              {f.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* FRM-008 Laporan Perkembangan */}
            <section className="bg-white rounded-2xl border border-primary/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold flex items-center gap-2">
                  <LineChart size={18} className="text-primary" />
                  Laporan Perkembangan (FRM-008)
                </h3>
                <span className="text-xs text-text-secondary">{reports.length} sesi</span>
              </div>
              {reports.length === 0 ? (
                <p className="text-sm text-text-secondary italic">
                  Belum ada laporan sesi terapi. Buat di tab <span className="font-semibold">Laporan Perkembangan</span>.
                </p>
              ) : (
                <ul className="space-y-3">
                  {reports.map((r) => {
                    const sesNo = r.session_no ?? r.session_number ?? "-";
                    const sesTot = r.session_total ?? r.total_sessions ?? "-";
                    return (
                      <li key={r.id} className="border-l-2 border-secondary/60 pl-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-sm font-semibold">
                            Sesi {sesNo}/{sesTot} · {new Date(r.therapy_date).toLocaleDateString("id-ID", {
                              day: "2-digit", month: "short", year: "numeric",
                            })}
                          </p>
                          <span className="text-xs text-text-secondary">{r.therapist_name ?? ""}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary mt-1">
                          {r.mood && <span><span className="font-semibold">Mood:</span> {r.mood}</span>}
                          {r.energy && <span><span className="font-semibold">Energi:</span> {r.energy}</span>}
                        </div>
                        {r.activities && r.activities.length > 0 && (
                          <p className="text-xs text-text-secondary mt-1">
                            <span className="font-semibold">Aktivitas:</span>{" "}
                            {r.activities.map((a) => a.activity).filter(Boolean).join(", ")}
                          </p>
                        )}
                        {r.obstacles && r.obstacles.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {r.obstacles.map((o, i) => (
                              <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-red/10 text-red border border-red/20">
                                {o.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        )}
                        {r.home_program && (
                          <p className="text-xs text-text-secondary mt-1 italic">
                            <span className="font-semibold not-italic">Home program:</span> {r.home_program}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            {/* Legacy: rekam medis manual (kalau ada) */}
            {records.length > 0 && (
              <section className="bg-white rounded-2xl border border-primary/10 p-5">
                <h3 className="font-heading font-bold flex items-center gap-2 mb-3">
                  <FileText size={18} className="text-primary" />
                  Rekam Medis Manual (Lama)
                </h3>
                <ul className="space-y-3">
                  {records.map((r) => (
                    <li key={r.id} className="border-l-2 border-primary/40 pl-3">
                      <p className="text-sm font-semibold">{r.title}</p>
                      <p className="text-xs text-text-secondary mb-1">
                        {new Date(r.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-sm text-text-secondary whitespace-pre-line">{r.content}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Catatan progres publik (untuk portal pasien) */}
            <section className="bg-white rounded-2xl border border-primary/10 p-5">
              <h3 className="font-heading font-bold flex items-center gap-2 mb-3">
                <ClipboardList size={18} className="text-primary" />
                Catatan Progres Publik
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-background border border-black/10 font-normal ml-1">
                  Terlihat oleh Orang Tua
                </span>
              </h3>
              {notes.length === 0 ? (
                <p className="text-sm text-text-secondary italic">
                  Belum ada catatan publik. Isi di sini untuk info yang boleh dilihat orang tua di portal.
                </p>
              ) : (
                <ul className="space-y-2">
                  {notes.map((n) => (
                    <li key={n.id} className="text-sm bg-background rounded-lg px-3 py-2 border border-primary/10">
                      <div className="flex items-baseline justify-between">
                        <p className="font-semibold">{n.title}</p>
                        <p className="text-xs text-text-secondary">{new Date(n.created_at).toLocaleDateString("id-ID")}</p>
                      </div>
                      {n.summary && <p className="text-xs text-text-secondary mt-1">{n.summary}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="text-xs text-text-secondary bg-primary/5 border border-primary/10 rounded-2xl p-3 flex items-start gap-2">
              <ExternalLink size={14} className="text-primary mt-0.5 shrink-0" />
              <span>
                Untuk <span className="font-semibold">membuat/mengedit</span> laporan, buka tab{" "}
                <span className="font-semibold">Pemeriksaan</span> (FRM-005) atau{" "}
                <span className="font-semibold">Laporan Perkembangan</span> (FRM-008) di sidebar.
                Tab Rekam Medis ini hanya menampilkan rangkuman (read-only).
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
