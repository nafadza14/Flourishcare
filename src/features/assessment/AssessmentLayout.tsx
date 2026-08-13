import { Outlet, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { GrainOverlay } from "@/components/GrainOverlay";

export function AssessmentLayout() {
  return (
    <div className="min-h-screen bg-background relative">
      <GrainOverlay />

      <header className="relative z-10 bg-white/70 backdrop-blur border-b border-black/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            {/* Logo Mitra Diani (kiri) + Logo FlourishCare (kanan) */}
            <img
              src="/mitra-diani-logo.png"
              alt="Klinik Mitra Diani"
              className="h-14 w-auto object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <Logo className="h-14 w-auto" />
          </Link>
          <div className="hidden sm:block text-right text-xs text-text-secondary">
            <p><span className="font-semibold">Klinik Mitra Diani</span> × <span className="font-semibold">FlourishCare</span></p>
            <p>Jl. PKP Raya No.1, Ciracas, Jakarta Timur</p>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 py-8 md:py-12">
        <Outlet />
      </main>

      <footer className="relative z-10 py-6 px-4 text-center text-xs text-text-secondary">
        FlourishCare © {new Date().getFullYear()} · Assessment intake portal
      </footer>
    </div>
  );
}
