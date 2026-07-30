# 08 — Code Review & Remediation Roadmap

**Produk:** FlourishCare.id
**Versi:** 1.0
**Cakupan:** Ringkasan temuan code review atas commit MVP saat ini + rencana perbaikan bertahap.

Catatan konteks: MVP saat ini adalah **UI-first**. Visual matang (Tailwind v4, framer-motion, layout responsive), tetapi **90% fitur data-nya masih mock/dummy**. Satu-satunya integrasi Supabase yang berfungsi adalah `signInWithPassword`; tombol "Selesaikan Pembayaran" di booking wizard adalah dead-end.

Dokumen ini menggantikan slot "08-Laravel-Project-Blueprint.md" di template acuan — karena stack yang aktual adalah React SPA + Vercel + Supabase, bukan Laravel. Yang paling berguna sebagai acuan pengembangan ke depan adalah **peta jalan perbaikan berbasis temuan review**.

---

## 1. Ringkasan Eksekutif

**Status codebase:** Prototype UI matang, backend fungsional 10%.

**3 prioritas paling mendesak sebelum demo stakeholder:**
1. Booking wizard tidak menyimpan data — flagship feature tidak berfungsi.
2. `/dashboard` tanpa auth guard — siapa pun bisa membuka via URL.
3. Foto tim menggunakan stock photo Unsplash yang bukan orang sungguhan — risiko hukum & reputasi.

**3 prioritas arsitektural sebelum production launch:**
1. Rancang & terapkan skema DB + RLS di Supabase (lihat `04-Database-Architecture.md`).
2. Pindahkan kredensial ke env vars; buang `GEMINI_API_KEY` dari `vite.config.ts`; buang dependency yang tidak dipakai (`@google/genai`, `express`, `dotenv`, `tsx`).
3. Tambah `AuthProvider` + `ProtectedRoute` + `useAuth` + RLS role sebenarnya (gantikan dropdown "Preview Role").

---

## 2. Temuan Kritis (Harus Fix Sebelum Launch)

### 2.1 Security — Critical
| # | Temuan | File / Baris | Rekomendasi |
|---|---|---|---|
| S-01 | Supabase URL + anon key hardcoded & di-commit | `src/lib/supabase.ts:3-4` | Pindah ke `import.meta.env.VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`; rotasi key setelahnya. |
| S-02 | `GEMINI_API_KEY` di-bundle ke client via `define` | `vite.config.ts:11` | Hapus baris `define`; jika kelak butuh Gemini, panggil dari Edge Function. |
| S-03 | Route `/dashboard` tanpa guard | `src/App.tsx:30` | Bungkus dengan `<ProtectedRoute>` yang cek session Supabase; redirect ke `/login?redirect=...` jika belum login. |
| S-04 | Logout hanya `navigate("/")` — session tetap hidup | `src/pages/Dashboard.tsx:120-122` | Panggil `supabase.auth.signOut()` sebelum navigate; clear query cache. |
| S-05 | Role admin hanya client-side dropdown | `src/pages/Dashboard.tsx` (state `currentRole`) | Ambil role dari `profiles.role` di Supabase; tegakkan otorisasi via RLS. |
| S-06 | Foto tim = stock photo Unsplash meski nama dan gelar terlihat nyata | `src/pages/Team.tsx:29-59` | Ganti dengan foto asli. Kalau belum ada, gunakan ilustrasi netral berlabel jelas. |
| S-07 | Hotlink gambar Pinterest (termasuk logo) | Homepage, Footer, Login, Dashboard, dsb. | Pindahkan seluruh aset ke Supabase Storage (`brand-assets`, `gallery`). |
| S-08 | `console.error("Login error:", err)` bocor detail | `src/pages/Login.tsx:31` | Ganti dengan pesan generic untuk user; kirim detail ke Sentry (bukan console). |

### 2.2 Correctness — Critical
| # | Temuan | File / Baris | Rekomendasi |
|---|---|---|---|
| C-01 | Tombol "Selesaikan Pembayaran" tanpa `onClick` — booking tidak pernah dikirim ke mana-mana | `src/pages/Booking.tsx:212-224` | Implement flow `booking_intake` Edge Function → Midtrans Snap → webhook. |
| C-02 | Slot "13:00 - 14:00 (Penuh)" tetap dapat dipilih | `src/pages/Booking.tsx:471-474` | Filter dari `booking_availability` RPC + `disabled` pada tombol yang penuh. |
| C-03 | Tanggal hardcoded `todayStr = "2026-04-18"` | `src/pages/Dashboard.tsx:74-81` | Ganti `new Date().toISOString().slice(0,10)`; format via `Intl.DateTimeFormat` locale `id-ID`. |
| C-04 | `window.innerWidth` dievaluasi inline di render (tidak reactive terhadap resize) | `src/pages/Dashboard.tsx:130` | Ganti dengan hook `useMediaQuery('(min-width: 1024px)')`. |
| C-05 | Fetch Curator ketat `posts.length === 5` — gagal kalau feed return 3 atau 4 | `src/pages/Homepage.tsx:71` | Cukup `posts.length > 0`; ambil `slice(0,5)`. |
| C-06 | Tombol "Full Gallery" tanpa link (dead button) | `src/pages/Homepage.tsx:498-502` | Beri `to="/galeri"` atau anchor `#galeri`. |
| C-07 | Semua link footer Layanan = `#` | `src/components/Footer.tsx:63` | Arahkan ke `/services#<anchor>`. |
| C-08 | Dead code `menuItems` di Navbar berisi "Blog"/"Kontak" yang tidak ada halamannya | `src/components/Navbar.tsx:10` | Hapus dead array; sembunyikan menu hingga halaman siap. |
| C-09 | Nomor WA `phone.replace(/[^0-9]/g, '')` tanpa prefix negara — nomor `0812...` tidak valid untuk `wa.me` | `src/pages/Dashboard.tsx:347` | Normalize: jika mulai `0`, ganti `62`. |
| C-10 | Handler Logout tidak signOut | `src/pages/Dashboard.tsx:120` | Lihat S-04. |
| C-11 | `bookings: any` di state — kompilasi strict akan error | `src/pages/Dashboard.tsx:526-538` | Tambah tipe `Booking` di `features/dashboard/types.ts`. |
| C-12 | Camera cleanup effect kadang null → stream menggantung | `src/pages/Dashboard.tsx:768-776` | Simpan `stream` di ref, stop di return function. |

### 2.3 Copywriting Inconsistency
| # | Temuan | Rekomendasi |
|---|---|---|
| K-01 | Alamat: Footer = Jakarta Selatan; Dashboard Settings = Surabaya | Satu sumber: tabel `branches`. Fallback default konstan di `config/constants.ts`. |
| K-02 | Radius home-visit: Homepage = 15 km; Services/Booking/Homepage lain = 10 km | Ambil dari `branches.radius_km`; standarisasi copywriting 10 km. |
| K-03 | `<html lang="en">` padahal seluruh konten Bahasa Indonesia | Ubah ke `lang="id"` di `index.html`. |

---

## 3. Temuan High (Fix di Fase 1-2)

### 3.1 Kualitas Kode
- `Dashboard.tsx` 1073 baris — pecah per tab ke `features/dashboard/views/*`.
- `Booking.tsx` 27 KB — pecah 6 step ke `features/booking/steps/*`; ekstrak schema Zod.
- Variasi `fadeUp` di-copy-paste di 6 file → satu file `src/lib/motion.ts`.
- Logo brand di-hardcode 4 tempat → komponen `<Logo />`.
- Nomor WA `628175028099` hardcoded 6+ tempat → `import { WA_NUMBER } from '@/config/constants'`.
- `any` bertebaran di semua step Booking dan Dashboard.

### 3.2 Dependency Hygiene
- Hapus: `@google/genai`, `express`, `@types/express`, `dotenv`, `tsx`, `autoprefixer` (tidak diperlukan Tailwind v4).
- Pilih satu: `framer-motion` atau `motion` (bukan keduanya). Rekomendasi: `framer-motion` (yang sudah di-import di kode).

### 3.3 Aksesibilitas
- Hamburger button Navbar tanpa `aria-label`, `aria-expanded`, `aria-controls`.
- Foto tim grayscale → warna hanya on `hover` (tidak keyboard-accessible) — tambahkan `focus-visible`.
- Modal Booking & Reschedule tanpa focus trap, `role="dialog"`, `aria-modal`, restore focus.
- Kontras `text-text-secondary` (#9A6C5D) di atas background marginal.
- Label form tidak ter-`htmlFor` ke `id` input.

### 3.4 Performance
- Semua gambar external tanpa `loading="lazy"` dan `width`/`height` → CLS buruk.
- Fonts di-import via `@import url(...)` blocking di `index.css` → pindah ke `<link rel="preconnect">` + `<link rel="stylesheet">` di `index.html`.
- Tidak ada code splitting per route → semua page dimuat sekaligus.
- Curator fetch tanpa cache/retry/AbortController.

---

## 4. Roadmap Perbaikan Bertahap

### Fase 0 — Housekeeping (1-2 hari)
- [ ] Setup ESLint + Prettier + Husky + lint-staged.
- [ ] Aktifkan `tsc strict`.
- [ ] Hapus dependency tidak dipakai (S-08.dep list).
- [ ] Ubah `lang="id"`, ganti hardcoded konstanta ke `config/constants.ts`.
- [ ] Tambah `.env.example` yang benar (Supabase + WA + Curator, hapus GEMINI).

### Fase 1 — Foundation (1 minggu)
- [ ] Env var: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (S-01). Rotasi anon key.
- [ ] Hapus `define` GEMINI dari `vite.config.ts` (S-02).
- [ ] `AuthProvider`, `useAuth`, `ProtectedRoute` (S-03).
- [ ] Logout memanggil `signOut()` (S-04).
- [ ] Pecah `Dashboard.tsx` per tab.
- [ ] Header CSP + security headers Vercel.

### Fase 2 — Data Layer & Booking (2-3 minggu)
- [ ] Migration SQL untuk seluruh tabel (`04-Database-Architecture.md`).
- [ ] Enable RLS + policy untuk semua tabel.
- [ ] Seed data awal: 1 branch, 6 staff_profiles, pricing default, 1 super_admin.
- [ ] React Query provider + `features/*/api.ts`.
- [ ] Booking `POST /functions/v1/booking_intake` + Midtrans Snap integration.
- [ ] Payment webhook → update status.
- [ ] Kirim konfirmasi email + WA (WhatsApp Cloud API atau CS manual sementara).
- [ ] Ganti foto tim + logo + gambar hero ke Supabase Storage.

### Fase 3 — Dashboard Real Data (2-3 minggu)
- [ ] KPI Overview dari RPC `dashboard_kpis`.
- [ ] Booking tab: list dari `bookings`; aksi konfirmasi/reschedule/cancel.
- [ ] Jadwal tab: kalender minggu (FullCalendar / react-big-calendar) dari `sessions`.
- [ ] Pasien tab: CRUD `children` + drawer detail.
- [ ] Rekam Medis tab: editor markdown + attachment upload.
- [ ] Keuangan tab: laporan dari `payments`; export CSV.
- [ ] Pengaturan tab: CRUD branches, users, pricing.

### Fase 4 — Presensi & Cuti Nyata (1-2 minggu)
- [ ] Face API (client-side face-api.js) + registrasi wajah staf.
- [ ] Geolocation validation home-visit + hitung jarak.
- [ ] Insert `attendance_logs` sungguhan.
- [ ] Alur cuti: insert → notifikasi → approve → booking terdampak.

### Fase 5 — Polish (1-2 minggu)
- [ ] Error boundary root + Sentry.
- [ ] Toast system (react-hot-toast atau sonner).
- [ ] Vitest + Playwright test dasar (booking + login).
- [ ] Lighthouse CI ≥ 90.
- [ ] Analytics Vercel + event tracking.
- [ ] SEO: meta, OG, sitemap, robots, structured data.
- [ ] Halaman legal: privacy policy (UU PDP), terms.

### Fase 6 — Post-Launch (Roadmap)
- [ ] Parent portal (login orang tua, progres, unduh laporan).
- [ ] Chat in-app parent–terapis.
- [ ] Reminder H-1 otomatis via WA API.
- [ ] Multi-cabang penuh.
- [ ] Video call built-in untuk psikolog online.

---

## 5. Daftar Aksi "Hari Ini" (Quick Wins < 1 jam)

Yang bisa langsung di-commit hari ini tanpa banyak dependensi:

1. Ubah `<html lang="en">` → `lang="id"` di `index.html`.
2. Hapus dependency tidak dipakai dari `package.json` (`@google/genai`, `express`, `@types/express`, `dotenv`, `tsx`).
3. Ekstrak konstanta: `WA_NUMBER`, `BRAND_NAME`, `HOME_VISIT_RADIUS_KM = 10`, `LOGO_URL` ke `src/config/constants.ts` dan gunakan di semua tempat.
4. Standarisasi radius home-visit ke 10 km (perbaiki Homepage yang menulis 15 km).
5. Hapus dead code `menuItems` di Navbar.
6. Tambah `to` untuk tombol "Full Gallery" Homepage.
7. Nonaktifkan tombol slot "Penuh" di Booking.
8. Ganti `todayStr` hardcoded dengan `new Date()`.
9. Hapus `console.error` login (S-08).
10. Rename `<html>` title tanpa emoji 🌱 (beberapa browser memotong).

---

## 6. Metrik Keberhasilan Remediation

| Metrik | Baseline | Target Akhir Fase 5 |
|---|---|---|
| Lighthouse Perf (Homepage) | belum diukur | ≥ 90 |
| Lighthouse A11y (semua public) | belum diukur | ≥ 95 |
| Test coverage `features/booking` | 0% | ≥ 70% |
| E2E flow booking sampai success | ❌ | ✅ (Playwright) |
| Dashboard tab dengan data nyata | 0/8 | 8/8 |
| Dependency tidak terpakai | 5 | 0 |
| Hardcoded credential | 2 (Supabase URL, key) | 0 |
| Route publik tanpa loading state | banyak | 0 |
| Halaman legal (privacy, terms) | 0 | 2 |

---

## 7. Risiko & Mitigasi Selama Remediasi

| Risiko | Mitigasi |
|---|---|
| Refactor Dashboard sekaligus → PR raksasa & merge conflict | Pecah per tab, satu PR per tab; feature flag jika perlu |
| Migrasi env-var memaksa deploy Supabase URL baru | Rotasi anon key setelah semua env-var di Vercel siap; deploy semua environment sekaligus |
| Foto tim asli belum ada | Gunakan ilustrasi netral berlabel jelas sementara; jangan gunakan stock person photo |
| Payment gateway (Midtrans) butuh onboarding & KYC | Mulai onboarding paralel dengan Fase 1 supaya siap saat Fase 2 |
| UU PDP compliance (data anak) | Konsultasi legal, siapkan consent form + privacy policy sebelum menerima data nyata |

---

## 8. Kesimpulan

Codebase ini adalah fondasi visual yang bagus dan siap dipromosikan menjadi produk sungguhan dengan disiplin arsitektur. Perbaikan yang paling banyak ROI adalah **memasang backend Supabase yang benar-benar dipakai** — begitu booking bisa disimpan, dashboard menampilkan data nyata, dan RBAC aman, produk siap dilihat pengguna sungguhan. Roadmap 5 fase di atas dirancang untuk mencapai kondisi itu dalam 6-9 minggu kerja fokus.

Rujuk dokumen-dokumen lain di paket ini sesuai keperluan:
- Perilaku detail per halaman → `03-Functional-Specification.md`
- Perilaku detail dashboard → `05-Admin-Panel-Specification.md`
- Skema DB & RLS → `04-Database-Architecture.md`
- Kontrak API → `06-REST-API-Specification.md`
- Standar coding → `07-Engineering-Guidelines.md`
- Konteks bisnis → `01-PRD.md`
- Arsitektur sistem → `02-Software-Architecture.md`
