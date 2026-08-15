import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { fadeUp } from "@/lib/motion";
import { useWizard, CONSULTATION_TOPICS } from "../wizardContext";
import { Stepper, AdminWhatsAppLink } from "../Stepper";

export function StepProfile() {
  const navigate = useNavigate();
  const { data, update } = useWizard();
  const { session } = useAuth();
  const autofilledRef = useRef(false);

  // Bersihkan ?code= dan ?state= dari URL setelah OAuth callback selesai
  // (mencegah reload loop dan URL yang jelek)
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("code") || url.searchParams.has("state") || url.searchParams.has("error")) {
      url.searchParams.delete("code");
      url.searchParams.delete("state");
      url.searchParams.delete("error");
      url.searchParams.delete("error_description");
      window.history.replaceState({}, "", url.pathname + (url.search || ""));
    }
  }, []);

  // Auto-fill dari session (email + wa dari user_metadata) — HANYA sekali
  useEffect(() => {
    if (!session || autofilledRef.current) return;
    autofilledRef.current = true;
    const meta = session.user.user_metadata as { whatsapp?: string; full_name?: string; name?: string } | undefined;
    const patch: Record<string, string> = {};
    if (!data.parent_email && session.user.email) patch.parent_email = session.user.email;
    if (!data.parent_whatsapp && meta?.whatsapp) patch.parent_whatsapp = meta.whatsapp;
    if (!data.parent_name && (meta?.full_name || meta?.name)) patch.parent_name = meta.full_name || meta.name || "";
    if (Object.keys(patch).length > 0) update(patch as Partial<typeof data>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validasi minimal sudah lewat native `required`. Lanjut.
    navigate("/book/schedule");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-[2rem] p-6 md:p-10 border border-black/5 shadow-warm">
        <Stepper current={1} />

        <div className="mt-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-1">Lengkapi Profil</h1>
          <p className="text-sm text-text-secondary">
            Mohon isi data orang tua dan anak untuk memulai sesi konsultasi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informasi Orang Tua */}
            <div className="space-y-4">
              <p className="text-primary font-semibold text-xs uppercase tracking-wider">Informasi Orang Tua</p>

              <Field label="Nama Lengkap Orang Tua/Wali">
                <input
                  type="text"
                  required
                  value={data.parent_name}
                  onChange={(e) => update({ parent_name: e.target.value })}
                  className={inputCls}
                />
              </Field>

              <Field label="Nomor WhatsApp Aktif (untuk kontak lanjutan)">
                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  value={data.parent_whatsapp}
                  onChange={(e) => update({ parent_whatsapp: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className={inputCls}
                />
                <p className="text-xs text-text-secondary mt-1">
                  Semua konfirmasi jadwal & follow-up akan dikirim via WhatsApp.
                </p>
              </Field>

              <Field label="Email (opsional)">
                <input
                  type="email"
                  value={data.parent_email}
                  onChange={(e) => update({ parent_email: e.target.value })}
                  placeholder="Boleh dikosongkan"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Informasi Anak */}
            <div className="space-y-4">
              <p className="text-primary font-semibold text-xs uppercase tracking-wider">Informasi Anak</p>

              <Field label="Nama Anak">
                <input
                  type="text"
                  required
                  value={data.child_name}
                  onChange={(e) => update({ child_name: e.target.value })}
                  className={inputCls}
                />
              </Field>

              <Field label="Tanggal Lahir Anak">
                <input
                  type="date"
                  required
                  value={data.child_dob}
                  onChange={(e) => update({ child_dob: e.target.value })}
                  className={inputCls}
                />
              </Field>

              <Field label="Jenis Kelamin Anak">
                <div className="grid grid-cols-2 gap-3">
                  {(["L", "P"] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => update({ child_gender: g })}
                      className={`rounded-full border px-4 py-3 text-sm font-semibold transition-colors ${
                        data.child_gender === g
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-white border-black/10 text-text-secondary hover:border-primary/40"
                      }`}
                    >
                      {g === "L" ? "Laki-laki" : "Perempuan"}
                    </button>
                  ))}
                </div>
                {!data.child_gender && (
                  <p className="text-xs text-text-secondary mt-1">Pilih salah satu.</p>
                )}
              </Field>
            </div>
          </div>

          <div className="border-t border-black/5 pt-6 space-y-4">
            <Field label="Hal utama yang ingin dikonsultasikan">
              <select
                required
                value={data.consultation_topic}
                onChange={(e) => update({ consultation_topic: e.target.value as never })}
                className={inputCls}
              >
                <option value="" disabled>Pilih kebutuhan</option>
                {CONSULTATION_TOPICS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Ceritakan singkat kondisi anak (Opsional)">
              <textarea
                rows={4}
                value={data.condition_notes}
                onChange={(e) => update({ condition_notes: e.target.value })}
                className={`${inputCls} !rounded-3xl min-h-[120px]`}
              />
            </Field>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!data.child_gender}
            className="w-full rounded-full shadow-warm"
          >
            Lanjut Pilih Jadwal
          </Button>

          <div className="text-center">
            <AdminWhatsAppLink />
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const inputCls =
  "w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-text-primary">{label}</label>
      {children}
    </div>
  );
}
