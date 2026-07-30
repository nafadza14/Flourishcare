import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Star,
  Users,
  Activity,
  Brain,
  MessageSquare,
  HeartHandshake,
  GraduationCap,
  Smile,
  Building2,
  Stethoscope,
  ArrowUpRight,
  CheckCircle2,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/lib/motion";
import { supabase } from "@/lib/supabase";
import { CLINIC_ADDRESS, CLINIC_MAPS_URL, SOCIAL } from "@/config/constants";

type GalleryImage = { id: string; url: string; alt: string };

const HERO_BADGES = [
  "Terapis Berlisensi & Berpengalaman",
  "Tim Bersertifikasi STR",
  "Klinik Terpercaya di Jakarta Timur",
];

const CHALLENGES = [
  { icon: MessageSquare, title: "Keterlambatan Bicara", desc: "Anak belum lancar bicara sesuai usia." },
  { icon: Activity, title: "ADHD", desc: "Kesulitan fokus dan mengontrol impuls." },
  { icon: Brain, title: "Autism Spectrum (ASD)", desc: "Tantangan dalam interaksi sosial dan komunikasi." },
  { icon: GraduationCap, title: "Kesulitan Belajar", desc: "Butuh pendekatan khusus untuk membaca, menulis, berhitung." },
  { icon: HeartHandshake, title: "Gangguan Motorik", desc: "Kesulitan koordinasi motorik halus atau kasar." },
  { icon: Smile, title: "Kecemasan & Emosi", desc: "Butuh dukungan mengelola emosi dan rasa cemas." },
];

const SERVICES = [
  {
    icon: Building2,
    title: "Terapi On-Site",
    desc: "4 jenis terapi (SI, TW, OT, BT) di Klinik Mitra Diani, dipandu terapis bersertifikat.",
    to: "/services#onsite",
  },
  {
    icon: Stethoscope,
    title: "Konsultasi Psikolog",
    desc: "Konsultasi tatap muka bersama psikolog anak berpengalaman.",
    to: "/services#psikolog",
  },
  {
    icon: Brain,
    title: "Psikotes & Assessment",
    desc: "Tes IQ, kesiapan sekolah, dan asesmen diagnostik lengkap.",
    to: "/services#psikotes",
  },
];

const HOW_STEPS = [
  { step: "01", title: "Konsultasi Awal", desc: "Datang ke Klinik Mitra Diani untuk sesi konsultasi bersama psikolog kami." },
  { step: "02", title: "Evaluasi Berkala", desc: "Kami memantau perkembangan anak dan menyesuaikan rencana terapi secara berkala." },
];

// Fallback galeri kalau tabel gallery di Supabase kosong.
const FALLBACK_GALLERY: GalleryImage[] = [];

export function Homepage() {
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("gallery")
        .select("id,url,alt")
        .order("display_order", { ascending: true })
        .limit(5);
      if (cancelled) return;
      if (!error && data && data.length > 0) {
        setGallery(data as GalleryImage[]);
      } else {
        setGallery(FALLBACK_GALLERY);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-background">
      {/* Hero */}
      <section className="pt-8 pb-16 lg:pt-16 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-text-primary leading-[1.1] tracking-tight mb-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Setiap Anak Berhak <span className="text-primary">Tumbuh Sepenuhnya</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-text-secondary mb-6 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          FlourishCare menemani anak Anda tumbuh dengan pendekatan terapi profesional yang hangat dan berbasis bukti.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {HERO_BADGES.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm sm:text-base font-medium text-text-primary">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                <CheckCircle2 size={14} />
              </div>
              {item}
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill="currentColor" />
            ))}
          </div>
          <span className="text-sm text-text-secondary">Kepercayaan keluarga di Jakarta Timur</span>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/booking">Kunjungi Klinik</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-2">
            <Link to="/progress">Cek Progress Anak</Link>
          </Button>
        </motion.div>
      </section>

      {/* Nilai singkat */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Users, value: "Ratusan", label: "Keluarga Dipercaya" },
            { icon: Activity, value: "4", label: "Jenis Terapi Komprehensif" },
            { icon: HeartHandshake, value: "STR", label: "Terapis Bersertifikat" },
            { icon: Stethoscope, value: "1 Klinik", label: "di Jakarta Timur" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 md:p-6 border border-primary/10 shadow-sm text-center">
              <div className="w-11 h-11 mx-auto mb-3 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <s.icon size={22} />
              </div>
              <p className="text-2xl md:text-3xl font-heading font-extrabold text-text-primary">{s.value}</p>
              <p className="text-xs md:text-sm text-text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tantangan Anak */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Tantangan Tumbuh Kembang</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Kami memahami perjalanan Anda</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {CHALLENGES.map((c) => (
              <motion.div
                key={c.title}
                variants={fadeUp}
                className="bg-background rounded-2xl p-6 border border-primary/10"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <c.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{c.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Layanan */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Layanan Kami</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">3 Pilar untuk mendampingi si kecil</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {SERVICES.map((s) => (
              <motion.div key={s.title} variants={fadeUp} className="bg-white rounded-2xl p-6 border border-primary/10 shadow-sm flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <s.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed flex-grow">{s.desc}</p>
                <Link
                  to={s.to}
                  className="mt-4 inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
                >
                  Selengkapnya <ArrowUpRight size={16} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Alur Layanan (ringkas) */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Alur Layanan</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Sederhana & terarah</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOW_STEPS.map((h) => (
              <div key={h.step} className="bg-background rounded-2xl p-6 border border-primary/10">
                <p className="text-4xl font-heading font-extrabold text-primary/40 mb-3">{h.step}</p>
                <h3 className="font-heading font-bold text-lg mb-2">{h.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alamat Klinik */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-primary/10 shadow-sm text-center">
          <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Kunjungi Kami</p>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{CLINIC_ADDRESS.split(",")[0]}</h2>
          <p className="text-text-secondary max-w-2xl mx-auto mb-6">{CLINIC_ADDRESS}</p>
          <Button asChild size="lg" className="rounded-full px-8">
            <a href={CLINIC_MAPS_URL} target="_blank" rel="noopener noreferrer">
              Petunjuk Arah
            </a>
          </Button>
        </div>
      </section>

      {/* Galeri Instagram (opsional — dari tabel gallery Supabase) */}
      {gallery.length > 0 && (
        <section className="pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-primary font-semibold text-sm mb-1 tracking-wider uppercase">Momen di Klinik</p>
                <h2 className="text-2xl md:text-3xl font-heading font-bold">Ikuti keseharian kami</h2>
              </div>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
              >
                <Instagram size={18} /> @flourishcare.id
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {gallery.map((g) => (
                <div key={g.id} className="aspect-square rounded-xl overflow-hidden bg-primary/5">
                  <img src={g.url} alt={g.alt} loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
