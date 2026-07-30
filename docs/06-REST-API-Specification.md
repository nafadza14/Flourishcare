# 06 — REST/API Specification

**Produk:** FlourishCare.id
**Versi:** 1.0
**Cakupan:** Kontrak API antara frontend (React SPA) ↔ Supabase (PostgREST + Auth + Edge Functions) + integrasi eksternal.

Supabase memaparkan Postgres sebagai REST auto-generated (PostgREST) dan RPC. Client menggunakan `@supabase/supabase-js` sebagai wrapper. Endpoint kustom (payment, webhook, notifikasi) diimplementasi sebagai **Edge Functions** (Deno) di path `/functions/v1/*`.

Base URL: `https://<project-ref>.supabase.co`
Header default:
```
apikey: <anon key>
Authorization: Bearer <access_token JWT>  # kecuali endpoint public
Content-Type: application/json
```

---

## 1. Auth Endpoints (GoTrue)

| Method | Path | Deskripsi |
|---|---|---|
| POST | `/auth/v1/token?grant_type=password` | Login email+password |
| POST | `/auth/v1/logout` | Logout (invalidate session) |
| POST | `/auth/v1/recover` | Kirim email reset password |
| POST | `/auth/v1/user` (PUT) | Update user (password baru dari reset link) |
| GET | `/auth/v1/user` | Ambil user aktif |

Dipakai lewat client: `supabase.auth.signInWithPassword`, `supabase.auth.signOut`, `supabase.auth.resetPasswordForEmail`, `supabase.auth.updateUser`, `supabase.auth.getUser`.

---

## 2. PostgREST Resources

Semua tabel bisnis diakses via `/rest/v1/<table>`. Otorisasi tunduk pada RLS (lihat `04-Database-Architecture.md`). Contoh yang paling sering digunakan:

### 2.1 `bookings`

**List (admin)**
```
GET /rest/v1/bookings?select=*,child:children(*),parent:parents(*),therapist:profiles(full_name),payments(*)
    &status=in.(pending_payment,awaiting_confirmation,confirmed)
    &order=created_at.desc
    &limit=25&offset=0
```

**Create (public)**
```
POST /rest/v1/bookings
Prefer: return=representation

{
  "child_id": "...",
  "parent_id": "...",
  "branch_id": "...",
  "service": "onsite",
  "therapy_type": "SI",
  "package_sessions": 8,
  "day_type": "weekdays",
  "therapist_id": "...",
  "address": null
}
```
RLS memaksa `status='pending_payment'` awal; `total_amount` dihitung oleh trigger `calc_booking_total`.

**Update (konfirmasi/reschedule/cancel)**
```
PATCH /rest/v1/bookings?id=eq.<uuid>
{ "status": "confirmed" }
```

### 2.2 `sessions`

**List sesi minggu ini untuk terapis**
```
GET /rest/v1/sessions?therapist_id=eq.<uid>
    &scheduled_at=gte.<ISO>&scheduled_at=lt.<ISO>
    &select=*,child:children(full_name,dob)
    &order=scheduled_at.asc
```

**Reschedule (admin)**
```
PATCH /rest/v1/sessions?id=eq.<uuid>
{ "scheduled_at": "2026-08-05T09:00:00+07:00", "status": "rescheduled" }
```

### 2.3 `children` & `parents`
- CRUD standar via PostgREST. Untuk booking anonim publik, parent+child dibuat oleh Edge Function `booking_intake` (agar validasi & de-duplikasi email/WA terpusat).

### 2.4 `medical_records`
```
GET /rest/v1/medical_records?child_id=eq.<uuid>&order=created_at.desc
POST /rest/v1/medical_records
PATCH /rest/v1/medical_records?id=eq.<uuid>
```
Update setelah 24 jam ditolak oleh RLS/policy.

### 2.5 `payments`
- Client hanya `SELECT` (untuk melihat status). `INSERT/UPDATE` hanya via Edge Function `payment_webhook` menggunakan service role.

### 2.6 `attendance_logs`
```
POST /rest/v1/attendance_logs
{
  "type": "session_start",
  "mode": "homevisit",
  "session_id": "...",
  "latitude": -6.234,
  "longitude": 106.845,
  "distance_m": 42,
  "face_score": 0.93,
  "photo_url": "attendance-snapshots/uid/ts.jpg"
}
```
Trigger DB memvalidasi `face_score >= 0.85` dan `distance_m <= 100` untuk homevisit.

### 2.7 `leave_requests`
```
POST  /rest/v1/leave_requests
GET   /rest/v1/leave_requests?status=eq.pending
PATCH /rest/v1/leave_requests?id=eq.<uuid>   { "status": "approved" }
```

### 2.8 `pricing` (public read)
```
GET /rest/v1/pricing?is_active=eq.true&order=service.asc,day_type.asc
```

### 2.9 `staff_profiles` (public read filter visible)
```
GET /rest/v1/staff_profiles?is_visible=eq.true&order=display_order.asc
```

---

## 3. RPC (Postgres Functions)

Untuk operasi yang membutuhkan logika multi-tabel atau bypass RLS terkontrol (`security definer`).

| RPC | Input | Output | Deskripsi |
|---|---|---|---|
| `booking_availability` | `{ therapist_id, date }` | `time_slot[]` dengan `is_available: bool` | List slot 09..16 untuk terapis di tanggal tertentu, sudah exclude sesi terisi. |
| `calc_booking_total` | `{ service, therapy_type, package_sessions, day_type }` | `numeric` | Kalkulasi total berdasarkan tabel `pricing`. |
| `generate_sessions_for_booking` | `{ booking_id }` | `sessions[]` | Generate N sesi otomatis saat booking confirmed. |
| `dashboard_kpis` | `{ branch_id, month }` | `{ patients, sessions_today, revenue_month, attendance_rate }` | KPI Overview. |
| `notify_role` | `{ role, type, payload }` | `void` | Push notifikasi. |

Cara panggil client:
```ts
const { data, error } = await supabase.rpc('booking_availability', {
  therapist_id: '...',
  date: '2026-08-05',
});
```

---

## 4. Edge Functions (`/functions/v1/*`)

Diimplementasi di `supabase/functions/<name>/index.ts`. Deploy: `supabase functions deploy <name>`.

### 4.1 `POST /functions/v1/booking_intake`
Menerima payload booking dari wizard, memvalidasi, membuat/mencari `parents`, membuat `children`, membuat `bookings` (`pending_payment`), memanggil `create_payment`, mengembalikan `payment_token` + `redirect_url`.

Request:
```json
{
  "child": { "full_name": "Rara", "dob": "2020-05-01", "gender": "P", "primary_condition": "Speech delay" },
  "parent": { "full_name": "Sari", "whatsapp": "628175028099", "email": "sari@example.com", "address": "..." },
  "booking": { "service": "homevisit", "therapy_type": "SI", "package_sessions": 8, "day_type": "weekdays", "therapist_id": "...", "date": "2026-08-05", "time": "09:00" }
}
```
Response 201:
```json
{ "booking_id": "...", "booking_code": "FC-2607-0123", "payment_token": "...", "redirect_url": "https://app.midtrans.com/snap/v3/redirection/..." }
```

### 4.2 `POST /functions/v1/create_payment`
Server-side call Midtrans Snap dengan `MIDTRANS_SERVER_KEY`. Menyimpan `payments` row dengan `status='pending'`.

### 4.3 `POST /functions/v1/payment_webhook`
Callback dari Midtrans. Verifikasi signature (`signature_key = SHA512(order_id + status_code + gross_amount + server_key)`). Update `payments.status` dan trigger `sync_booking_status_on_payment`. Kirim notifikasi WA/email.

### 4.4 `POST /functions/v1/wa_send`
Wrapper WhatsApp Cloud API untuk notifikasi (konfirmasi booking, reminder H-1, reschedule, dst). Payload templated. Dipicu oleh trigger DB via `pg_net` atau cron.

### 4.5 `POST /functions/v1/reminder_cron`
Dijadwal `pg_cron` setiap jam. Cari `sessions.scheduled_at` dalam 24 jam ke depan, kirim reminder ke orang tua via `wa_send`.

### 4.6 `POST /functions/v1/face_verify`
(Opsional) Sisi server verifikasi wajah dengan Rekognition/Face++ jika client-only tidak dianggap cukup andal. Menerima `photo_base64` + `staff_id`, mengembalikan `score`.

### 4.7 `GET /functions/v1/signed_url`
Menerbitkan signed URL untuk lampiran privat (medical_records, attendance snapshot) — cek RLS-equivalent otorisasi sebelum menandatangani.

### 4.8 `POST /functions/v1/generate_report_pdf`
Menghasilkan laporan progres pasien dalam PDF, upload ke bucket `medical-attachments/reports/`, kembalikan signed URL.

---

## 5. Realtime Channels

Client subscribe via `supabase.channel(name).on(...)`.

| Channel | Payload | Konsumen |
|---|---|---|
| `bookings:branch:<branch_id>` | `INSERT`, `UPDATE` bookings di branch | Dashboard admin |
| `sessions:therapist:<uid>` | `INSERT`, `UPDATE` sessions milik user | Kalender terapis |
| `notifications:role:<role>` | Broadcast notif per role | Bell dashboard |
| `notifications:user:<uid>` | Notif spesifik user | Bell dashboard |

---

## 6. Integrasi Eksternal

### 6.1 Curator.io (Instagram feed publik)
```
GET https://api.curator.io/v1/feeds/<FEED_ID>/posts
```
Client-side fetch tanpa auth. Fallback grid statis bila error.

### 6.2 WhatsApp Deep Link
```
https://wa.me/<62xxxxxxxxxx>?text=<encodeURIComponent(pesan)>
```
Digunakan untuk CTA kontak publik dan tombol "Tawarkan Reschedule".

### 6.3 WhatsApp Cloud API (server, roadmap)
```
POST https://graph.facebook.com/v20.0/<PHONE_NUMBER_ID>/messages
Authorization: Bearer <WA_CLOUD_TOKEN>
```

### 6.4 Midtrans Snap
```
POST https://app.sandbox.midtrans.com/snap/v1/transactions
Authorization: Basic base64(SERVER_KEY:)
```

---

## 7. Konvensi Umum

- **Pagination:** `limit` + `offset` di query PostgREST; hitung total via header `Prefer: count=exact` → `Content-Range: 0-24/1200`.
- **Filtering:** operator PostgREST (`eq`, `neq`, `gt`, `lt`, `in`, `like`, `ilike`, `is`, `not`).
- **Field selection:** `select=field1,field2,relasi(field3)`.
- **Order:** `order=field.asc|desc`.
- **Error format:**
  ```json
  {"code":"23505","message":"duplicate key value violates unique constraint", "details":"..."}
  ```
  Client memetakan ke pesan Indonesia via `lib/errors.ts`.
- **HTTP status:**
  - 200 OK — read
  - 201 Created — insert
  - 204 No Content — update/delete tanpa `return=representation`
  - 400 Bad Request — validasi
  - 401 Unauthorized — token invalid / expired
  - 403 Forbidden — RLS blok
  - 404 Not Found
  - 409 Conflict — unique constraint (slot bentrok)
  - 429 Too Many Requests — rate limit

---

## 8. Keamanan API

- Anon key hanya untuk operasi publik terkontrol (baca `pricing`, `staff_profiles`; insert `bookings` via Edge Function).
- Service role key **tidak pernah** dikirim ke client — hanya di Edge Functions.
- CORS: whitelist domain `flourishcare.id`, subdomain preview `*.vercel.app`.
- Rate limit di Supabase Pro + Edge Function throttle untuk endpoint intake.
- Webhook Midtrans wajib verifikasi signature; drop request yang tidak sah.

---

## 9. Ringkasan Endpoint Kritikal (Cheat Sheet)

| Endpoint | Auth | Ringkasan |
|---|---|---|
| `POST /auth/v1/token?grant_type=password` | none | Login |
| `POST /functions/v1/booking_intake` | none | Buat booking publik + inisiasi bayar |
| `POST /functions/v1/payment_webhook` | signature | Update status pembayaran |
| `GET /rest/v1/bookings` | JWT admin | Daftar booking |
| `PATCH /rest/v1/bookings?id=eq.<uuid>` | JWT admin | Konfirmasi/cancel booking |
| `POST /rest/v1/attendance_logs` | JWT staff | Catat presensi |
| `POST /rest/v1/leave_requests` | JWT staff | Ajukan cuti |
| `PATCH /rest/v1/leave_requests?id=eq.<uuid>` | JWT admin | Setujui/tolak cuti |
| `POST /functions/v1/wa_send` | service role | Kirim WA notifikasi |
| `POST /rest/v1/rpc/booking_availability` | none/JWT | Slot tersedia terapis |
