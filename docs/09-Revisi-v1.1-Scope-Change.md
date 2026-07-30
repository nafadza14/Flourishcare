# 09 — Revisi v1.1 (Scope Change)

**Produk:** FlourishCare.id
**Versi Dokumen:** 1.1
**Berlaku sejak:** Juli 2026
**Menggantikan bagian terkait di:** `01-PRD.md`, `03-Functional-Specification.md`, `04-Database-Architecture.md`, `05-Admin-Panel-Specification.md`, `06-REST-API-Specification.md`, `08-Code-Review-and-Remediation-Roadmap.md`

---

## 0. Ringkasan Perubahan

Berdasarkan review stakeholder, model layanan disederhanakan agar lebih realistis untuk fase awal (dan lebih mudah dioperasikan):

1. **Layanan Home Visit dihilangkan** dari seluruh produk (marketing site, katalog, booking).
2. **Booking self-service publik dihapus** — semua terapi/psikolog/psikotes dilakukan **on-site di Klinik Mitra Diani** dan calon klien datang langsung / kontak via WA.
3. **Konsultasi Psikolog Online** menjadi satu-satunya jalur yang tetap memakai sistem booking, namun **dialihkan ke subdomain terpisah** `https://book.flourishcare.id/` (status: coming soon).
4. **Tabel harga publik dihilangkan** — harga tidak lagi ditampilkan di website.
5. **Tim publik disusutkan** dari 6 menjadi 2 orang (Achla, Rofanny) untuk baseline.
6. **Fitur baru: Progress Layanan** — halaman track progress pasien secara online berbasis input No. RM + Nama Pasien.
7. **Footer & branding** disesuaikan: logo transparan, kontak baru, sosial media Instagram/Threads/TikTok, WhatsApp & Quick Links di footer dihapus.

Dampak positif: **cakupan yang harus dibangun turun ~60%**, waktu ke launch dipercepat, dan risiko regulasi (booking online untuk terapi anak) berkurang.

---

## 1. Detail Revisi per Halaman

### 1.1 Beranda (Homepage)

**Hero / Value Props — Hapus:**
- Kartu "Home Visit Tersedia".
- Kartu "Laporan Progres Digital" (akan dibangun sebagai fitur Progress Layanan, jadi tidak diklaim di hero).
- Kartu "Evaluasi Besar Setiap 16 Sesi (Gratis newcomer)".
- Section "Home Visit Radius 15 km — Layanan terapis datang ke rumah…".

**Copywriting:**
- Ubah "5 Jenis Terapi Komprehensif" → **"4 Jenis Terapi Komprehensif"** (SI, TW, OT, BT — dengan menghilangkan home-visit sebagai kategori).
- Konsisten hilangkan referensi "home visit" di seluruh copy.

**Logo:**
- Ubah background logo menjadi **transparan** (PNG dengan alpha channel atau SVG). Berlaku untuk Navbar, Footer, Login, Dashboard, dan share OG image.

**How It Works (5 langkah):**
- Baris awal terlihat mengandung instruksi "Dihapus Dulu aja" untuk poin 2-4 di section berikutnya. Interpretasi: hilangkan sementara langkah 2-4 di "How It Works" — sisakan **Langkah 1 (Konsultasi Awal / Kunjungan) → Langkah 5 (Evaluasi)** sebagai versi ringkas dua langkah. Konfirmasi ke stakeholder sebelum publish; jika interpretasi salah, mudah dipulihkan.

**Footer (mengikuti section 5 di dokumen review):**
- Ikon sosial di bawah logo → **link ke Instagram, Threads, TikTok** (Instagram tetap; tambahkan Threads dan TikTok; hapus ikon lain).
- **Hapus** kolom "Quick Links" dan kolom "Layanan".
- **Kontak (baru):**
  - Email: `Flourishcare.id@gmail.com`
  - Alamat: **Klinik Mitra Diani Lantai 2, Jl. PKP Raya No.1, Kelapa Dua Wetan, Ciracas, Jakarta Timur**
  - **WhatsApp dihapus** dari footer.

### 1.2 Layanan (`/services`)

- **Hapus** section "Terapi Home Visit" secara utuh.
- Pilar layanan tersisa: On-Site, Konsultasi Psikolog (Online + On-Site), Psikotes.
- 4 Jenis Terapi (SI, TW, OT, BT) tetap, tetapi framing lokasi selalu **on-site di Klinik Mitra Diani**.

### 1.3 Tim Kami (`/team`)

- **Sisakan 2 profil**: **Achla** dan **Rofanny**.
- Kartu-kartu lain (dan section "Kepercayaan" 3 blok) tetap boleh ada, tetapi konten profil individu hanya untuk 2 orang.
- Data lain (Ukhtina, Budi, Rina, Andi) dihapus dari kode dan dari tabel `staff_profiles`.

### 1.4 Harga (`/pricing`)

- **Halaman Pricing dihapus** dari navigasi publik.
- Route `/pricing` dihapus (atau redirect ke `/services`).
- Menu "Pricing" di Navbar dihapus.
- Data pricing tetap disimpan di tabel `pricing` untuk perhitungan internal (admin cabang), tetapi tidak dipublikasikan.

### 1.5 Booking (`/booking`) — Berubah menjadi **Info & Kontak Klinik**

Halaman `/booking` **tidak lagi berupa wizard**. Diubah menjadi **halaman informasi layanan on-site + CTA kontak / kunjungan**, dengan 4 kartu layanan:

| Kartu | Konten | CTA |
|---|---|---|
| **Terapi On-Site** | Layanan terapi (SI/TW/OT/BT) dilakukan di klinik. Alamat + peta Klinik Mitra Diani. | Tombol "Hubungi via WA" + "Petunjuk Arah (Google Maps)" |
| **Konsultasi Psikolog On-Site** | Konsultasi tatap muka di klinik. Alamat sama. | Idem |
| **Psikotes & Assessment** | Layanan asesmen psikologis di klinik. Alamat sama. | Idem |
| **Konsultasi Psikolog Online** | Badge **"Opening Soon"**. Saat live, tombol ke `https://book.flourishcare.id/`. | Sementara: tombol "Notify Saya" (opsional, simpan email). Setelah rilis: tombol "Booking Sekarang" → subdomain. |

**Detail Alamat wajib dicantumkan di ketiga kartu on-site:**
> Klinik Mitra Diani Lantai 2, Jl. PKP Raya No.1, Kelapa Dua Wetan, Ciracas, Jakarta Timur

**Sistem pemesanan sesi (wizard 6 langkah) dihapus dari client.** Kode `src/pages/Booking.tsx` dipecah ulang menjadi komponen informasional. Semua state, step, dan form field terkait wizard dihapus dari repo.

**Menu Navbar** untuk item ini bisa diberi label ulang: **"Info Kunjungan"** atau **"Kontak & Kunjungan"** (opsional), atau tetap "Booking" untuk konsistensi URL.

### 1.6 Halaman Baru: **Progress Layanan** (`/progress`)

Halaman publik untuk orang tua/pasien melacak progres terapi tanpa perlu login penuh.

**Aliran singkat:**
1. Orang tua masuk `/progress`.
2. Isi form: **No. RM (Rekam Medis)** + **Nama Pasien** (validasi cocok/tidak).
3. Setelah cocok, sistem mengirim OTP via WhatsApp/email orang tua terdaftar (satu langkah verifikasi ringan).
4. Setelah OTP terverifikasi, tampilkan halaman progres:
   - Info anak (nama, usia, kondisi awal).
   - Terapis penanggung jawab.
   - Total sesi dijalani vs total paket.
   - Grafik progres (skor asesmen per periode, jika ada).
   - Daftar catatan progres publik (yang di-share oleh terapis, bukan full rekam medis).
   - Jadwal sesi berikutnya.
   - Tombol download PDF laporan progres (roadmap).

**Halaman `/progress` diakses tanpa login** (lightweight), tetapi:
- OTP satu-kali (kadaluarsa 10 menit) menjadi guardrail keamanan.
- Setelah OTP verified, session lokal (JWT khusus progress, TTL 30 menit) menyimpan akses.
- Tidak menampilkan data sensitif medis lengkap — hanya ringkasan progres yang di-`is_shared=true` oleh terapis.

**Spec teknis lengkap ada di §3 dokumen ini.**

---

## 2. Dampak ke Dokumen Lain

### 2.1 PRD (`01-PRD.md`)
- Persona P2 (booking online mandiri) di-deprioritaskan; ganti dengan persona "Ibu yang mencari klinik terpercaya di Jakarta Timur".
- Cakupan v1 tidak lagi memasukkan payment gateway & booking wizard.
- KPI "Booking online per bulan" diganti "Kunjungan klinik dari lead website per bulan" — trackable via UTM link WhatsApp.
- Target ekspansi Home Visit dipindahkan ke Fase 3 (setelah pilar on-site stabil).

### 2.2 Functional Spec (`03-Functional-Specification.md`)
- Section 5 (Pricing) — halaman dihapus.
- Section 7 (Booking Wizard) — dihapus total; diganti dengan **Section 7 baru: Info Kunjungan + Progress Layanan** (lihat §3 di dokumen ini).
- Section 9 (Navbar) — hapus item "Pricing"; tambah "Progress" atau taruh di bawah menu Booking.

### 2.3 Database (`04-Database-Architecture.md`)
- Tabel `bookings`, `payments`, `sessions` **tetap** — tetap dipakai admin untuk mencatat kedatangan klien on-site (booking manual dari admin, bukan self-service publik).
- Tabel `bookings`: kolom `service` value `homevisit` **tidak lagi diproduksi**, dan `address` (untuk homevisit) tidak dipakai. Constraint bisa diperketat: `service in ('onsite','psikolog','psikotes','psikolog_online')`.
- Tabel baru: **`children.rm_number text unique not null`** — nomor Rekam Medis (formatnya bebas, mis. `FC-RM-2607-0001`).
- Tabel baru: **`progress_notes`** — catatan progres yang bisa di-share ke halaman `/progress`:
  ```sql
  create table progress_notes (
    id          uuid primary key default gen_random_uuid(),
    child_id    uuid not null references children(id) on delete cascade,
    author_id   uuid not null references profiles(id),
    session_id  uuid references sessions(id),
    title       text not null,
    summary     text not null,          -- versi ringkas & aman untuk orang tua
    metrics     jsonb,                  -- skor asesmen periodik
    is_shared   boolean not null default false,
    created_at  timestamptz not null default now()
  );
  ```
  RLS: `select` publik hanya jika `is_shared=true` **dan** dipanggil via RPC `get_progress_by_rm(rm_number, otp_token)`.
- Tabel baru: **`progress_access_otp`** — OTP one-time untuk akses halaman `/progress`:
  ```sql
  create table progress_access_otp (
    id            uuid primary key default gen_random_uuid(),
    child_id      uuid not null references children(id),
    parent_id     uuid not null references parents(id),
    otp_hash      text not null,               -- SHA256 dari kode 6 digit
    channel       text not null,               -- 'wa' | 'email'
    expires_at    timestamptz not null,
    consumed_at   timestamptz,
    created_at    timestamptz not null default now()
  );
  create index on progress_access_otp(child_id, created_at desc);
  ```

### 2.4 Admin Panel (`05-Admin-Panel-Specification.md`)
- Tab **Booking** tetap ada, tapi kini **entry manual oleh admin**: form "Tambah Kedatangan" — pilih pasien, jenis layanan, terapis, waktu.
- Tab **Rekam Medis** ditambah tombol "Publikasikan sebagai Progress Note" — memungkinkan terapis/psikolog memilih bagian catatan yang aman dibagikan ke orang tua.
- Tab **Progress Layanan (baru)** untuk staf: melihat & mengelola `progress_notes` per pasien.

### 2.5 REST/API (`06-REST-API-Specification.md`)
- Endpoint booking publik (`booking_intake`) & `payment_webhook` **dihapus dari MVP** (dipindah ke roadmap subdomain `book.flourishcare.id`).
- Endpoint baru:
  - `POST /functions/v1/progress_request_otp` → `{ rm_number, patient_name }` → validasi + kirim OTP ke channel terdaftar.
  - `POST /functions/v1/progress_verify_otp` → `{ rm_number, otp }` → keluarkan `progress_token` (JWT khusus, TTL 30 mnt).
  - `GET /functions/v1/progress_snapshot` (header `Authorization: Bearer <progress_token>`) → snapshot data pasien (nama, usia, terapis, jumlah sesi, `progress_notes` yang `is_shared`).
- RPC `get_progress_by_rm(rm_number)` internal (dipanggil dari Edge Function).

### 2.6 Roadmap (`08-Code-Review-and-Remediation-Roadmap.md`)
Diringkas ulang di §5 dokumen ini.

---

## 3. Spesifikasi Fitur Baru: Progress Layanan

### 3.1 Tujuan
- Memberikan transparansi progres terapi kepada orang tua tanpa membangun full parent portal.
- Menjadi differentiator marketing ("Track progres anak Anda kapan pun") sekaligus retention driver.
- Membuka jalur komunikasi terarah antara orang tua dan terapis (WhatsApp trigger dari halaman progress).

### 3.2 Aliran Pengguna
1. **Landing** — user tiba di `/progress` (bisa via QR code yang diberikan admin saat pendaftaran, atau menu Navbar "Progress").
2. **Form akses:**
   - Field: **No. RM** (mis. `FC-RM-2607-0001`), **Nama Pasien** (harus persis).
   - Tombol: "Kirim Kode Verifikasi".
   - Sistem cek pasangan `children.rm_number` + `children.full_name`; jika match, ambil `parents.whatsapp` (dan/atau email); jika tidak match, tampilkan pesan generic "Data tidak ditemukan. Hubungi admin klinik."
3. **Kirim OTP:** Edge Function `progress_request_otp` generate 6 digit, hash, simpan; kirim ke channel terdaftar. Rate limit: 1 per 60 detik per RM.
4. **Form OTP:** user memasukkan 6 digit; validasi `progress_verify_otp`.
5. **Halaman progres** menampilkan:
   - Header: Nama anak, usia (dihitung dari DOB), badge status program (Aktif/Selesai).
   - Ringkasan: total sesi (dijalani / total paket), terapis, kondisi awal.
   - **Timeline progres**: kartu-kartu dari `progress_notes` (yang `is_shared=true`), urutan terbaru.
   - **Grafik metric (opsional)**: jika `metrics` JSON berisi angka periodik (mis. skor kemampuan bicara 0–100), tampilkan line chart.
   - **Jadwal berikutnya**: 3 sesi upcoming (`sessions.scheduled_at`).
   - Tombol "Hubungi Terapis via WA" (prefilled dengan `Halo, saya orang tua dari <nama anak> (RM <no>) …`).
   - Tombol "Sign out" (hapus token lokal).

### 3.3 UI Detail
- Layout single column, mobile-first (mayoritas akses dari HP).
- Aksen warna brand; ilustrasi lembut untuk state kosong.
- Fallback: jika belum ada `progress_notes`, tampilkan pesan "Terapis Anda akan menulis catatan progres setelah beberapa sesi pertama."
- Aksesibilitas: label form jelas, `inputmode="numeric"` untuk OTP, focus management setelah OTP terverifikasi.

### 3.4 Keamanan
- OTP 6 digit numerik, kadaluarsa 10 menit, hanya 1 aktif per RM.
- Rate limit 5 percobaan OTP; 3 kali salah → invalidate & user harus request ulang.
- `progress_token`:
  - JWT ditandatangani Edge Function (secret di env).
  - Claim: `child_id`, `iat`, `exp` (30 menit).
  - Disimpan client di `sessionStorage` (bukan localStorage) → hilang saat tab ditutup.
- Data yang tampil **selalu** melewati filter `is_shared=true`. Rekam medis lengkap tidak pernah dikirim ke endpoint publik ini.
- Log akses (`activity_logs`) mencatat setiap request OTP & snapshot untuk audit.

### 3.5 Alur Terapis Membuat Progress Note (di Dashboard)
1. Terapis membuka Rekam Medis pasien → catatan sesi terbaru.
2. Klik "Buat Ringkasan Progress untuk Orang Tua".
3. Form muncul dengan:
   - Judul (default: "Catatan Sesi #{n}").
   - Ringkasan yang aman & positif untuk orang tua (contoh: "Ananda menunjukkan peningkatan fokus 30% dari sesi sebelumnya.").
   - Opsional: input metric (skor / capaian) dalam format terstruktur.
   - Checkbox: **"Publikasikan ke halaman Progress"** (`is_shared=true`).
4. Simpan → muncul di `/progress` orang tua.

### 3.6 Kriteria Terima
- Orang tua yang tahu RM + nama anak bisa melihat progres dalam < 1 menit.
- Percobaan brute force RM/OTP dibatasi rate limit dan tidak membocorkan data.
- Terapis dapat mempublikasikan progress note dalam < 30 detik dari catatan sesi biasa.
- Tidak ada rekam medis lengkap yang bocor ke publik.

---

## 4. Perubahan Kecil Lainnya (Konsolidasi)

- Navbar: Item menu final = **Beranda • Layanan • Tim • About • Info Kunjungan • Progress**. Hapus **Pricing**, **Blog**, **Kontak** (info kontak sudah di Info Kunjungan & Footer).
- Metadata OG image: ganti dengan versi logo transparan pada background brand.
- Konstanta di `config/constants.ts`:
  ```ts
  export const BRAND_NAME = 'FlourishCare.id';
  export const CONTACT_EMAIL = 'Flourishcare.id@gmail.com';
  export const CLINIC_NAME = 'Klinik Mitra Diani';
  export const CLINIC_ADDRESS = 'Klinik Mitra Diani Lantai 2, Jl. PKP Raya No.1, Kelapa Dua Wetan, Ciracas, Jakarta Timur';
  export const CLINIC_MAPS_URL = 'https://maps.google.com/?q=Klinik+Mitra+Diani+Kelapa+Dua+Wetan';
  export const SOCIAL = {
    instagram: 'https://instagram.com/flourishcare.id',
    threads:   'https://threads.net/@flourishcare.id',
    tiktok:    'https://tiktok.com/@flourishcare.id',
  };
  export const BOOKING_ONLINE_URL = 'https://book.flourishcare.id/'; // subdomain (opening soon)
  export const BOOKING_ONLINE_STATUS = 'coming_soon'; // 'coming_soon' | 'live'
  ```
- Hapus konstanta radius home-visit (`HOME_VISIT_RADIUS_KM`) — tidak dipakai lagi.
- Hapus / arsipkan halaman & komponen: `Booking wizard steps` lama, `/pricing`.

---

## 5. Roadmap Diperbarui (Menggantikan §4 di `08-…`)

### Fase 0 — Housekeeping (2-3 hari)
- Setup ESLint + Prettier + Husky + strict TypeScript.
- Hapus dependency tidak dipakai + logo transparan.
- Konstanta baru di `config/constants.ts`.
- `lang="id"` di `index.html`.

### Fase 1 — Scope Trim & Content Update (3-5 hari)
- Hapus wizard Booking, hapus halaman Pricing.
- Refactor `Booking.tsx` menjadi halaman "Info Kunjungan" dengan 4 kartu layanan.
- Update Homepage per §1.1 (hapus 3 kartu, ubah "5→4 Jenis Terapi", hilangkan section home visit, ringkas How It Works).
- Update Services (hapus home visit).
- Update Team menjadi 2 orang.
- Update Footer (sosial baru, kontak baru, hapus quick links & layanan, hapus WA).
- Nav menu final tanpa Pricing/Blog/Kontak.

### Fase 2 — Foundation Backend (1 minggu)
- Env var + AuthProvider + ProtectedRoute + logout signOut.
- Migration SQL: `branches`, `profiles`, `staff_profiles`, `parents`, `children (+rm_number)`, `bookings`, `sessions`, `medical_records`, `attendance_logs`, `leave_requests`, `activity_logs`, `notifications`, plus tabel baru **`progress_notes`**, **`progress_access_otp`**.
- Seed: 1 branch (Klinik Mitra Diani), 2 staff_profiles (Achla, Rofanny), 1 super_admin.
- RLS untuk semua tabel.

### Fase 3 — Progress Layanan (1-1,5 minggu)
- Halaman publik `/progress` (form RM+nama → OTP → snapshot).
- Edge Functions: `progress_request_otp`, `progress_verify_otp`, `progress_snapshot`.
- Dashboard: tombol "Buat Progress Note" di Rekam Medis + tab "Progress" untuk staf.
- Kirim OTP via WhatsApp Cloud API (atau email sebagai fallback saat WA belum onboard).

### Fase 4 — Dashboard Data Nyata (2-3 minggu)
- Booking manual admin (form "Tambah Kedatangan"), Jadwal kalender, Pasien CRUD, Rekam Medis editor, Keuangan report, Pengaturan (branch/user/pricing internal).
- Presensi & Cuti (face API + geolocation opsional; untuk on-site cukup clock-in/out sederhana).

### Fase 5 — Polish & Launch (1-2 minggu)
- Error boundary + Sentry + toast.
- Vitest + Playwright test (login, `/progress` flow, admin booking).
- SEO + meta + sitemap.
- Halaman legal (privacy UU PDP + terms).
- Lighthouse ≥ 90.

### Fase 6 — Subdomain Booking Online (paralel, terpisah)
- Bangun `https://book.flourishcare.id/` untuk konsultasi psikolog online.
- Jadwal dokter → slot Zoom/Meet auto-generated.
- Payment gateway (Midtrans/Xendit).
- Setelah live, `BOOKING_ONLINE_STATUS = 'live'` di konstanta → tombol di halaman Info Kunjungan berubah dari "Opening Soon" menjadi CTA aktif.

---

## 6. Item yang Perlu Konfirmasi Stakeholder

Beberapa titik saya interpretasi karena catatan review ringkas. Mohon konfirmasi untuk memastikan implementasi tepat:

| # | Interpretasi Saya | Konfirmasi? |
|---|---|---|
| Q-1 | "Dihapus Dulu aja / Hapus poin 2-4" = hapus langkah 2-4 di section How It Works Homepage (sisakan langkah 1 & 5). | Ya / Tidak |
| Q-2 | Menu Navbar "Booking" tetap ada dengan URL `/booking` namun konten baru = Info Kunjungan; alternatif: ubah label menjadi "Info Kunjungan" atau "Kunjungi Klinik". | Pilih label |
| Q-3 | Halaman `/progress` — akses OTP saya interpretasikan agar aman; alternatif lebih longgar: cukup RM + nama tanpa OTP. | OTP wajib? |
| Q-4 | Data 4 anggota tim (Ukhtina, Budi, Rina, Andi) benar-benar dihapus, bukan disembunyikan (`is_visible=false`). | Hapus permanen? |
| Q-5 | Tabel harga tetap disimpan di DB untuk kalkulasi internal / admin walau tidak muncul di publik. | Setuju? |
| Q-6 | Icon "Threads" & "TikTok" — pastikan akun sudah tersedia; jika belum, sembunyikan sementara. | URL akun? |

Setelah 6 poin ini diklarifikasi, developer bisa langsung eksekusi Fase 0–Fase 1 dalam ≤ 1 minggu.
