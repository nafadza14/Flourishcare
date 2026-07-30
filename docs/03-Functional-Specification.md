# 03 — Functional Specification

**Produk:** FlourishCare.id
**Versi:** 1.0
**Cakupan:** Perilaku fungsional per halaman untuk website publik + Login. Dashboard admin dispesifikasi terpisah di `05-Admin-Panel-Specification.md`.

---

## 1. Prinsip Umum

- Semua halaman publik responsif (breakpoint utama: `sm 640`, `md 768`, `lg 1024`, `xl 1280`).
- Navbar sticky, background berubah opacity saat scroll melebihi 20 px.
- Setiap CTA utama tersedia dalam dua bentuk: internal (link ke `/booking`) dan eksternal (WhatsApp `wa.me`).
- Semua form menggunakan validasi Zod + `react-hook-form`; pesan error dalam Bahasa Indonesia.
- Semua state loading menampilkan skeleton atau spinner; tombol submit `disabled` selama proses.
- Semua modal menutup dengan `Esc`, klik overlay, atau tombol X.

---

## 2. Homepage (`/`)

### 2.1 Section
1. **Hero** — headline, subheadline, badge kepercayaan (Terdaftar & Berizin, Tim Bersertifikasi, Empati Tinggi, Kepercayaan Keluarga).
2. **Social Proof Bar** — 5 bintang + teks "4.9/5 dari 50+ keluarga".
3. **Instagram Live Gallery** — 5 post terbaru dari Curator.io.
4. **Nilai & Keunggulan** — bento grid: 50+ keluarga, 5 jenis terapi, 98% kepuasan, home visit radius 10 km.
5. **6 Kategori Tantangan Anak** — Speech Delay, ADHD, ASD, Kesulitan Belajar, Gangguan Motorik, Kecemasan/Emosi.
6. **5 Pilihan Layanan** — kartu ringkas link ke `/services`.
7. **How It Works** — 5 langkah: Konsultasi Awal → Asesmen → Rencana → Sesi Terapi → Evaluasi.
8. **Galeri Foto** — 8 foto activity (Supabase Storage).
9. **CTA Final** — Book sesi + WhatsApp.

### 2.2 Fungsional
- **Instagram fetch:** panggil `GET https://api.curator.io/v1/feeds/{FEED_ID}/posts` di mount; ambil `posts[0..4]`; fallback grid 5 gambar statis jika `posts.length === 0` atau request gagal.
- **Radius kebijakan (10 km)** disimpan konstan di `config/constants.ts` — sumber tunggal.
- **Tombol "Full Gallery"** → `/galeri` (roadmap) atau anchor `#galeri` di halaman jika belum tersedia.

### 2.3 Kriteria Terima
- Semua gambar memiliki `alt` deskriptif.
- LCP element = hero image, dimuat dengan `fetchpriority="high"`.
- Instagram gallery muncul dalam ≤ 1 detik atau menampilkan skeleton.

---

## 3. Services (`/services`)

### 3.1 Konten
- **4 pilar layanan**: On-Site, Home Visit, Konsultasi Psikolog (online + on-site), Psikotes.
- **4 jenis terapi**: TW (Terapi Wicara), SI (Sensori Integrasi), OT (Okupasi Terapi), BT (Behavioral Therapy).
- Untuk tiap item: deskripsi, durasi, kondisi cocok, ikon.
- CTA di akhir: "Book Sesi" + "Konsultasi via WA".

### 3.2 Fungsional
- Halaman statis.
- Klik pilar/jenis terapi → scroll ke section terkait atau membuka accordion detail.
- CTA ke `/booking?service=<value>` untuk pre-fill wizard.

---

## 4. Team (`/team`)

### 4.1 Konten
- Grid 6 profil profesional.
- Setiap kartu: foto (grayscale default → berwarna on hover/focus), nama, gelar, spesialisasi (chips), sertifikasi/STR.
- Section "Kepercayaan": lisensi resmi, pengalaman, empati.

### 4.2 Fungsional
- Data profil datang dari tabel `staff_profiles` di Supabase; **tidak boleh** hardcoded lagi setelah refactor.
- Klik kartu → modal atau halaman detail `/team/:slug` (roadmap) untuk melihat CV lengkap.
- Foto grayscale → warna: harus juga dipicu dengan `focus-visible` (bukan hanya hover) — aksesibilitas.

### 4.3 Kriteria Terima
- Semua nama = orang nyata yang bekerja di FlourishCare.
- Semua foto = foto asli, bukan stock. Jika belum tersedia, gunakan placeholder ilustrasi netral dan tandai jelas.
- Nomor STR ditampilkan (opsional visible/disembunyikan di detail).

---

## 5. Pricing (`/pricing`)

### 5.1 Konten
Lima tabel harga (sumber tunggal kebenaran):

**A. On-Site Weekdays** — SI/TW/OT vs BT × 4/8/12/16 sesi.
**B. On-Site Weekend** — idem.
**C. Home Visit Weekdays** — idem (±2× tarif on-site).
**D. Home Visit Weekend** — idem.
**E. Layanan Psikolog** — Konsultasi, Tes IQ, Kesiapan Sekolah, Diagnosa × On-Site vs Home Visit.

Catatan tetap:
- Durasi sesi standar 60 mnt (50 sesi + 10 dokumentasi); BT 60 mnt (45 sesi + 15 evaluasi).
- Evaluasi tiap 16 sesi gratis untuk klien baru.
- Dokumentasi foto/video gratis.

### 5.2 Fungsional
- Halaman statis, tapi data harga disarankan pindah ke tabel `pricing` di Supabase agar admin bisa update tanpa deploy.
- Toggle kategori: On-Site / Home Visit / Psikolog.
- Toggle Weekdays / Weekend.
- Tombol "Pilih Paket" pada tiap baris → `/booking?service=...&therapy=...&package=...&dayType=...`.

---

## 6. About (`/about`)

Statis. Visi, misi, tahun berdiri (2023), 4 core values (Compassion, Excellence, Collaboration, Transparency). Tidak ada interaksi.

---

## 7. Booking Wizard (`/booking`)

### 7.1 Model State

```ts
type BookingForm = {
  service: 'onsite' | 'homevisit' | 'psikolog_online' | 'psikolog' | 'psikotes' | null;
  therapyType: 'SI' | 'TW' | 'OT' | 'BT' | 'konsultasi' | 'tesIQ' | 'kesiapan' | 'diagnosa' | null;
  package: 4 | 8 | 12 | 16 | null;
  dayType: 'weekdays' | 'weekend' | null;
  therapist: string | null;
  date: string | null; // ISO
  time: string | null;
  childName: string;
  childDob: string;
  childGender: 'L' | 'P' | '';
  condition: string;
  parentName: string;
  whatsapp: string;
  email: string;
  address: string;
  paymentMethod: 'BCA' | 'Mandiri' | 'QRIS' | 'GoPay' | 'OVO' | 'DANA' | null;
};
```

### 7.2 Aliran 6 Langkah

**Step 1 — Layanan.** User memilih salah satu dari 5. Jika `onsite` atau `homevisit` dipilih dan user belum tandai "sudah pernah konsultasi psikolog", tampilkan modal: "Untuk terapi anak, disarankan konsultasi psikolog terlebih dahulu." Dua tombol: (a) "Booking Konsultasi Psikolog" → set `service=psikolog`, `therapyType=konsultasi`; (b) "Saya sudah pernah" → lanjut.

**Step 2 — Jenis Terapi.** Opsi tergantung `service`:
- onsite / homevisit → SI, TW, OT, BT.
- psikolog / psikolog_online → konsultasi.
- psikotes → tesIQ, kesiapan, diagnosa.

**Step 3 — Paket.** Hanya untuk `onsite` / `homevisit`. Pilih paket sesi + hari. Untuk service lain, langsung skip ke Step 4.

**Step 4 — Jadwal.** Pilih terapis (dari `staff_profiles` yang berperan sesuai jenis terapi), tanggal (kalender), jam (slot 09/10/11/13/14/15/16 — filter yang bentrok dari `sessions` di DB). Slot terisi = badge "Penuh", tombol `disabled`.

**Step 5 — Data Diri.** Form field: `childName*`, `childDob*`, `childGender*`, `condition`, `parentName*`, `whatsapp*` (format 08xx atau 62xx), `email*`, `address*` (wajib untuk `homevisit`).

**Step 6 — Pembayaran.** Ringkasan booking + subtotal (dihitung dari tabel harga). Pilih metode → klik "Selesaikan Pembayaran".

### 7.3 Submit Logic
1. Validasi seluruh form dengan Zod.
2. `supabase.from('bookings').insert({...}).select().single()` → status `pending_payment`.
3. Panggil Edge Function `create_payment` (Midtrans Snap) → return `payment_token`, `redirect_url`.
4. Redirect ke Snap atau tampilkan Snap modal.
5. Callback Midtrans → Edge Function `payment_webhook` → update `payments.status` + `bookings.status`.
6. Tampilkan halaman `/booking/success?ref=<booking_id>` — dengan detail sesi, tombol simpan ke kalender, WhatsApp admin.

### 7.4 Skenario Error
- Slot ternyata sudah terisi saat submit (race) → tampilkan modal "Slot baru saja diambil orang lain" dan kembalikan ke Step 4.
- Payment gagal → status `payment_failed`, izinkan retry.
- Timeout Midtrans → tampilkan status `awaiting_payment` dan opsi transfer manual.

### 7.5 Kriteria Terima
- Data booking tersimpan permanen di Supabase.
- Konfirmasi email + WhatsApp otomatis terkirim.
- Admin melihat booking baru di dashboard secara realtime.

---

## 8. Login (`/login`)

### 8.1 UI
- Logo, judul "Masuk Dashboard".
- Field email + password (toggle show/hide).
- Link "Lupa password?".
- Copy: "Hanya untuk internal FlourishCare".

### 8.2 Fungsional
- Submit → `supabase.auth.signInWithPassword({email, password})`.
- Sukses → ambil `profiles` untuk role → redirect ke `?redirect=<path>` atau `/dashboard`.
- Gagal → tampilkan pesan generic "Email atau password salah" (jangan bocorkan detail).
- Rate-limit visual: setelah 5 percobaan gagal, tampilkan cooldown 30 detik.
- **Lupa password:** `supabase.auth.resetPasswordForEmail(email, {redirectTo: <baseUrl>/reset-password})`.

### 8.3 Kriteria Terima
- Detail error tidak muncul di console produksi.
- Tidak ada auto-complete tersimpan untuk password di device publik (opsional `autocomplete="current-password"` tetap bisa dipakai).

---

## 9. Navbar

- Menu: Beranda, Layanan, Team, Pricing, About, Booking. (Blog & Kontak = roadmap; sembunyikan sampai ready.)
- Hamburger di `< lg`; menu overlay full-screen dengan animasi.
- Tombol CTA "Book Sekarang" di kanan (desktop).
- Jika user login, ganti CTA dengan avatar + dropdown ("Dashboard", "Keluar").

## 10. Footer

- Logo + tagline singkat.
- Kolom: Layanan, Perusahaan, Kontak.
- Sosial: Instagram, WhatsApp, TikTok (jika ada) — semua `aria-label`.
- Copyright otomatis `new Date().getFullYear()`.
- Link privacy & terms → halaman legal (roadmap).

## 11. Halaman Legal (Roadmap)

- `/privacy-policy` — kebijakan privasi UU PDP-compliant (kategori sensitif: data anak, medis).
- `/terms` — syarat & ketentuan layanan.
- `/cookie` — kebijakan cookie.

## 12. Error & 404

- `/*` fallback → halaman 404 dengan link ke Homepage.
- Root `ErrorBoundary` → tampilan degradasi anggun + tombol "Muat Ulang".

## 13. Aksesibilitas Umum

- `<html lang="id">`.
- Kontras teks minimal WCAG AA.
- Fokus keyboard terlihat.
- Motion respect `prefers-reduced-motion`.
- Semua tombol `<button>` bukan `<div>` clickable.
- Alt image deskriptif; ikon dekoratif `aria-hidden="true"`.

## 14. SEO

- `<title>` unik per halaman.
- Meta description per halaman.
- Open Graph (og:title, og:image, og:description) untuk share sosial.
- `sitemap.xml` + `robots.txt`.
- Structured data `LocalBusiness` di Homepage + `MedicalBusiness` di Services.

## 15. Analitik (Roadmap)

- Vercel Analytics (default GA-free).
- Event tracking: `booking_start`, `booking_step_{n}`, `booking_submit`, `booking_success`, `login_success`, `whatsapp_click`.
