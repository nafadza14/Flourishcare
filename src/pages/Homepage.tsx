import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Star, 
  Users, 
  Activity, 
  MapPin, 
  Brain, 
  MessageSquare, 
  HeartHandshake, 
  GraduationCap, 
  Smile,
  Home,
  Building2,
  Stethoscope,
  ArrowRight
} from "lucide-react";

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

export function Homepage() {
  const heroImages = [
    "https://iik.ac.id/blog/wp-content/uploads/2023/01/fisioterapi-anak.jpg",
    "https://taniakidscenter.com/wp-content/uploads/2022/02/terapi-wicara-klinik-tumbuh-kembang-scaled.jpg",
    "https://akcdn.detik.net.id/visual/2023/11/29/ilustrasi-ciri-anak-adhd-1_11.jpeg?w=720&q=90"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden bg-background">
        {/* Organic Blob Backgrounds */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-secondary/10 blur-3xl opacity-60" />
          <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-bluebell/20 blur-3xl opacity-60" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div 
              className="max-w-2xl"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-text-primary leading-tight mb-6">
                Setiap Anak Berhak <span className="text-primary relative">
                  Tumbuh Sepenuhnya
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary mb-8 leading-relaxed font-sans">
                FlourishCare menghadirkan terapi tumbuh kembang profesional di rumah tumbuh kembang kami, atau langsung di rumahmu. Dipandu psikolog berpengalaman, dipantau setiap langkahnya.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button size="lg" asChild className="rounded-xl text-lg shadow-lg shadow-primary/20">
                  <Link to="/booking">Booking Sesi Sekarang</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-xl text-lg border-2">
                  <a href="https://wa.me/628175028099" target="_blank" rel="noopener noreferrer">
                    Konsultasi Gratis via WhatsApp
                  </a>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Terapis Berlisensi & Berpengalaman", 
                  "Home Visit Tersedia", 
                  "Laporan Progres Digital", 
                  "Evaluasi Berkala Setiap 16 Sesi"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-text-primary font-medium">
                    <CheckCircle2 className="text-secondary w-5 h-5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden aspect-square lg:aspect-[4/3] bg-bluebell/10 shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={currentImageIndex}
                    src={heroImages[currentImageIndex]}
                    alt={`Therapy image ${currentImageIndex + 1}`}
                    className="object-cover w-full h-full absolute top-0 left-0"
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  />
                </AnimatePresence>
                
                {/* Carousel Indicators */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {heroImages.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary w-6' : 'bg-white/60 hover:bg-white'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 z-10">
                  <div className="w-12 h-12 bg-yellow/20 rounded-full flex items-center justify-center text-yellow">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">4.9/5 Rating</p>
                    <p className="text-sm text-text-secondary">Dari 50+ Keluarga</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-10 bg-white border-y border-primary/10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: Users, text: "50+ Keluarga Telah Bersama Kami" },
              { icon: Activity, text: "5 Jenis Terapi Komprehensif" },
              { icon: HeartHandshake, text: "98% Orang Tua Puas dengan Progres" },
              { icon: MapPin, text: "Home Visit Radius 15 km" },
              { icon: Star, text: "Rating: ⭐⭐⭐⭐⭐ 4.9/5" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <item.icon size={20} />
                </div>
                <span className="font-heading font-bold text-text-primary text-sm md:text-base">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            {...fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              Apakah Si Kecil Mengalami Ini?
            </h2>
            <p className="text-text-secondary text-lg">
              Setiap anak memiliki tantangannya sendiri. Kami siap membantu mereka melewati fase ini dengan pendekatan yang tepat.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
          >
            {[
              { title: "Keterlambatan Bicara", desc: "Sulit mengekspresikan diri, kosakata terbatas", icon: MessageSquare, color: "bg-bluebell/20 text-bluebell" },
              { title: "ADHD & Hiperaktivitas", desc: "Sulit fokus, impulsif, tidak bisa diam", icon: Activity, color: "bg-orange/20 text-orange" },
              { title: "Autisme (ASD)", desc: "Hambatan komunikasi sosial, perilaku repetitif", icon: Brain, color: "bg-primary/20 text-primary" },
              { title: "Kesulitan Belajar", desc: "Disleksia, disgrafia, berhitung terlambat", icon: GraduationCap, color: "bg-yellow/20 text-yellow" },
              { title: "Gangguan Motorik", desc: "Koordinasi tubuh, postur, keseimbangan", icon: Activity, color: "bg-secondary/20 text-secondary" },
              { title: "Kecemasan & Emosi", desc: "Tantrum berlebihan, fobia, menarik diri", icon: Smile, color: "bg-red/20 text-red" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5 hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <item.icon size={28} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Pillar */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            {...fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              Layanan Fleksibel Sesuai Kebutuhan
            </h2>
            <p className="text-text-secondary text-lg">
              Pilih metode terapi yang paling nyaman untuk anak dan keluarga Anda.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Terapi On Site",
                desc: "Ruang terapi ramah anak, 5 jenis terapi komprehensif untuk stimulasi optimal.",
                icon: Building2,
                color: "bg-bluebell",
                textColor: "text-bluebell"
              },
              {
                title: "Home Visit",
                desc: "Terapis datang ke rumah, radius 15 km. Nyaman, praktis, dan anak belajar di lingkungan sehari-harinya.",
                icon: Home,
                color: "bg-secondary",
                textColor: "text-secondary"
              },
              {
                title: "Konsultasi Psikolog",
                desc: "Layanan konsultasi, tes IQ, dan evaluasi perkembangan untuk dukungan emosional dan perilaku.",
                icon: Stethoscope,
                color: "bg-primary",
                textColor: "text-primary"
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative bg-background rounded-3xl p-8 overflow-hidden hover:shadow-xl transition-all duration-300 border border-primary/5"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${service.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
                <div className={`w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 ${service.textColor}`}>
                  <service.icon size={32} />
                </div>
                <h3 className="font-heading font-bold text-2xl text-text-primary mb-4">{service.title}</h3>
                <p className="text-text-secondary leading-relaxed mb-6">{service.desc}</p>
                <Link to="/booking" className={`inline-flex items-center font-bold ${service.textColor} hover:opacity-80 transition-opacity`}>
                  Pelajari Lebih Lanjut <ArrowRight size={16} className="ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            {...fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              Bagaimana FlourishCare Bekerja?
            </h2>
            <p className="text-text-secondary text-lg">
              Proses yang transparan dan terstruktur untuk memastikan hasil terbaik.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-primary/20 -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {[
                "Konsultasi Awal",
                "Asesmen",
                "Rencana Terapi",
                "Sesi Reguler",
                "Evaluasi"
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-primary text-primary font-heading font-bold text-2xl flex items-center justify-center shadow-lg mb-4 relative">
                    {i + 1}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-text-primary">{step}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            className="bg-primary rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-primary/20"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/40 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                Mulai Perjalanan Tumbuh Kembang Anak Hari Ini
              </h2>
              <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                Jangan tunda perkembangan optimal anak Anda. Jadwalkan sesi pertama sekarang dan lihat perubahannya.
              </p>
              <Button size="lg" variant="secondary" asChild className="rounded-xl text-lg text-primary bg-white hover:bg-white/90 shadow-xl px-10 h-14">
                <Link to="/booking">Booking Sekarang</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
