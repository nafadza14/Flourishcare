import { Instagram } from "lucide-react";
import { Logo } from "./Logo";
import {
  BRAND_NAME,
  CLINIC_ADDRESS,
  CONTACT_EMAIL,
  SOCIAL,
} from "@/config/constants";

// Ikon Threads & TikTok tidak tersedia di lucide , pakai SVG inline.
function ThreadsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.19 2C6.7 2 3 5.53 3 12.05 3 18.47 6.7 22 12.19 22c5.28 0 8.42-3.03 8.42-6.63 0-2.29-1.16-4.19-3.14-5.14.15-.4.24-.83.24-1.29 0-1.87-1.5-3.4-3.4-3.6-.34-.03-.68-.05-1.02-.05-1.94 0-3.4.98-4.06 2.31l1.65.9c.43-.85 1.28-1.4 2.41-1.4.24 0 .49.02.73.05 1 .11 1.68.79 1.68 1.79 0 .29-.07.56-.19.8-1.02-.32-2.17-.5-3.4-.5-3.14 0-5.35 1.63-5.35 4.15 0 2.35 2 3.99 4.7 3.99 3.03 0 4.85-1.88 5.44-4.61 1.16.68 1.83 1.83 1.83 3.13 0 2.5-2.34 4.62-6.42 4.62-4.35 0-7.19-2.63-7.19-8.05C5 6.63 7.84 4 12.19 4c4.35 0 7.19 2.63 7.19 8.05 0 .3-.01.6-.03.89l1.99.13c.03-.34.05-.68.05-1.02C21.39 5.53 17.68 2 12.19 2Zm.72 12.55c-.4 1.72-1.4 2.79-2.99 2.79-1.36 0-2.42-.71-2.42-1.83 0-1.13 1.08-1.9 2.86-1.9.98 0 1.89.13 2.71.34-.05.2-.1.4-.16.6Z"/>
    </svg>
  );
}
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.4 1.2 1.1 2.3 2 3.1 1 .9 2.2 1.4 3.5 1.6v3.1c-1.4-.1-2.7-.5-3.9-1.1-.5-.3-1-.6-1.5-1v7.6c0 4-3.2 7.2-7.3 7.2S2 20.3 2 16.3s3.2-7.2 7.3-7.2c.4 0 .8 0 1.2.1v3.2c-.4-.1-.8-.2-1.2-.2-2.3 0-4.1 1.8-4.1 4.1s1.8 4.1 4.1 4.1 4.1-1.8 4.1-4.1V3h3.1Z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-primary/10 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div className="space-y-4">
            <Logo className="h-28 w-auto object-contain" />
            <p className="text-text-secondary text-sm leading-relaxed max-w-md">
              Tumbuh Bersama, Flourish Sepenuhnya. Menghadirkan terapi tumbuh kembang profesional untuk anak Anda.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram FlourishCare"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={SOCIAL.threads}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads FlourishCare"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <ThreadsIcon size={20} />
              </a>
              <a
                href={SOCIAL.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok FlourishCare"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Kontak</h3>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li>
                <p className="font-medium text-text-primary">Email</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hover:text-primary transition-colors break-all"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <p className="font-medium text-text-primary">Alamat</p>
                <p className="leading-relaxed">{CLINIC_ADDRESS}</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
