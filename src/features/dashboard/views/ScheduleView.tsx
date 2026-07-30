import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { fetchUpcomingSessions } from "@/features/dashboard/queries";
import type { SessionRow } from "@/types/database";
import { EmptyState, LoadingBlock } from "@/pages/Dashboard";
import { useAuth } from "@/providers/AuthProvider";

export function ScheduleView() {
  const { profile, role } = useAuth();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchUpcomingSessions(role === "psikolog" || role === "terapis" ? profile?.id : undefined, 100);
        if (!cancelled) setSessions(data);
      } catch {
        if (!cancelled) setSessions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [profile?.id, role]);

  const byDate = groupByDate(sessions);

  if (loading) return <LoadingBlock />;
  if (sessions.length === 0)
    return <EmptyState title="Belum ada jadwal" description="Jadwal terapi akan muncul di sini setelah booking dikonfirmasi." icon={CalendarDays} />;

  return (
    <div className="space-y-4">
      {byDate.map(([date, items]) => (
        <div key={date} className="bg-white rounded-2xl border border-primary/10">
          <div className="px-4 py-3 border-b border-primary/10 bg-background rounded-t-2xl">
            <p className="text-sm font-semibold">
              {new Date(date).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
            </p>
          </div>
          <ul className="divide-y divide-primary/10">
            {items.map((s) => (
              <li key={s.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    {new Date(s.scheduled_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} — Sesi #{s.id.slice(0, 6)}
                  </p>
                  <p className="text-xs text-text-secondary">Durasi {s.duration_min} menit</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{s.status}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function groupByDate(sessions: SessionRow[]): Array<[string, SessionRow[]]> {
  const map = new Map<string, SessionRow[]>();
  sessions.forEach((s) => {
    const key = new Date(s.scheduled_at).toISOString().slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  });
  return [...map.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
}
