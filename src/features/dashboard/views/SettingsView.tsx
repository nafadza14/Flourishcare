import { useEffect, useState } from "react";
import { Building2, UserCog, Wallet, Calendar as CalendarIcon, Loader2, Plus, Trash2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";
import type { Branch, Profile } from "@/types/database";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

type PriceRow = { mode: "online" | "homecare"; price: number };
type Psi = { id: string; title: string; photo_url: string | null };
type Schedule = {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  session_duration_min: number;
  is_active: boolean;
};

const DAY_LABELS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

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
      {/* Harga Booking Online */}
      <PricingSection />

      {/* Jadwal Psikolog */}
      <SchedulesSection />

      {/* Cabang */}
      <section className="bg-white rounded-2xl border border-black/5 p-5">
        <h3 className="font-heading font-bold flex items-center gap-2 mb-4">
          <Building2 size={18} className="text-primary" /> Cabang
        </h3>
        {branches.length === 0 ? (
          <EmptyState title="Belum ada cabang" description="Jalankan seed atau tambahkan cabang melalui Supabase." icon={Building2} />
        ) : (
          <ul className="divide-y divide-black/5">
            {branches.map((b) => (
              <li key={b.id} className="py-3">
                <p className="font-semibold">{b.name}</p>
                <p className="text-xs text-text-secondary">{b.address}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Pengguna */}
      <section className="bg-white rounded-2xl border border-black/5 p-5">
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
              <tbody className="divide-y divide-black/5">
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

// ============ Harga Booking ============

function PricingSection() {
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("online_booking_prices").select("*").order("mode");
    const rows = (data as PriceRow[]) ?? [];
    setPrices(rows);
    const d: Record<string, string> = {};
    rows.forEach((r) => { d[r.mode] = String(r.price); });
    setDraft(d);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function save(mode: string) {
    setSaving(mode);
    setMsg(null);
    const newPrice = Number(draft[mode]);
    if (isNaN(newPrice) || newPrice <= 0) {
      setMsg("Harga harus angka positif.");
      setSaving(null);
      return;
    }
    const { error } = await supabase
      .from("online_booking_prices")
      .update({ price: newPrice })
      .eq("mode", mode);
    setSaving(null);
    if (error) setMsg(`Error: ${error.message}`);
    else {
      setMsg(`Harga ${mode} berhasil diupdate ke Rp ${newPrice.toLocaleString("id-ID")}.`);
      void load();
    }
  }

  return (
    <section className="bg-white rounded-2xl border border-black/5 p-5">
      <h3 className="font-heading font-bold flex items-center gap-2 mb-1">
        <Wallet size={18} className="text-primary" /> Harga Booking Online
      </h3>
      <p className="text-xs text-text-secondary mb-4">
        Harga yang tampil di halaman <span className="font-mono">book.flourishcare.id</span>.
      </p>

      {loading ? (
        <div className="text-sm text-text-secondary flex items-center gap-2">
          <Loader2 className="animate-spin" size={14} /> Memuat harga…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prices.map((p) => (
            <div key={p.mode} className="bg-background rounded-2xl p-4 border border-black/5">
              <p className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-2">
                {p.mode === "online" ? "Konsultasi Online" : "Homecare Visit"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Rp</span>
                <input
                  type="number"
                  value={draft[p.mode] ?? ""}
                  onChange={(e) => setDraft({ ...draft, [p.mode]: e.target.value })}
                  min={0}
                  step={1000}
                  className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <Button size="sm" onClick={() => save(p.mode)} disabled={saving === p.mode} className="rounded-full">
                  {saving === p.mode ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                </Button>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Saat ini: <span className="font-semibold">Rp {p.price.toLocaleString("id-ID")}</span>
              </p>
            </div>
          ))}
        </div>
      )}
      {msg && (
        <p className={`text-xs mt-3 ${msg.startsWith("Error") ? "text-red" : "text-green-700"}`}>{msg}</p>
      )}
    </section>
  );
}

// ============ Jadwal Psikolog ============

function SchedulesSection() {
  const { role } = useAuth();
  const canEdit = role === "super_admin" || role === "admin_cabang";
  const [psis, setPsis] = useState<Psi[]>([]);
  const [selectedPsi, setSelectedPsi] = useState<string>("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loadingPsi, setLoadingPsi] = useState(true);
  const [loadingSched, setLoadingSched] = useState(false);

  // Form input untuk tambah schedule baru
  const [newDay, setNewDay] = useState<number>(1);
  const [newStart, setNewStart] = useState<string>("19:00");
  const [newEnd, setNewEnd] = useState<string>("20:30");
  const [newDuration, setNewDuration] = useState<number>(60);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingPsi(true);
      const { data } = await supabase
        .from("staff_profiles")
        .select("id,title,photo_url")
        .eq("is_visible", true)
        .order("display_order");
      const list = (data as Psi[]) ?? [];
      setPsis(list);
      if (list[0]) setSelectedPsi(list[0].id);
      setLoadingPsi(false);
    })();
  }, []);

  async function loadSchedules() {
    if (!selectedPsi) return;
    setLoadingSched(true);
    const { data } = await supabase
      .from("psychologist_schedules")
      .select("*")
      .eq("staff_id", selectedPsi)
      .order("day_of_week")
      .order("start_time");
    setSchedules((data as Schedule[]) ?? []);
    setLoadingSched(false);
  }

  useEffect(() => { void loadSchedules(); }, [selectedPsi]);

  async function addSchedule() {
    if (!selectedPsi) return;
    if (newStart >= newEnd) {
      setMsg("Waktu mulai harus sebelum waktu selesai.");
      return;
    }
    setSaving(true);
    setMsg(null);
    const { error } = await supabase.from("psychologist_schedules").insert({
      staff_id: selectedPsi,
      day_of_week: newDay,
      start_time: newStart,
      end_time: newEnd,
      session_duration_min: newDuration,
      is_active: true,
    });
    setSaving(false);
    if (error) setMsg(`Error: ${error.message}`);
    else {
      setMsg("Jadwal berhasil ditambahkan.");
      void loadSchedules();
    }
  }

  async function deleteSchedule(id: string) {
    if (!confirm("Hapus jadwal ini?")) return;
    await supabase.from("psychologist_schedules").delete().eq("id", id);
    void loadSchedules();
  }

  async function toggleActive(s: Schedule) {
    await supabase
      .from("psychologist_schedules")
      .update({ is_active: !s.is_active })
      .eq("id", s.id);
    void loadSchedules();
  }

  return (
    <section className="bg-white rounded-2xl border border-black/5 p-5">
      <h3 className="font-heading font-bold flex items-center gap-2 mb-1">
        <CalendarIcon size={18} className="text-primary" /> Jadwal Psikolog (Booking Online)
      </h3>
      <p className="text-xs text-text-secondary mb-4">
        Kelola jadwal sesi online & homecare. Perubahan langsung mempengaruhi slot di halaman booking publik.
      </p>

      {loadingPsi ? (
        <div className="text-sm text-text-secondary flex items-center gap-2">
          <Loader2 className="animate-spin" size={14} /> Memuat…
        </div>
      ) : (
        <>
          {/* Pilih psikolog */}
          <div className="mb-4">
            <label className="block text-xs text-text-secondary font-semibold uppercase tracking-wider mb-2">Pilih Psikolog</label>
            <div className="flex flex-wrap gap-2">
              {psis.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPsi(p.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedPsi === p.id
                      ? "bg-primary text-white"
                      : "bg-background border border-black/10 text-text-secondary hover:border-primary/40"
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Daftar jadwal existing */}
          <div className="bg-background rounded-2xl border border-black/5 divide-y divide-black/5 mb-5">
            {loadingSched ? (
              <div className="p-4 text-sm text-text-secondary">Memuat jadwal…</div>
            ) : schedules.length === 0 ? (
              <div className="p-4 text-sm text-text-secondary">Belum ada jadwal untuk psikolog ini.</div>
            ) : (
              schedules.map((s) => (
                <div key={s.id} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-14 text-center">
                      <p className="text-xs text-text-secondary uppercase">{DAY_LABELS[s.day_of_week].slice(0, 3)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {s.start_time.slice(0, 5)} – {s.end_time.slice(0, 5)}
                      </p>
                      <p className="text-xs text-text-secondary">Durasi sesi {s.session_duration_min} menit</p>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(s)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          s.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {s.is_active ? "Aktif" : "Nonaktif"}
                      </button>
                      <button
                        onClick={() => deleteSchedule(s.id)}
                        className="p-2 text-red hover:bg-red/10 rounded-full"
                        aria-label="Hapus jadwal"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Form tambah jadwal */}
          {canEdit && (
            <div className="bg-background rounded-2xl border border-black/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                Tambah Jadwal Baru
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="text-xs text-text-secondary">Hari</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(Number(e.target.value))}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-2 text-sm mt-1"
                  >
                    {DAY_LABELS.map((d, i) => (
                      <option key={i} value={i}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-secondary">Mulai</label>
                  <input
                    type="time"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-2 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary">Selesai</label>
                  <input
                    type="time"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-2 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary">Durasi (menit)</label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full rounded-lg border border-black/10 bg-white px-2 py-2 text-sm mt-1"
                  />
                </div>
                <Button
                  onClick={addSchedule}
                  disabled={saving}
                  size="sm"
                  className="rounded-full h-10"
                >
                  {saving ? <Loader2 className="animate-spin" size={14} /> : <><Plus size={14} className="mr-1" /> Tambah</>}
                </Button>
              </div>
              {msg && (
                <p className={`text-xs mt-3 ${msg.startsWith("Error") ? "text-red" : "text-green-700"}`}>{msg}</p>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
