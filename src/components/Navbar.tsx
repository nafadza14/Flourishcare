import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";

type MenuItem = { label: string; to: string };
const MENU: MenuItem[] = [
  { label: "Beranda", to: "/" },
  { label: "Layanan", to: "/services" },
  { label: "Tim Kami", to: "/team" },
  { label: "Tentang", to: "/about" },
  { label: "Info Kunjungan", to: "/booking" },
  { label: "Progress", to: "/progress" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-3 z-50 w-full px-4 mt-3">
      <div className="max-w-6xl mx-auto rounded-full bg-white/70 backdrop-blur-xl border border-primary/10 shadow-warm-sm">
        <div className="flex px-4 md:px-5 py-2 items-center justify-between gap-4">
          <Logo className="h-16 md:h-20 w-auto object-contain" />

          <nav className="hidden lg:flex items-center gap-6">
            {MENU.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                end={m.to === "/"}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-primary" : "text-text-secondary hover:text-primary"
                  }`
                }
              >
                {m.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" asChild className="rounded-full px-5 text-text-secondary hover:text-primary">
              <Link to="/login">Masuk</Link>
            </Button>
            <Button asChild className="rounded-full px-5 shadow-warm">
              <Link to="/booking">Kunjungi Klinik</Link>
            </Button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              className="p-2 text-text-secondary hover:text-primary transition-colors"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden max-w-6xl mx-auto mt-2 rounded-3xl bg-white/95 backdrop-blur-xl border border-primary/10 shadow-warm overflow-hidden"
          >
            <div className="px-4 py-5 space-y-1 flex flex-col">
              {MENU.map((m) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  end={m.to === "/"}
                  onClick={close}
                  className={({ isActive }) =>
                    `text-base font-medium py-2.5 px-3 rounded-xl transition-colors ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-text-secondary hover:text-primary hover:bg-primary/5"
                    }`
                  }
                >
                  {m.label}
                </NavLink>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-primary/10 mt-2">
                <Button variant="outline" asChild className="w-full rounded-full border-2">
                  <Link to="/login" onClick={close}>Masuk</Link>
                </Button>
                <Button asChild className="w-full rounded-full">
                  <Link to="/booking" onClick={close}>Kunjungi Klinik</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
