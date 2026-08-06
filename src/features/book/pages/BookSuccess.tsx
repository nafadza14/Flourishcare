import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminWhatsAppLink } from "../Stepper";

export function BookSuccess() {
  const [params] = useSearchParams();
  const code = params.get("booking");
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-warm">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-2xl font-heading font-bold mb-2">Booking Berhasil!</h1>
        <p className="text-sm text-text-secondary mb-4">
          Pembayaran Anda telah diterima. Kami akan mengirim konfirmasi jadwal via WhatsApp.
        </p>
        {code && (
          <p className="font-mono text-primary text-sm bg-primary/10 rounded-full px-4 py-2 inline-block mb-4">
            {code}
          </p>
        )}
        <div className="flex flex-col gap-2 mt-4">
          <Button asChild className="rounded-full" size="lg">
            <Link to="/">Kembali ke Beranda</Link>
          </Button>
          <AdminWhatsAppLink className="justify-center" />
        </div>
      </div>
    </div>
  );
}
