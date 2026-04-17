import { motion } from "framer-motion";
import { MessageSquare, Activity, Brain, Smile, Stethoscope, Home, Building2, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 }
};

export function Services() {
  const therapies = [
    {
      title: "Terapi Wicara (Speech Therapy)",
      desc: "Membantu anak yang mengalami keterlambatan bicara, gangguan artikulasi, gagap, atau kesulitan memahami bahasa. Terapis kami menggunakan metode bermain yang interaktif untuk merangsang kemampuan komunikasi verbal dan nonverbal anak.",
      icon: MessageSquare,
      color: "bg-bluebell/20 text-bluebell",
      borderColor: "border-bluebell/30"
    },
    {
      title: "Sensori Integrasi (SI)",
      desc: "Dirancang untuk anak yang mengalami gangguan pemrosesan sensori (terlalu sensitif atau kurang sensitif terhadap sentuhan, suara, cahaya). Terapi ini membantu otak anak memproses informasi sensori dengan lebih baik melalui aktivitas fisik yang terstruktur.",
      icon: Activity,
      color: "bg-orange/20 text-orange",
      borderColor: "border-orange/30"
    },
    {
      title: "Terapi Okupasi (Occupational Therapy)",
      desc: "Fokus pada peningkatan kemandirian anak dalam aktivitas sehari-hari (makan, berpakaian, menulis). Sangat direkomendasikan untuk anak dengan gangguan motorik halus, motorik kasar, dan koordinasi mata-tangan.",
      icon: Brain,
      color: "bg-primary/20 text-primary",
      borderColor: "border-primary/30"
    },
    {
      title: "Behavioral Therapy (Terapi Perilaku)",
      desc: "Pendekatan terstruktur untuk memodifikasi perilaku anak, mengurangi tantrum, agresi, atau perilaku repetitif. Sangat efektif untuk anak dengan spektrum autisme (ASD) atau ADHD untuk membantu mereka beradaptasi dengan lingkungan sosial.",
      icon: Smile,
      color: "bg-yellow/20 text-yellow",
      borderColor: "border-yellow/30"
    }
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden bg-background">
      {/* Header */}
      <section className="pt-20 pb-16 bg-white border-b border-primary/10">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Layanan Komprehensif FlourishCare
          </motion.h1>
          <motion.p 
            className="text-lg text-text-secondary leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Didesain khusus untuk memenuhi kebutuhan unik setiap anak. Kami hadir melalui empat pilar layanan utama untuk mendukung tumbuh kembang optimal si kecil.
          </motion.p>
        </div>
      </section>

      {/* 4 Pillars Delivery Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {/* Pilar 1 */}
            <motion.div 
              className="bg-white p-8 rounded-3xl border border-primary/10 shadow-lg shadow-primary/5 flex flex-col items-start"
              {...fadeUp}
            >
              <div className="w-16 h-16 rounded-2xl bg-bluebell/20 text-bluebell flex items-center justify-center mb-6">
                <Building2 size={32} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">Terapi On-Site</h2>
              <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
                Fasilitas ruang terapi yang child-friendly di klinik kami. Di sini, kami menawarkan 4 jenis terapi komprehensif. Lingkungan yang terkontrol membantu anak lebih fokus selama sesi terapi.
              </p>
              <ul className="space-y-2 mb-8 w-full">
                {["Ruang terapi tematik", "4 Jenis Terapi (SI, TW, OT, BT)", "Alat sensori lengkap"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-primary font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Pilar 2 */}
            <motion.div 
              className="bg-white p-8 rounded-3xl border border-primary/10 shadow-lg shadow-primary/5 flex flex-col items-start"
              {...fadeUp}
              transition={{ delay: 0.1 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 text-secondary flex items-center justify-center mb-6">
                <Home size={32} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">Terapi Home Visit</h2>
              <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
                Terapis profesional kami datang langsung ke rumah Anda. Solusi praktis bagi orang tua yang sibuk, serta memberikan keuntungan bagi anak untuk belajar dan beradaptasi langsung di lingkungan sehari-harinya.
              </p>
              <ul className="space-y-2 mb-8 w-full">
                {["Radius layanan hingga 10 km", "Terapis membawa alat pendukung", "Protokol ketat setara on-site"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-primary font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            
            {/* Pilar 3 */}
            <motion.div 
              className="bg-white p-8 rounded-3xl border border-primary/10 shadow-lg shadow-primary/5 flex flex-col items-start"
              {...fadeUp}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <Stethoscope size={32} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">Konsultasi Psikolog</h2>
              <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
                Layanan profesional untuk membantu orang tua memahami dan mendukung perkembangan emosional, perilaku, dan kemampuan anak sesuai tahap usianya.
              </p>
              <ul className="space-y-2 mb-8 w-full">
                {["Psikolog berpengalaman", "Konseling orang tua bertahap", "Pendekatan holistik (growth companion)"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-primary font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Pilar 4 */}
            <motion.div 
              className="bg-white p-8 rounded-3xl border border-primary/10 shadow-lg shadow-primary/5 flex flex-col items-start"
              {...fadeUp}
              transition={{ delay: 0.3 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-yellow/20 text-yellow flex items-center justify-center mb-6">
                <ClipboardCheck size={32} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-text-primary mb-4">Psikotes & Asesmen</h2>
              <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
                Evaluasi mendalam untuk mengukur kematangan perkembangan anak. Merupakan langkah awal penting sebelum penentuan program terapi yang tepat sasaran.
              </p>
              <ul className="space-y-2 mb-8 w-full">
                {["Tes IQ & Evaluasi Perkembangan", "Tes Kesiapan Sekolah", "Tes Penegakan Diagnosa"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-primary font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Detailed Therapies */}
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-12"
            {...fadeUp}
          >
            <h2 className="text-3xl font-heading font-bold text-text-primary mb-4">
              4 Jenis Terapi Pilihan
            </h2>
            <p className="text-text-secondary">
              Layanan terapi kami tersedia baik di klinik (on-site) maupun melalui kunjungan ke rumah (home visit).
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {therapies.map((therapy, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className={`bg-white p-6 rounded-3xl border ${therapy.borderColor} shadow-sm hover:shadow-md transition-shadow flex flex-col`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${therapy.color}`}>
                  <therapy.icon size={28} />
                </div>
                <h3 className="font-heading font-bold text-lg text-text-primary mb-3">{therapy.title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm flex-grow">{therapy.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary/5 border-t border-primary/10">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-6">
            Langkah Awal Menuju Kemajuan
          </h2>
          <p className="text-text-secondary mb-8">
            Jadwalkan pra-assessment atau konsultasi awal dengan tim psikolog kami untuk menentukan pendekatan terapi terbaik bagi Ananda tercinta.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="rounded-xl shadow-md shadow-primary/20 hover:scale-105 transition-transform">
              <Link to="/booking">Booking Sesi Sekarang</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-xl border-primary text-primary hover:bg-primary/5">
              <a href="https://wa.me/628175028099" target="_blank" rel="noopener noreferrer">
                Hubungi via WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
