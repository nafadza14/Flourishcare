import { useEffect, useState } from "react";
import { Building2, UserCog } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { EmptyState, LoadingBlock } from "@/pages/Dashboard";
import type { Branch, Profile } from "@/types/database";

export function SettingsView() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [br, us] = await Promise.all([
        supabase.from("branches").select("*").order("created_at"),
        supabase.from("profiles").select("*").order("created_at"),
      ]);
      if (!cancelled) {
        setBranches((br.data as Branch[]) ?? []);
        setUsers((us.data as Profile[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <LoadingBlock />;

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-primary/10 p-5">
        <h3 className="font-heading font-bold flex items-center gap-2 mb-4">
          <Building2 size={18} className="text-primary" /> Cabang
        </h3>
        {branches.length === 0 ? (
          <EmptyState title="Belum ada cabang" description="Jalankan seed atau tambahkan cabang melalui Supabase." icon={Building2} />
        ) : (
          <ul className="divide-y divide-primary/10">
            {branches.map((b) => (
              <li key={b.id} className="py-3">
                <p className="font-semibold">{b.name}</p>
                <p className="text-xs text-text-secondary">{b.address}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-primary/10 p-5">
        <h3 className="font-heading font-bold flex items-center gap-2 mb-4">
          <UserCog size={18} className="text-primary" /> Pengguna & Role
        </h3>
        {users.length === 0 ? (
          <EmptyState title="Belum ada pengguna" icon={UserCog} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-text-secondary">
                <tr>
                  <th className="px-4 py-2 font-medium">Nama</th>
                  <th className="px-4 py-2 font-medium">Role</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3">{u.full_name}</td>
                    <td className="px-4 py-3 capitalize">{u.role.replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                        {u.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
