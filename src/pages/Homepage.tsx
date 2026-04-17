import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
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
  ArrowUpRight,
  CheckCircle2,
  Check
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export function Homepage() {
  const bentoImages = [
    "https://i.pinimg.com/736x/b1/ea/4d/b1ea4d486af624e510e9fc13791843ae.jpg", // Top Left
    "https://i.pinimg.com/736x/a0/6b/7f/a06b7f1cb2de748885a65918d11c6a91.jpg", // Bottom Left
    "https://i.pinimg.com/736x/3b/d2/cb/3bd2cb81b8e012b588d72e1250d893bb.jpg", // Center Large
    "https://i.pinimg.com/1200x/d4/d0/a2/d4d0a26da2bfe6ee86f485332d7cbaaf.jpg", // Top Right
    "https://i.pinimg.com/736x/5e/73/8f/5e738f21883a045057d345c8b5428e08.jpg" // Bottom Right
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="pt-8 pb-16 lg:pt-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-7xl font-heading font-extrabold text-text-primary leading-[1.1] tracking-tight mb-6 max-w-4xl mx-auto"
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
          FlourishCare bukan hanya tentang tumbuh hari ini, tetapi tentang membuka jalan agar setiap anak dapat melangkah lebih jauh dan bersinar dengan caranya sendiri.
        </motion.p>

        <motion.div
           className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-8 max-w-3xl mx-auto"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.15 }}
        >
          {[
            "Terapis Berlisensi & Berpengalaman", 
            "Home Visit Tersedia", 
            "Laporan Progres Digital", 
            "Evaluasi Besar Setiap 16 Sesi (Gratis newcomer)"
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm sm:text-base font-medium text-text-primary">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                <Check size={14} />
              </div>
              {item}
            </div>
          ))}
        </motion.div>

        <motion.div 
          className="flex flex-col items-center gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-primary/10">
            <div className="flex -space-x-3">
              <img src="https://i.pravatar.cc/100?img=1" alt="Parent" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://i.pravatar.cc/100?img=2" alt="Parent" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://i.pravatar.cc/100?img=3" alt="Parent" className="w-8 h-8 rounded-full border-2 border-white" />
            </div>
            <div className="flex items-center gap-1 text-yellow">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm font-bold text-text-primary">4.9/5 Rating Dari 50+ Keluarga</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="rounded-full text-lg px-8 py-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              <Link to="/booking">Booking Sesi Sekarang</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full text-lg px-8 py-6 border-2 hover:bg-primary/5">
              <a href="https://wa.me/628175028099" target="_blank" rel="noopener noreferrer">
                Konsultasi Gratis via WhatsApp
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Bento Box Gallery */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 max-w-6xl mx-auto h-[400px] md:h-[500px]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div className="hidden md:block col-span-1 row-span-1 min-h-0">
            <img src={bentoImages[0]} alt="Therapy" className="w-full h-full object-cover rounded-3xl" referrerPolicy="no-referrer" />
          </div>
          <div className="hidden md:block col-span-1 row-span-1 min-h-0">
            <img src={bentoImages[1]} alt="Therapy" className="w-full h-full object-cover rounded-3xl" referrerPolicy="no-referrer" />
          </div>
          <div className="col-span-1 md:col-span-2 md:row-span-2 md:col-start-2 md:row-start-1 min-h-0">
            <img src={bentoImages[2]} alt="Therapy" className="w-full h-full object-cover rounded-3xl" referrerPolicy="no-referrer" />
          </div>
          <div className="hidden md:block col-span-1 row-span-1 md:col-start-4 md:row-start-1 min-h-0">
            <img src={bentoImages[3]} alt="Therapy" className="w-full h-full object-cover rounded-3xl" referrerPolicy="no-referrer" />
          </div>
          <div className="hidden md:block col-span-1 row-span-1 md:col-start-4 md:row-start-2 min-h-0">
            <img src={bentoImages[4]} alt="Therapy" className="w-full h-full object-cover rounded-3xl" referrerPolicy="no-referrer" />
          </div>
        </motion.div>
      </section>

      {/* Core Values / Social Proof Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary max-w-md leading-tight tracking-tight">
            Nilai & Keunggulan Kami
          </h2>
          <p className="text-text-secondary text-lg max-w-lg">
            FlourishCare didedikasikan untuk memberikan layanan terapi terbaik dengan pendekatan yang berpusat pada anak dan keluarga.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Block 1 */}
          <div className="bg-white rounded-[2rem] p-6 flex flex-col sm:flex-row gap-6 relative shadow-sm border border-primary/10">
            {/* Top Right Arrow */}
            <div className="absolute -right-3 -top-3 bg-white p-3 rounded-2xl shadow-md border border-primary/10 text-primary z-10">
              <ArrowUpRight size={24} />
            </div>
            
            {/* Left Col */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="p-2">
                <h3 className="font-heading font-bold text-2xl text-text-primary mb-2">50+ Keluarga Telah Bersama Kami</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Mempercayakan tumbuh kembang anak dengan Rating: ⭐⭐⭐⭐⭐ 4.9/5.
                </p>
              </div>
              <img src="https://i.pinimg.com/1200x/e5/0a/6c/e50a6c0e3bcc4250da025adc00de1d04.jpg" alt="Keluarga" className="w-full h-48 object-cover object-top rounded-2xl mt-auto" referrerPolicy="no-referrer" />
            </div>

            {/* Right Col */}
            <div className="flex-1 flex flex-col gap-4 relative">
              <img src="https://i.pinimg.com/1200x/6d/82/74/6d8274aa5abbfb54da6c4206a937b62a.jpg" alt="Terapi" className="w-full h-48 object-cover object-center rounded-2xl" referrerPolicy="no-referrer" />
              <div className="p-2 mt-auto">
                <h3 className="font-heading font-bold text-2xl text-text-primary mb-2">5 Jenis Terapi Komprehensif</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Layanan yang disesuaikan dengan kebutuhan spesifik setiap anak untuk hasil optimal.
                </p>
              </div>
              {/* Bottom Left Arrow */}
              <div className="absolute -left-10 bottom-4 bg-white p-3 rounded-2xl shadow-md border border-primary/10 text-primary z-10 hidden sm:block">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </div>

          {/* Block 2 */}
          <div className="bg-white rounded-[2rem] p-6 flex flex-col sm:flex-row gap-6 relative shadow-sm border border-primary/10">
            {/* Top Right Arrow */}
            <div className="absolute -right-3 -top-3 bg-white p-3 rounded-2xl shadow-md border border-primary/10 text-primary z-10">
              <ArrowUpRight size={24} />
            </div>
            
            {/* Left Col */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="p-2">
                <h3 className="font-heading font-bold text-2xl text-text-primary mb-2">98% Orang Tua Puas dengan Progres</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Melihat perkembangan positif anak setelah mengikuti sesi terapi secara rutin.
                </p>
              </div>
              <img src="https://i.pinimg.com/736x/6f/3e/1a/6f3e1a1b245e962ce014ba129db9c95f.jpg" alt="Kepuasan" className="w-full h-48 object-cover object-top rounded-2xl mt-auto" referrerPolicy="no-referrer" />
            </div>

            {/* Right Col */}
            <div className="flex-1 flex flex-col gap-4 relative">
              <img src="https://i.pinimg.com/736x/17/a5/93/17a593c0d112cc6238612d882e725dc0.jpg" alt="Home Visit" className="w-full h-48 object-cover object-[center_30%] rounded-2xl" referrerPolicy="no-referrer" />
              <div className="p-2 mt-auto">
                <h3 className="font-heading font-bold text-2xl text-text-primary mb-2">Home Visit Radius 15 km</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Layanan terapis datang ke rumah untuk kenyamanan Anda dan si kecil.
                </p>
              </div>
              {/* Bottom Left Arrow */}
              <div className="absolute -left-10 bottom-4 bg-white p-3 rounded-2xl shadow-md border border-primary/10 text-primary z-10 hidden sm:block">
                <ArrowUpRight size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section -> Our Story Layout */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary max-w-md leading-tight tracking-tight">
            Apakah Si Kecil Mengalami Ini?
          </h2>
          <p className="text-text-secondary text-lg max-w-md">
            Setiap anak memiliki tantangannya sendiri. Kami siap membantu mereka melewati fase ini dengan pendekatan yang tepat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              {...fadeUp}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-primary/10 hover:shadow-md transition-all group relative flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.color}`}>
                  <item.icon size={32} />
                </div>
                <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowUpRight size={20} />
                </div>
              </div>
              <h3 className="font-heading font-bold text-2xl text-text-primary mb-3">{item.title}</h3>
              <p className="text-text-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section -> Our Programs Layout */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white/50 rounded-[3rem] my-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary max-w-md leading-tight tracking-tight">
            Empat Pilar Layanan
          </h2>
          <p className="text-text-secondary text-lg max-w-md">
            Pilih metode yang paling sesuai untuk membantu tumbuh kembang anak Anda secara optimal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "Terapi On-Site",
              desc: "Ruang terapi child-friendly dengan 4 jenis terapi untuk stimulasi optimal di klinik.",
              img: "https://i.pinimg.com/736x/46/45/5c/46455cbadebbaa67274a94cf8e9780f5.jpg",
              features: ["Lingkungan child-friendly", "4 jenis terapi komprehensif", "Fasilitas lengkap"],
              color: "text-bluebell"
            },
            {
              title: "Terapi Home Visit",
              desc: "Terapis datang ke rumah (radius 10 km). Praktis dan anak belajar di lingkungan familiar.",
              img: "https://i.pinimg.com/736x/5a/43/c6/5a43c601c0c1b3cd8108ed741e9a5e47.jpg",
              features: ["Terapis datang ke rumah", "Radius jangkauan 10 km", "Lebih nyaman & praktis"],
              color: "text-secondary"
            },
            {
              title: "Konsultasi Psikolog",
              desc: "Layanan profesional untuk mendukung perkembangan emosional, perilaku, dan kemampuan anak.",
              img: "https://i.pinimg.com/736x/9b/f4/aa/9bf4aa9289fc4f58cf9f44b61f258889.jpg",
              features: ["Psikolog profesional", "Pendekatan holistik", "Dukungan emosional"],
              color: "text-primary"
            },
            {
              title: "Psikotes",
              desc: "Tes IQ, evaluasi perkembangan, kesiapan sekolah, hingga tes penegakan diagnosa.",
              img: "https://i.pinimg.com/736x/32/c2/3f/32c23fc387f75d6bee46cedc34c21174.jpg",
              features: ["Tes IQ & Evaluasi", "Kesiapan Sekolah", "Penegakan Diagnosa"],
              color: "text-yellow"
            }
          ].map((service, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-primary/10 flex flex-col"
            >
              <div className="h-40 relative">
                <img src={service.img} alt={service.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className={`font-heading font-bold text-xl mb-3 ${service.color}`}>{service.title}</h3>
                <p className="text-text-secondary text-sm mb-6 line-clamp-3">{service.desc}</p>
                <ul className="space-y-2 mb-6 flex-grow">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-text-primary font-medium text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full bg-current ${service.color}`} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end mt-auto">
                  <Link to="/booking" className="text-primary font-bold text-sm hover:text-primary-hover transition-colors">
                    Booking
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works -> Why Choose Us Layout */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary max-w-md leading-tight tracking-tight">
            Bagaimana FlourishCare Bekerja?
          </h2>
          <p className="text-text-secondary text-lg max-w-md">
            Proses yang transparan dan terstruktur untuk memastikan hasil terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            "Konsultasi Awal",
            "Asesmen",
            "Rencana Terapi",
            "Sesi Reguler",
            "Evaluasi"
          ].map((step, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              className="bg-white p-6 rounded-[2rem] shadow-sm border border-primary/10 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <span className="font-heading font-bold text-2xl">{i + 1}</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-text-primary">{step}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary max-w-md leading-tight tracking-tight">
            Galeri
          </h2>
          <p className="text-text-secondary text-lg max-w-md">
            Intip suasana ruang terapi kami, di mana setiap hari dipenuhi dengan rasa ingin tahu, kreativitas, dan keceriaan anak-anak.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            "https://i.pinimg.com/1200x/56/0b/be/560bbeb052161dbd5def32ec7c9c25d2.jpg",
            "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1587691592099-24045742c181?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1602080858428-57174f9431cf?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1471286174890-9c11241eb435?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=600"
          ].map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-[4/3] rounded-3xl overflow-hidden shadow-sm"
            >
              <img src={img} alt={`Gallery ${i+1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button size="lg" className="rounded-full text-lg px-10 py-6 shadow-lg shadow-primary/20">
            Full Gallery
          </Button>
        </div>
      </section>

      {/* CTA Section -> Contact Layout */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary max-w-md leading-tight tracking-tight">
            Mulai Perjalanan Tumbuh Kembang Anak Hari Ini
          </h2>
          <p className="text-text-secondary text-lg max-w-md">
            Jangan tunda perkembangan optimal anak Anda. Jadwalkan sesi pertama sekarang dan lihat perubahannya.
          </p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-text-primary mb-4">Siap untuk memulai?</h3>
            <p className="text-text-secondary mb-8">
              Tim kami siap membantu Anda menemukan layanan yang paling tepat untuk kebutuhan si kecil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="rounded-full text-lg px-8 py-6 shadow-lg shadow-primary/20">
                <Link to="/booking">Booking Sekarang</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full text-lg px-8 py-6 border-2">
                <a href="https://wa.me/628175028099" target="_blank" rel="noopener noreferrer">
                  Hubungi Kami
                </a>
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/3 bg-background rounded-3xl p-8">
            <ul className="space-y-6">
              {[
                "Terapis Berlisensi & Berpengalaman", 
                "Home Visit Tersedia", 
                "Laporan Progres Digital", 
                "Evaluasi Berkala Setiap 16 Sesi"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-text-primary font-medium">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
