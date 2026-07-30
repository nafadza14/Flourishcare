import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { fetchRecentBookings } from "@/features/dashboard/queries";
import type { Booking } from "@/types/database";
import { EmptyState, LoadingBlock } from "@/features/dashboard/common";

const STATUS_COLORS: Record<Booking["status"], string> = {
  pending_payment: "bg-yellow/10 text-yellow-700",
  awaiting_confirmation: "bg-secondary/10 text-secondary",
  confirmed: "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-red/10 text-red",
  no_show: "bg-gray-100 text-gray-600",
};

export function BookingsView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchRecentBookings(50);
        if (!cancelled) setBookings(data);
      } catch {
        if (!cancelled) setBookings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <LoadingBlock />;
  if (bookings.length === 0)
    return (
      <EmptyState
        title="Belum ada booking"
        description="Data booking akan muncul di sini setelah masuk dari halaman publik atau di-input manual oleh admin."
        icon={ClipboardList}
      />
    );

  return (
    <div className="bg-white rounded-2xl border border-primary/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-background text-text-secondary text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Kode</th>
              <th className="px-4 py-3 font-medium">Layanan</th>
              <th className="px-4 py-3 font-medium">Terapi</th>
              <th className="px-4 py-3 font-medium">Paket</th>
              <th className="px-4 py-3 font-medium">Dibuat</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-background/60">
                <td className="px-4 py-3 font-mono text-xs">{b.code}</td>
                <td className="px-4 py-3 capitalize">{b.service.replace("_", " ")}</td>
                <td className="px-4 py-3">{b.therapy_type ?? "-"}</td>
                <td className="px-4 py-3">{b.package_sessions ? `${b.package_sessions} sesi` : "-"}</td>
                <td className="px-4 py-3 text-text-secondary">
                  {new Date(b.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[b.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {b.status.replace("_", " ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
