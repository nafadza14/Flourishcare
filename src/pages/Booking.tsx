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
  ChevronLeft
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
    therapist: "",
    date: "",
    time: "",
    childName: "",
    childDob: "",
    parentName: "",
    whatsapp: "",
    paymentMethod: ""
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const updateForm = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            Booking Sesi Terapi
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

              return (
                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                      isActive ? "bg-primary text-white shadow-lg shadow-primary/30" :
                      isCompleted ? "bg-primary text-white" :
                      "bg-white text-text-secondary border-2 border-primary/10"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={20} /> : stepNum}
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
                  onSelect={(val) => updateForm("service", val)} 
                />
              )}
              {currentStep === 2 && (
                <Step2Therapy 
                  selected={formData.therapyType} 
                  onSelect={(val) => updateForm("therapyType", val)} 
                />
              )}
              {currentStep === 3 && (
                <Step3Package 
                  selected={formData.package} 
                  onSelect={(val) => updateForm("package", val)} 
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
              <Button onClick={nextStep} className="rounded-xl px-8">
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
    { id: "onsite", title: "Terapi On Site", icon: Building2, desc: "Sesi terapi di rumah tumbuh kembang FlourishCare" },
    { id: "homevisit", title: "Home Visit", icon: Home, desc: "Terapis datang ke rumah Anda" },
    { id: "consult", title: "Konsultasi Psikolog", icon: Stethoscope, desc: "Sesi konsultasi dengan psikolog anak" }
  ];

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Pilih Layanan</h2>
      <div className="grid md:grid-cols-3 gap-4">
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

function Step2Therapy({ selected, onSelect }: { selected: string, onSelect: (val: string) => void }) {
  const options = [
    { id: "wicara", title: "Terapi Wicara", price: "Rp 250.000 / sesi" },
    { id: "okupasi", title: "Terapi Okupasi", price: "Rp 250.000 / sesi" },
    { id: "perilaku", title: "Terapi Perilaku", price: "Rp 300.000 / sesi" },
    { id: "sensori", title: "Sensori Integrasi", price: "Rp 275.000 / sesi" }
  ];

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Pilih Jenis Terapi</h2>
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
              <p className="text-sm text-text-secondary">{opt.price}</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selected === opt.id ? "border-primary bg-primary" : "border-gray-300"
            }`}>
              {selected === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3Package({ selected, onSelect }: { selected: string, onSelect: (val: string) => void }) {
  const options = [
    { id: "4", title: "4 Sesi", desc: "Cocok untuk evaluasi awal", popular: false },
    { id: "8", title: "8 Sesi", desc: "Rekomendasi untuk hasil optimal", popular: true },
    { id: "12", title: "12 Sesi", desc: "Program intensif", popular: false },
    { id: "16", title: "16 Sesi", desc: "Program jangka panjang", popular: false }
  ];

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Pilih Paket</h2>
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
            {opt.popular && (
              <span className="absolute -top-3 right-4 bg-yellow text-text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Paling Populer
              </span>
            )}
            <h3 className="font-bold text-xl mb-1">{opt.title}</h3>
            <p className="text-sm text-text-secondary">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step4Schedule({ data, updateForm }: { data: any, updateForm: any }) {
  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Pilih Jadwal & Terapis</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-text-primary mb-2">Terapis Pilihan (Opsional)</label>
          <select 
            className="w-full p-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.therapist}
            onChange={(e) => updateForm("therapist", e.target.value)}
          >
            <option value="">Pilih Terapis (Bebas)</option>
            <option value="t1">Siti Aminah, S.Psi</option>
            <option value="t2">Budi Santoso, Amd.OT</option>
            <option value="t3">Rina Wati, Amd.TW</option>
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
          </div>
          <div>
            <label className="block text-sm font-bold text-text-primary mb-2">Waktu Preferensi</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
              <select 
                className="w-full pl-10 p-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={data.time}
                onChange={(e) => updateForm("time", e.target.value)}
              >
                <option value="">Pilih Waktu</option>
                <option value="morning">Pagi (08:00 - 12:00)</option>
                <option value="afternoon">Siang (13:00 - 17:00)</option>
                <option value="evening">Sore (17:00 - 20:00)</option>
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
      <h2 className="text-2xl font-heading font-bold mb-6">Data Diri</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-text-primary mb-2">Nama Anak</label>
          <input 
            type="text" 
            placeholder="Masukkan nama lengkap anak"
            className="w-full p-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.childName}
            onChange={(e) => updateForm("childName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-text-primary mb-2">Tanggal Lahir Anak</label>
          <input 
            type="date" 
            className="w-full p-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.childDob}
            onChange={(e) => updateForm("childDob", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-text-primary mb-2">Nama Orang Tua</label>
          <input 
            type="text" 
            placeholder="Nama orang tua / wali"
            className="w-full p-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.parentName}
            onChange={(e) => updateForm("parentName", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-text-primary mb-2">Nomor WhatsApp</label>
          <input 
            type="tel" 
            placeholder="0812xxxx"
            className="w-full p-3 rounded-xl border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={data.whatsapp}
            onChange={(e) => updateForm("whatsapp", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function Step6Payment({ data, updateForm }: { data: any, updateForm: any }) {
  const methods = ["Bank Transfer", "QRIS", "GoPay", "OVO"];

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold mb-6">Konfirmasi & Pembayaran</h2>
      
      <div className="bg-background rounded-2xl p-6 mb-6 border border-primary/10">
        <h3 className="font-bold text-lg mb-4">Ringkasan Booking</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-text-secondary">Layanan:</span> <span className="font-medium">{data.service || "-"}</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Terapi:</span> <span className="font-medium">{data.therapyType || "-"}</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Paket:</span> <span className="font-medium">{data.package ? `${data.package} Sesi` : "-"}</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Nama Anak:</span> <span className="font-medium">{data.childName || "-"}</span></div>
        </div>
        <div className="mt-4 pt-4 border-t border-primary/10 flex justify-between items-center">
          <span className="font-bold">Total Estimasi</span>
          <span className="font-bold text-primary text-xl">Rp 2.000.000</span>
        </div>
        <p className="text-xs text-text-secondary mt-2 text-right">*Pembayaran DP 50% diperlukan untuk konfirmasi jadwal</p>
      </div>

      <h3 className="font-bold text-lg mb-4">Metode Pembayaran</h3>
      <div className="grid grid-cols-2 gap-3">
        {methods.map((method) => (
          <button
            key={method}
            onClick={() => updateForm("paymentMethod", method)}
            className={`p-3 rounded-xl border-2 text-center transition-all ${
              data.paymentMethod === method 
                ? "border-primary bg-primary/5 text-primary font-bold" 
                : "border-primary/10 hover:border-primary/30"
            }`}
          >
            {method}
          </button>
        ))}
      </div>
    </div>
  );
}
