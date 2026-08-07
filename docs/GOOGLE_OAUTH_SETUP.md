# Setup Google OAuth untuk FlourishCare

Panduan mengaktifkan login "Sign in with Google" di `flourishcare.id` dan `book.flourishcare.id`. Sekali setup, kedua domain otomatis pakai konfigurasi yang sama karena Supabase Auth adalah single source of truth.

Estimasi waktu: 15 menit.

## Langkah 1: Buat Project di Google Cloud

1. Buka https://console.cloud.google.com
2. Kalau belum punya project, klik dropdown project di header → **New Project**
3. Nama: `FlourishCare` (atau bebas)
4. Klik **Create**, tunggu ~10 detik sampai project aktif

## Langkah 2: Configure OAuth Consent Screen

1. Menu kiri (☰) → **APIs & Services → OAuth consent screen**
2. Pilih **External** → **Create**
3. Isi form:
   - **App name:** `FlourishCare.id`
   - **User support email:** `Flourishcare.id@gmail.com`
   - **App logo:** upload logo FlourishCare (`public/logo.png` di project Anda) — opsional tapi profesional
   - **App domain:**
     - Application home page: `https://flourishcare.id`
     - Application privacy policy: `https://flourishcare.id/privacy` (kalau belum ada, isi kosong dulu)
     - Application terms of service: `https://flourishcare.id/terms` (idem)
   - **Authorized domains:** tambah `flourishcare.id` (Google auto-cover subdomain)
   - **Developer contact:** email Anda
4. Klik **Save and Continue**
5. **Scopes** — biarkan default (email, profile, openid) → **Save and Continue**
6. **Test users** — untuk sekarang tambahkan email Anda + email tester → **Save and Continue**
7. Review → **Back to Dashboard**

**Catatan:** App masih dalam mode "Testing". User di luar test users tidak bisa login sampai app di-publish. Setelah siap production, klik **Publish App** di halaman OAuth consent screen. Google akan minta review kalau minta scope sensitif, tapi untuk email/profile default TIDAK butuh review.

## Langkah 3: Buat OAuth 2.0 Client ID

1. Menu kiri → **APIs & Services → Credentials**
2. Klik **+ Create Credentials → OAuth client ID**
3. **Application type:** `Web application`
4. **Name:** `FlourishCare Web`
5. **Authorized JavaScript origins** — tambah 3 baris:
   ```
   https://flourishcare.id
   https://book.flourishcare.id
   http://localhost:3000
   ```
   (localhost untuk dev lokal)
6. **Authorized redirect URIs** — tambah 1 baris (paling penting):
   ```
   https://vtquhqdfyirccxdzmpyr.supabase.co/auth/v1/callback
   ```
7. Klik **Create**
8. Popup muncul dengan **Client ID** dan **Client Secret** — copy keduanya

## Langkah 4: Aktifkan di Supabase

1. Buka https://supabase.com/dashboard/project/vtquhqdfyirccxdzmpyr/auth/providers
2. Cari **Google** → klik untuk expand
3. Toggle **Enable Sign in with Google** ke ON
4. Paste:
   - **Client ID (for OAuth)**: dari langkah 3
   - **Client Secret (for OAuth)**: dari langkah 3
5. **Redirect URL** yang ditampilkan Supabase harus persis sama dengan yang Anda daftarkan di Google. Copy dari sini kalau perlu update di Google.
6. Klik **Save**

## Langkah 5: Set Site URL & Redirect URLs

Masih di Supabase → **Authentication → URL Configuration**:

- **Site URL:** `https://flourishcare.id`
- **Redirect URLs** (whitelist, satu per baris):
  ```
  https://flourishcare.id/**
  https://book.flourishcare.id/**
  http://localhost:3000/**
  ```

Klik **Save**.

## Langkah 6: Test

1. Buka `https://book.flourishcare.id/signup` (atau `?book=1` sementara subdomain belum aktif)
2. Klik **Lanjutkan dengan Google**
3. Popup Google muncul → pilih akun → **Allow**
4. Harus redirect balik ke `/book/profile` dalam keadaan sudah login
5. Cek di Supabase → Authentication → Users, user baru harus terdaftar dengan provider `google`

Ulangi test di `https://flourishcare.id/login` untuk memastikan unified login jalan.

## Troubleshooting

**"Error 400: redirect_uri_mismatch"** — URI di popup Google tidak match dengan yang di Credentials. Pastikan `https://vtquhqdfyirccxdzmpyr.supabase.co/auth/v1/callback` persis (tanpa trailing slash, tanpa typo).

**"Access blocked: This app's request is invalid"** — OAuth consent screen belum di-save atau app masih testing dan email login belum di test users list. Tambah email tersebut atau publish app.

**Redirect ke halaman kosong setelah Google login** — Site URL di Supabase salah. Set ke `https://flourishcare.id`.

**Localhost tidak jalan** — pastikan `http://localhost:3000` (bukan 127.0.0.1) sudah di JavaScript origins Google + Redirect URLs Supabase.

## Setelah Production

Kalau app FlourishCare siap dilaunch publik:

1. Google Cloud Console → OAuth consent screen → **Publish App**
2. Google minta submit untuk verification kalau scope sensitif. Untuk basic email/profile, biasanya langsung published tanpa review.
3. Setelah published, semua user Google bisa login (tidak terbatas test users).
