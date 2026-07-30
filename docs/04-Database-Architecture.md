# 04 — Database Architecture (Supabase / Postgres)

**Produk:** FlourishCare.id
**Versi:** 1.0
**Platform:** Supabase Postgres (versi 15+), Row-Level Security aktif untuk semua tabel bisnis.
**Konvensi:** snake_case untuk tabel/kolom, `id uuid default gen_random_uuid() primary key`, `created_at`/`updated_at timestamptz not null default now()`.

---

## 1. Prinsip Desain

1. **Semua tabel bisnis pakai `uuid` PK** — hindari sequential id yang bocor volume.
2. **RLS aktif tanpa kecuali** — tabel tanpa RLS diblok CI.
3. **Soft delete** untuk data yang mungkin di-restore (`deleted_at timestamptz`).
4. **Audit trail** — tabel `activity_logs` untuk mutasi kritikal (booking, payment, medical_record).
5. **Trigger `updated_at`** otomatis.
6. **Referensi antar tabel via FK dengan `on delete restrict` (default)**, kecuali child yang wajib ikut parent (`cascade`).

---

## 2. Enum

```sql
create type user_role as enum (
  'super_admin', 'admin_cabang', 'psikolog', 'terapis', 'karyawan'
);

create type gender as enum ('L', 'P');

create type service_type as enum (
  'onsite', 'homevisit', 'psikolog', 'psikolog_online', 'psikotes'
);

create type therapy_type as enum (
  'SI', 'TW', 'OT', 'BT',           -- terapi
  'konsultasi',                     -- psikolog
  'tesIQ', 'kesiapan', 'diagnosa'   -- psikotes
);

create type day_type as enum ('weekdays', 'weekend');

create type booking_status as enum (
  'pending_payment', 'awaiting_confirmation', 'confirmed',
  'in_progress', 'completed', 'cancelled', 'no_show'
);

create type payment_status as enum (
  'pending', 'paid', 'failed', 'refunded', 'expired'
);

create type payment_method as enum (
  'BCA', 'Mandiri', 'BNI', 'BRI', 'QRIS', 'GoPay', 'OVO', 'DANA', 'Cash'
);

create type session_status as enum (
  'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled', 'no_show'
);

create type attendance_type as enum (
  'clock_in', 'clock_out', 'session_start', 'session_end'
);

create type attendance_mode as enum ('onsite', 'homevisit');

create type leave_status as enum ('pending', 'approved', 'rejected');
```

---

## 3. Tabel Inti

### 3.1 `branches` (cabang klinik)

```sql
create table branches (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  address     text not null,
  city        text not null,
  phone       text,
  latitude    double precision,
  longitude   double precision,
  radius_km   int not null default 10,   -- radius home-visit
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
```

### 3.2 `profiles` (satu-satu dengan `auth.users`)

```sql
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  role        user_role not null,
  branch_id   uuid references branches(id),
  phone       text,
  avatar_url  text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index on profiles(role);
create index on profiles(branch_id);
```

### 3.3 `staff_profiles` (data profesional untuk halaman Team & assignment)

```sql
create table staff_profiles (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null unique references profiles(id) on delete cascade,
  title          text not null,                    -- "Psikolog Anak", "Terapis Wicara"
  slug           text unique not null,             -- URL /team/:slug
  bio            text,
  photo_url      text,
  specialties    text[] not null default '{}',
  therapy_types  therapy_type[] not null default '{}',
  str_number     text,                             -- Nomor Surat Tanda Registrasi
  str_expires_at date,
  is_visible     boolean not null default true,    -- muncul di halaman Team publik
  display_order  int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
```

### 3.4 `parents` (orang tua / wali)

```sql
create table parents (
  id             uuid primary key default gen_random_uuid(),
  auth_user_id   uuid references auth.users(id), -- null untuk booking anonim; diisi jika ada parent portal
  full_name      text not null,
  whatsapp       text not null,
  email          citext not null,
  address        text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index on parents(email);
create index on parents(whatsapp);
```

### 3.5 `children` (pasien)

```sql
create table children (
  id            uuid primary key default gen_random_uuid(),
  parent_id     uuid not null references parents(id) on delete cascade,
  full_name     text not null,
  nickname      text,
  dob           date not null,
  gender        gender not null,
  primary_condition text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index on children(parent_id);
```

### 3.6 `bookings` (booking induk)

```sql
create table bookings (
  id              uuid primary key default gen_random_uuid(),
  code            text unique not null,          -- FC-YYMM-XXXX
  child_id        uuid not null references children(id),
  parent_id       uuid not null references parents(id),
  branch_id       uuid not null references branches(id),
  service         service_type not null,
  therapy_type    therapy_type,
  package_sessions int check (package_sessions in (1,4,8,12,16)),
  day_type        day_type,
  therapist_id    uuid references profiles(id),
  address         text,                          -- override alamat homevisit
  total_amount    numeric(12,2) not null default 0,
  currency        text not null default 'IDR',
  status          booking_status not null default 'pending_payment',
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  cancelled_at    timestamptz,
  cancelled_reason text
);

create index on bookings(status);
create index on bookings(therapist_id, created_at desc);
create index on bookings(branch_id, created_at desc);
```

### 3.7 `sessions` (sesi terapi per booking)

```sql
create table sessions (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null references bookings(id) on delete cascade,
  therapist_id  uuid not null references profiles(id),
  child_id      uuid not null references children(id),
  scheduled_at  timestamptz not null,
  duration_min  int not null default 60,
  status        session_status not null default 'scheduled',
  location_mode attendance_mode not null,        -- onsite | homevisit
  location_address text,                         -- untuk homevisit
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (therapist_id, scheduled_at)            -- cegah double-book therapist
);

create index on sessions(child_id, scheduled_at desc);
create index on sessions(scheduled_at);
```

### 3.8 `payments`

```sql
create table payments (
  id             uuid primary key default gen_random_uuid(),
  booking_id     uuid not null references bookings(id) on delete cascade,
  amount         numeric(12,2) not null,
  method         payment_method,
  status         payment_status not null default 'pending',
  provider       text not null default 'midtrans',
  provider_ref   text unique,                    -- order_id Midtrans
  paid_at        timestamptz,
  raw_response   jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index on payments(booking_id);
create index on payments(status);
```

### 3.9 `medical_records`

```sql
create table medical_records (
  id           uuid primary key default gen_random_uuid(),
  child_id     uuid not null references children(id) on delete cascade,
  session_id   uuid references sessions(id),
  author_id    uuid not null references profiles(id), -- psikolog/terapis penulis
  visibility   text not null default 'restricted',    -- 'restricted' | 'branch'
  title        text not null,
  content      text not null,                         -- markdown/html
  attachments  jsonb not null default '[]',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on medical_records(child_id, created_at desc);
```

### 3.10 `attendance_logs`

```sql
create table attendance_logs (
  id           uuid primary key default gen_random_uuid(),
  staff_id     uuid not null references profiles(id),
  type         attendance_type not null,
  mode         attendance_mode not null,
  session_id   uuid references sessions(id),           -- untuk session_start/end
  logged_at    timestamptz not null default now(),
  latitude     double precision,
  longitude    double precision,
  distance_m   int,                                    -- jarak ke lokasi target
  face_score   real,                                   -- 0..1 dari verifikasi wajah
  photo_url    text,                                   -- snapshot verifikasi
  device_info  jsonb,
  notes        text
);

create index on attendance_logs(staff_id, logged_at desc);
```

### 3.11 `leave_requests`

```sql
create table leave_requests (
  id            uuid primary key default gen_random_uuid(),
  staff_id      uuid not null references profiles(id),
  start_date    date not null,
  end_date      date not null,
  reason        text not null,
  status        leave_status not null default 'pending',
  reviewed_by   uuid references profiles(id),
  reviewed_at   timestamptz,
  review_note   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  check (end_date >= start_date)
);
```

### 3.12 `pricing`

```sql
create table pricing (
  id            uuid primary key default gen_random_uuid(),
  service       service_type not null,
  therapy_type  therapy_type,
  package_sessions int,
  day_type      day_type,
  price         numeric(12,2) not null,
  is_active     boolean not null default true,
  effective_from date not null default current_date,
  created_at    timestamptz not null default now()
);

create unique index on pricing (service, coalesce(therapy_type::text,''), coalesce(package_sessions,0), coalesce(day_type::text,''))
  where is_active;
```

### 3.13 `activity_logs` (audit trail)

```sql
create table activity_logs (
  id           bigserial primary key,
  actor_id     uuid references profiles(id),
  action       text not null,          -- 'booking.create', 'medical_record.update', dll
  entity       text not null,          -- 'bookings' | 'medical_records' | 'payments'
  entity_id    uuid,
  metadata     jsonb,
  created_at   timestamptz not null default now()
);

create index on activity_logs(entity, entity_id);
create index on activity_logs(actor_id, created_at desc);
```

### 3.14 `notifications` (untuk banner dashboard)

```sql
create table notifications (
  id          uuid primary key default gen_random_uuid(),
  recipient_id uuid references profiles(id),   -- null = broadcast per role
  recipient_role user_role,
  type        text not null,
  payload     jsonb not null,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
```

---

## 4. Relasi (ERD Ringkas)

```
auth.users ─┬─ profiles ── staff_profiles
            │      │
            │      └── attendance_logs
            │      └── leave_requests
            │
            └─ parents ── children ── bookings ── sessions ── attendance_logs
                                            │        │
                                            │        └── medical_records
                                            └── payments
branches ── profiles
branches ── bookings
```

---

## 5. Trigger & Function

### 5.1 `updated_at` otomatis

```sql
create or replace function touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Terapkan untuk tiap tabel bisnis:
create trigger t_touch before update on bookings
  for each row execute function touch_updated_at();
-- (dan seterusnya)
```

### 5.2 Generator `bookings.code`

```sql
create or replace function generate_booking_code()
returns trigger as $$
begin
  new.code := 'FC-' || to_char(now(), 'YYMM') || '-' ||
              lpad(nextval('booking_code_seq')::text, 4, '0');
  return new;
end;
$$ language plpgsql;

create sequence booking_code_seq;
create trigger t_booking_code before insert on bookings
  for each row when (new.code is null) execute function generate_booking_code();
```

### 5.3 Sinkronisasi status booking dari payment

```sql
create or replace function sync_booking_status_on_payment()
returns trigger as $$
begin
  if new.status = 'paid' then
    update bookings set status = 'awaiting_confirmation'
      where id = new.booking_id and status = 'pending_payment';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger t_payment_sync after update of status on payments
  for each row execute function sync_booking_status_on_payment();
```

### 5.4 Auto-generate sesi setelah booking confirmed

Function `generate_sessions_for_booking(booking_id)` dipanggil dari Edge Function atau trigger saat status booking `confirmed` — membuat N baris `sessions` sesuai `package_sessions`, `day_type`, `therapist_id`.

---

## 6. Row-Level Security (RLS) Policies

Aktifkan di semua tabel bisnis: `alter table X enable row level security;`.

### 6.1 Helper Function

```sql
create or replace function current_role_val()
returns user_role
language sql stable
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function current_branch()
returns uuid
language sql stable
as $$
  select branch_id from profiles where id = auth.uid();
$$;
```

### 6.2 Contoh Policy per Tabel

**`profiles`**
- `select`: user hanya bisa lihat profil sendiri + super_admin bisa lihat semua + admin_cabang bisa lihat profil di branch-nya.
- `update`: hanya profil sendiri (nama, phone, avatar); super_admin bisa update semua kolom.
- `insert/delete`: super_admin only.

**`bookings`**
- `select`: super_admin (semua), admin_cabang (branch_id sama), terapis/psikolog (therapist_id = auth.uid()), parent authenticated (parent_id memiliki auth_user_id = auth.uid()).
- `insert`: anon boleh insert dengan status `pending_payment` (public booking); tapi field `status`, `total_amount` di-set oleh trigger/Edge Function, bukan client.
- `update`: super_admin, admin_cabang (branch match); terapis boleh update status jadi `in_progress`/`completed`/`no_show` untuk booking miliknya.
- `delete`: hanya super_admin (soft delete lebih dianjurkan).

**`sessions`**
- `select`: staff yang bertugas + admin cabang + super_admin + parent (child_id di keluarganya).
- `update`: staff bertugas untuk `status`/`notes`; admin cabang untuk `scheduled_at`/`therapist_id`.

**`medical_records`**
- `select`: super_admin, psikolog di branch yang sama, terapis bertugas untuk anak tersebut, parent (child terkait).
- `insert/update`: hanya psikolog & super_admin.
- `delete`: hanya super_admin.

**`payments`**
- `select`: super_admin, admin_cabang, parent (via booking → parent match).
- `insert/update`: hanya service role (via Edge Function webhook), tidak dari client.

**`attendance_logs`**
- `select`: super_admin, admin_cabang (staff branch match), staff sendiri.
- `insert`: staff untuk dirinya sendiri (`staff_id = auth.uid()`); Edge Function validasi face_score & lokasi.
- `update/delete`: super_admin only.

**`leave_requests`**
- `select`: super_admin, admin_cabang (staff branch match), staff sendiri.
- `insert`: staff untuk dirinya sendiri.
- `update` (approve/reject): super_admin, admin_cabang.

**`pricing`**
- `select`: public (anon).
- `insert/update/delete`: super_admin.

**`staff_profiles`**
- `select`: public jika `is_visible = true`; internal boleh semua.
- `insert/update/delete`: super_admin.

**`activity_logs`**
- `select`: super_admin.
- `insert`: internal via trigger (security definer).

---

## 7. Indeks Tambahan

- `create index on bookings (created_at desc);` untuk sorting terbaru.
- `create index on sessions (scheduled_at) where status = 'scheduled';` — kalender aktif.
- `create index on payments (created_at desc) where status = 'paid';` — laporan keuangan.

---

## 8. Storage (Supabase Storage Bucket)

| Bucket | Public | Isi |
|---|---|---|
| `brand-assets` | yes | Logo, gambar hero, ikon SVG |
| `team-photos` | yes | Foto tim profesional |
| `gallery` | yes | Galeri kegiatan Homepage |
| `medical-attachments` | no | Lampiran rekam medis (PDF, gambar hasil tes) |
| `attendance-snapshots` | no | Snapshot foto verifikasi presensi |
| `payment-proofs` | no | Bukti transfer manual (jika ada) |

Policy Storage: bucket privat hanya bisa diakses dengan signed URL yang dibuat via Edge Function berdasarkan otorisasi.

---

## 9. Realtime

- Channel `bookings:branch:<branch_id>` — admin cabang subscribe `INSERT` dan `UPDATE`.
- Channel `sessions:therapist:<user_id>` — terapis subscribe perubahan jadwal.
- Channel `notifications:role:<role>` — banner dashboard.

---

## 10. Migrasi & Seeding

- Semua schema dikelola sebagai file SQL di `supabase/migrations/*.sql` (menggunakan Supabase CLI).
- File seed `supabase/seed.sql` untuk data awal: 1 branch, 6 staff_profiles, pricing default, 1 super_admin.
- Generator types otomatis: `supabase gen types typescript --project-id <id> > src/types/database.ts`.

---

## 11. Retensi & Kepatuhan (UU PDP)

- Data anak dan rekam medis **tidak dihapus** kecuali permintaan wali (soft delete + anonymisasi setelah 30 hari).
- Attendance snapshot & face data: retensi maksimal 12 bulan (`pg_cron` job).
- Audit log: retensi 5 tahun.
- Enkripsi: Supabase Postgres by default at-rest (AES-256); in-transit TLS.
- Pemrosesan data anak wajib berdasarkan consent orang tua tercatat di `parents.consent_signed_at` dan `parents.consent_version` (kolom tambahan yang direkomendasikan).

---

## 12. Backup

- Point-in-time recovery Supabase Pro (7 hari) aktif.
- Dump mingguan ke bucket privat R2/S3 (Edge Function + pg_dump).
