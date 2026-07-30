import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Brain,
  Stethoscope,
  Video,
  Sparkles,
  Puzzle,
  HandHeart,
  MessageSquare,
  Wand2,
  ArrowUpRight,
  MapPin,
  Clock,
  Users,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "@/lib/motion";
import { BOOKING_ONLINE_STATUS, CLINIC_ADDRESS, CLINIC_MAPS_URL } from "@/config/constants";

const PILLARS = [
  {
    id: "onsite",
    icon: Building2,
    title: "Terapi On-Site",
    tagline: "Sesi terapi anak di klinik kami",
    desc: "Rangkaian terapi anak (Sensori Integrasi, Terapi Wicara, Okupasi Terapi, dan Behavioral Therapy) dilakukan di Klinik Mitra Diani. Ruangan didesain ramah anak dengan peralatan lengkap untuk mendukung berbagai jenis intervensi.",
    features: [
      "4 jenis terapi tersedia: SI, TW, OT, BT",
      "Durasi standar 60 menit per sesi",
      "Terapis bersertifikasi STR",
      "Evaluasi progres berkala",
    ],
  },
  {
    id: "psikolog",
    icon: Stethoscope,
    title: "Konsultasi Psikolog",
    tagline: "Konsultasi tatap muka bersama psikolog anak",
    desc: "Konsultasi bersama psikolog anak berpengalaman untuk asesmen awal, arahan program terapi, konseling parenting, atau evaluasi berkala. Kami menciptakan ruang aman untuk orang tua bercerita dan mencari solusi.",
    features: [
      "Asesmen awal & rekomendasi terapi",
      "Konseling parenting & keluarga",
      "Evaluasi berkala perkembangan anak",
      "Konsultasi kesiapan sekolah",
    ],
  },
  {
    id: "psikolog-online",
    icon: Video,
    title: "Konsultasi Psikolog Online",
    tagline: BOOKING_ONLINE_STATUS === "live" ? "Sesi jarak jauh yang fleksibel" : "Segera hadir",
    desc: "Sesi konsultasi psikolog secara online yang fleksibel dan mudah diakses — cocok untuk orang tua yang membutuhkan arahan cepat, konsultasi lanjutan, atau berdomisili di luar Jakarta. Dilakukan melalui platform booking terpisah.",
    features: [
      "Fleksibel dari mana saja",
      "Sesi terjadwal via video call",
      "Cocok untuk konsultasi lanjutan",
      "Cocok untuk luar Jabodetabek",
    ],
    comingSoon: BOOKING_ONLINE_STATUS !== "live",
  },
  {
    id: "psikotes",
    icon: Brain,
    title: "Psikotes & Assessment",
    tagline: "Asesmen menyeluruh oleh psikolog berlisensi",
    desc: "Layanan tes dan asesmen psikologis yang komprehensif untuk memahami kemampuan, potensi, dan kebutuhan khusus anak. Hasil disertai laporan tertulis dan sesi feedback bersama orang tua.",
    features: [
      "Tes IQ (WISC / Stanford-Binet)",
      "Tes Kesiapan Sekolah",
      "Evaluasi Perkembangan (Denver)",
      "Diagnosa profesional (ASD, ADHD)",
    ],
  },
];

const THERAPIES = [
  {
    code: "TW",
    icon: MessageSquare,
    title: "Terapi Wicara",
    desc: "Membantu anak yang mengalami keterlambatan bicara, gangguan artikulasi, atau kesulitan komunikasi verbal maupun non-verbal. Terapis kami menggunakan pendekatan bermain yang menyenangkan untuk memicu keinginan anak berkomunikasi.",
    cocok: ["Speech delay", "Artikulasi tidak jelas", "Kesulitan memahami instruksi", "Autisme dengan hambatan bicara"],
  },
  {
    code: "SI",
    icon: Puzzle,
    title: "Sensori Integrasi",
    desc: "Terapi yang membantu anak mengolah stimulasi sensorik (sentuhan, gerakan, keseimbangan, pendengaran) dan merespons dengan tepat. Sangat bermanfaat untuk anak dengan sensory processing disorder.",
    cocok: ["Sensory Processing Disorder", "Hipersensitif suara/sentuhan", "Kesulitan keseimbangan", "Anak dengan ASD"],
  },
  {
    code: "OT",
    icon: HandHeart,
    title: "Okupasi Terapi",
    desc: "Melatih kemandirian anak dalam aktivitas sehari-hari (makan sendiri, berpakaian, memegang alat tulis) serta keterampilan motorik halus dan kasar. Berfokus pada fungsional yang dibutuhkan di kehidupan.",
    cocok: ["Kesulitan motorik halus", "Kurang mandiri", "Koordinasi mata-tangan lemah", "Persiapan menulis"],
  },
  {
    code: "BT",
    icon: Wand2,
    title: "Behavioral Therapy",
    desc: "Pendekatan berbasis bukti (ABA/behavior modification) untuk membentuk perilaku positif dan mengurangi perilaku maladaptif. Cocok untuk anak dengan ADHD, ASD, atau tantangan regulasi perilaku.",
    cocok: ["ADHD", "Autism Spectrum Disorder", "Perilaku maladaptif", "Kesulitan regulasi emosi"],
  },
];

const FLOW = [
  { icon: MessageSquare, title: "Kontak Awal", desc: "Hubungi kami via email atau kunjungi klinik untuk menjadwalkan konsultasi awal." },
  { icon: ClipboardCheck, title: "Asesmen", desc: "Psikolog kami melakukan asesmen menyeluruh untuk memahami kebutuhan anak." },
  { icon: Sparkles, title: "Rencana Terapi", desc: "Tim menyusun program terapi individual yang disesuaikan dengan kondisi anak." },
  { icon: Users, title: "Sesi & Evaluasi", desc: "Anak menjalani sesi terapi berkala; progres dievaluasi dan disampaikan ke orang tua." },
];

export function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-14 pb-12 md:pt-20 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="blob blob-peach w-[380px] h-[380px] -top-16 right-0" />
        <div className="blob blob-lavender w-[300px] h-[300px] top-24 -left-16" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Layanan Kami</p>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
            Pendampingan tumbuh kembang{" "}
            <span className="font-accent text-primary text-6xl md:text-7xl">yang komprehensif</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Kami menyediakan spektrum layanan lengkap — dari konsultasi psikolog, asesmen menyeluruh, hingga 4 jenis terapi klinis — semuanya dilakukan on-site di Klinik Mitra Diani, Jakarta Timur.
          </p>
        </div>
      </section>

      {/* 4 Pilar */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {PILLARS.map((p) => (
            <motion.article
              key={p.id}
              id={p.id}
              variants={fadeUp}
              className="bg-white rounded-3xl p-6 md:p-8 border border-black/5 shadow-warm-sm flex flex-col scroll-mt-24 hover:shadow-warm transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <p.icon size={22} />
                </div>
                {p.comingSoon && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary/20 text-secondary">
                    Opening Soon
                  </span>
                )}
              </div>
              <h3 className="font-heading font-bold text-xl mb-1">{p.title}</h3>
              <p className="text-sm text-primary font-medium mb-3">{p.tagline}</p>
              <p className="text-sm text-text-secondary leading-relaxed mb-5">{p.desc}</p>

              <ul className="space-y-2 mb-5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-primary">
                    <CheckCircle2 size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/booking"
                className="mt-auto inline-flex items-center gap-1 text-primary font-semibold text-sm hover:gap-2 transition-all"
              >
                Info Kunjungan <ArrowUpRight size={16} />
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* 4 Jenis Terapi Detail */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="blob blob-sage w-[300px] h-[300px] top-1/3 right-0" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">4 Jenis Terapi Komprehensif</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
              Setiap terapi punya <span className="font-accent text-primary text-5xl md:text-6xl">pendekatannya</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Anak Anda mungkin membutuhkan satu jenis terapi, atau kombinasi beberapa. Berikut penjelasan detail masing-masing.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {THERAPIES.map((t) => (
              <motion.div
                key={t.code}
                variants={fadeUp}
                className="bg-white rounded-3xl p-6 md:p-8 border border-black/5 shadow-warm-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <t.icon size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded">{t.code}</span>
                      <h3 className="font-heading font-bold text-lg mt-0.5">{t.title}</h3>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{t.desc}</p>
                <p className="text-xs font-semibold text-text-primary mb-2 uppercase tracking-wider">Cocok untuk</p>
                <div className="flex flex-wrap gap-2">
                  {t.cocok.map((c) => (
                    <span key={c} className="text-xs px-3 py-1 rounded-full bg-background border border-black/5 text-text-secondary">
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Alur Layanan */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="blob blob-lavender w-[280px] h-[280px] top-10 -left-10" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Alur Layanan</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
              Sederhana & <span className="font-accent text-primary text-5xl md:text-6xl">terarah</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {FLOW.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="bg-white rounded-3xl p-6 border border-black/5 shadow-warm-sm"
              >
                <p className="text-3xl font-heading font-extrabold text-primary/30 mb-3">{String(i + 1).padStart(2, "0")}</p>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <f.icon size={18} />
                </div>
                <h3 className="font-heading font-bold text-base mb-2">{f.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Info penting */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-warm-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Clock size={18} />
            </div>
            <p className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-1">Durasi Sesi</p>
            <p className="font-heading font-bold text-lg">60 menit</p>
            <p className="text-xs text-text-secondary mt-1">Termasuk dokumentasi & feedback ringkas.</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-warm-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <MapPin size={18} />
            </div>
            <p className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-1">Lokasi</p>
            <p className="font-heading font-bold text-lg">On-Site</p>
            <p className="text-xs text-text-secondary mt-1">Semua layanan on-site di Klinik Mitra Diani.</p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-warm-sm">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Users size={18} />
            </div>
            <p className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-1">Tim</p>
            <p className="font-heading font-bold text-lg">Bersertifikasi</p>
            <p className="text-xs text-text-secondary mt-1">Psikolog & terapis dengan STR aktif.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="blob blob-peach w-[320px] h-[320px] top-10 right-10" />

        <div className="relative z-10 max-w-3xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 border border-black/5 shadow-warm-lg text-center">
          <Sparkles className="mx-auto mb-3 text-primary" size={32} />
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
            Siap memulai perjalanan{" "}
            <span className="font-accent text-primary text-5xl md:text-6xl">tumbuh kembang</span>?
          </h2>
          <p className="text-text-secondary mb-6 max-w-xl mx-auto leading-relaxed">
            Kunjungi klinik kami untuk konsultasi awal & asesmen bersama tim profesional yang hangat dan berpengalaman.
          </p>
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
