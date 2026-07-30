import { motion } from "framer-motion";
import { Heart, Target, Eye, Users, Sparkles, ShieldCheck, HandHeart, MessageCircle } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";
import { COPYRIGHT_YEAR_START } from "@/config/constants";

const VALUES = [
  {
    icon: Heart,
    title: "Compassion",
    desc: "Kami menempatkan empati sebagai fondasi setiap interaksi. Setiap anak dan orang tua yang datang ke FlourishCare adalah bagian dari keluarga kami.",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    desc: "Selalu memberikan kualitas terapi terbaik untuk anak Anda dengan pendekatan berbasis bukti dan tim profesional yang terus belajar.",
  },
  {
    icon: HandHeart,
    title: "Collaboration",
    desc: "Kolaborasi erat antara terapis, psikolog, dan orang tua. Anak berkembang paling optimal ketika semua pihak bekerja sebagai satu tim.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    desc: "Transparan dalam rencana terapi, progres anak, dan setiap keputusan klinis. Orang tua berhak tahu setiap detail perjalanan anaknya.",
  },
];

export function About() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-14 pb-16 lg:pt-24 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="blob blob-peach w-[400px] h-[400px] -top-20 -right-16" />
        <div className="blob blob-lavender w-[320px] h-[320px] top-20 -left-16" />

        <div className="relative z-10 container mx-auto max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center">
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Tentang Kami</p>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary mb-6 leading-tight">
              Berawal dari <span className="font-accent text-primary text-6xl md:text-7xl">kepedulian</span>,<br />
              <span className="text-primary">Tumbuh Menjadi Solusi.</span>
            </h1>
          </motion.div>

          <motion.div
            className="mt-10 space-y-5 text-lg text-text-secondary leading-relaxed max-w-3xl mx-auto"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <p>
              FlourishCare didirikan pada tahun {COPYRIGHT_YEAR_START} berawal dari observasi sederhana: banyak orang tua di Indonesia merasa kebingungan dan sendirian ketika menghadapi tantangan tumbuh kembang anak mereka.
            </p>
            <p>
              Akses ke terapis dan psikolog anak yang tepercaya seringkali terhambat oleh jarak, antrean panjang di rumah sakit, atau lingkungan yang tidak ramah bagi anak. Banyak orang tua menemukan diri mereka mencari jawaban di internet tanpa mendapatkan panduan profesional yang membantu.
            </p>
            <p>
              Kami hadir untuk mengubah hal itu. FlourishCare membangun ekosistem terapi yang hangat, ramah anak, dan mudah diakses untuk keluarga di Jakarta Timur. Kami hadir di Klinik Mitra Diani dengan tim profesional yang berpengalaman dan berdedikasi.
            </p>
          </motion.div>

          {/* Filosofi Card */}
          <motion.div
            className="mt-12 max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-black/5 shadow-warm"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Sparkles size={22} />
              </div>
              <div>
                <p className="text-primary font-semibold text-xs uppercase tracking-wider mb-1">Filosofi Kami</p>
                <p className="text-text-primary leading-relaxed">
                  Setiap anak adalah <span className="font-accent text-2xl text-primary">benih unik</span> yang akan mekar (<span className="italic">flourish</span>) indah pada waktunya, jika diberikan nutrisi dan lingkungan yang tepat.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="blob blob-sage w-[300px] h-[300px] top-10 right-1/4" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Visi & Misi</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Kompas kami dalam melayani</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              className="bg-secondary/10 p-8 md:p-10 rounded-[2rem] border border-black/5 shadow-warm-sm"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary text-white flex items-center justify-center mb-5 shadow-warm">
                <Eye size={26} />
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-3">Visi</h3>
              <p className="text-text-secondary leading-relaxed">
                Menjadi pusat layanan tumbuh kembang anak terdepan di Indonesia yang paling dipercaya oleh keluarga, dengan mengedepankan inovasi, aksesibilitas, dan kualitas klinis yang unggul.
              </p>
            </motion.div>

            <motion.div
              className="bg-primary/10 p-8 md:p-10 rounded-[2rem] border border-black/5 shadow-warm-sm"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-5 shadow-warm">
                <Target size={26} />
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-3">Misi</h3>
              <ul className="space-y-3 text-text-secondary leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">◆</span>
                  <span>Menyediakan layanan terapi tumbuh kembang berbasis bukti oleh tim bersertifikasi STR.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">◆</span>
                  <span>Menghadirkan pengalaman yang hangat dan ramah anak di setiap sesi terapi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">◆</span>
                  <span>Melibatkan orang tua sebagai mitra dalam setiap tahap terapi dan pengambilan keputusan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">◆</span>
                  <span>Membuka transparansi progres melalui platform digital yang mudah diakses.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4 Values */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="blob blob-lavender w-[300px] h-[300px] top-10 left-10" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Nilai Kami</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">
              4 Prinsip yang <span className="font-accent text-primary text-5xl md:text-6xl">menuntun</span> kami
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Nilai-nilai ini menjadi kompas setiap keputusan klinis dan interaksi kami dengan anak, orang tua, dan sesama tim.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {VALUES.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="bg-white rounded-3xl p-6 border border-black/5 shadow-warm-sm text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <v.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Kepercayaan / Angka */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Users, value: "Ratusan", label: "Keluarga Dipercaya" },
            { icon: ShieldCheck, value: "STR", label: "Terapis Bersertifikat" },
            { icon: MessageCircle, value: "4.9/5", label: "Rating Kepuasan" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-3xl p-6 border border-black/5 shadow-warm-sm text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <s.icon size={22} />
              </div>
              <p className="text-3xl font-heading font-extrabold text-text-primary">{s.value}</p>
              <p className="text-sm text-text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
