import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarClock, Wallet, ClipboardList, User2, LogOut, Menu, X, Upload } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { Logo } from "@/components/Logo";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Button } from "@/components/ui/button";
import { PatientOverview } from "@/features/patient/views/PatientOverview";
import { PatientBookings } from "@/features/patient/views/PatientBookings";
import { PatientPayments } from "@/features/patient/views/PatientPayments";
import { PatientMedical } from "@/features/patient/views/PatientMedical";
import { PatientProfile } from "@/features/patient/views/PatientProfile";
import { PatientUploads } from "@/features/patient/views/PatientUploads";

type TabKey = "overview" | "bookings" | "payments" | "medical" | "uploads" | "profile";

const TABS: Array<{ key: TabKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: "overview", label: "Beranda", icon: LayoutDashboard },
  { key: "bookings", label: "Sesi & Kunjungan", icon: CalendarClock },
  { key: "payments", label: "Pembayaran", icon: Wallet },
  { key: "medical", label: "Catatan Progres", icon: ClipboardList },
  { key: "uploads", label: "Unggah Rekam Medis", icon: Upload },
  { key: "profile", label: "Profil", icon: User2 },
];

export function PatientPortal() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  const email = session?.user.email ?? "-";

  return (
    <div className="min-h-screen bg-background flex relative">
      <GrainOverlay />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-black/5 flex flex-col transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-black/5 flex items-center justify-between">
          <Logo className="h-10 w-auto" />
          <button className="lg:hidden text-text-secondary" onClick={() => setSidebarOpen(false)} aria-label="Tutup menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSidebarOpen(false); }}
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

        <div className="p-3 border-t border-black/5">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-text-secondary">Masuk sebagai</p>
            <p className="text-sm font-semibold text-text-primary truncate">{email}</p>
            <p className="text-xs text-primary">Portal Pasien</p>
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="bg-white border-b border-black/5 px-4 md:px-6 py-4 flex items-center justify-between">
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

        <main className="flex-1 p-4 md:p-6 overflow-x-auto max-w-5xl mx-auto w-full">
          {tab === "overview" && <PatientOverview />}
          {tab === "bookings" && <PatientBookings />}
          {tab === "payments" && <PatientPayments />}
          {tab === "medical" && <PatientMedical />}
          {tab === "uploads" && <PatientUploads />}
          {tab === "profile" && <PatientProfile />}
        </main>
      </div>
    </div>
  );
}
