import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-primary/10 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                F
              </div>
              <span className="font-heading font-bold text-xl text-text-primary">
                Flourish<span className="text-primary">Care</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed">
              Tumbuh Bersama, Flourish Sepenuhnya. Menghadirkan terapi tumbuh kembang profesional untuk anak Anda.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-text-secondary hover:text-primary transition-colors text-sm">Beranda</Link>
              </li>
              <li>
                <Link to="/services" className="text-text-secondary hover:text-primary transition-colors text-sm">Layanan</Link>
              </li>
              <li>
                <Link to="/team" className="text-text-secondary hover:text-primary transition-colors text-sm">Tim Kami</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-text-secondary hover:text-primary transition-colors text-sm">Harga</Link>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary hover:text-primary transition-colors text-sm">Tentang</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Layanan</h3>
            <ul className="space-y-3">
              {["Terapi On-Site", "Home Visit", "Konsultasi Psikolog", "Evaluasi Berkala", "Laporan Digital"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-text-secondary hover:text-primary transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Kontak</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>
                <p className="font-medium text-text-primary">Alamat</p>
                <p>Jl. Tumbuh Kembang No. 123, Jakarta Selatan</p>
              </li>
              <li>
                <p className="font-medium text-text-primary">Email</p>
                <p>halo@flourishcare.id</p>
              </li>
              <li>
                <p className="font-medium text-text-primary">WhatsApp</p>
                <p>+62 812 3456 7890</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} FlourishCare.id. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="#" className="text-text-secondary hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-text-secondary hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
