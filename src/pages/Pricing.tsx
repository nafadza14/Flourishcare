import { motion } from "framer-motion";
import { CheckCircle2, Info } from "lucide-react";

export function Pricing() {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          className="text-center mb-16"
          {...fadeUp}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-4">
            Layanan & Paket Harga Lengkap
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Pilih paket terapi yang paling sesuai dengan kebutuhan tumbuh kembang anak Anda. Kami menawarkan transparansi harga tanpa biaya tersembunyi.
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* A. Terapi On Site */}
          <motion.section {...fadeUp}>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6 border-b-2 border-primary/20 pb-2">
              A. Terapi On Site
            </h2>
            
            <div className="space-y-8">
              {/* Weekdays */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-text-primary">Weekdays (Senin sampai Jumat)</h3>
                <div className="overflow-x-auto rounded-xl border border-primary/10 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="p-4 font-semibold border-b border-primary/20">Layanan</th>
                        <th className="p-4 font-semibold border-b border-primary/20">4 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">8 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">12 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">16 Sesi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {[
                        { name: "Sensori Integrasi (SI)", p4: "Rp 560.000", p8: "Rp 1.120.000", p12: "Rp 1.680.000", p16: "Rp 2.240.000" },
                        { name: "Terapi Wicara (TW)", p4: "Rp 560.000", p8: "Rp 1.120.000", p12: "Rp 1.680.000", p16: "Rp 2.240.000" },
                        { name: "Terapi Okupasi (OT)", p4: "Rp 560.000", p8: "Rp 1.120.000", p12: "Rp 1.680.000", p16: "Rp 2.240.000" },
                        { name: "Fisioterapi (FT)", p4: "Rp 560.000", p8: "Rp 1.120.000", p12: "Rp 1.680.000", p16: "Rp 2.240.000" },
                        { name: "Behavioral Therapy (BT)", p4: "Rp 760.000", p8: "Rp 1.520.000", p12: "Rp 2.280.000", p16: "Rp 3.040.000" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-primary/5 hover:bg-background/50 transition-colors">
                          <td className="p-4 font-medium text-text-primary">{row.name}</td>
                          <td className="p-4 text-text-secondary">{row.p4}</td>
                          <td className="p-4 text-text-secondary">{row.p8}</td>
                          <td className="p-4 text-text-secondary">{row.p12}</td>
                          <td className="p-4 text-text-secondary">{row.p16}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Weekend */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-text-primary">Weekend (Sabtu sampai Minggu)</h3>
                <div className="overflow-x-auto rounded-xl border border-primary/10 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="p-4 font-semibold border-b border-primary/20">Layanan</th>
                        <th className="p-4 font-semibold border-b border-primary/20">4 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">8 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">12 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">16 Sesi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {[
                        { name: "SI / TW / OT / FT", p4: "Rp 600.000", p8: "Rp 1.200.000", p12: "Rp 1.800.000", p16: "Rp 2.400.000" },
                        { name: "Behavioral Therapy (BT)", p4: "Rp 800.000", p8: "Rp 1.600.000", p12: "Rp 2.400.000", p16: "Rp 3.200.000" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-primary/5 hover:bg-background/50 transition-colors">
                          <td className="p-4 font-medium text-text-primary">{row.name}</td>
                          <td className="p-4 text-text-secondary">{row.p4}</td>
                          <td className="p-4 text-text-secondary">{row.p8}</td>
                          <td className="p-4 text-text-secondary">{row.p12}</td>
                          <td className="p-4 text-text-secondary">{row.p16}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.section>

          {/* B. Terapi Home Visit */}
          <motion.section {...fadeUp}>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6 border-b-2 border-primary/20 pb-2">
              B. Terapi Home Visit
            </h2>
            
            <div className="space-y-8">
              {/* Weekdays */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-text-primary">Weekdays</h3>
                <div className="overflow-x-auto rounded-xl border border-primary/10 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="p-4 font-semibold border-b border-primary/20">Layanan</th>
                        <th className="p-4 font-semibold border-b border-primary/20">4 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">8 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">12 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">16 Sesi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {[
                        { name: "SI / TW / OT / FT", p4: "Rp 1.120.000", p8: "Rp 2.240.000", p12: "Rp 3.360.000", p16: "Rp 4.480.000" },
                        { name: "Behavioral Therapy (BT)", p4: "Rp 1.520.000", p8: "Rp 3.040.000", p12: "Rp 4.560.000", p16: "Rp 6.080.000" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-primary/5 hover:bg-background/50 transition-colors">
                          <td className="p-4 font-medium text-text-primary">{row.name}</td>
                          <td className="p-4 text-text-secondary">{row.p4}</td>
                          <td className="p-4 text-text-secondary">{row.p8}</td>
                          <td className="p-4 text-text-secondary">{row.p12}</td>
                          <td className="p-4 text-text-secondary">{row.p16}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Weekend */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-text-primary">Weekend</h3>
                <div className="overflow-x-auto rounded-xl border border-primary/10 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="p-4 font-semibold border-b border-primary/20">Layanan</th>
                        <th className="p-4 font-semibold border-b border-primary/20">4 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">8 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">12 Sesi</th>
                        <th className="p-4 font-semibold border-b border-primary/20">16 Sesi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {[
                        { name: "SI / TW / OT / FT", p4: "Rp 1.200.000", p8: "Rp 2.400.000", p12: "Rp 3.600.000", p16: "Rp 4.800.000" },
                        { name: "Behavioral Therapy (BT)", p4: "Rp 1.600.000", p8: "Rp 3.200.000", p12: "Rp 4.800.000", p16: "Rp 6.400.000" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-primary/5 hover:bg-background/50 transition-colors">
                          <td className="p-4 font-medium text-text-primary">{row.name}</td>
                          <td className="p-4 text-text-secondary">{row.p4}</td>
                          <td className="p-4 text-text-secondary">{row.p8}</td>
                          <td className="p-4 text-text-secondary">{row.p12}</td>
                          <td className="p-4 text-text-secondary">{row.p16}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.section>

          {/* C. Layanan Psikolog */}
          <motion.section {...fadeUp}>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6 border-b-2 border-primary/20 pb-2">
              C. Layanan Psikolog
            </h2>
            
            <div className="overflow-x-auto rounded-xl border border-primary/10 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-4 font-semibold border-b border-primary/20">Layanan</th>
                    <th className="p-4 font-semibold border-b border-primary/20">On Site</th>
                    <th className="p-4 font-semibold border-b border-primary/20">Home Visit</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {[
                    { name: "Pendaftaran (sekali bayar)", onsite: "Rp 100.000", home: "Rp 100.000" },
                    { name: "Konsultasi Psikolog", onsite: "Rp 250.000", home: "Rp 500.000" },
                    { name: "Evaluasi Kematangan Perkembangan", onsite: "Rp 300.000", home: "Rp 600.000" },
                    { name: "Tes IQ", onsite: "Rp 350.000", home: "Rp 700.000" },
                    { name: "Tes Kesiapan Sekolah", onsite: "Rp 350.000", home: "Rp 700.000" },
                    { name: "Tes Penegakan Diagnosa", onsite: "Rp 350.000", home: "Rp 700.000" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-primary/5 hover:bg-background/50 transition-colors">
                      <td className="p-4 font-medium text-text-primary">{row.name}</td>
                      <td className="p-4 text-text-secondary">{row.onsite}</td>
                      <td className="p-4 text-text-secondary">{row.home}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Catatan Penting */}
          <motion.section 
            {...fadeUp}
            className="bg-white p-8 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Info size={24} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-primary">
                Catatan Penting
              </h2>
            </div>
            
            <ul className="space-y-4">
              {[
                "Durasi sesi terapi: 60 menit (50 menit terapi + 10 menit laporan kepada orang tua)",
                "Behavioral Therapy: 60 menit (45 menit terapi + 15 menit laporan)",
                "Evaluasi besar setiap 16 sesi: GRATIS untuk klien baru (evaluasi pertama)",
                "Dokumentasi sesi foto/video: GRATIS atas request orang tua"
              ].map((note, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-secondary w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-text-primary text-lg">{note}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
