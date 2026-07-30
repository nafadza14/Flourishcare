import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, Loader2, Users, Sparkles } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";
import { supabase } from "@/lib/supabase";
import type { StaffProfile } from "@/types/database";

// Fallback tim yang selalu tampil bila tabel `staff_profiles` di Supabase kosong.
// Foto ada di public/team/*.jpeg
const FALLBACK_TEAM: StaffProfile[] = [
  {
    id: "fallback-achla",
    profile_id: null as unknown as string,
    title: "Achla Himmah",
    slug: "achla-himmah",
    bio: "Psikolog anak yang berfokus pada asesmen tumbuh kembang, konseling keluarga, dan pendampingan orang tua. Achla percaya bahwa setiap anak memiliki potensi unik yang dapat mekar dengan pendekatan hangat, sabar, dan berbasis bukti. Dengan pengalaman menangani beragam kasus tumbuh kembang, ia mendampingi orang tua memahami dunia si kecil dan menyusun langkah terapi yang paling sesuai untuk mereka.",
    photo_url: "/team/achla.jpeg",
    specialties: ["Asesmen Anak", "Konseling Keluarga", "Kesiapan Sekolah", "Parenting"],
    therapy_types: [],
    str_number: null,
    str_expires_at: null,
    is_visible: true,
    display_order: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "fallback-rofanny",
    profile_id: null as unknown as string,
    title: "Rofanny Haznatu P K",
    slug: "rofanny-haznatu-pk",
    bio: "Psikolog anak yang berdedikasi mendampingi anak dan orang tua di setiap tahap tumbuh kembang. Rofanny berpengalaman dalam asesmen perkembangan, konseling anak, serta membantu keluarga menyusun strategi intervensi yang selaras dengan kebutuhan si kecil. Ia percaya bahwa kolaborasi antara psikolog, terapis, dan orang tua adalah kunci keberhasilan program terapi anak.",
    photo_url: "/team/rofanny.jpeg",
    specialties: ["Asesmen Perkembangan", "Konseling Anak", "Intervensi Terapi", "Kolaborasi Keluarga"],
    therapy_types: [],
    str_number: null,
    str_expires_at: null,
    is_visible: true,
    display_order: 2,
    created_at: "",
    updated_at: "",
  },
];

export function Team() {
  const [staff, setStaff] = useState<StaffProfile[]>(FALLBACK_TEAM);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("staff_profiles")
          .select("*")
          .eq("is_visible", true)
          .order("display_order", { ascending: true });
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          setStaff(data as StaffProfile[]);
        } else {
          setStaff(FALLBACK_TEAM);
        }
      } catch {
        if (!cancelled) setStaff(FALLBACK_TEAM);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <section className="relative pt-14 pb-12 md:pt-20 md:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="blob blob-peach w-[380px] h-[380px] -top-20 -left-20" />
        <div className="blob blob-lavender w-[320px] h-[320px] top-20 right-10" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Tim Kami</p>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
            Profesional yang <span className="font-accent text-primary text-6xl md:text-7xl">berdedikasi</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Kami adalah psikolog anak yang siap mendampingi tumbuh kembang si kecil dengan pendekatan hangat, empatik, dan berbasis bukti klinis.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-text-secondary">
              <Loader2 className="animate-spin mr-2" size={20} /> Memuat profil tim…
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {staff.map((s, idx) => (
                <motion.article
                  key={s.id}
                  variants={fadeUp}
                  style={{ rotate: idx % 2 === 0 ? -1 : 1 }}
                  whileHover={{ rotate: 0, y: -4 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="bg-white rounded-[2rem] overflow-hidden border border-black/5 shadow-warm"
                >
                  <div className="aspect-[4/5] bg-black/5">
                    {s.photo_url ? (
                      <img
                        src={s.photo_url}
                        alt={`Foto ${s.title}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-secondary/40">
                        <Users size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:p-7">
                    <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Psikolog Anak</p>
                    <h3 className="font-heading font-bold text-2xl mb-2">{s.title}</h3>
                    {s.str_number && (
                      <p className="text-xs text-text-secondary mb-3 inline-flex items-center gap-1">
                        <Award size={12} className="text-primary" />
                        STR {s.str_number}
                      </p>
                    )}
                    {s.bio && <p className="text-sm text-text-secondary leading-relaxed mb-4">{s.bio}</p>}
                    {s.specialties?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {s.specialties.map((sp) => (
                          <span
                            key={sp}
                            className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium"
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* Polaroid signature */}
                    <div className="mt-5 pt-4 border-t border-black/5">
                      <span className="font-accent text-2xl text-text-secondary/70">— {s.title.split(" ")[0]}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Kepercayaan */}
      <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="blob blob-sage w-[280px] h-[280px] top-10 right-1/4" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div className="text-center mb-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Kepercayaan</p>
            <h2 className="text-3xl md:text-4xl font-heading font-bold">
              Alasan Anda bisa <span className="font-accent text-primary text-5xl md:text-6xl">percaya</span> kepada kami
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-center">
            {[
              { icon: Award, title: "Lisensi Resmi", desc: "Seluruh psikolog kami memiliki STR (Surat Tanda Registrasi) aktif dan berlisensi resmi." },
              { icon: GraduationCap, title: "Berpengalaman", desc: "Berpengalaman menangani berbagai kasus tumbuh kembang anak — dari asesmen hingga intervensi." },
              { icon: Sparkles, title: "Empatis", desc: "Membangun kepercayaan bersama anak dan orang tua melalui pendekatan yang hangat dan sabar." },
            ].map((k) => (
              <div key={k.title} className="bg-white rounded-3xl p-6 border border-black/5 shadow-warm-sm">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <k.icon size={26} />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1">{k.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
