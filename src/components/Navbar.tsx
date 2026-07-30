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
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex py-3 items-center justify-between">
          <Logo className="h-12 md:h-16 w-auto object-contain" />

          <nav className="hidden lg:flex items-center gap-7">
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

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" asChild className="rounded-full px-6 border-2">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="rounded-full px-6">
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
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-primary/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2 flex flex-col">
              {MENU.map((m) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  end={m.to === "/"}
                  onClick={close}
                  className={({ isActive }) =>
                    `text-base font-medium py-2 transition-colors ${
                      isActive ? "text-primary" : "text-text-secondary hover:text-primary"
                    }`
                  }
                >
                  {m.label}
                </NavLink>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <Button variant="outline" asChild className="w-full rounded-full border-2">
                  <Link to="/login" onClick={close}>Login</Link>
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
