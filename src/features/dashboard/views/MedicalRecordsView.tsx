import { useEffect, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { fetchAssessedChildren, fetchMedicalRecords, fetchProgressNotes } from "@/features/dashboard/queries";
import type { Child, MedicalRecord, ProgressNote } from "@/types/database";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";

export function MedicalRecordsView() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [notes, setNotes] = useState<ProgressNote[]>([]);
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
        const [rec, prog] = await Promise.all([fetchMedicalRecords(selected), fetchProgressNotes(selected)]);
        if (!cancelled) {
          setRecords(rec);
          setNotes(prog);
        }
      } catch {
        if (!cancelled) {
          setRecords([]);
          setNotes([]);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl border border-primary/10 divide-y divide-primary/10 overflow-hidden">
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
        {detailLoading ? (
          <div className="bg-white rounded-2xl border border-primary/10 p-8 text-center text-text-secondary text-sm">
            <Loader2 className="animate-spin mx-auto mb-2" size={18} /> Memuat…
          </div>
        ) : (
          <>
            <section className="bg-white rounded-2xl border border-primary/10 p-5">
              <h3 className="font-heading font-bold mb-3">Rekam Medis</h3>
              {records.length === 0 ? (
                <p className="text-sm text-text-secondary">Belum ada rekam medis untuk pasien ini.</p>
              ) : (
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
              )}
            </section>

            <section className="bg-white rounded-2xl border border-primary/10 p-5">
              <h3 className="font-heading font-bold mb-3">Catatan Progres Publik</h3>
              {notes.length === 0 ? (
                <p className="text-sm text-text-secondary">Belum ada catatan progres yang dipublikasikan.</p>
              ) : (
                <ul className="space-y-2">
                  {notes.map((n) => (
                    <li key={n.id} className="text-sm bg-background rounded-lg px-3 py-2 border border-primary/10">
                      <p className="font-semibold">{n.title}</p>
                      <p className="text-xs text-text-secondary">{new Date(n.created_at).toLocaleDateString("id-ID")}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
