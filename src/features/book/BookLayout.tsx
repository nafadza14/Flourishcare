import { Outlet, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { GrainOverlay } from "@/components/GrainOverlay";
import { BRAND_TAGLINE } from "@/config/constants";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";

export function BookLayout() {
  const { session, signOut } = useAuth();
  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <GrainOverlay />

      {/* Header sederhana: logo + tagline */}
      <header className="relative z-10 pt-8 pb-6 px-4 text-center">
        <Link to="/" className="inline-block">
          <Logo className="h-20 md:h-24 w-auto mx-auto" />
        </Link>
        <p className="mt-3 text-text-secondary text-sm italic">
          {BRAND_TAGLINE.split(",")[0]}, menuju versi terbaik 🌱
        </p>
      </header>

      {/* Optional session bar */}
      {session && (
        <div className="relative z-10 max-w-3xl mx-auto w-full px-4 pb-2 flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => void signOut()} className="rounded-full text-xs text-text-secondary">
            Keluar ({session.user.email})
          </Button>
        </div>
      )}

      <main className="relative z-10 flex-grow px-4 pb-16">
        <Outlet />
      </main>

      <footer className="relative z-10 py-6 px-4 text-center text-xs text-text-secondary">
        FlourishCare © {new Date().getFullYear()} &nbsp;·&nbsp;
        <a href="/privacy" className="hover:text-primary">Privacy Policy</a>
        <span className="mx-2">·</span>
        <a href="/terms" className="hover:text-primary">Terms</a>
      </footer>
    </div>
  );
}
