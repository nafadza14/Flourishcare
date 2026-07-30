import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-primary font-semibold">404</p>
      <h1 className="mt-2 text-3xl md:text-4xl font-heading font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-text-secondary max-w-md">
        Alamat yang Anda tuju sudah tidak tersedia atau dipindahkan. Kembali ke beranda dan mulai dari sana.
      </p>
      <Button asChild className="mt-8 rounded-full px-8">
        <Link to="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
