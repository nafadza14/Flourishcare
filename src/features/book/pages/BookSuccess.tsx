import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Phone, Receipt, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWizard } from "../wizardContext";

export function BookSuccess() {
  const [params] = useSearchParams();
  const code = params.get("booking");
  const { reset } = useWizard();

  // Reset wizard hanya SETELAH payment sukses. User yang klik Back dari Sumopod
  // (tidak jadi bayar) datanya tetap ada di localStorage.
  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-warm text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold mb-2">
          Terima kasih!
        </h1>
        <p className="text-text-secondary mb-4 leading-relaxed">
          Pembayaran Anda sudah kami terima. Terima kasih telah mempercayakan tumbuh
          kembang si kecil kepada FlourishCare.
        </p>

        {code && (
          <div className="mb-5">
            <p className="text-xs text-text-secondary mb-1">Kode Booking</p>
            <p className="font-mono text-primary text-sm bg-primary/10 rounded-full px-4 py-2 inline-block">
              {code}
            </p>
          </div>
        )}

        <div className="bg-background rounded-2xl border border-black/5 p-4 text-left mb-6 space-y-3">
          <div className="flex items-start gap-3">
            <Receipt size={18} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Invoice akan segera dikirim</p>
              <p className="text-xs text-text-secondary">
                Admin FlourishCare akan menghubungi Anda via WhatsApp untuk mengirim
                invoice resmi dan konfirmasi jadwal.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Estimasi konfirmasi</p>
              <p className="text-xs text-text-secondary">
                Dalam waktu 1x24 jam pada jam operasional (Sen-Sab, 09:00-17:00 WIB).
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button asChild className="rounded-full shadow-warm" size="lg">
            <a
              href="https://wa.me/6285887031855"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              <Phone size={16} className="mr-2" /> Chat WA Admin
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-2" size="lg">
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
