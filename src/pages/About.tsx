import { motion } from "framer-motion";
import { Heart, Target, Eye, Users, Sparkles } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export function About() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero / Story Section */}
      <section className="pt-20 pb-16 lg:pt-32 lg:pb-24 relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-bluebell/10 rounded-bl-[100px] -z-10" />
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-6 leading-tight">
                Berawal dari Kepedulian,<br />
                <span className="text-primary">Tumbuh Menjadi Solusi.</span>
              </h1>
              <div className="space-y-4 text-lg text-text-secondary leading-relaxed">
                <p>
                  FlourishCare didirikan pada tahun 2023 berawal dari sebuah observasi sederhana: banyak orang tua yang merasa kebingungan dan sendirian ketika menghadapi tantangan tumbuh kembang anak mereka.
                </p>
                <p>
                  Akses ke terapis profesional seringkali terhambat oleh jarak, antrean panjang di rumah sakit, atau lingkungan rumah tumbuh kembang yang mengintimidasi bagi anak.
                </p>
                <p>
                  Kami hadir untuk mengubah hal tersebut. FlourishCare membangun ekosistem terapi yang hangat, ramah anak, dan mudah diakses, baik melalui rumah tumbuh kembang on site kami yang nyaman maupun layanan home visit yang praktis.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://i.pinimg.com/736x/f2/aa/4b/f2aa4bee2ea07dc4e0ef94cb2d320820.jpg" 
                alt="Children playing and learning" 
                className="rounded-3xl shadow-2xl object-cover aspect-square"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-primary/10 max-w-xs">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-yellow/20 flex items-center justify-center text-yellow">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="font-bold text-text-primary">Filosofi Kami</h3>
                </div>
                <p className="text-sm text-text-secondary">Setiap anak adalah benih unik yang akan mekar (flourish) indah pada waktunya jika diberikan nutrisi dan lingkungan yang tepat.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white border-y border-primary/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-secondary/10 p-10 rounded-3xl border border-secondary/20"
              {...fadeUp}
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary text-white flex items-center justify-center mb-6 shadow-lg shadow-secondary/30">
                <Eye size={32} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-text-primary mb-4">Visi Kami</h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                Menjadi pusat layanan tumbuh kembang anak terdepan di Indonesia yang paling dipercaya oleh keluarga, dengan mengedepankan inovasi, aksesibilitas, dan kualitas klinis yang unggul.
              </p>
            </motion.div>

            <motion.div 
              className="bg-primary/10 p-10 rounded-3xl border border-primary/20"
              {...fadeUp}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                <Target size={32} />
              </div>
              <h2 className="text-3xl font-heading font-bold text-text-primary mb-4">Misi Kami</h2>
              <ul className="space-y-3 text-text-secondary text-lg">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span>Memberikan intervensi dini yang tepat sasaran dan berbasis bukti (evidence-based).</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span>Mengedukasi dan memberdayakan orang tua sebagai co-therapist di rumah.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span>Menyediakan layanan yang fleksibel (On-Site & Home Visit) untuk kenyamanan keluarga.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            {...fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              Nilai-Nilai Inti (Core Values)
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Prinsip yang memandu setiap tindakan, keputusan, dan interaksi kami dengan anak dan orang tua.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Compassion", desc: "Melayani dengan empati, kasih sayang, dan kesabaran tanpa batas." },
              { icon: Sparkles, title: "Excellence", desc: "Berkomitmen pada standar profesionalisme dan kualitas klinis tertinggi." },
              { icon: Users, title: "Collaboration", desc: "Bekerja sama erat dengan orang tua sebagai satu tim untuk kemajuan anak." },
              { icon: Target, title: "Transparency", desc: "Jujur dan terbuka mengenai progres, evaluasi, dan biaya terapi." }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-primary/10 shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 rounded-full bg-bluebell/20 text-bluebell flex items-center justify-center mx-auto mb-6">
                  <value.icon size={28} />
                </div>
                <h3 className="font-heading font-bold text-xl text-text-primary mb-3">{value.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
