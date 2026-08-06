-- FlourishCare — Booking Online (subdomain book.flourishcare.id)
-- Jalankan SETELAH 0001_initial_schema.sql di Supabase SQL Editor.

-- ============ TABEL BARU ============

-- Jadwal rutin per-psikolog (day_of_week + jam mulai/selesai).
-- day_of_week: 0=Minggu, 1=Senin, ..., 6=Sabtu (JS convention).
create table if not exists psychologist_schedules (
  id            uuid primary key default gen_random_uuid(),
  staff_id      uuid not null references staff_profiles(id) on delete cascade,
  day_of_week   int not null check (day_of_week between 0 and 6),
  start_time    time not null,
  end_time      time not null,
  session_duration_min int not null default 60,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  check (end_time > start_time)
);
create index if not exists psychologist_schedules_staff_idx on psychologist_schedules(staff_id, day_of_week);

-- Booking online (subdomain book.flourishcare.id).
-- Ini terpisah dari tabel `bookings` di 0001 karena flow-nya beda:
-- - Payment gateway wajib (Sumopod QRIS)
-- - Selalu psikolog (bukan terapis)
-- - Mode online atau homecare
do $$ begin
  create type online_booking_mode as enum ('online','homecare');
exception when duplicate_object then null; end $$;

do $$ begin
  create type online_booking_status as enum (
    'pending_payment', 'awaiting_confirmation', 'confirmed',
    'completed', 'cancelled', 'expired'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type consultation_topic as enum (
    'keterlambatan_bicara',
    'tantrum_regulasi_emosi',
    'sulit_fokus_hiperaktif',
    'kesiapan_sekolah',
    'kesulitan_belajar',
    'kecemasan_ketakutan',
    'perilaku_sosial',
    'parenting_pola_asuh',
    'konsultasi_awal',
    'lainnya'
  );
exception when duplicate_object then null; end $$;

create table if not exists online_bookings (
  id                uuid primary key default gen_random_uuid(),
  code              text unique not null,           -- ONL-YYMM-XXXX
  user_id           uuid references auth.users(id),  -- yang booking

  -- Info orang tua
  parent_name       text not null,
  parent_whatsapp   text not null,
  parent_email      text not null,

  -- Info anak
  child_name        text not null,
  child_dob         date not null,
  child_gender      gender not null,
  consultation_topic consultation_topic not null,
  condition_notes   text,

  -- Sesi
  mode              online_booking_mode not null default 'online',
  psychologist_id   uuid not null references staff_profiles(id),
  scheduled_at      timestamptz not null,
  duration_min      int not null default 60,
  homecare_address  text,                            -- wajib bila mode='homecare'

  -- Pembayaran
  amount            numeric(12,2) not null,
  payment_type      text not null default 'full' check (payment_type in ('full','dp_50')),
  status            online_booking_status not null default 'pending_payment',

  -- Metadata
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  cancelled_at      timestamptz,
  cancelled_reason  text
);
create index if not exists online_bookings_user_idx on online_bookings(user_id, created_at desc);
create index if not exists online_bookings_psi_idx on online_bookings(psychologist_id, scheduled_at);
create index if not exists online_bookings_status_idx on online_bookings(status);

-- Payment record per online booking (integrasi Sumopod)
create table if not exists online_payments (
  id                uuid primary key default gen_random_uuid(),
  booking_id        uuid not null references online_bookings(id) on delete cascade,
  provider          text not null default 'sumopod',
  provider_ref      text unique,                    -- Sumopod payment_id
  order_id          text unique not null,           -- ONL-YYMM-XXXX-P
  amount            numeric(12,2) not null,
  fee               numeric(12,2),
  net_amount        numeric(12,2),
  payment_method    text not null default 'QRIS',
  payment_url       text,                           -- Sumopod payment_link_url
  status            payment_status not null default 'pending',
  raw_response      jsonb,
  paid_at           timestamptz,
  expires_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists online_payments_booking_idx on online_payments(booking_id);

-- ============ TRIGGERS ============

drop trigger if exists t_touch_online_bookings on online_bookings;
create trigger t_touch_online_bookings before update on online_bookings
  for each row execute function touch_updated_at();

drop trigger if exists t_touch_online_payments on online_payments;
create trigger t_touch_online_payments before update on online_payments
  for each row execute function touch_updated_at();

-- Generator kode ONL-YYMM-XXXX
create sequence if not exists online_booking_code_seq;

create or replace function generate_online_booking_code()
returns trigger as $$
begin
  if new.code is null or new.code = '' then
    new.code := 'ONL-' || to_char(now(), 'YYMM') || '-' ||
                lpad(nextval('online_booking_code_seq')::text, 4, '0');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists t_online_booking_code on online_bookings;
create trigger t_online_booking_code before insert on online_bookings
  for each row execute function generate_online_booking_code();

-- Sync status booking dari payment
create or replace function sync_online_booking_status()
returns trigger as $$
begin
  if new.status = 'paid' and old.status <> 'paid' then
    update online_bookings
       set status = 'awaiting_confirmation'
     where id = new.booking_id
       and status = 'pending_payment';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists t_online_payment_sync on online_payments;
create trigger t_online_payment_sync after update of status on online_payments
  for each row execute function sync_online_booking_status();

-- ============ RLS ============
alter table psychologist_schedules enable row level security;
alter table online_bookings enable row level security;
alter table online_payments enable row level security;

-- Jadwal psikolog: public read
drop policy if exists psi_schedules_read on psychologist_schedules;
create policy psi_schedules_read on psychologist_schedules
  for select using (is_active = true);
drop policy if exists psi_schedules_admin on psychologist_schedules;
create policy psi_schedules_admin on psychologist_schedules
  for all using (current_role_val() in ('super_admin','admin_cabang'))
  with check (current_role_val() in ('super_admin','admin_cabang'));

-- Online bookings:
-- - User yang booking: bisa lihat booking sendiri
-- - Super admin & admin cabang: semua
-- - Psikolog yang di-assign: hanya booking miliknya
-- - Insert: authenticated user boleh insert dengan user_id = auth.uid()
drop policy if exists online_bookings_owner_read on online_bookings;
create policy online_bookings_owner_read on online_bookings
  for select using (
    user_id = auth.uid()
    or current_role_val() in ('super_admin','admin_cabang')
    or exists (
      select 1 from staff_profiles sp
       where sp.id = online_bookings.psychologist_id
         and sp.profile_id = auth.uid()
    )
  );

drop policy if exists online_bookings_insert on online_bookings;
create policy online_bookings_insert on online_bookings
  for insert with check (
    user_id = auth.uid()
    and status = 'pending_payment'
  );

drop policy if exists online_bookings_admin_update on online_bookings;
create policy online_bookings_admin_update on online_bookings
  for update using (
    current_role_val() in ('super_admin','admin_cabang')
    or exists (
      select 1 from staff_profiles sp
       where sp.id = online_bookings.psychologist_id
         and sp.profile_id = auth.uid()
    )
  ) with check (true);

-- Online payments: read by admin/owner; write hanya via Edge Function (service role)
drop policy if exists online_payments_read on online_payments;
create policy online_payments_read on online_payments
  for select using (
    current_role_val() in ('super_admin','admin_cabang')
    or exists (
      select 1 from online_bookings b
       where b.id = online_payments.booking_id
         and b.user_id = auth.uid()
    )
  );

-- ============ SEED — 2 PSIKOLOG DENGAN JADWAL ============

-- Update staff_profiles Achla (existing)
update staff_profiles
   set title = 'Achla Himmah, M.Psi., Psikolog',
       bio = 'Psikolog anak yang berfokus pada asesmen tumbuh kembang, konseling keluarga, dan pendampingan orang tua. Achla percaya bahwa setiap anak memiliki potensi unik yang dapat mekar dengan pendekatan hangat, sabar, dan berbasis bukti.',
       specialties = array['Asesmen Anak','Konseling Keluarga','Kesiapan Sekolah','Parenting'],
       photo_url = coalesce(photo_url, '/team/achla.jpeg')
 where id = '00000000-0000-0000-0000-000000001001';

-- Insert psikolog Azna (baru — khusus untuk online booking)
insert into staff_profiles (id, profile_id, title, slug, bio, photo_url, specialties, therapy_types, is_visible, display_order)
values (
  '00000000-0000-0000-0000-000000001003',
  null,
  'Azna, M.Psi., Psikolog',
  'azna',
  'Psikolog anak yang berpengalaman dalam konseling online dan asesmen jarak jauh. Azna memberikan pendekatan yang fleksibel untuk keluarga yang membutuhkan konsultasi cepat maupun berkelanjutan.',
  null,
  array['Konseling Online','Asesmen Anak','Parenting'],
  array['konsultasi']::therapy_type[],
  true,
  3
) on conflict (id) do nothing;

-- Jadwal Achla: Min/Sen/Sel/Kam jam 19:00-20:30 (1 slot 90 menit, jadi bisa 1 sesi 60 mnt)
insert into psychologist_schedules (staff_id, day_of_week, start_time, end_time, session_duration_min)
values
  ('00000000-0000-0000-0000-000000001001', 0, '19:00', '20:30', 60),  -- Minggu
  ('00000000-0000-0000-0000-000000001001', 1, '19:00', '20:30', 60),  -- Senin
  ('00000000-0000-0000-0000-000000001001', 2, '19:00', '20:30', 60),  -- Selasa
  ('00000000-0000-0000-0000-000000001001', 4, '19:00', '20:30', 60)   -- Kamis
on conflict do nothing;

-- Jadwal Azna: Sabtu 10-13, Minggu 10-13, Senin 18:30-20:30
insert into psychologist_schedules (staff_id, day_of_week, start_time, end_time, session_duration_min)
values
  ('00000000-0000-0000-0000-000000001003', 6, '10:00', '13:00', 60),  -- Sabtu
  ('00000000-0000-0000-0000-000000001003', 0, '10:00', '13:00', 60),  -- Minggu
  ('00000000-0000-0000-0000-000000001003', 1, '18:30', '20:30', 60)   -- Senin
on conflict do nothing;

-- ============ HELPER RPC untuk cek slot tersedia ============

-- Return array time_slot untuk psikolog di tanggal tertentu, exclude yang sudah dibook
create or replace function online_available_slots(p_staff_id uuid, p_date date)
returns table(slot_time time, is_available boolean)
language sql stable as $$
  with slots as (
    select
      (s.start_time + (interval '1 minute' * s.session_duration_min * gs.n))::time as slot_time,
      s.session_duration_min
    from psychologist_schedules s
    cross join generate_series(0, 5) as gs(n)
    where s.staff_id = p_staff_id
      and s.day_of_week = extract(dow from p_date)
      and s.is_active
      and (s.start_time + (interval '1 minute' * s.session_duration_min * (gs.n + 1))) <= s.end_time
  ),
  booked as (
    select scheduled_at::time as slot_time
    from online_bookings
    where psychologist_id = p_staff_id
      and scheduled_at::date = p_date
      and status not in ('cancelled','expired')
  )
  select
    s.slot_time,
    not exists (select 1 from booked b where b.slot_time = s.slot_time) as is_available
  from slots s
  order by s.slot_time;
$$;

grant execute on function online_available_slots(uuid, date) to anon, authenticated;
