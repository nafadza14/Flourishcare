import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatRupiah } from "@/features/dashboard/queries";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";

type PaymentRow = {
  id: string;
  amount: number;
  method: string | null;
  status: string;
  paid_at: string | null;
  created_at: string;
  booking_id: string;
};

export function FinanceView() {
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("payments")
        .select("id,amount,method,status,paid_at,created_at,booking_id")
        .order("created_at", { ascending: false })
        .limit(100);
      if (!cancelled) {
        setRows((data as PaymentRow[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPaid = rows.filter((r) => r.status === "paid").reduce((s, r) => s + Number(r.amount), 0);
  const totalPending = rows.filter((r) => r.status === "pending").reduce((s, r) => s + Number(r.amount), 0);

  if (loading) return <LoadingBlock />;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-primary/10">
          <p className="text-xs text-text-secondary">Terkumpul</p>
          <p className="text-2xl font-heading font-extrabold text-primary mt-1">{formatRupiah(totalPaid)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-primary/10">
          <p className="text-xs text-text-secondary">Piutang / Menunggu</p>
          <p className="text-2xl font-heading font-extrabold text-secondary mt-1">{formatRupiah(totalPending)}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="Belum ada transaksi" description="Data pembayaran akan muncul di sini setelah booking diproses." icon={Wallet} />
      ) : (
        <div className="bg-white rounded-2xl border border-primary/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background text-text-secondary text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Booking</th>
                  <th className="px-4 py-3 font-medium">Metode</th>
                  <th className="px-4 py-3 font-medium">Nominal</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-background/60">
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(r.paid_at ?? r.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{r.booking_id.slice(0, 8)}</td>
                    <td className="px-4 py-3">{r.method ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold">{formatRupiah(Number(r.amount))}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          r.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow/10 text-yellow-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
