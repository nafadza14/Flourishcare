import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { fetchPatientProgressNotes, type PatientProgressNote } from "@/features/patient/queries";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";

export function PatientMedical() {
  const [notes, setNotes] = useState<PatientProgressNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchPatientProgressNotes();
        if (!cancelled) setNotes(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingBlock />;
  if (notes.length === 0)
    return (
      <EmptyState
        title="Belum ada catatan progres"
        description="Terapis akan menulis catatan progres setelah beberapa sesi pertama. Catatan akan tampil di sini."
        icon={ClipboardList}
      />
    );

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary mb-2">
        Catatan progres yang dibagikan oleh terapis/psikolog untuk perkembangan anak Anda.
      </p>

      {notes.map((n) => (
        <div key={n.id} className="bg-white rounded-3xl border border-black/5 p-5 shadow-warm-sm">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-heading font-bold">{n.title}</h4>
            <span className="text-xs text-text-secondary whitespace-nowrap">
              {new Date(n.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{n.summary}</p>

          {n.metrics && typeof n.metrics === "object" && Object.keys(n.metrics).length > 0 && (
            <div className="mt-3 pt-3 border-t border-black/5 flex flex-wrap gap-2">
              {Object.entries(n.metrics).map(([k, v]) => (
                <span key={k} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {k}: {String(v)}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
