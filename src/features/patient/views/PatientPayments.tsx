import { useEffect, useState } from "react";
import { Wallet, ExternalLink } from "lucide-react";
import { fetchPatientPayments, formatRupiah, type PatientPayment } from "@/features/patient/queries";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  pending: { text: "Menunggu", cls: "bg-yellow/10 text-yellow-700" },
  paid: { text: "Lunas", cls: "bg-green-100 text-green-700" },
  failed: { text: "Gagal", cls: "bg-red/10 text-red" },
  expired: { text: "Kadaluarsa", cls: "bg-gray-100 text-gray-600" },
  refunded: { text: "Direfund", cls: "bg-secondary/10 text-secondary" },
};

export function PatientPayments() {
  const [rows, setRows] = useState<PatientPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchPatientPayments();
        if (!cancelled) setRows(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingBlock />;
  if (rows.length === 0)
    return <EmptyState title="Belum ada transaksi" description="Riwayat pembayaran Anda akan tampil di sini." icon={Wallet} />;

  const totalPaid = rows.filter((r) => r.status === "paid").reduce((s, r) => s + Number(r.amount), 0);
  const pendingCount = rows.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-black/5">
          <p className="text-xs text-text-secondary">Total Dibayar</p>
          <p className="text-2xl font-heading font-extrabold text-primary mt-1">{formatRupiah(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-black/5">
          <p className="text-xs text-text-secondary">Menunggu Bayar</p>
          <p className="text-2xl font-heading font-extrabold text-secondary mt-1">{pendingCount}</p>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((r) => {
          const st = STATUS_LABEL[r.status] ?? { text: r.status, cls: "bg-gray-100 text-gray-600" };
          return (
            <div key={r.id} className="bg-white rounded-3xl border border-black/5 p-5 shadow-warm-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${st.cls}`}>{st.text}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {r.payment_method}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {new Date(r.paid_at ?? r.created_at).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <p className="font-heading font-bold text-lg whitespace-nowrap">{formatRupiah(Number(r.amount))}</p>
              </div>

              {r.status === "pending" && r.payment_url && (
                <a
                  href={r.payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all mt-1"
                >
                  Bayar Sekarang <ExternalLink size={14} />
                </a>
              )}
              {r.fee && r.fee > 0 && (
                <p className="text-xs text-text-secondary mt-1">Biaya admin: {formatRupiah(Number(r.fee))}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
