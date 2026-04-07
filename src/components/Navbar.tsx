import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = ["Layanan", "Tim Kami", "Harga", "Tentang", "Blog", "Kontak"];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                F
              </div>
              <span className="font-heading font-bold text-2xl text-text-primary">
                Flourish<span className="text-primary">Care</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-text-secondary hover:text-primary font-medium transition-colors">Beranda</Link>
            <Link to="/services" className="text-text-secondary hover:text-primary font-medium transition-colors">Layanan</Link>
            <Link to="/team" className="text-text-secondary hover:text-primary font-medium transition-colors">Tim Kami</Link>
            <Link to="/pricing" className="text-text-secondary hover:text-primary font-medium transition-colors">Harga</Link>
            <Link to="/about" className="text-text-secondary hover:text-primary font-medium transition-colors">Tentang</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button asChild className="rounded-full px-8">
              <Link to="/booking">Booking</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-text-secondary hover:text-primary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-primary/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              <Link to="/" className="text-text-secondary hover:text-primary font-medium py-2 transition-colors" onClick={() => setIsOpen(false)}>Beranda</Link>
              <Link to="/services" className="text-text-secondary hover:text-primary font-medium py-2 transition-colors" onClick={() => setIsOpen(false)}>Layanan</Link>
              <Link to="/team" className="text-text-secondary hover:text-primary font-medium py-2 transition-colors" onClick={() => setIsOpen(false)}>Tim Kami</Link>
              <Link to="/pricing" className="text-text-secondary hover:text-primary font-medium py-2 transition-colors" onClick={() => setIsOpen(false)}>Harga</Link>
              <Link to="/about" className="text-text-secondary hover:text-primary font-medium py-2 transition-colors" onClick={() => setIsOpen(false)}>Tentang</Link>
              <div className="pt-4">
                <Button asChild className="w-full rounded-full">
                  <Link to="/booking" onClick={() => setIsOpen(false)}>Booking</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
