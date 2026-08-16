import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

/**
 * ProtectedRoute dengan grace period:
 * kalau session tiba-tiba jadi null tapi sebelumnya ada, tunggu 2 detik dulu
 * (kemungkinan cuma token refresh race). Baru redirect kalau memang benar hilang.
 * Ini mencegah "auto logout" tiba-tiba saat token diperbarui background.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, session } = useAuth();
  const location = useLocation();
  const hadSessionRef = useRef(false);
  const [confirmedNoSession, setConfirmedNoSession] = useState(false);

  useEffect(() => {
    if (session) {
      hadSessionRef.current = true;
      setConfirmedNoSession(false);
      return;
    }
    if (loading) return;
    if (!hadSessionRef.current) {
      // Belum pernah login sama sekali → langsung tandai
      setConfirmedNoSession(true);
      return;
    }
    // Punya session sebelumnya tapi sekarang null → tunggu 2 detik untuk grace period
    const t = setTimeout(() => setConfirmedNoSession(true), 2000);
    return () => clearTimeout(t);
  }, [session, loading]);

  if (loading || (!session && hadSessionRef.current && !confirmedNoSession)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-text-secondary text-sm">Memuat sesi…</div>
      </div>
    );
  }

  if (!session && confirmedNoSession) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <>{children}</>;
}
