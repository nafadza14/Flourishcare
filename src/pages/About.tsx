import { motion } from "framer-motion";
import { Heart, Target, Eye, Users, Sparkles } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { COPYRIGHT_YEAR_START } from "@/config/constants";

const VALUES = [
  { icon: Heart, title: "Compassion", desc: "Kami menempatkan empati sebagai fondasi setiap interaksi." },
  { icon: Sparkles, title: "Excellence", desc: "Selalu memberikan kualitas terapi yang terbaik untuk anak Anda." },
  { icon: Users, title: "Collaboration", desc: "Kolaborasi erat antara terapis, psikolog, dan orang tua." },
  { icon: Target, title: "Transparency", desc: "Transparan dalam rencana terapi dan progres anak." },
];

export function About() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-14 pb-16 lg:pt-24 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="blob blob-peach w-[400px] h-[400px] -top-20 -right-16" />
        <div className="blob blob-mist w-[320px] h-[320px] top-20 -left-16" />

        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Tentang Kami</p>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary mb-6 leading-tight">
              Berawal dari <span className="font-accent text-primary text-6xl md:text-7xl">kepedulian</span>,<br />
              <span className="text-primary">Tumbuh Menjadi Solusi.</span>
            </h1>
            <div className="space-y-4 text-lg text-text-secondary leading-relaxed">
              <p>
                FlourishCare didirikan pada tahun {COPYRIGHT_YEAR_START} berawal dari observasi sederhana: banyak
                orang tua merasa kebingungan dan sendirian ketika menghadapi tantangan tumbuh kembang anak mereka.
              </p>
              <p>
                Kami membangun ekosistem terapi yang hangat, ramah anak, dan mudah diakses untuk keluarga di Jakarta Timur.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <motion.div className="bg-secondary/10 p-8 md:p-10 rounded-[2rem] border border-secondary/20 shadow-warm-sm" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="w-14 h-14 rounded-2xl bg-secondary text-white flex items-center justify-center mb-5 shadow-warm">
              <Eye size={26} />
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-3">Visi</h2>
            <p className="text-text-secondary leading-relaxed">
              Menjadi pusat layanan tumbuh kembang anak terdepan di Indonesia yang paling dipercaya oleh keluarga.
            </p>
          </motion.div>

          <motion.div className="bg-primary/10 p-8 md:p-10 rounded-[2rem] border border-primary/20 shadow-warm-sm" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-5 shadow-warm">
              <Target size={26} />
            </div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-3">Misi</h2>
            <ul className="space-y-2 text-text-secondary leading-relaxed list-disc pl-5">
              <li>Menyediakan layanan terapi tumbuh kembang berbasis bukti oleh tim bersertifikasi.</li>
              <li>Menghadirkan pengalaman yang hangat dan ramah anak di setiap sesi.</li>
              <li>Melibatkan orang tua sebagai mitra dalam setiap tahap terapi.</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="blob blob-buttercup w-[280px] h-[280px] top-10 right-1/3" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Nilai Kami</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              4 Prinsip yang <span className="font-accent text-primary text-5xl md:text-6xl">menuntun</span> kami
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white rounded-3xl p-6 border border-primary/10 shadow-warm-sm text-center">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <v.icon size={22} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
