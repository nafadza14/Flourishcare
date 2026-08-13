import { CheckCircle2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssessmentSuccess() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-black/5 shadow-warm text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold mb-3">Terima kasih!</h1>
        <p className="text-text-secondary leading-relaxed mb-6">
          Form pendaftaran telah kami terima. Tim FlourishCare akan segera meninjau data Anda dan mengirimkan <span className="font-semibold text-text-primary">Nomor Rekam Medis (RM)</span> via email/WhatsApp dalam 1–2 hari kerja.
        </p>

        <div className="bg-background rounded-2xl p-4 border border-black/5 text-left mb-6">
          <p className="font-semibold text-sm mb-2">Langkah selanjutnya:</p>
          <ol className="text-sm text-text-secondary space-y-1.5 list-decimal pl-4">
            <li>Tim admin klinik meninjau data pendaftaran</li>
            <li>Anda menerima Nomor RM via email/WhatsApp</li>
            <li>Simpan Nomor RM untuk akses laporan progres online</li>
            <li>Jadwalkan sesi awal via booking atau kontak admin</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="rounded-full border-2">
            <a href="mailto:Flourishcare.id@gmail.com">
              <Mail size={16} className="mr-2" /> Email Admin
            </a>
          </Button>
          <Button asChild className="rounded-full shadow-warm">
            <a href="https://wa.me/6285887031855" target="_blank" rel="noopener noreferrer">
              <Phone size={16} className="mr-2" /> Chat WA Admin
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
