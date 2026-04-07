import { motion } from "framer-motion";
import { ShieldCheck, Award, Heart, GraduationCap } from "lucide-react";

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

export function Team() {
  const teamMembers = [
    {
      name: "Achla Himmah M.Psi., Psikolog",
      role: "Psikolog Anak & Remaja",
      image: "https://i.ibb.co/DPpMtgtw/Whats-App-Image-2026-04-07-at-21-44-20.jpg",
      desc: "Lulusan Magister Profesi Psikologi UGM. Berpengalaman lebih dari 8 tahun dalam menangani kasus autisme, ADHD, dan gangguan kecemasan pada anak. Bersertifikasi dalam Play Therapy.",
      specialties: ["Asesmen Psikologi", "Play Therapy", "Parenting Counseling"]
    },
    {
      name: "Budi Santoso, S.Tr.Kes., OT",
      role: "Terapis Okupasi Senior",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
      desc: "Memiliki keahlian khusus dalam Sensori Integrasi (SI) tersertifikasi. Telah membantu ratusan anak meningkatkan kemandirian aktivitas sehari-hari dan kemampuan motorik halus.",
      specialties: ["Sensori Integrasi", "Motorik Halus", "Kemandirian (ADL)"]
    },
    {
      name: "Rina Wati, A.Md.TW",
      role: "Terapis Wicara",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
      desc: "Fokus pada intervensi dini keterlambatan bicara (speech delay) dan gangguan artikulasi. Menggunakan pendekatan DIR Floortime untuk merangsang komunikasi dua arah secara natural.",
      specialties: ["Speech Delay", "Artikulasi", "DIR Floortime"]
    },
    {
      name: "Andi Pratama, S.Psi",
      role: "Behavioral Therapist",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800",
      desc: "Berpengalaman dalam menerapkan metode Applied Behavior Analysis (ABA) untuk memodifikasi perilaku anak dengan ASD. Sabar, tegas, dan sangat disukai oleh anak-anak.",
      specialties: ["ABA Therapy", "Modifikasi Perilaku", "Manajemen Tantrum"]
    },
    {
      name: "dr. Sarah Wijaya, Sp.A",
      role: "Dokter Spesialis Anak (Konsultan)",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800",
      desc: "Mitra konsultan medis FlourishCare yang memastikan setiap program terapi sejalan dengan kondisi medis dan tumbuh kembang fisik anak secara keseluruhan.",
      specialties: ["Tumbuh Kembang", "Pediatri Klinis", "Nutrisi Anak"]
    },
    {
      name: "Dina Karmila, S.Ft., Physio",
      role: "Fisioterapis Anak",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
      desc: "Ahli dalam menangani gangguan motorik kasar, cerebral palsy ringan, dan postur tubuh anak. Menggabungkan terapi fisik dengan permainan yang menyenangkan.",
      specialties: ["Motorik Kasar", "Neuro-Developmental Treatment", "Koreksi Postur"]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <section className="pt-20 pb-16 bg-primary text-white text-center rounded-b-[3rem] shadow-xl mb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.h1 
            className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Tim Profesional FlourishCare
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/90 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Di balik setiap progres luar biasa anak Anda, ada tim ahli yang berdedikasi. Kami terdiri dari psikolog klinis, terapis bersertifikasi, dan tenaga medis yang bekerja dengan hati.
          </motion.p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 max-w-6xl mb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Lisensi Resmi", desc: "Seluruh terapis dan psikolog kami memiliki Surat Tanda Registrasi (STR) dan Izin Praktik yang aktif." },
            { icon: Award, title: "Berpengalaman", desc: "Telah menangani ratusan kasus tumbuh kembang dengan jam terbang tinggi di bidang pediatri." },
            { icon: Heart, title: "Pendekatan Empatis", desc: "Tidak hanya ahli secara klinis, tim kami dilatih untuk membangun bonding yang kuat dengan anak." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-8 rounded-3xl border border-primary/10 shadow-sm text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-6">
                <item.icon size={32} />
              </div>
              <h3 className="font-heading font-bold text-xl text-text-primary mb-3">{item.title}</h3>
              <p className="text-text-secondary">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Grid */}
      <section className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          {...fadeUp}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
            Kenalan dengan Ahli Kami
          </h2>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
        >
          {teamMembers.map((member, i) => (
            <motion.div 
              key={i}
              variants={fadeUp}
              className="bg-white rounded-3xl overflow-hidden border border-primary/10 shadow-lg shadow-primary/5 group"
            >
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map(spec => (
                      <span key={spec} className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/30">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-xl text-text-primary mb-1">{member.name}</h3>
                <p className="text-primary font-medium text-sm mb-4">{member.role}</p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {member.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
