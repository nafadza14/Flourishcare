import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Home, 
  Stethoscope, 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  CreditCard,
  ChevronRight,
  ChevronLeft,
  ClipboardCheck,
  QrCode
} from "lucide-react";

const steps = [
  "Layanan",
  "Jenis Terapi",
  "Paket",
  "Jadwal",
  "Data Diri",
  "Pembayaran"
];

export function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    therapyType: "",
    package: "",
    dayType: "weekdays", // weekdays or weekend
    therapist: "",
    date: "",
    time: "",
    childName: "",
    childDob: "",
    childGender: "",
    condition: "",
    parentName: "",
    whatsapp: "",
    email: "",
    address: "",
    paymentMethod: ""
  });

  const nextStep = () => {
    // Skip paket step if not terapi
    if (currentStep === 2 && formData.service !== "onsite" && formData.service !== "homevisit") {
      setCurrentStep(4);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    if (currentStep === 4 && formData.service !== "onsite" && formData.service !== "homevisit") {
      setCurrentStep(2);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const updateForm = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            Sistem Pemesanan Sesi
          </h1>
          <p className="text-text-secondary">
            Selesaikan langkah-langkah di bawah ini untuk menjadwalkan sesi.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-primary/10 z-0 rounded-full" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step, index) => {
              const stepNum = index + 1;
              const isActive = stepNum === currentStep;
              const isCompleted = stepNum < currentStep;
              let isSkipped = false;
              if (stepNum === 3 && formData.service !== "onsite" && formData.service !== "homevisit" && currentStep > 2) {
                isSkipped = true;
              }

              return (
                <div key={step} className={`relative z-10 flex flex-col items-center gap-2 ${isSkipped ? 'opacity-30' : ''}`}>
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                      isActive ? "bg-primary text-white shadow-lg shadow-primary/30" :
                      isCompleted ? "bg-primary text-white" :
                      "bg-white text-text-secondary border-2 border-primary/10"
                    }`}
                  >
                    {isCompleted && !isSkipped ? <CheckCircle2 size={20} /> : stepNum}
                  </div>
                  <span className={`text-xs font-medium hidden md:block ${isActive ? "text-primary" : "text-text-secondary"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 border border-primary/10 p-6 md:p-10 min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-grow"
            >
              {currentStep === 1 && (
                <Step1Service 
                  selected={formData.service} 
                  onSelect={(val) => { updateForm("service", val); updateForm("therapyType", ""); }} 
                />
              )}
              {currentStep === 2 && (
                <Step2Therapy 
                  service={formData.service}
                  selected={formData.therapyType} 
                  onSelect={(val) => updateForm("therapyType", val)} 
                />
              )}
              {currentStep === 3 && (
                <Step3Package 
                  selected={formData.package} 
                  onSelect={(val) => updateForm("package", val)}
                  dayType={formData.dayType}
                  onTypeChange={(val) => updateForm("dayType", val)}
                />
              )}
              {currentStep === 4 && (
                <Step4Schedule 
                  data={formData} 
                  updateForm={updateForm} 
                />
              )}
              {currentStep === 5 && (
                <Step5Data 
                  data={formData} 
                  updateForm={updateForm} 
                />
              )}
              {currentStep === 6 && (
                <Step6Payment 
                  data={formData} 
                  updateForm={updateForm} 
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-primary/10">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="rounded-xl"
            >
              <ChevronLeft size={20} className="mr-2" /> Kembali
            </Button>
            
            {currentStep < steps.length ? (
              <Button onClick={nextStep} className="rounded-xl px-8" disabled={
                (currentStep === 1 && !formData.service) ||
                (currentStep === 2 && !formData.therapyType) ||
                (currentStep === 3 && !formData.package) 
              }>
                Lanjut <ChevronRight size={20} className="ml-2" />
              </Button>
            ) : (
              <Button className="rounded-xl px-8 bg-secondary hover:bg-secondary/90">
                Selesaikan Pembayaran
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub Components for Steps ---

function Step1Service({ selected, onSelect }: { selected: string, onSelect: (val: string) => void }) {
  const options = [
    { id: "onsite", title: "Terapi On-Site", icon: Building2, desc: "Sesi terapi di klinik FlourishCare" },
    { id: "homevisit", title: "Terapi Home Visit", icon: Home, desc: "Terapis datang ke rumah Anda" },
    { id: "psikolog", title: "Konsultasi Psikolog", icon: Stethoscope, desc: "Sesi konsultasi dengan psikolog berpengalaman" },
    { id: "psikotes", title: "Psikotes & Asesmen", icon: ClipboardCheck, desc: "Evaluasi perkembangan & IQ" }
  ];

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Pilih Tipe Layanan</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              selected === opt.id 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-primary/10 hover:border-primary/30 hover:bg-background"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              selected === opt.id ? "bg-primary text-white" : "bg-primary/10 text-primary"
            }`}>
              <opt.icon size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">{opt.title}</h3>
            <p className="text-sm text-text-secondary">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2Therapy({ service, selected, onSelect }: { service: string, selected: string, onSelect: (val: string) => void }) {
  let options: any[] = [];
  let description = "Pilih spesifik layanan yang Anda butuhkan.";

  if (service === "onsite" || service === "homevisit") {
    options = [
      { id: "SI", title: "Sensori Integrasi (SI)", desc: "Membantu regulasi sensori anak" },
      { id: "TW", title: "Terapi Wicara (TW)", desc: "Membantu keterlambatan bicara & komunikasi" },
      { id: "OT", title: "Okupasi Terapi (OT)", desc: "Membantu kemandirian & motorik halus" },
      { id: "BT", title: "Behavioral Therapy (BT)", desc: "Membantu modifikasi perilaku & tantrum" }
    ];
    description = "Pilih jenis terapi. *Harus telah melewati assessment / memiliki surat hasil pemeriksaan sebelumnya.";
  } else if (service === "psikolog") {
    options = [
      { id: "konsultasi", title: "Konsultasi Psikolog", desc: "Sesi konseling orang tua / anak" }
    ];
  } else if (service === "psikotes") {
    options = [
      { id: "tesIQ", title: "Tes IQ", desc: "Mengukur tingkat intelegensi anak" },
      { id: "evaluasi", title: "Tes Evaluasi Perkembangan", desc: "Melihat tahap perkembangan sesuai usia" },
      { id: "kesiapan", title: "Tes Kesiapan Sekolah", desc: "Mengukur kesiapan masuk SD" },
      { id: "diagnosa", title: "Tes Penegakan Diagnosa", desc: "Penegakan diagnosa psikologis" }
    ];
  }

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-2">Pilih Jenis Layanan</h2>
      <p className="text-sm text-text-secondary mb-6">{description}</p>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`p-5 rounded-2xl border-2 flex justify-between items-center transition-all ${
              selected === opt.id 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-primary/10 hover:border-primary/30"
            }`}
          >
            <div className="text-left">
              <h3 className="font-bold text-lg">{opt.title}</h3>
              <p className="text-sm text-text-secondary mt-1">{opt.desc}</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
              selected === opt.id ? "border-primary bg-primary" : "border-gray-300"
            }`}>
              {selected === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center bg-bluebell/10 p-4 rounded-xl border border-bluebell/30">
        <p className="text-sm font-medium text-text-primary mb-2">Tidak yakin layanan apa yang dibutuhkan?</p>
        <a href="https://wa.me/628175028099" target="_blank" rel="noopener noreferrer" className="text-sm text-primary font-bold hover:underline">
          Chat dulu dengan tim kami via WhatsApp
        </a>
      </div>
    </div>
  );
}

function Step3Package({ selected, onSelect, dayType, onTypeChange }: { selected: string, onSelect: (val: string) => void, dayType: string, onTypeChange: (val: string) => void }) {
  const options = [
    { id: "4", title: "4 Sesi", label: "" },
    { id: "8", title: "8 Sesi", label: "Paling Populer" },
    { id: "12", title: "12 Sesi", label: "" },
    { id: "16", title: "16 Sesi", label: "Terhemat ++" }
  ];

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Pilih Paket Terapi</h2>
      
      <div className="flex gap-4 mb-6">
        <button 
          className={`flex-1 py-3 rounded-lg border-2 text-sm font-bold transition-all ${dayType === 'weekdays' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500'}`}
          onClick={() => onTypeChange("weekdays")}
        >
          Weekdays
        </button>
        <button 
          className={`flex-1 py-3 rounded-lg border-2 text-sm font-bold transition-all ${dayType === 'weekend' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500'}`}
          onClick={() => onTypeChange("weekend")}
        >
          Weekend Rate
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
              selected === opt.id 
                ? "border-primary bg-primary/5 shadow-md" 
                : "border-primary/10 hover:border-primary/30"
            }`}
          >
            {opt.label && (
              <span className={`absolute -top-3 right-4 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${opt.label.includes('Populer') ? 'bg-yellow text-text-primary' : 'bg-secondary text-white'}`}>
                {opt.label}
              </span>
            )}
            <h3 className="font-bold text-xl mb-1">{opt.title}</h3>
            <p className="text-sm text-text-secondary">Pilihan paket komitmen terapi</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step4Schedule({ data, updateForm }: { data: any, updateForm: any }) {
  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Pilih Terapis & Jadwal</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-text-primary mb-2">Terapis Tersedia</label>
          <select 
            className="w-full p-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.therapist}
            onChange={(e) => updateForm("therapist", e.target.value)}
          >
            <option value="">Pilih Terapis Tanpa Preferensi</option>
            <option value="t1">Siti Aminah, S.Psi -⭐ 4.9 (Pengalaman 5 thn)</option>
            <option value="t2">Budi Santoso, Amd.OT -⭐ 4.8</option>
            <option value="t3">Rina Wati, Amd.TW -⭐ 4.9</option>
          </select>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-text-primary mb-2">Tanggal Mulai</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
              <input 
                type="date" 
                className="w-full pl-10 p-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={data.date}
                onChange={(e) => updateForm("date", e.target.value)}
              />
            </div>
            {data.dayType === 'weekend' && <p className="text-xs text-orange font-bold mt-1">Hanya pilih slot di Sabtu/Minggu</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-text-primary mb-2">Waktu Sesi</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
              <select 
                className="w-full pl-10 p-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={data.time}
                onChange={(e) => updateForm("time", e.target.value)}
              >
                <option value="">Pilih Slot Kosong</option>
                <option value="09:00">09:00 - 10:00 (Tersedia)</option>
                <option value="11:00">11:00 - 12:00 (Tersedia)</option>
                <option value="13:00">13:00 - 14:00 (Penuh)</option>
                <option value="15:00">15:00 - 16:00 (Tersedia)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step5Data({ data, updateForm }: { data: any, updateForm: any }) {
  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Data Klien</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        
        <div className="sm:col-span-2"><h3 className="font-bold border-b border-gray-100 pb-2">Informasi Anak</h3></div>
        
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1">Nama Lengkap Anak *</label>
          <input 
            type="text" 
            className="w-full p-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.childName}
            onChange={(e) => updateForm("childName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1">Tanggal Lahir *</label>
          <input 
            type="date" 
            className="w-full p-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.childDob}
            onChange={(e) => updateForm("childDob", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1">Jenis Kelamin *</label>
          <select 
            className="w-full p-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.childGender}
            onChange={(e) => updateForm("childGender", e.target.value)}
          >
            <option value="">Pilih</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1">Kondisi / Diagnosa (Opsional)</label>
          <input 
            type="text" 
            className="w-full p-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            placeholder="Contoh: Terlambat bicara"
            value={data.condition}
            onChange={(e) => updateForm("condition", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2 mt-4"><h3 className="font-bold border-b border-gray-100 pb-2">Informasi Orang Tua / Wali</h3></div>
        
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1">Nama Orang Tua *</label>
          <input 
            type="text" 
            className="w-full p-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.parentName}
            onChange={(e) => updateForm("parentName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1">Nomor WhatsApp *</label>
          <input 
            type="tel" 
            className="w-full p-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.whatsapp}
            onChange={(e) => updateForm("whatsapp", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1">Email Aktif *</label>
          <input 
            type="email" 
            className="w-full p-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.email}
            onChange={(e) => updateForm("email", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-primary mb-1">Alamat Lengkap {data.service === 'homevisit' && '*'}</label>
          <textarea 
            rows={2}
            className="w-full p-2.5 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            value={data.address}
            onChange={(e) => updateForm("address", e.target.value)}
          />
        </div>

      </div>
    </div>
  );
}

function Step6Payment({ data, updateForm }: { data: any, updateForm: any }) {
  const methods = [
    { name: "Transfer Bank BCA", type: "bank" },
    { name: "Transfer Bank Mandiri", type: "bank" },
    { name: "QRIS", type: "qris" },
    { name: "GoPay", type: "ewallet" },
    { name: "OVO", type: "ewallet" },
    { name: "DANA", type: "ewallet" }
  ];

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Konfirmasi & Pembayaran</h2>
      
      <div className="bg-background rounded-2xl p-6 mb-6 border border-primary/10">
        <h3 className="font-bold text-lg mb-4">Ringkasan Booking</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-secondary">Layanan:</span> <span className="font-medium capitalize">{data.service || "-"}</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Jenis Layanan:</span> <span className="font-medium">{data.therapyType || "-"}</span></div>
          {(data.service === 'onsite' || data.service === 'homevisit') && (
            <>
              <div className="flex justify-between"><span className="text-text-secondary">Paket:</span> <span className="font-medium">{data.package ? `${data.package} Sesi` : "-"}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Sesi:</span> <span className="font-medium capitalize">{data.dayType}</span></div>
            </>
          )}
          <div className="flex justify-between"><span className="text-text-secondary">Jadwal Mulai:</span> <span className="font-medium">{data.date ? `${data.date} jam ${data.time}` : "-"}</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Nama Klien:</span> <span className="font-medium">{data.childName || "-"}</span></div>
        </div>
        <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-center">
          <span className="font-bold">DP 50% Dibayarkan</span>
          <span className="font-bold text-primary text-xl">Rp ...</span>
        </div>
        <p className="text-xs text-text-secondary mt-2 text-right">Pelunasan dilakukan saat kedatangan</p>
      </div>

      <h3 className="font-bold text-lg mb-4">Metode Pembayaran Integrasi</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {methods.map((method) => (
          <button
            key={method.name}
            onClick={() => updateForm("paymentMethod", method.name)}
            className={`p-3 rounded-xl border-2 text-center text-sm transition-all flex flex-col items-center gap-1 ${
              data.paymentMethod === method.name 
                ? "border-primary bg-primary/5 text-primary font-bold" 
                : "border-primary/10 hover:border-primary/30"
            }`}
          >
            {method.type === 'qris' ? <QrCode size={20}/> : <CreditCard size={20}/>}
            {method.name}
          </button>
        ))}
      </div>
    </div>
  );
}

