import { Link } from "react-router-dom";
import { ClipboardList, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssessmentIntro() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-black/5 shadow-warm">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
          <ClipboardList size={24} />
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold mb-3">
          Form Pendaftaran <span className="italic text-primary">(Confidential)</span>
        </h1>
        <p className="text-text-secondary leading-relaxed mb-6">
          Terima kasih telah mempercayakan tumbuh kembang si kecil kepada FlourishCare. Silakan lengkapi formulir pendaftaran berikut. Data yang Anda isikan akan dijaga kerahasiaannya dan hanya digunakan untuk keperluan asesmen dan intervensi anak Anda.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <InfoCard icon={ClipboardList} title="3 Bagian" desc="Identitas Pasien, Orang Tua/Wali, Saudara" />
          <InfoCard icon={Clock} title="~10 Menit" desc="Estimasi waktu pengisian" />
          <InfoCard icon={ShieldCheck} title="Confidential" desc="Data disimpan aman & terenkripsi" />
        </div>

        <div className="bg-background rounded-2xl p-4 border border-black/5 mb-6 text-sm text-text-secondary">
          <p className="font-semibold text-text-primary mb-1">📌 Setelah submit</p>
          <p>Tim kami akan meninjau data Anda dan mengirimkan Nomor Rekam Medis (RM) via email/WhatsApp. Simpan nomor RM tersebut untuk mengakses laporan progres anak di masa mendatang.</p>
        </div>

        <Button asChild size="lg" className="w-full sm:w-auto rounded-full shadow-warm">
          <Link to="/form">Mulai Isi Form <ArrowRight size={18} className="ml-2" /></Link>
        </Button>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, desc }: { icon: typeof ClipboardList; title: string; desc: string }) {
  return (
    <div className="bg-background rounded-2xl p-4 border border-black/5">
      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
        <Icon size={16} />
      </div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-text-secondary mt-0.5">{desc}</p>
    </div>
  );
}
