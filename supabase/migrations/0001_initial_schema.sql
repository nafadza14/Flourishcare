-- FlourishCare — Initial Schema v1.1
-- Jalankan di Supabase → SQL Editor. Idempotent-friendly: pakai IF NOT EXISTS di mana mungkin.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ============ ENUM ============
do $$ begin
  create type user_role as enum ('super_admin','admin_cabang','psikolog','terapis','karyawan');
exception when duplicate_object then null; end $$;

do $$ begin
  create type gender as enum ('L','P');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_type as enum ('onsite','psikolog','psikolog_online','psikotes');
exception when duplicate_object then null; end $$;

do $$ begin
  create type therapy_type as enum ('SI','TW','OT','BT','konsultasi','tesIQ','kesiapan','diagnosa');
exception when duplicate_object then null; end $$;

do $$ begin
  create type booking_status as enum ('pending_payment','awaiting_confirmation','confirmed','in_progress','completed','cancelled','no_show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('pending','paid','failed','refunded','expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type session_status as enum ('scheduled','in_progress','completed','cancelled','rescheduled','no_show');
exception when duplicate_object then null; end $$;

do $$ begin
  create type attendance_type as enum ('clock_in','clock_out','session_start','session_end');
exception when duplicate_object then null; end $$;

do $$ begin
  create type attendance_mode as enum ('onsite','homevisit');
exception when duplicate_object then null; end $$;

do $$ begin
  create type leave_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;

-- ============ TRIGGER FUNCTION ============
create or replace function touch_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

-- ============ TABLES ============
create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text not null,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'karyawan',
  branch_id uuid references branches(id),
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_role_idx on profiles(role);

create table if not exists staff_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references profiles(id) on delete cascade,
  title text not null,
  slug text unique not null,
  bio text,
  photo_url text,
  specialties text[] not null default '{}',
  therapy_types therapy_type[] not null default '{}',
  str_number text,
  str_expires_at date,
  is_visible boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists parents (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id),
  full_name text not null,
  whatsapp text not null,
  email citext not null,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists parents_wa_idx on parents(whatsapp);
create index if not exists parents_email_idx on parents(email);

create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references parents(id) on delete cascade,
  rm_number text unique not null,
  full_name text not null,
  nickname text,
  dob date not null,
  gender gender not null,
  primary_condition text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create sequence if not exists booking_code_seq;

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  child_id uuid not null references children(id),
  parent_id uuid not null references parents(id),
  branch_id uuid not null references branches(id),
  service service_type not null,
  therapy_type therapy_type,
  package_sessions int check (package_sessions in (1,4,8,12,16)),
  therapist_id uuid references profiles(id),
  total_amount numeric(12,2) not null default 0,
  currency text not null default 'IDR',
  status booking_status not null default 'pending_payment',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  therapist_id uuid not null references profiles(id),
  child_id uuid not null references children(id),
  scheduled_at timestamptz not null,
  duration_min int not null default 60,
  status session_status not null default 'scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (therapist_id, scheduled_at)
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  amount numeric(12,2) not null,
  method text,
  status payment_status not null default 'pending',
  provider text not null default 'manual',
  provider_ref text unique,
  paid_at timestamptz,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists medical_records (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  session_id uuid references sessions(id),
  author_id uuid not null references profiles(id),
  visibility text not null default 'restricted',
  title text not null,
  content text not null,
  attachments jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists progress_notes (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  author_id uuid not null references profiles(id),
  session_id uuid references sessions(id),
  title text not null,
  summary text not null,
  metrics jsonb,
  is_shared boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists progress_notes_child_idx on progress_notes(child_id, created_at desc);

create table if not exists progress_access_otp (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  parent_id uuid not null references parents(id) on delete cascade,
  otp_hash text not null,
  channel text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists progress_otp_child_idx on progress_access_otp(child_id, created_at desc);

create table if not exists attendance_logs (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references profiles(id),
  type attendance_type not null,
  mode attendance_mode not null default 'onsite',
  session_id uuid references sessions(id),
  logged_at timestamptz not null default now(),
  latitude double precision,
  longitude double precision,
  face_score real,
  photo_url text,
  notes text
);
create index if not exists attendance_staff_idx on attendance_logs(staff_id, logged_at desc);

create table if not exists leave_requests (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references profiles(id),
  start_date date not null,
  end_date date not null,
  reason text not null,
  status leave_status not null default 'pending',
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text not null default '',
  display_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id bigserial primary key,
  actor_id uuid references profiles(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============ TRIGGERS updated_at ============
do $$ declare t text;
begin
  for t in
    select unnest(array['branches','profiles','staff_profiles','parents','children','bookings','sessions','payments','medical_records','leave_requests'])
  loop
    execute format('drop trigger if exists t_touch on %I;', t);
    execute format('create trigger t_touch before update on %I for each row execute function touch_updated_at();', t);
  end loop;
end $$;

-- ============ BOOKING CODE ============
create or replace function generate_booking_code()
returns trigger as $$
begin
  if new.code is null or new.code = '' then
    new.code := 'FC-' || to_char(now(), 'YYMM') || '-' || lpad(nextval('booking_code_seq')::text, 4, '0');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists t_booking_code on bookings;
create trigger t_booking_code before insert on bookings
  for each row execute function generate_booking_code();

-- ============ RLS ============
alter table profiles enable row level security;
alter table branches enable row level security;
alter table staff_profiles enable row level security;
alter table parents enable row level security;
alter table children enable row level security;
alter table bookings enable row level security;
alter table sessions enable row level security;
alter table payments enable row level security;
alter table medical_records enable row level security;
alter table progress_notes enable row level security;
alter table progress_access_otp enable row level security;
alter table attendance_logs enable row level security;
alter table leave_requests enable row level security;
alter table gallery enable row level security;
alter table activity_logs enable row level security;

-- Helper
create or replace function current_role_val() returns user_role
language sql stable as $$ select role from profiles where id = auth.uid() $$;

-- Public read
drop policy if exists gallery_read on gallery;
create policy gallery_read on gallery for select using (is_visible);

drop policy if exists staff_profiles_public_read on staff_profiles;
create policy staff_profiles_public_read on staff_profiles for select using (is_visible);

-- Profiles
drop policy if exists profiles_self_read on profiles;
create policy profiles_self_read on profiles for select using (id = auth.uid() or current_role_val() = 'super_admin');

drop policy if exists profiles_admin_all on profiles;
create policy profiles_admin_all on profiles for all using (current_role_val() = 'super_admin') with check (current_role_val() = 'super_admin');

-- Branches
drop policy if exists branches_read on branches;
create policy branches_read on branches for select using (auth.uid() is not null);
drop policy if exists branches_admin on branches;
create policy branches_admin on branches for all using (current_role_val() = 'super_admin') with check (current_role_val() = 'super_admin');

-- Children/Parents/Bookings/Sessions — admin & staff internal
drop policy if exists internal_read_children on children;
create policy internal_read_children on children for select using (auth.uid() is not null);
drop policy if exists internal_write_children on children;
create policy internal_write_children on children for all using (current_role_val() in ('super_admin','admin_cabang')) with check (current_role_val() in ('super_admin','admin_cabang'));

drop policy if exists internal_read_parents on parents;
create policy internal_read_parents on parents for select using (auth.uid() is not null);
drop policy if exists internal_write_parents on parents;
create policy internal_write_parents on parents for all using (current_role_val() in ('super_admin','admin_cabang')) with check (current_role_val() in ('super_admin','admin_cabang'));

drop policy if exists internal_read_bookings on bookings;
create policy internal_read_bookings on bookings for select using (auth.uid() is not null);
drop policy if exists internal_write_bookings on bookings;
create policy internal_write_bookings on bookings for all using (current_role_val() in ('super_admin','admin_cabang')) with check (current_role_val() in ('super_admin','admin_cabang'));

drop policy if exists internal_read_sessions on sessions;
create policy internal_read_sessions on sessions for select using (auth.uid() is not null);
drop policy if exists internal_write_sessions on sessions;
create policy internal_write_sessions on sessions for all using (current_role_val() in ('super_admin','admin_cabang','psikolog','terapis')) with check (current_role_val() in ('super_admin','admin_cabang','psikolog','terapis'));

-- Payments (read only for admin)
drop policy if exists payments_read on payments;
create policy payments_read on payments for select using (current_role_val() in ('super_admin','admin_cabang'));

-- Medical records
drop policy if exists medical_records_read on medical_records;
create policy medical_records_read on medical_records for select using (current_role_val() in ('super_admin','psikolog'));
drop policy if exists medical_records_write on medical_records;
create policy medical_records_write on medical_records for all using (current_role_val() in ('super_admin','psikolog')) with check (current_role_val() in ('super_admin','psikolog'));

-- Progress notes (staff internal)
drop policy if exists progress_notes_read on progress_notes;
create policy progress_notes_read on progress_notes for select using (auth.uid() is not null);
drop policy if exists progress_notes_write on progress_notes;
create policy progress_notes_write on progress_notes for all using (current_role_val() in ('super_admin','psikolog','terapis')) with check (current_role_val() in ('super_admin','psikolog','terapis'));

-- Progress OTP — hanya di-manage oleh Edge Function service role. Client TIDAK boleh SELECT.
-- Policy default deny (no policy = no access untuk authenticated).

-- Attendance logs
drop policy if exists attendance_read on attendance_logs;
create policy attendance_read on attendance_logs for select using (staff_id = auth.uid() or current_role_val() in ('super_admin','admin_cabang'));
drop policy if exists attendance_write on attendance_logs;
create policy attendance_write on attendance_logs for insert with check (staff_id = auth.uid());

-- Leave requests
drop policy if exists leave_read on leave_requests;
create policy leave_read on leave_requests for select using (staff_id = auth.uid() or current_role_val() in ('super_admin','admin_cabang'));
drop policy if exists leave_write on leave_requests;
create policy leave_write on leave_requests for insert with check (staff_id = auth.uid());
drop policy if exists leave_review on leave_requests;
create policy leave_review on leave_requests for update using (current_role_val() in ('super_admin','admin_cabang')) with check (current_role_val() in ('super_admin','admin_cabang'));

-- Activity logs — admin read only
drop policy if exists activity_read on activity_logs;
create policy activity_read on activity_logs for select using (current_role_val() = 'super_admin');
