import { useEffect, useMemo, useState } from "react";
import { Users, Search } from "lucide-react";
import { fetchChildren } from "@/features/dashboard/queries";
import type { Child } from "@/types/database";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";

export function PatientsView() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchChildren(200);
        if (!cancelled) setChildren(data);
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

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return children;
    return children.filter(
      (c) => c.full_name.toLowerCase().includes(s) || c.rm_number.toLowerCase().includes(s)
    );
  }, [children, q]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="search"
          placeholder="Cari nama atau RM"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-primary/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {loading ? (
        <LoadingBlock />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Belum ada pasien"
          description="Data pasien akan muncul di sini setelah ditambahkan oleh admin."
          icon={Users}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-primary/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background text-text-secondary text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">RM</th>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Tgl Lahir</th>
                  <th className="px-4 py-3 font-medium">Jenis Kelamin</th>
                  <th className="px-4 py-3 font-medium">Kondisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-background/60">
                    <td className="px-4 py-3 font-mono text-xs">{c.rm_number}</td>
                    <td className="px-4 py-3 font-semibold">{c.full_name}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(c.dob).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">{c.gender === "L" ? "Laki-laki" : "Perempuan"}</td>
                    <td className="px-4 py-3 text-text-secondary">{c.primary_condition ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
