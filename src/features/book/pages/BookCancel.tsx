import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminWhatsAppLink } from "../Stepper";

export function BookCancel() {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-warm">
        <div className="w-16 h-16 mx-auto rounded-full bg-red/10 text-red flex items-center justify-center mb-4">
          <XCircle size={32} />
        </div>
        <h1 className="text-2xl font-heading font-bold mb-2">Pembayaran Dibatalkan</h1>
        <p className="text-sm text-text-secondary mb-6">
          Anda dapat mengulang proses booking kapan saja. Booking Anda tetap tersimpan sebagai pending payment.
        </p>
        <div className="flex flex-col gap-2">
          <Button asChild className="rounded-full" size="lg">
            <Link to="/">Coba Lagi</Link>
          </Button>
          <AdminWhatsAppLink className="justify-center" />
        </div>
      </div>
    </div>
  );
}
