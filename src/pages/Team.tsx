import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, Loader2, Users } from "lucide-react";
import { fadeUp, stagger } from "@/lib/motion";
import { supabase } from "@/lib/supabase";
import type { StaffProfile } from "@/types/database";

export function Team() {
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("staff_profiles")
        .select("*")
        .eq("is_visible", true)
        .order("display_order", { ascending: true });
      if (cancelled) return;
      if (!error && data) {
        setStaff(data as StaffProfile[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-background">
      <section className="pt-12 pb-12 md:pt-20 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold text-sm mb-2 tracking-wider uppercase">Tim Kami</p>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
            Profesional yang <span className="text-primary">Berdedikasi</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Kami adalah psikolog dan terapis bersertifikasi yang siap mendampingi tumbuh kembang si kecil.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-text-secondary">
              <Loader2 className="animate-spin mr-2" size={20} /> Memuat profil tim…
            </div>
          ) : staff.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {staff.map((s) => (
                <motion.article
                  key={s.id}
                  variants={fadeUp}
                  className="bg-white rounded-3xl overflow-hidden border border-primary/10 shadow-sm"
                >
                  <div className="aspect-[4/5] bg-primary/5">
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
                  <div className="p-6">
                    <h3 className="font-heading font-bold text-xl mb-1">{s.title}</h3>
                    {s.str_number && (
                      <p className="text-xs text-text-secondary mb-3 inline-flex items-center gap-1">
                        <Award size={12} className="text-primary" />
                        STR {s.str_number}
                      </p>
                    )}
                    {s.bio && <p className="text-sm text-text-secondary leading-relaxed mb-4">{s.bio}</p>}
                    {s.specialties?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
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
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Kepercayaan */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: Award, title: "Lisensi Resmi", desc: "Seluruh terapis dan psikolog kami memiliki STR aktif." },
            { icon: GraduationCap, title: "Berpengalaman", desc: "Berpengalaman menangani berbagai kasus tumbuh kembang anak." },
            { icon: Users, title: "Empatis", desc: "Membangun kepercayaan bersama anak dan orang tua." },
          ].map((k) => (
            <div key={k.title} className="p-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <k.icon size={26} />
              </div>
              <h3 className="font-heading font-bold text-lg mb-1">{k.title}</h3>
              <p className="text-sm text-text-secondary">{k.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Users className="mx-auto text-text-secondary/40 mb-3" size={40} />
      <p className="text-text-secondary">Profil tim akan segera hadir.</p>
    </div>
  );
}
