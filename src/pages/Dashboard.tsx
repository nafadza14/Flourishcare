import { useState, useRef, useEffect } from "react";
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
  UserCheck,
  CheckCircle2
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

  // Global Mock State for Demo Flow
  const todayStr = "2026-04-18";
  const tomorrowStr = "2026-04-19";
  const [bookings, setBookings] = useState([
    { id: 1, name: 'Keluarga Ananda Budi', phone: '0812-3344-5566', service: 'Konsultasi Awal • Psikolog', date: todayStr, time: '13:00', status: 'Menunggu Konfirmasi', therapist: 'Dr. Sarah (Psikolog)' },
    { id: 2, name: 'Keluarga Ananda Siti', phone: '0856-1122-3344', service: 'Terapi On-Site • Sensori Integrasi', date: tomorrowStr, time: '10:00', status: 'Dikonfirmasi', therapist: 'Terapis Rendi' },
    { id: 3, name: 'Keluarga Ananda Rudi', phone: '0899-7788-9900', service: 'Terapi Home Visit • Terapi Wicara', date: '2026-04-20', time: '13:00', status: 'Dikonfirmasi', therapist: 'Terapis Maya' },
    { id: 4, name: 'Keluarga Ananda Dika', phone: '0811-2233-4455', service: 'Konsultasi Lanjutan • Psikolog', date: todayStr, time: '10:00', status: 'Dikonfirmasi', therapist: 'Dr. Sarah (Psikolog)' },
  ]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);

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

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  const globalProps = { bookings, setBookings, leaveRequests, setLeaveRequests };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed lg:static top-0 left-0 bg-white border-r border-gray-200 flex flex-col h-screen w-[280px] shrink-0 z-40"
          >
            <div className="p-6 flex items-center justify-between border-b border-gray-100 h-20 shrink-0">
              <img 
                src="https://i.pinimg.com/736x/e2/11/9a/e2119a970264b1116bf8c76318d1265a.jpg" 
                alt="FlourishCare Logo" 
                className="h-10 w-auto object-contain mix-blend-multiply" 
                referrerPolicy="no-referrer" 
              />
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {currentRoleConfig.tabs.map((tab) => {
                const Icon = TAB_ICONS[tab];
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
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
        <header className="bg-white border-b border-gray-200 h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 w-full relative">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 truncate pr-2">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors shrink-0"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg sm:text-xl font-heading font-bold text-gray-800 truncate block">
              {activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Role Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1 sm:gap-2 bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full font-medium hover:bg-primary/20 transition-colors"
              >
                <span className="text-xs sm:text-sm hidden sm:inline">Preview Role:</span>
                <strong className="text-xs sm:text-sm max-w-[80px] sm:max-w-none truncate">{currentRole}</strong>
                <ChevronDown size={14} className="sm:w-4 sm:h-4 shrink-0" />
              </button>

              <AnimatePresence>
                {isRoleDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[60]"
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

            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
              <img src="https://i.pravatar.cc/150?img=32" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <DashboardContent role={currentRole} activeTab={activeTab} globalProps={globalProps} />
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Content Components ---

function DashboardContent({ role, activeTab, globalProps }: { role: Role, activeTab: Tab, globalProps: any }) {
  switch (activeTab) {
    case "Overview":
      return <OverviewView role={role} globalProps={globalProps} />;
    case "Jadwal":
      return <ScheduleView role={role} />;
    case "Pasien":
      return <PatientsView role={role} />;
    case "Rekam Medis":
      return <MedicalRecordsView role={role} />;
    case "Booking":
      return <BookingView role={role} globalProps={globalProps} />;
    case "Keuangan":
      return <FinanceView role={role} />;
    case "Presensi":
      return <AttendanceView role={role} globalProps={globalProps} />;
    case "Pengaturan":
      return <SettingsView role={role} />;
    default:
      return <div>Content for {activeTab} is under construction.</div>;
  }
}

function OverviewView({ role, globalProps }: { role: Role, globalProps: any }) {
  const { leaveRequests, setLeaveRequests, bookings } = globalProps;
  
  const handleApproveLeave = (id: number) => {
    setLeaveRequests(leaveRequests.map((req: any) => req.id === id ? { ...req, status: 'Disetujui' } : req));
  };

  const getAffectedBookings = (therapistName: string, date: string) => {
    return bookings.filter((b: any) => b.therapist === therapistName && b.date === date);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Pasien" value="1,248" icon={Users} trend="+12% bulan ini" />
        <StatCard title="Sesi Hari Ini" value="42" icon={CalendarDays} trend="5 sesi mendatang" />
        {(role === "Super Admin" || role === "Admin Cabang") && (
          <StatCard title="Pendapatan (Bulan Ini)" value="Rp 45.2M" icon={CreditCard} trend="+8% dari bulan lalu" />
        )}
        <StatCard title="Tingkat Kehadiran" value="98%" icon={UserCheck} trend="Sangat Baik" />
      </div>

      {(role === "Super Admin" || role === "Admin Cabang") && leaveRequests.length > 0 && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-orange-200">
          <h3 className="font-bold text-base sm:text-lg mb-4 text-orange-600 flex items-center gap-2">
            <Activity size={20} /> Notifikasi Admin: Pengajuan Izin / Cuti
          </h3>
          <div className="space-y-4">
            {leaveRequests.map((req: any) => {
              const affected = getAffectedBookings(req.name, req.date);
              return (
                <div key={req.id} className="p-3 sm:p-4 border border-gray-100 bg-orange-50/30 rounded-xl space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                    <div>
                      <p className="font-bold text-gray-800 text-sm sm:text-base">{req.name} <span className="text-xs sm:text-sm font-normal text-gray-500">({req.role})</span></p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1"><strong>Tanggal Izin:</strong> {new Date(req.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1"><strong>Alasan:</strong> "{req.reason}"</p>
                      <p className="text-xs font-bold mt-2 text-primary">Status: {req.status}</p>
                    </div>
                    {req.status === 'Menunggu Persetujuan' && (
                      <Button onClick={() => handleApproveLeave(req.id)} size="sm" className="rounded-lg bg-green-600 hover:bg-green-700 w-full sm:w-auto">Setujui Cuti</Button>
                    )}
                  </div>
                  
                  {/* Affected Bookings List for Admin */}
                  {req.status === 'Disetujui' && (
                    <div className="mt-4 pt-4 border-t border-orange-200/50">
                      <p className="font-bold text-sm text-gray-700 mb-2">Tindakan Diperlukan: Jadwal Pasien yang Terdampak ({affected.length})</p>
                      {affected.length === 0 ? (
                        <p className="text-sm text-gray-500">Tidak ada jadwal pasien yang terdampak pada tanggal ini.</p>
                      ) : (
                        <div className="grid gap-3">
                          {affected.map((b: any) => {
                            const waText = encodeURIComponent(`Halo ${b.name}, menginformasikan bahwa sesi ${b.service} pada ${new Date(b.date).toLocaleDateString('id-ID')} pukul ${b.time} perlu dijadwalkan ulang karena terapis berhalangan hadir. Apakah berkenan untuk merubah jadwal?`);
                            return (
                              <div key={b.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white rounded-lg border border-gray-200 gap-3 sm:gap-0">
                                <div>
                                  <p className="font-bold text-sm">{b.name}</p>
                                  <p className="text-xs text-gray-500">{b.service} • {b.time}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                                  <a href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center sm:justify-start gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors w-full sm:w-auto">
                                    Tawarkan via WA
                                  </a>
                                  <span className="text-[10px] sm:text-xs text-gray-400 italic px-1 sm:px-2 py-1.5 align-middle text-center sm:text-left w-full sm:w-auto">
                                    (Gunakan menu Booking untuk Ubah Jadwal)
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                     <Activity size={18} />
                   </div>
                   <div className="flex-1">
                     <p className="font-medium text-sm">Sesi Terapi Wicara Selesai</p>
                     <p className="text-xs text-gray-500">Ananda Budi • Siti Aisyah</p>
                   </div>
                   <span className="sm:hidden text-xs text-gray-400 shrink-0">10 mnt</span>
                </div>
                <span className="hidden sm:block ml-auto text-xs text-gray-400">10 mnt lalu</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
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
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 min-h-[400px] sm:min-h-[500px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="font-bold text-lg sm:text-xl">Jadwal & Sesi</h3>
        <Button className="rounded-full w-full sm:w-auto">Tambah Jadwal</Button>
      </div>
      <div className="bg-gray-50 rounded-xl p-6 sm:p-8 text-center border-2 border-dashed border-gray-200">
        <CalendarDays size={40} className="mx-auto text-gray-400 mb-4 sm:w-12 sm:h-12" />
        <p className="text-gray-500 text-sm sm:text-base">Tampilan Kalender Interaktif akan muncul di sini.</p>
        <p className="text-xs sm:text-sm text-gray-400 mt-2">Menampilkan jadwal untuk: {role}</p>
      </div>
    </div>
  );
}

function PatientsView({ role }: { role: Role }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-bold text-lg sm:text-xl">Daftar Pasien</h3>
        <input type="text" placeholder="Cari pasien..." className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary" />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[800px] px-4 sm:px-0">
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
    </div>
  );
}

function MedicalRecordsView({ role }: { role: Role }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 min-h-[500px]">
      <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6">Rekam Medis & Asesmen</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
          <h4 className="font-medium text-gray-500 mb-4 text-xs sm:text-sm uppercase tracking-wider">Pilih Pasien</h4>
          <div className="space-y-2 flex flex-row overflow-x-auto md:flex-col pb-2 md:pb-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-3 rounded-xl cursor-pointer transition-colors min-w-[200px] md:min-w-0 ${i === 1 ? 'bg-primary/10 border border-primary/20' : 'hover:bg-gray-50 border border-transparent'}`}>
                <p className="font-medium text-sm">Ananda Budi</p>
                <p className="text-xs text-gray-500 mt-1">Update terakhir: 2 hari lalu</p>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
            <h4 className="font-bold text-base sm:text-lg mb-2">Catatan Perkembangan (Progress Note)</h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">Sesi Terapi Wicara - 12 April 2026</p>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-700 leading-relaxed overflow-x-auto">
              Anak menunjukkan peningkatan dalam pengucapan konsonan bilabial. Mampu meniru 5 kata baru dengan bantuan visual. Perhatian masih mudah teralih setelah 15 menit. Rekomendasi untuk orang tua: Lanjutkan latihan meniup gelembung di rumah.
            </div>
            {role === "Psikolog" && (
              <Button className="mt-4 rounded-full w-full sm:w-auto">Tambah Catatan Baru</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingView({ role, globalProps }: { role: Role, globalProps: any }) {
  const { bookings, setBookings } = globalProps;

  const [rescheduleData, setRescheduleData] = useState<any>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Waktu operasional klinik dengan blok 1 jam (sesi 45 menit + persiapan)
  const availableTimeSlots = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
  ];

  const openRescheduleModal = (booking: any) => {
    setRescheduleData(booking);
    setNewDate(booking.date);
    setNewTime(booking.time);
  };

  const saveReschedule = () => {
    if (!newDate || !newTime) return;
    setBookings(prev => prev.map(b => 
      b.id === rescheduleData.id ? { ...b, date: newDate, time: newTime } : b
    ));
    setRescheduleData(null);
  };

  // Get booked times for the specific therapist on the selected newDate
  const getBookedSlots = () => {
    if (!rescheduleData || !newDate) return [];
    return bookings
      .filter(b => b.therapist === rescheduleData.therapist && b.date === newDate && b.id !== rescheduleData.id)
      .map(b => b.time);
  };

  const bookedSlots = getBookedSlots();

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 min-h-[500px] relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="font-bold text-lg sm:text-xl">Daftar Booking & Antrean</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="rounded-full flex-1 sm:flex-none">Filter</Button>
          <Button className="rounded-full flex-1 sm:flex-none">Buat Booking</Button>
        </div>
      </div>
      <div className="space-y-4">
        {bookings.map((booking, idx) => (
          <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">{booking.name}</p>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{booking.service} • {booking.therapist}</p>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-1 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-50">
              <div className="text-left sm:text-right">
                <p className="font-medium text-xs sm:text-sm">{new Date(booking.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}, {booking.time}</p>
                <span className={`inline-block mt-1 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                  booking.status === 'Dikonfirmasi' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{booking.status}</span>
              </div>
              {(role === "Super Admin" || role === "Admin Cabang") && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openRescheduleModal(booking)}
                  className="rounded-lg text-xs h-8 ml-0 sm:ml-4 shrink-0 px-2 sm:px-3"
                >
                  Ubah Jadwal
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>


      {rescheduleData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl md:rounded-3xl p-4 sm:p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4 font-heading text-text-primary">Ubah Kalender Layanan</h3>
            <div className="mb-4 sm:mb-6 text-sm text-gray-600 bg-primary/5 p-3 sm:p-4 rounded-xl border border-primary/10">
              <p className="mb-1"><strong className="text-text-primary">Pasien:</strong> {rescheduleData.name}</p>
              <p className="mb-1"><strong className="text-text-primary">Layanan:</strong> {rescheduleData.service}</p>
              <p><strong className="text-text-primary">Terapis:</strong> {rescheduleData.therapist}</p>
            </div>
            
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Pilih Tanggal Baru</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border-2 border-gray-200 rounded-xl p-2.5 sm:p-3 focus:ring-primary focus:border-primary text-text-primary outline-none transition-colors"
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(e.target.value);
                    setNewTime(""); // Reset time when date changes
                  }}
                />
              </div>
              
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-end mb-2 gap-1 sm:gap-0">
                  <label className="block text-sm font-bold text-text-primary">Pilih Waktu (Blok 60 Menit)</label>
                  <span className="text-[10px] sm:text-xs text-text-secondary bg-gray-100 px-2 py-1 rounded-md">45m Sesi + 15m Persiapan</span>
                </div>
                
                {!newDate ? (
                  <div className="text-sm text-text-secondary p-4 bg-gray-50 border border-gray-100 rounded-xl text-center border-dashed">
                    Pilih tanggal terlebih dahulu untuk melihat jadwal yang tersedia.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 flex-wrap sm:grid-cols-3 gap-2 sm:gap-3">
                    {availableTimeSlots.map(time => {
                      const isBooked = bookedSlots.includes(time);
                      const isSelected = newTime === time;
                      
                      return (
                        <button
                          key={time}
                          disabled={isBooked}
                          onClick={() => setNewTime(time)}
                          className={`py-2.5 sm:py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                            isBooked 
                              ? 'border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60' 
                              : isSelected
                                ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                                : 'border-gray-200 text-text-secondary hover:border-primary/50 hover:bg-primary/5'
                          }`}
                        >
                          {time} {isBooked && <span className="block text-[10px] font-normal leading-tight mt-0.5 text-gray-500">Terisi</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-100 w-full sm:w-auto">
              <Button variant="outline" onClick={() => setRescheduleData(null)} className="rounded-xl px-6 w-full sm:w-auto">Batal</Button>
              <Button onClick={saveReschedule} disabled={!newDate || !newTime} className="rounded-xl px-6 w-full sm:w-auto">Simpan Perubahan</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function FinanceView({ role }: { role: Role }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Total Pemasukan (Bulan Ini)</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Rp 45.250.000</h3>
          <p className="text-green-500 text-xs sm:text-sm mt-2 font-medium">+12.5% vs bulan lalu</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Total Tagihan Belum Dibayar</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Rp 3.400.000</h3>
          <p className="text-red-500 text-xs sm:text-sm mt-2 font-medium">8 Invoice Tertunda</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs sm:text-sm mb-1">Metode Pembayaran Populer</p>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mt-2">Transfer Bank (65%)</h3>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Diikuti oleh E-Wallet (25%)</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6">Riwayat Transaksi Terakhir</h3>
        <div className="overflow-x-auto">
          <div className="min-w-[700px] px-4 sm:px-0">
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
                    <td className="py-4 text-xs sm:text-sm">10 Apr 2026</td>
                    <td className="py-4 text-xs sm:text-sm font-medium">Pembayaran Sesi Terapi #INV-00{i}</td>
                    <td className="py-4 text-xs sm:text-sm text-gray-500">BCA Virtual Account</td>
                    <td className="py-4 text-xs sm:text-sm font-bold">Rp 350.000</td>
                    <td className="py-4 text-xs sm:text-sm">
                      <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] sm:text-xs font-medium">Lunas</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttendanceView({ role, globalProps }: { role: Role, globalProps: any }) {
  const { leaveRequests, setLeaveRequests } = globalProps;
  
  // States for Leave Request
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // States for Presensi
  const [scanMode, setScanMode] = useState<"onsite" | "homevisit">("onsite");
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState("");
  const [sessionNote, setSessionNote] = useState("");
  
  // Real Camera States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [cameraError, setCameraError] = useState("");

  // Simple local list to act as the database of logs for this session
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);

  // Derived states to check whether they need to Scan In or Out
  const hasClockedInOnsite = attendanceLogs.some(log => log.location === 'On-Site' && log.type === 'Datang (Clock In)');
  const hasClockedOutOnsite = attendanceLogs.some(log => log.location === 'On-Site' && log.type === 'Pulang (Clock Out)');
  
  const homeVisitLogs = attendanceLogs.filter(log => log.location === 'Home Visit');
  const isCurrentlyInSession = homeVisitLogs.length > 0 && homeVisitLogs[0].type === 'Mulai Sesi';

  // Start Camera Function
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } // Use front camera
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasCameraAccess(true);
        setCameraError("");
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setCameraError("Gagal mengakses kamera. Pastikan izin kamera diberikan.");
      setHasCameraAccess(false);
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = (type: string, note: string = "") => {
    if (!hasCameraAccess && !cameraError) {
       startCamera();
       return;
    }

    setIsScanning(true);
    setScanStatus("Mendeteksi Titik Wajah...");
    
    // Simulate API delay
    setTimeout(() => {
      setScanStatus("Selesai! Hadir tercatat.");
      setTimeout(() => {
        setIsScanning(false);
        setScanStatus("");
        setAttendanceLogs(prev => [{
          id: Date.now(),
          type,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          location: scanMode === 'onsite' ? 'On-Site' : 'Home Visit',
          note
        }, ...prev]);
        
        if (scanMode === 'homevisit' && type === 'Selesai Sesi') {
          setSessionNote(""); // Clear input after finishing home visit block
        }
      }, 1000);
    }, 1500);
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveDate || !leaveReason) return;
    
    setLeaveRequests([
      ...leaveRequests, 
      { id: Date.now(), role, name: role === 'Psikolog' ? 'Dr. Sarah (Psikolog)' : 'Terapis Maya', date: leaveDate, reason: leaveReason, status: 'Menunggu Persetujuan' }
    ]);
    setSubmitted(true);
    setLeaveDate("");
    setLeaveReason("");
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-6 sm:gap-8">
        
        {/* Lensa Camera Section */}
        <div className="flex-1 flex flex-col items-center">
          <h3 className="font-bold text-xl sm:text-2xl mb-2 text-center">Presensi Wajah (Face Recognition)</h3>
          <p className="text-gray-500 mb-4 sm:mb-6 text-center text-sm">Arahkan wajah Anda ke kamera untuk verifikasi kehadiran.</p>
          
          <div className="w-full max-w-[280px] sm:max-w-sm aspect-[3/4] sm:aspect-square bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden relative mb-4 sm:mb-6 shadow-inner border-[4px] sm:border-[6px] border-gray-100 flex items-center justify-center">
            
            {!hasCameraAccess && !cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-gray-800 z-10">
                <Camera size={48} className="mb-2 text-gray-400" />
                <p className="text-xs">Memuat Kamera...</p>
              </div>
            )}

            {cameraError && (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 P-4 text-center bg-gray-800 z-10">
                <p className="text-sm px-4">{cameraError}</p>
                <Button variant="outline" size="sm" onClick={startCamera} className="mt-4 border-red-500/50 hover:bg-red-500/10 text-red-400 rounded-full">
                  Coba Lagi
                </Button>
              </div>
            )}

            {/* Actual Video Stream */}
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${hasCameraAccess ? 'opacity-100' : 'opacity-0'}`}
            />
            
            {/* Scanning Overlay Animation */}
            {isScanning && (
              <>
                <div className="absolute inset-0 border-4 border-primary/50 rounded-2xl m-4 animate-pulse z-20"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_15px_rgba(var(--primary),1)] animate-[scan_1.5s_ease-in-out_infinite] z-20"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center text-white font-medium bg-black/50 py-1 backdrop-blur-sm z-20">
                  {scanStatus}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Panel Aksi Presensi */}
        <div className="w-full flex-1 flex flex-col justify-center lg:max-w-md mx-auto xl:mx-0">
          
          {/* Toggles */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-4 sm:mb-6 mt-4 lg:mt-0">
            <button 
              onClick={() => setScanMode("onsite")}
              className={`flex-1 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors ${scanMode === 'onsite' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Di Klinik
            </button>
            <button 
              onClick={() => setScanMode("homevisit")}
              className={`flex-1 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors ${scanMode === 'homevisit' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Home Visit
            </button>
          </div>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100 mb-4 sm:mb-6 min-h-[160px] flex flex-col justify-center w-full">
            {scanMode === 'onsite' ? (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-center text-gray-500 mb-2">Presensi kehadiran dan kepulangan di Klinik.</p>
                {!hasClockedInOnsite ? (
                  <Button 
                    size="lg" 
                    onClick={() => handleScan('Datang (Clock In)')}
                    disabled={isScanning}
                    className="w-full rounded-full text-base sm:text-lg py-5 sm:py-6 shadow-lg shadow-primary/20"
                  >
                    Scan Wajah (BERANGKAT)
                  </Button>
                ) : !hasClockedOutOnsite ? (
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => handleScan('Pulang (Clock Out)')}
                    disabled={isScanning}
                    className="w-full rounded-full text-base sm:text-lg py-5 sm:py-6 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Scan Wajah (PULANG)
                  </Button>
                ) : (
                  <div className="text-center p-3 sm:p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                    <UserCheck className="mx-auto mb-2" size={24} />
                    <p className="font-bold text-sm sm:text-base">Selesai</p>
                    <p className="text-xs sm:text-sm mt-1">Anda telah presensi hari ini.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs sm:text-sm text-center text-gray-500 mb-2">Presensi di titik lokasi setiap sesi.</p>
                
                {!isCurrentlyInSession ? (
                  <>
                    <input 
                      type="text" 
                      placeholder="Nama Pasien / Sesi ..."
                      value={sessionNote}
                      onChange={(e) => setSessionNote(e.target.value)}
                      className="w-full p-2.5 sm:p-3 rounded-xl border border-gray-200 text-sm focus:ring-primary focus:border-primary outline-none"
                    />
                    <Button 
                      size="lg" 
                      onClick={() => handleScan('Mulai Sesi', sessionNote)}
                      disabled={isScanning || !sessionNote}
                      className="w-full rounded-full text-base sm:text-lg py-5 sm:py-6 shadow-lg shadow-primary/20 bg-blue-600 hover:bg-blue-700"
                    >
                      Scan Wajah (MULAI)
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-center text-xs sm:text-sm border border-blue-100 flex flex-col items-center gap-1">
                      <span className="font-bold flex justify-center items-center gap-2"><Activity size={16} className="animate-pulse" /> Sedang sesi:</span>
                      <span className="truncate w-full max-w-[200px] sm:max-w-none">{homeVisitLogs[0]?.note || "Tanpa Nama"}</span>
                    </div>
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => handleScan('Selesai Sesi', homeVisitLogs[0]?.note)}
                      disabled={isScanning}
                      className="w-full rounded-full text-base sm:text-lg py-5 sm:py-6 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={20} /> <span className="hidden sm:inline">Scan Wajah (SELESAI)</span><span className="sm:hidden">SELESAI</span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Recent Logs Table */}
          {attendanceLogs.length > 0 && (
            <div className="mt-2 text-left bg-white p-4 rounded-xl border border-gray-100">
              <h4 className="font-bold text-sm text-gray-700 mb-3">Aktivitas Hari Ini</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {attendanceLogs.map(log => (
                  <div key={log.id} className="text-xs sm:text-sm border border-gray-100 p-2 sm:p-3 rounded-lg bg-gray-50 flex items-center justify-between">
                    <div className="truncate pr-2">
                      <p className="font-bold text-gray-800 truncate">{log.type}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">{log.location} {log.note ? `- ${log.note}` : ''}</p>
                    </div>
                    <span className="font-mono text-primary font-bold bg-primary/10 px-1.5 py-1 rounded-md text-xs shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {(role === "Psikolog" || role === "Terapis") && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg sm:text-xl mb-4 border-b pb-4">Pengajuan Izin / Cuti</h3>
          {submitted ? (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-medium border border-green-200 text-sm sm:text-base">
              Pengajuan izin berhasil dikirim ke Admin Cabang untuk persetujuan.
            </div>
          ) : (
            <form onSubmit={handleSubmitLeave} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Izin/Cuti</label>
                <input 
                  type="date" 
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan / Alasan (Terkait Perubahan Jadwal)</label>
                <textarea 
                  rows={3}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Contoh: Saya ada keperluan keluarga darurat. Mohon jadwalkan ulang pasien saya untuk hari ini ke hari lain."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-primary focus:border-primary outline-none"
                  required
                ></textarea>
              </div>
              <div className="pt-2">
                <Button type="submit" className="rounded-xl px-8 w-full sm:w-auto">Kirim Pengajuan</Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function SettingsView({ role }: { role: Role }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 min-h-[500px]">
      <h3 className="font-bold text-lg sm:text-xl mb-6">Pengaturan Sistem</h3>
      <div className="max-w-2xl space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800 border-b pb-2 text-sm sm:text-base">Manajemen Cabang</h4>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl gap-4 sm:gap-0">
            <div className="flex items-center gap-3">
              <Building2 className="text-gray-400 shrink-0" />
              <div>
                <p className="font-medium text-sm sm:text-base">Cabang Utama (Surabaya)</p>
                <p className="text-xs sm:text-sm text-gray-500">Jl. Contoh No. 123</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full w-full sm:w-auto">Edit</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800 border-b pb-2 text-sm sm:text-base">Manajemen Pengguna & Role</h4>
          <p className="text-xs sm:text-sm text-gray-500">Kelola akses untuk Admin, Psikolog, Terapis, dan Karyawan.</p>
          <Button className="rounded-full w-full sm:w-auto">Tambah Pengguna Baru</Button>
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
