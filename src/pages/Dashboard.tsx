import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  FileText, 
  CreditCard, 
  Camera, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  Activity,
  Clock,
  UserCheck
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Role = "Super Admin" | "Admin Cabang" | "Psikolog" | "Terapis" | "Karyawan";
type Tab = "Overview" | "Jadwal" | "Pasien" | "Rekam Medis" | "Booking" | "Keuangan" | "Presensi" | "Pengaturan";

interface RoleConfig {
  name: Role;
  tabs: Tab[];
}

const ROLES: RoleConfig[] = [
  {
    name: "Super Admin",
    tabs: ["Overview", "Booking", "Jadwal", "Pasien", "Rekam Medis", "Keuangan", "Presensi", "Pengaturan"]
  },
  {
    name: "Admin Cabang",
    tabs: ["Overview", "Booking", "Jadwal", "Pasien", "Keuangan", "Presensi"]
  },
  {
    name: "Psikolog",
    tabs: ["Overview", "Jadwal", "Pasien", "Rekam Medis", "Presensi"]
  },
  {
    name: "Terapis",
    tabs: ["Overview", "Jadwal", "Pasien", "Presensi"]
  },
  {
    name: "Karyawan",
    tabs: ["Overview", "Jadwal", "Presensi"]
  }
];

const TAB_ICONS: Record<Tab, React.ElementType> = {
  Overview: LayoutDashboard,
  Jadwal: CalendarDays,
  Pasien: Users,
  "Rekam Medis": FileText,
  Booking: Clock,
  Keuangan: CreditCard,
  Presensi: Camera,
  Pengaturan: Settings
};

export function Dashboard() {
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState<Role>("Super Admin");
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const currentRoleConfig = ROLES.find(r => r.name === currentRole)!;

  // Ensure active tab is valid for current role when switching roles
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    const newRoleConfig = ROLES.find(r => r.name === role)!;
    if (!newRoleConfig.tabs.includes(activeTab)) {
      setActiveTab(newRoleConfig.tabs[0]);
    }
    setIsRoleDropdownOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-r border-gray-200 flex flex-col h-screen shrink-0 z-20"
          >
            <div className="p-6 flex items-center justify-center border-b border-gray-100">
              <img 
                src="https://i.pinimg.com/736x/e2/11/9a/e2119a970264b1116bf8c76318d1265a.jpg" 
                alt="FlourishCare Logo" 
                className="h-12 w-auto object-contain mix-blend-multiply" 
                referrerPolicy="no-referrer" 
              />
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {currentRoleConfig.tabs.map((tab) => {
                const Icon = TAB_ICONS[tab];
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? "bg-primary text-white shadow-md shadow-primary/20" 
                        : "text-gray-500 hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-gray-100">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-heading font-bold text-gray-800 hidden sm:block">
              {activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher (For Preview Purposes) */}
            <div className="relative">
              <button 
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-medium hover:bg-primary/20 transition-colors"
              >
                <span className="text-sm">Preview Role: <strong className="ml-1">{currentRole}</strong></span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {isRoleDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    {ROLES.map((role) => (
                      <button
                        key={role.name}
                        onClick={() => handleRoleChange(role.name)}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          currentRole === role.name ? "bg-primary text-white" : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {role.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <DashboardContent role={currentRole} activeTab={activeTab} />
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Content Components ---

function DashboardContent({ role, activeTab }: { role: Role, activeTab: Tab }) {
  switch (activeTab) {
    case "Overview":
      return <OverviewView role={role} />;
    case "Jadwal":
      return <ScheduleView role={role} />;
    case "Pasien":
      return <PatientsView role={role} />;
    case "Rekam Medis":
      return <MedicalRecordsView role={role} />;
    case "Booking":
      return <BookingView role={role} />;
    case "Keuangan":
      return <FinanceView role={role} />;
    case "Presensi":
      return <AttendanceView role={role} />;
    case "Pengaturan":
      return <SettingsView role={role} />;
    default:
      return <div>Content for {activeTab} is under construction.</div>;
  }
}

function OverviewView({ role }: { role: Role }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pasien" value="1,248" icon={Users} trend="+12% bulan ini" />
        <StatCard title="Sesi Hari Ini" value="42" icon={CalendarDays} trend="5 sesi mendatang" />
        {(role === "Super Admin" || role === "Admin Cabang") && (
          <StatCard title="Pendapatan (Bulan Ini)" value="Rp 45.2M" icon={CreditCard} trend="+8% dari bulan lalu" />
        )}
        <StatCard title="Tingkat Kehadiran" value="98%" icon={UserCheck} trend="Sangat Baik" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="font-medium text-sm">Sesi Terapi Wicara Selesai</p>
                  <p className="text-xs text-gray-500">Pasien: Ananda Budi • Terapis: Siti Aisyah</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">10 mnt lalu</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Jadwal Terdekat</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-4 border-primary pl-4 py-2">
                <p className="font-medium text-sm">14:00 - 15:00</p>
                <p className="text-sm text-gray-600">Terapi Okupasi</p>
                <p className="text-xs text-gray-400 mt-1">Ruang Mawar</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleView({ role }: { role: Role }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">Jadwal & Sesi</h3>
        <Button className="rounded-full">Tambah Jadwal</Button>
      </div>
      <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
        <CalendarDays size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Tampilan Kalender Interaktif akan muncul di sini.</p>
        <p className="text-sm text-gray-400 mt-2">Menampilkan jadwal untuk: {role}</p>
      </div>
    </div>
  );
}

function PatientsView({ role }: { role: Role }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-xl">Daftar Pasien</h3>
        <input type="text" placeholder="Cari pasien..." className="px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm">
              <th className="p-4 font-medium">ID Pasien</th>
              <th className="p-4 font-medium">Nama Anak</th>
              <th className="p-4 font-medium">Usia</th>
              <th className="p-4 font-medium">Layanan Utama</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4 text-sm font-medium">#FC-00{i}</td>
                <td className="p-4 text-sm">Ananda {['Budi', 'Siti', 'Rudi', 'Ayu', 'Dika'][i-1]}</td>
                <td className="p-4 text-sm">{[4, 6, 5, 7, 3][i-1]} Tahun</td>
                <td className="p-4 text-sm text-gray-600">Terapi {['Wicara', 'Okupasi', 'Perilaku', 'Wicara', 'Sensori'][i-1]}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Aktif</span>
                </td>
                <td className="p-4">
                  <button className="text-primary text-sm hover:underline">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MedicalRecordsView({ role }: { role: Role }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
      <h3 className="font-bold text-xl mb-6">Rekam Medis & Asesmen</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-r border-gray-100 pr-6">
          <h4 className="font-medium text-gray-500 mb-4 text-sm uppercase tracking-wider">Pilih Pasien</h4>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-3 rounded-xl cursor-pointer transition-colors ${i === 1 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-50 border border-transparent'}`}>
                <p className="font-medium text-sm">Ananda Budi</p>
                <p className="text-xs text-gray-500 mt-1">Update terakhir: 2 hari lalu</p>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="font-bold text-lg mb-2">Catatan Perkembangan (Progress Note)</h4>
            <p className="text-sm text-gray-600 mb-4">Sesi Terapi Wicara - 12 April 2026</p>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-700 leading-relaxed">
              Anak menunjukkan peningkatan dalam pengucapan konsonan bilabial. Mampu meniru 5 kata baru dengan bantuan visual. Perhatian masih mudah teralih setelah 15 menit. Rekomendasi untuk orang tua: Lanjutkan latihan meniup gelembung di rumah.
            </div>
            {role === "Psikolog" && (
              <Button className="mt-4 rounded-full">Tambah Catatan Baru</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingView({ role }: { role: Role }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">Daftar Booking & Antrean</h3>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full">Filter</Button>
          <Button className="rounded-full">Buat Booking Baru</Button>
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                {i}
              </div>
              <div>
                <p className="font-bold">Keluarga Bapak Andi</p>
                <p className="text-sm text-gray-500">Konsultasi Awal • Psikolog Klinis</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">Hari ini, 15:00</p>
              <span className="inline-block mt-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Menunggu Konfirmasi</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceView({ role }: { role: Role }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Total Pemasukan (Bulan Ini)</p>
          <h3 className="text-3xl font-bold text-gray-800">Rp 45.250.000</h3>
          <p className="text-green-500 text-sm mt-2 font-medium">+12.5% vs bulan lalu</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Total Tagihan Belum Dibayar</p>
          <h3 className="text-3xl font-bold text-gray-800">Rp 3.400.000</h3>
          <p className="text-red-500 text-sm mt-2 font-medium">8 Invoice Tertunda</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">Metode Pembayaran Populer</p>
          <h3 className="text-xl font-bold text-gray-800 mt-2">Transfer Bank (65%)</h3>
          <p className="text-gray-500 text-sm mt-2">Diikuti oleh E-Wallet (25%)</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-xl mb-6">Riwayat Transaksi Terakhir</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-sm">
              <th className="pb-3 font-medium">Tanggal</th>
              <th className="pb-3 font-medium">Deskripsi</th>
              <th className="pb-3 font-medium">Metode</th>
              <th className="pb-3 font-medium">Jumlah</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="py-4 text-sm">10 Apr 2026</td>
                <td className="py-4 text-sm font-medium">Pembayaran Sesi Terapi #INV-00{i}</td>
                <td className="py-4 text-sm text-gray-500">BCA Virtual Account</td>
                <td className="py-4 text-sm font-bold">Rp 350.000</td>
                <td className="py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Lunas</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AttendanceView({ role }: { role: Role }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px] flex flex-col items-center justify-center text-center">
      <div className="max-w-md w-full">
        <h3 className="font-bold text-2xl mb-2">Presensi Wajah (Face Recognition)</h3>
        <p className="text-gray-500 mb-8">Silakan arahkan wajah Anda ke kamera untuk melakukan presensi kehadiran hari ini.</p>
        
        <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative mb-6 shadow-inner border-4 border-gray-100">
          {/* Mock Camera View */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera size={48} className="text-gray-600" />
          </div>
          {/* Scanning Overlay */}
          <div className="absolute inset-0 border-2 border-primary/50 rounded-2xl m-4 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/80 shadow-[0_0_10px_rgba(var(--primary),0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>

        <Button size="lg" className="w-full rounded-full text-lg py-6 shadow-lg shadow-primary/20">
          Mulai Scan Wajah
        </Button>

        <div className="mt-8 grid grid-cols-2 gap-4 text-left">
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500">Status Kehadiran</p>
            <p className="font-bold text-green-600">Hadir (07:45 WIB)</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500">Total Jam Kerja</p>
            <p className="font-bold text-gray-800">4j 15m</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView({ role }: { role: Role }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
      <h3 className="font-bold text-xl mb-6">Pengaturan Sistem</h3>
      <div className="max-w-2xl space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800 border-b pb-2">Manajemen Cabang</h4>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Building2 className="text-gray-400" />
              <div>
                <p className="font-medium">Cabang Utama (Surabaya)</p>
                <p className="text-sm text-gray-500">Jl. Contoh No. 123</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full">Edit</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800 border-b pb-2">Manajemen Pengguna & Role</h4>
          <p className="text-sm text-gray-500">Kelola akses untuk Admin, Psikolog, Terapis, dan Karyawan.</p>
          <Button className="rounded-full">Tambah Pengguna Baru</Button>
        </div>
      </div>
    </div>
  );
}

// Helper component
function StatCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: React.ElementType, trend: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon size={24} />
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-gray-800">{value}</h4>
        <p className="text-sm text-gray-500 mt-2">{trend}</p>
      </div>
    </div>
  );
}
