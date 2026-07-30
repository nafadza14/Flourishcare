# 01 — Product Requirements Document (PRD)

**Produk:** FlourishCare.id — Platform Layanan Tumbuh Kembang Anak
**Versi Dokumen:** 1.0
**Tanggal:** Juli 2026
**Status:** Baseline (disusun dari code review MVP saat ini)

---

## 1. Ringkasan Produk

FlourishCare adalah startup layanan tumbuh kembang anak (child development & pediatric therapy) berbasis di Indonesia. Produk digitalnya adalah website bisnis yang menggabungkan tiga peran:

1. **Marketing site** — memperkenalkan brand, layanan, dan tim profesional.
2. **Booking engine** — memungkinkan orang tua memesan sesi terapi/konsultasi/psikotes secara mandiri.
3. **Internal operations dashboard** — memungkinkan staf klinik (super admin, admin cabang, psikolog, terapis, karyawan) mengelola booking, jadwal, rekam medis, keuangan, dan presensi.

Tagline resmi: *"Tumbuh Bersama, Flourish Sepenuhnya"* — *"Setiap Anak Berhak Tumbuh Sepenuhnya"*.

## 2. Latar Belakang & Masalah

Orang tua di Indonesia yang mencurigai adanya keterlambatan/gangguan tumbuh kembang anak (speech delay, ADHD, ASD, kesulitan belajar, gangguan motorik, kecemasan) menghadapi tiga hambatan:

- Akses ke terapis anak yang tersertifikasi masih terbatas dan tidak transparan.
- Proses booking sesi terapi masih manual (WhatsApp/telepon) dan sulit dijadwalkan.
- Layanan home-visit jarang tersedia, sementara membawa anak berulang-kali ke klinik menguras energi keluarga.

FlourishCare menjawab dengan model bisnis hybrid (klinik + home visit + online), disertai transparansi harga dan portfolio tim profesional.

## 3. Tujuan Produk

**Tujuan Bisnis**
- Meningkatkan konversi kunjungan situs menjadi booking berbayar.
- Menurunkan biaya operasional admin dengan mengalihkan penjadwalan ke self-service.
- Meningkatkan retensi klien melalui paket sesi (4/8/12/16) dan evaluasi berkala.

**Tujuan Produk (v1)**
- Menyediakan katalog layanan dan harga yang jelas.
- Menyediakan booking wizard yang bisa diselesaikan orang tua tanpa bantuan admin.
- Menyediakan dashboard internal untuk mengelola jadwal, presensi, dan pengajuan cuti staf.

**Non-tujuan (v1)**
- Parent portal (portal untuk orang tua login melihat progres anak) — ditunda ke v2.
- Video-call built-in untuk sesi psikolog online — v1 masih redirect ke Zoom/Google Meet.
- Multi-cabang penuh — v1 menargetkan satu cabang utama.

## 4. Persona Pengguna

**P1 — Ibu Rina (Orang tua, 32 tahun, Jakarta Selatan)**
Anak 4 tahun didiagnosis speech delay. Mencari terapis wicara terpercaya, ingin harga transparan, lebih memilih home-visit karena anak tantrum di lingkungan asing.

**P2 — Bapak Adi (Ayah, 38 tahun, profesional)**
Anak 6 tahun perlu asesmen kesiapan sekolah. Ingin proses cepat, dapat memesan online tanpa harus menelepon.

**P3 — Dr. Sarah (Psikolog anak, staf FlourishCare)**
Butuh melihat jadwal sesi hari ini, mencatat rekam medis anak, mengajukan izin sakit kalau perlu, dan melakukan presensi dengan mudah dari lokasi home-visit.

**P4 — Ukhtina (Admin cabang)**
Butuh melihat semua booking masuk, mengonfirmasi/mereschedule sesi, memantau kehadiran staf, dan menyetujui cuti.

**P5 — Achla (Super admin / owner)**
Butuh melihat KPI keuangan, jumlah pasien, tingkat kehadiran, dan mengelola daftar cabang, pengguna, dan role.

## 5. Cakupan Fitur v1

### 5.1 Public Website
- **Homepage** — hero, social proof, feed Instagram (via Curator.io), 6 kategori tantangan anak, 5 layanan, 5-langkah how-it-works, galeri, CTA WhatsApp.
- **Services** — 4 pilar layanan (On-Site, Home Visit, Konsultasi Psikolog, Psikotes) + 4 jenis terapi (Terapi Wicara, Sensori Integrasi, Okupasi Terapi, Behavioral Therapy).
- **Team** — profil singkat 6 profesional (foto, spesialisasi, sertifikasi).
- **Pricing** — 3 tabel harga (On-Site, Home Visit, Layanan Psikolog).
- **About** — visi, misi, 4 core values.
- **Booking wizard** — 6 langkah: Layanan → Jenis Terapi → Paket → Jadwal → Data Diri → Pembayaran.

### 5.2 Internal Dashboard
- **Overview** — KPI cards + notifikasi cuti + panel booking terdampak.
- **Booking** — daftar booking dengan aksi reschedule dan konfirmasi.
- **Jadwal** — kalender interaktif per terapis (v1: pandangan mingguan).
- **Pasien** — daftar & profil singkat pasien.
- **Rekam Medis** — catatan sesi (khusus psikolog & super admin).
- **Keuangan** — daftar transaksi + KPI pendapatan (super admin & admin cabang).
- **Presensi** — face-scan check-in on-site & home visit; pengajuan cuti.
- **Pengaturan** — cabang, pengguna, role (super admin).

### 5.3 Authentication
- Login email + password melalui Supabase Auth.
- Reset password via email link.
- Session persisten dengan proteksi route `/dashboard`.
- Logout terjamin (invalidate session).

## 6. Alur Utama (User Journey)

### 6.1 Journey Booking (Orang Tua)
1. Masuk Homepage → klik "Book Sesi" atau langsung ke `/booking`.
2. Pilih jenis layanan (On-Site / Home Visit / Psikolog / Psikotes).
3. Jika terapi (SI/TW/OT/BT) dipilih tapi belum pernah konsultasi psikolog → sistem menawarkan konsultasi psikolog dulu.
4. Pilih paket sesi + hari (weekdays/weekend).
5. Pilih terapis, tanggal, jam (slot terisi ditandai tidak dapat diklik).
6. Isi data anak & orang tua (nama, DOB, kondisi, alamat untuk home-visit).
7. Pilih metode pembayaran → sistem membuat booking + transaksi (status `pending_payment`).
8. Terima konfirmasi via email + WhatsApp; admin klinik melihat booking baru di dashboard.

### 6.2 Journey Presensi (Terapis Home Visit)
1. Login → tab Presensi.
2. Pilih mode "Home Visit" → isi nama pasien.
3. Klik "Scan Wajah" → sistem verifikasi wajah + geolokasi.
4. Log `attendance_logs` dibuat dengan type `mulai_sesi`.
5. Setelah sesi selesai → klik "Selesai Sesi" → log `selesai_sesi` dibuat.

### 6.3 Journey Cuti (Staf)
1. Login → tab Presensi → form Pengajuan Cuti.
2. Isi tanggal + alasan → submit.
3. Notifikasi muncul di dashboard Admin/Super Admin.
4. Admin mengklik "Setujui Cuti" → sistem menandai cuti disetujui dan menampilkan booking terdampak.
5. Admin mengklik "Tawarkan Reschedule via WA" → deep link WhatsApp ke orang tua.

## 7. Metrik Keberhasilan

| Metrik | Baseline | Target 6 Bulan |
|---|---|---|
| Booking online per bulan | 0 (belum online) | 60 |
| Booking-completion rate (mulai wizard → bayar) | — | ≥ 55% |
| Conversion pengunjung → booking | — | ≥ 3% |
| Waktu admin per booking (dari 10 menit manual) | 10 mnt | ≤ 2 mnt |
| Kepuasan orang tua (NPS) | — | ≥ 70 |
| Retensi paket (klien beli paket lanjutan) | — | ≥ 40% |

## 8. Prioritas & Roadmap

**Fase 1 (Q3 2026, MVP → Production Ready)**
- Konektivitas Booking → Supabase (persistensi + notifikasi).
- Auth guard dashboard + RBAC berbasis Supabase RLS.
- Payment gateway integration (Midtrans).
- Ganti stock photo tim dengan foto asli.
- Konfigurasi env vars & hapus hardcoded key.

**Fase 2 (Q4 2026)**
- Face recognition sungguhan untuk presensi.
- Geolokasi validation home-visit.
- Kalender interaktif drag-and-drop.
- Kirim reminder H-1 via WA API.

**Fase 3 (Q1 2027)**
- Parent portal (portal orang tua, upload dokumen, unduh laporan).
- Chat in-app parent–terapis.
- Multi-cabang penuh dengan agregasi lintas cabang.

## 9. Batasan & Asumsi

- **Regulasi**: Data anak = kategori sensitif menurut UU PDP; harus ada consent orang tua tertulis untuk penyimpanan dan pengolahan.
- **Sertifikasi**: Semua terapis dan psikolog wajib memiliki STR aktif; nomor STR ditampilkan di profil tim.
- **Home-visit radius**: 10 km dari cabang utama (sumber tunggal kebenaran di dokumen ini — hindari inkonsistensi copywriting).
- **Cabang**: v1 = 1 cabang utama Jakarta Selatan (sesuaikan copywriting Dashboard yang saat ini masih menyebut Surabaya).

## 10. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Payment gateway penolakan pembayaran | Booking gagal, kehilangan calon klien | Failover metode manual (transfer + verifikasi admin) |
| Bocor data anak (breach) | Hukum, reputasi | RLS Supabase ketat, audit log, retention policy, enkripsi at-rest |
| Salah verifikasi wajah presensi | Fraud jam kerja | Kombinasi face + geolocation + audit periodik |
| Terapis tidak update rekam medis | Kualitas layanan turun | Trigger reminder pasca-sesi, blok tandai selesai jika catatan kosong |
| Hotlinking gambar Pinterest bermasalah hak cipta | Legal claim | Migrasi seluruh aset ke Supabase Storage / CDN sendiri |

## 11. Open Questions

- Model bagi hasil dengan terapis (per-sesi vs gaji tetap) — memengaruhi struktur data Keuangan.
- Apakah orang tua boleh memilih terapis spesifik, atau hanya sistem yang assign?
- Kebijakan pembatalan/refund untuk booking berbayar.
- Apakah rekam medis dapat diakses oleh psikolog lain di cabang yang sama (kolaborasi) atau hanya penanggung jawab kasus?

## 12. Referensi

- Dokumen `02-Software-Architecture.md` — desain sistem.
- Dokumen `03-Functional-Specification.md` — detail fitur per halaman.
- Dokumen `04-Database-Architecture.md` — skema Supabase.
- Dokumen `05-Admin-Panel-Specification.md` — spesifikasi dashboard.
- Dokumen `06-REST-API-Specification.md` — kontrak API.
- Dokumen `07-Engineering-Guidelines.md` — standar coding.
- Dokumen `08-Code-Review-and-Remediation-Roadmap.md` — temuan review & rencana perbaikan.
