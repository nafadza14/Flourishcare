import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  FileText,
  Wallet,
  Fingerprint,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types/database";
import { OverviewView } from "@/features/dashboard/views/OverviewView";
import { BookingsView } from "@/features/dashboard/views/BookingsView";
import { ScheduleView } from "@/features/dashboard/views/ScheduleView";
import { PatientsView } from "@/features/dashboard/views/PatientsView";
import { MedicalRecordsView } from "@/features/dashboard/views/MedicalRecordsView";
import { FinanceView } from "@/features/dashboard/views/FinanceView";
import { AttendanceView } from "@/features/dashboard/views/AttendanceView";
import { SettingsView } from "@/features/dashboard/views/SettingsView";

type TabKey =
  | "overview"
  | "bookings"
  | "schedule"
  | "patients"
  | "records"
  | "finance"
  | "attendance"
  | "settings";

const TABS: Array<{ key: TabKey; label: string; icon: typeof LayoutDashboard; roles: UserRole[] }> = [
  { key: "overview", label: "Overview", icon: LayoutDashboard, roles: ["super_admin", "admin_cabang", "psikolog", "terapis", "karyawan"] },
  { key: "bookings", label: "Booking", icon: ClipboardList, roles: ["super_admin", "admin_cabang"] },
  { key: "schedule", label: "Jadwal", icon: CalendarDays, roles: ["super_admin", "admin_cabang", "psikolog", "terapis", "karyawan"] },
  { key: "patients", label: "Pasien", icon: Users, roles: ["super_admin", "admin_cabang", "psikolog", "terapis"] },
  { key: "records", label: "Rekam Medis", icon: FileText, roles: ["super_admin", "psikolog"] },
  { key: "finance", label: "Keuangan", icon: Wallet, roles: ["super_admin", "admin_cabang"] },
  { key: "attendance", label: "Presensi", icon: Fingerprint, roles: ["super_admin", "admin_cabang", "psikolog", "terapis", "karyawan"] },
  { key: "settings", label: "Pengaturan", icon: Settings, roles: ["super_admin"] },
];

export function Dashboard() {
  const { profile, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleTabs = useMemo(
    () => (role ? TABS.filter((t) => t.roles.includes(role)) : TABS.filter((t) => t.key === "overview")),
    [role]
  );

  useEffect(() => {
    if (!visibleTabs.some((t) => t.key === tab)) {
      setTab(visibleTabs[0]?.key ?? "overview");
    }
  }, [visibleTabs, tab]);

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-primary/10 flex flex-col transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-primary/10 flex items-center justify-between">
          <Logo className="h-10 w-auto" />
          <button className="lg:hidden text-text-secondary" onClick={() => setSidebarOpen(false)} aria-label="Tutup menu">
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleTabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-primary/10">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-text-secondary">Masuk sebagai</p>
            <p className="text-sm font-semibold text-text-primary truncate">{profile?.full_name ?? "—"}</p>
            <p className="text-xs text-primary capitalize">{role?.replace("_", " ") ?? ""}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red hover:bg-red/10 transition-colors"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-primary/10 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-text-secondary" onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
              <Menu size={22} />
            </button>
            <div>
              <h1 className="font-heading font-bold text-lg md:text-xl">{TABS.find((t) => t.key === tab)?.label}</h1>
              <p className="text-xs text-text-secondary">
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full hidden sm:inline-flex border-2">
            <Link to="/">Lihat Situs</Link>
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-x-auto">
          {!profile && role === null ? (
            <ProfileNotFoundBanner />
          ) : (
            <>
              {tab === "overview" && <OverviewView />}
              {tab === "bookings" && <BookingsView />}
              {tab === "schedule" && <ScheduleView />}
              {tab === "patients" && <PatientsView />}
              {tab === "records" && <MedicalRecordsView />}
              {tab === "finance" && <FinanceView />}
              {tab === "attendance" && <AttendanceView />}
              {tab === "settings" && <SettingsView />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function ProfileNotFoundBanner() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-primary/10 text-center">
      <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
        <Sparkles size={22} />
      </div>
      <h2 className="text-xl font-heading font-bold mb-2">Selamat datang!</h2>
      <p className="text-sm text-text-secondary">
        Akun Anda berhasil masuk, tetapi profil di tabel <code className="text-primary">profiles</code> belum dibuat. Hubungi Super Admin untuk memberikan role dan mengaktifkan akses tab.
      </p>
    </div>
  );
}
