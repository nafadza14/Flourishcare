import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Brain,
  Stethoscope,
  Sparkles,
  Puzzle,
  HandHeart,
  MessageSquare,
  Wand2,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/lib/motion";
import { CLINIC_ADDRESS, CLINIC_MAPS_URL } from "@/config/constants";

const PILLARS = [
  {
    id: "onsite",
    icon: Building2,
    title: "Terapi On-Site",
    desc: "Sesi terapi anak dilakukan di Klinik Mitra Diani bersama terapis kami yang berpengalaman.",
  },
  {
    id: "psikolog",
    icon: Stethoscope,
    title: "Konsultasi Psikolog",
    desc: "Konsultasi tatap muka bersama psikolog anak untuk asesmen awal, arahan terapi, dan konseling keluarga.",
  },
  {
    id: "psikotes",
    icon: Brain,
    title: "Psikotes & Assessment",
    desc: "Tes IQ, kesiapan sekolah, evaluasi perkembangan, dan diagnosa profesional oleh psikolog berlisensi.",
  },
];

const THERAPIES = [
  { code: "TW", icon: MessageSquare, title: "Terapi Wicara", desc: "Untuk anak dengan keterlambatan bicara atau gangguan artikulasi." },
  { code: "SI", icon: Puzzle, title: "Sensori Integrasi", desc: "Membantu anak mengolah stimulasi sensorik dan merespons dengan tepat." },
  { code: "OT", icon: HandHeart, title: "Okupasi Terapi", desc: "Melatih kemandirian aktivitas sehari-hari dan keterampilan motorik." },
  { code: "BT", icon: Wand2, title: "Behavioral Therapy", desc: "Pendekatan berbasis bukti untuk membentuk perilaku positif." },
];

export function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-14 pb-12 md:pt-20 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="blob blob-buttercup w-[360px] h-[360px] -top-16 right-0" />
        <div className="blob blob-mist w-[300px] h-[300px] top-24 -left-16" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Layanan Kami</p>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
            Pendampingan Tumbuh Kembang{" "}
            <span className="font-accent text-primary text-6xl md:text-7xl">yang komprehensif</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Seluruh layanan kami dilakukan on-site di Klinik Mitra Diani, Jakarta Timur.
          </p>
        </div>
      </section>

      {/* 3 Pilar */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {PILLARS.map((p) => (
            <motion.div
              key={p.id}
              id={p.id}
              variants={fadeUp}
              className="bg-white rounded-3xl p-6 md:p-8 border border-primary/10 shadow-warm-sm flex flex-col scroll-mt-24 hover:shadow-warm transition-shadow"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <p.icon size={22} />
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">{p.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed flex-grow">{p.desc}</p>
              <Link
                to="/booking"
                className="mt-5 inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
              >
                Info Kunjungan <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 4 Jenis Terapi */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="blob blob-peach w-[300px] h-[300px] top-1/2 -right-10" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Jenis Terapi</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">4 Terapi Komprehensif</h2>
            <p className="text-text-secondary mt-3 max-w-2xl mx-auto">
              Terapi anak yang kami sediakan disesuaikan dengan kebutuhan individu setiap anak.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {THERAPIES.map((t) => (
              <motion.div
                key={t.code}
                variants={fadeUp}
                className="bg-white rounded-3xl p-6 border border-primary/10 shadow-warm-sm flex flex-col"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <t.icon size={20} />
                  </div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{t.code}</span>
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{t.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 border border-primary/10 shadow-warm-lg text-center">
          <Sparkles className="mx-auto mb-3 text-primary" size={32} />
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
            Siap memulai perjalanan{" "}
            <span className="font-accent text-primary text-5xl md:text-6xl">tumbuh kembang</span>?
          </h2>
          <p className="text-text-secondary mb-6 max-w-xl mx-auto">Kunjungi klinik kami untuk konsultasi awal & asesmen.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-6">
            <MapPin size={16} className="text-primary" />
            <span>{CLINIC_ADDRESS}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-8 shadow-warm">
              <Link to="/booking">Info Kunjungan</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-2">
              <a href={CLINIC_MAPS_URL} target="_blank" rel="noopener noreferrer">Petunjuk Arah</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
