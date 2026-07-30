# 05 — Admin Panel Specification

**Produk:** FlourishCare.id — Internal Dashboard (`/dashboard`)
**Versi:** 1.0
**Sumber:** Struktur tab & role diambil dari implementasi `src/pages/Dashboard.tsx` saat ini, kemudian di-spec ulang untuk versi production.

---

## 1. Peran & Matriks Akses

| Tab | Super Admin | Admin Cabang | Psikolog | Terapis | Karyawan |
|---|---|---|---|---|---|
| Overview | ✓ | ✓ | ✓ | ✓ | ✓ |
| Booking | ✓ | ✓ | – | – | – |
| Jadwal | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pasien | ✓ | ✓ | ✓ | ✓ | – |
| Rekam Medis | ✓ | – | ✓ | – | – |
| Keuangan | ✓ | ✓ | – | – | – |
| Presensi | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pengaturan | ✓ | – | – | – | – |

Client-side men-render menu sesuai role dari `profiles.role`. Ditegakkan juga di RLS di database.

---

## 2. Layout

- Sidebar kiri (collapsible di layar `< lg`): logo, menu, profil user + tombol Logout.
- Header top: judul tab aktif, breadcrumbs, notifikasi bell (jumlah unread).
- Konten utama: view aktif.
- Semua tab deep-linkable: `/dashboard/overview`, `/dashboard/booking`, dst.

---

## 3. Tab: Overview

### 3.1 Komponen
- **4 KPI cards:**
  - Total Pasien Aktif — count `children` yang punya `sessions.status='scheduled'` dalam 30 hari.
  - Sesi Hari Ini — count `sessions` where `date(scheduled_at) = today`.
  - Pendapatan Bulan Ini — sum `payments.amount` where `status='paid'` and month = current (hanya untuk super_admin & admin_cabang).
  - Tingkat Kehadiran — persentase `sessions.status='completed'` dari total sesi minggu ini.
- **Panel Notifikasi Cuti** (admin/super_admin) — muncul jika `leave_requests.status='pending'` ada. Tombol "Setujui" / "Tolak". Menampilkan booking yang terdampak (sesi terapis pada rentang tanggal cuti) + tombol "Tawarkan Reschedule via WA".
- **Panel Aktivitas Terbaru** — 10 baris `activity_logs` terkini (booking baru, payment, medical record).
- **Panel Jadwal Terdekat** — 5 sesi berikutnya dari `sessions` untuk user (terapis) atau branch (admin).

### 3.2 Aksi
- Setujui cuti → `update leave_requests set status='approved'`. Trigger: buat notifikasi ke staff dan admin lain.
- Reschedule via WA → generator deep link `https://wa.me/<parent_wa>?text=<pesan pre-filled>`.

---

## 4. Tab: Booking

### 4.1 View Daftar
- Tabel: kode, anak, orang tua, layanan, terapis, tanggal & jam, status (badge warna), aksi.
- Filter: status, layanan, rentang tanggal, terapis, branch (super_admin).
- Search: kode, nama anak, nomor WA.
- Sort: default `created_at desc`.
- Realtime badge "Baru!" untuk booking `< 10 menit`.

### 4.2 Aksi Baris
- **Detail** → drawer kanan menampilkan seluruh info booking + payment + sesi.
- **Konfirmasi** → set `bookings.status='confirmed'`, generate `sessions` sesuai paket.
- **Reschedule** → modal pilih tanggal & jam baru; slot bentrok dengan `sessions.therapist_id + scheduled_at` di-disable.
- **Batalkan** → set `bookings.status='cancelled'`, isi alasan, refund policy notif ke Keuangan.
- **Reassign terapis** → dropdown terapis yang punya `therapy_types` cocok.

### 4.3 Kriteria Terima
- Perubahan status tercatat di `activity_logs`.
- Notifikasi WA/email otomatis ke orang tua untuk konfirmasi, reschedule, dan cancel.

---

## 5. Tab: Jadwal

### 5.1 Tampilan
- Kalender mingguan (Sun–Sat) untuk semua terapis di branch (admin), atau kalender pribadi (terapis).
- Drag-and-drop sesi antar slot (admin only) untuk reschedule cepat.
- Toggle: Harian / Mingguan / Bulanan.
- Warna berdasarkan jenis terapi (TW/SI/OT/BT/konsultasi).

### 5.2 Aksi
- Klik slot kosong → "Tambah Jadwal" (untuk booking existing atau blok waktu).
- Klik sesi → drawer detail (anak, orang tua, catatan sesi, lokasi).
- Filter: terapis, jenis terapi, mode (onsite/homevisit).

---

## 6. Tab: Pasien

### 6.1 Daftar
- Tabel: kode (FC-###), nama anak, tanggal lahir/usia, orang tua, layanan aktif, terapis penanggung jawab, status (aktif / selesai).
- Filter role visibility: Terapis hanya melihat pasien miliknya; admin & super_admin melihat semua di branch.
- Search: kode, nama anak, nomor WA orang tua.

### 6.2 Detail (`/dashboard/pasien/:id`)
- Tab dalam: Ringkasan, Rekam Medis (jika role diizinkan), Riwayat Sesi, Riwayat Booking, Riwayat Payment.
- Aksi: edit data anak (admin), tandai selesai program.

---

## 7. Tab: Rekam Medis

### 7.1 Layout master-detail
- Kiri: daftar pasien (pencarian, filter).
- Kanan: catatan medis pasien terpilih dalam urutan waktu terbalik.

### 7.2 Aksi
- **Tambah Catatan Baru** (psikolog & super_admin): editor markdown/richtext, lampiran (PDF, gambar) → simpan ke `medical_records` + `medical-attachments` bucket.
- **Edit** — hanya oleh author asli dalam 24 jam pasca simpan; setelah itu revisi via catatan baru.
- **Export PDF** — laporan progres pasien.
- Trigger reminder: setelah `sessions.status='completed'`, sistem cek apakah ada `medical_records.session_id = <id>`. Jika tidak, munculkan reminder di dashboard terapis.

### 7.3 Visibility
- Default `restricted` = hanya author + super_admin.
- Author bisa set `branch` = semua psikolog/terapis di branch bisa melihat (untuk kolaborasi).

---

## 8. Tab: Keuangan

### 8.1 View
- **KPI cards:** Pendapatan Bulan Ini, Piutang (booking `awaiting_confirmation` dengan payment `pending`), Refund Bulan Ini.
- **Grafik line** pendapatan 12 bulan (Recharts).
- **Tabel Transaksi:** tanggal, kode booking, orang tua, metode, jumlah, status, aksi.
- **Filter:** rentang tanggal, metode, status, branch.
- **Export CSV / XLSX.**

### 8.2 Aksi
- Detail transaksi → drawer dengan raw response gateway (super_admin only).
- Refund manual (super_admin) — trigger Edge Function ke Midtrans.
- Rekonsiliasi bulanan (roadmap): match `payments.paid_at` dengan mutasi bank.

---

## 9. Tab: Presensi

### 9.1 UI
- Sisi kiri: kamera live dengan overlay wajah + tombol "Scan Wajah".
- Sisi kanan: toggle mode (On-Site / Home Visit).
  - **On-Site:** dua tombol "Clock In" & "Clock Out".
  - **Home Visit:** input nama pasien + tombol "Mulai Sesi" & "Selesai Sesi".
- Tabel log presensi hari ini.
- Form Pengajuan Cuti (psikolog & terapis): tanggal mulai, tanggal selesai, alasan → insert `leave_requests`.

### 9.2 Verifikasi
- Face recognition menggunakan `face-api.js` (client-side) atau AWS Rekognition (server-side) — pilih based on privasi & biaya.
- Perbandingan dengan `staff_profiles.photo_url` yang diregister; threshold `face_score >= 0.85`.
- Geolokasi (via `navigator.geolocation`) wajib untuk mode home-visit; hitung jarak ke titik target (dari `sessions.location_address` di-geocode). Toleransi ≤ 100 m.
- Snapshot foto verifikasi disimpan ke bucket `attendance-snapshots` (privat).
- Data yang tersimpan: `staff_id`, `type`, `mode`, `session_id`, `logged_at`, `latitude`, `longitude`, `distance_m`, `face_score`, `photo_url`.

### 9.3 Aksi Cuti
- Setelah submit, notifikasi masuk ke Overview admin/super_admin.
- Setelah disetujui, sesi terjadwal pada rentang cuti di-tandai `needs_reschedule=true` (kolom tambahan) dan muncul di banner admin.

---

## 10. Tab: Pengaturan (Super Admin)

### 10.1 Sub-section
- **Cabang** — CRUD `branches` (nama, alamat, kota, kontak, koordinat, radius home-visit).
- **Pengguna & Role** — daftar `profiles`; ubah role, aktif/nonaktif, reset password (kirim link email).
- **Staff Profile Publik** — CRUD `staff_profiles` (foto, spesialisasi, STR, visibility).
- **Pricing** — CRUD tabel harga (langsung mempengaruhi halaman Pricing publik).
- **Notifikasi** — template pesan WA/email (booking confirm, reminder, cancel).
- **Audit Log** — tabel `activity_logs` dengan filter.

### 10.2 Aksi Bahaya
- Setiap aksi mutasi user & pricing memicu banner konfirmasi + tercatat di audit log.
- Delete user diganti "nonaktifkan" (soft) — hindari kehilangan riwayat.

---

## 11. Notifikasi (Bell di Header)

- Sumber: tabel `notifications`.
- Kategori: booking_new, booking_cancelled, payment_paid, leave_request, medical_record_missing.
- Klik notifikasi → deep-link ke entitas terkait.
- Realtime via Supabase Realtime channel `notifications:role:<role>` + `notifications:user:<uid>`.

---

## 12. Kriteria Non-Fungsional Dashboard

- Setiap load view ≤ 500 ms (dari cache React Query).
- Tabel besar (Booking, Keuangan) menggunakan pagination server-side (page size 25).
- Aksi mutasi optimis (React Query `useMutation` dengan `onMutate`/`onError` rollback).
- Semua tombol destructive membutuhkan konfirmasi eksplisit.
- Screen `< 640 px` (mobile) tetap dapat digunakan — sidebar berubah menjadi drawer, tabel menjadi list card.

---

## 13. Peta Sub-Route

```
/dashboard
├── overview
├── booking
│   └── :id                (drawer/side-page)
├── jadwal
├── pasien
│   └── :id
├── rekam-medis
│   └── :childId
├── keuangan
├── presensi
└── pengaturan
    ├── cabang
    ├── pengguna
    ├── staff-profile
    ├── pricing
    ├── notifikasi
    └── audit-log
```

---

## 14. Kriteria Terima Dashboard v1

- Semua tab menampilkan data nyata dari Supabase (tidak ada mock).
- RBAC ditegakkan client (menu hidden) + server (RLS).
- Realtime notifikasi booking baru berfungsi dalam 5 detik.
- Presensi mencatat `face_score` dan koordinat; tersimpan di DB dan bisa dilihat admin.
- Cuti disetujui → banner reschedule muncul dengan daftar booking terdampak.
- Logout memutus session (`supabase.auth.signOut()`), user tidak bisa kembali dengan tombol back.
