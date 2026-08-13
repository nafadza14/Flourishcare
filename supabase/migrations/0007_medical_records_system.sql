-- FlourishCare — Comprehensive Medical Records System
-- Jalankan SETELAH 0006_team_updates.sql
--
-- Mencakup:
-- 1. patient_registrations (FRM-007) : form pendaftaran dari assessment.flourishcare.id
-- 2. medical_examinations (FRM-005) : laporan pemeriksaan oleh psikolog
-- 3. development_reports (FRM-008)  : laporan perkembangan tiap sesi terapi
-- 4. patient_attachments             : file upload dari akun pasien (rekam medis sebelumnya)
-- 5. RM number generator             : FC-YYMM-XXXX

-- ============ 1. Patient Registrations (FRM-007) ============

do $$ begin
  create type registration_status as enum ('pending_rm','rm_assigned','archived');
exception when duplicate_object then null; end $$;

create table if not exists patient_registrations (
  id                    uuid primary key default gen_random_uuid(),
  code                  text unique,                       -- REG-YYMM-XXXX auto
  submitted_at          timestamptz not null default now(),
  submitter_email       citext,                             -- kalau user login saat submit
  submitter_user_id     uuid references auth.users(id),

  -- 1. Identitas Pasien
  patient_name          text not null,
  place_of_birth        text,
  date_of_birth         date,
  gender                gender not null,
  religion              text,
  ethnicity             text,
  parent_hopes          text,                               -- Harapan
  therapy_history       text,                               -- Riwayat Terapi
  consultation_history  text,                               -- Riwayat Konsultasi

  -- Riwayat Keluhan
  chief_complaint       text,                               -- Keluhan Utama
  disease_history       text,                               -- Riwayat Penyakit
  birth_history         text,                               -- Riwayat Kelahiran
  development_history   text,                               -- Riwayat Tumbuh Kembang

  child_order           int,                                -- Anak ke-
  child_status          text,                               -- Kandung / Angkat

  -- 2. Identitas Orang Tua (Ayah)
  father_name           text,
  father_pob            text,
  father_dob            date,
  father_religion       text,
  father_address        text,
  father_occupation     text,
  father_marriage_order int,
  father_marriage_age   int,
  father_education      text,

  -- 2. Identitas Orang Tua (Ibu)
  mother_name           text,
  mother_pob            text,
  mother_dob            date,
  mother_religion       text,
  mother_address        text,
  mother_occupation     text,
  mother_marriage_order int,
  mother_marriage_age   int,
  mother_education      text,

  -- 3. Saudara (array of objects — flexible: {name, gender, order, age})
  siblings              jsonb not null default '[]',

  -- Status & RM
  status                registration_status not null default 'pending_rm',
  rm_number             text unique,                       -- diisi manual admin
  rm_assigned_at        timestamptz,
  rm_assigned_by        uuid references profiles(id),
  linked_child_id       uuid references children(id),      -- terisi setelah RM di-assign
  linked_parent_id      uuid references parents(id),

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists patient_registrations_status_idx on patient_registrations(status, submitted_at desc);

-- Trigger touch_updated_at
drop trigger if exists t_touch_registrations on patient_registrations;
create trigger t_touch_registrations before update on patient_registrations
  for each row execute function touch_updated_at();

-- Generator code REG-YYMM-XXXX
create sequence if not exists registration_code_seq;
create or replace function generate_registration_code()
returns trigger as $$
begin
  if new.code is null or new.code = '' then
    new.code := 'REG-' || to_char(now(), 'YYMM') || '-' ||
                lpad(nextval('registration_code_seq')::text, 4, '0');
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists t_registration_code on patient_registrations;
create trigger t_registration_code before insert on patient_registrations
  for each row execute function generate_registration_code();

-- RLS
alter table patient_registrations enable row level security;

-- Public boleh insert (submit form dari assessment subdomain, mungkin anonymous)
drop policy if exists registrations_public_insert on patient_registrations;
create policy registrations_public_insert on patient_registrations
  for insert to anon, authenticated
  with check (status = 'pending_rm');

-- Submitter authenticated bisa lihat registrasi sendiri
drop policy if exists registrations_owner_read on patient_registrations;
create policy registrations_owner_read on patient_registrations
  for select to authenticated
  using (submitter_user_id = auth.uid() or current_role_val() in ('super_admin','admin_cabang','psikolog','terapis'));

-- Admin bisa update (assign RM, ubah status)
drop policy if exists registrations_admin_update on patient_registrations;
create policy registrations_admin_update on patient_registrations
  for update to authenticated
  using (current_role_val() in ('super_admin','admin_cabang'))
  with check (current_role_val() in ('super_admin','admin_cabang'));


-- ============ 2. Medical Examinations (FRM-005) ============

create table if not exists medical_examinations (
  id                    uuid primary key default gen_random_uuid(),
  child_id              uuid not null references children(id) on delete cascade,
  examiner_id           uuid not null references profiles(id),

  examination_date      date not null default current_date,
  patient_age           text,                               -- e.g. "5 tahun 3 bulan"
  chief_complaint       text,
  diagnosis             text,

  -- Kondisi umum (jsonb — flexible untuk motorik kasar, tengkurap dll)
  general_condition     jsonb not null default '{}',
  -- example:
  -- {
  --   "prenatal": "normal", "natal": "sesar", "postnatal": "...",
  --   "tengkurap": {"ok": true, "notes": "usia 5 bulan"},
  --   "duduk": {"ok": true, "notes": ""}, "merayap": {}, "merangkak": {},
  --   "berdiri": {}, "jalan": {}, "lari": {}, "lompat": {}
  -- }

  -- Aspek Bahasa
  language_aspects      jsonb not null default '{}',
  -- { "joint_attention": "optimal", "respon_panggil": "kurang_optimal",
  --   "ekspresif": {...}, "reseptif": "..." }

  -- Aspek Motorik
  motor_aspects         jsonb not null default '{}',
  -- { "motorik_kasar": "optimal", "motorik_halus": "kurang_optimal" }

  -- Aspek Sensorik
  sensory_aspects       jsonb not null default '{}',
  -- { "taktil": "optimal", "visual": "optimal", "auditori": "...", ... }

  -- Aspek Lainnya
  other_aspects         jsonb not null default '{}',
  -- { "control_impulse": "impulsif", "regulasi_emosi": "...", "kemampuan_adaptasi": "...",
  --   "aktivitas_keseharian": {...}, "aktivitas_kemandirian": {...} }

  -- Rencana Lanjutan (array checkbox)
  follow_up_plan        text[] not null default '{}',       -- ['observasi_berkala','ases_lanjutan','rujukan_medis','BT','OT','TW','FT','SI']

  additional_notes      text,
  subjective_info       text,
  objective_info        text,
  conclusion            text,

  -- Signature block
  signed_at             timestamptz,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists exam_child_idx on medical_examinations(child_id, examination_date desc);
create index if not exists exam_examiner_idx on medical_examinations(examiner_id);

drop trigger if exists t_touch_exams on medical_examinations;
create trigger t_touch_exams before update on medical_examinations
  for each row execute function touch_updated_at();

alter table medical_examinations enable row level security;

drop policy if exists exam_staff_read on medical_examinations;
create policy exam_staff_read on medical_examinations
  for select to authenticated
  using (current_role_val() in ('super_admin','admin_cabang','psikolog','terapis'));

drop policy if exists exam_psi_write on medical_examinations;
create policy exam_psi_write on medical_examinations
  for all to authenticated
  using (current_role_val() in ('super_admin','psikolog'))
  with check (current_role_val() in ('super_admin','psikolog'));

-- Patient boleh baca yang di-share
drop policy if exists exam_patient_read on medical_examinations;
create policy exam_patient_read on medical_examinations
  for select to authenticated
  using (
    exists (
      select 1 from children c
      join parents p on p.id = c.parent_id
      where c.id = medical_examinations.child_id
        and p.auth_user_id = auth.uid()
    )
  );


-- ============ 3. Development Reports (FRM-008) ============

create table if not exists development_reports (
  id                uuid primary key default gen_random_uuid(),
  child_id          uuid not null references children(id) on delete cascade,
  therapist_id      uuid not null references profiles(id),
  session_id        uuid references sessions(id),

  therapy_date      date not null default current_date,
  session_no        int,                                    -- e.g. sesi ke-3
  session_total     int not null default 12,

  -- 1. Kondisi Anak saat Datang
  mood              text,                                   -- baik / cukup / kurang_tenang
  energy            text,                                   -- tinggi / sedang / rendah

  -- 2. Aktivitas Terapi & Respon (array of activities)
  activities        jsonb not null default '[]',
  -- [{ "aktivitas": "Puzzle 10 pcs", "durasi": "10 mnt", "bantuan": "minimal", "respon": "antusias" }, ...]

  -- 3. Hambatan (array boolean checkboxes)
  obstacles         text[] not null default '{}',
  -- ['menolak','terdistraksi','tantrum','menangis','sulit_transisi','sensitif_sensori','agresif','tidak_ada']

  -- 4. Program Latihan di Rumah
  home_program      text,

  signed_at         timestamptz,
  signed_by_name    text,
  signed_by_title   text,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists dev_child_idx on development_reports(child_id, therapy_date desc);
create index if not exists dev_therapist_idx on development_reports(therapist_id);

drop trigger if exists t_touch_dev_reports on development_reports;
create trigger t_touch_dev_reports before update on development_reports
  for each row execute function touch_updated_at();

alter table development_reports enable row level security;

drop policy if exists dev_staff_read on development_reports;
create policy dev_staff_read on development_reports
  for select to authenticated
  using (current_role_val() in ('super_admin','admin_cabang','psikolog','terapis'));

drop policy if exists dev_staff_write on development_reports;
create policy dev_staff_write on development_reports
  for all to authenticated
  using (current_role_val() in ('super_admin','psikolog','terapis'))
  with check (current_role_val() in ('super_admin','psikolog','terapis'));

drop policy if exists dev_patient_read on development_reports;
create policy dev_patient_read on development_reports
  for select to authenticated
  using (
    exists (
      select 1 from children c
      join parents p on p.id = c.parent_id
      where c.id = development_reports.child_id
        and p.auth_user_id = auth.uid()
    )
  );


-- ============ 4. Patient Attachments (upload rekam medis sebelumnya) ============

create table if not exists patient_attachments (
  id                uuid primary key default gen_random_uuid(),
  child_id          uuid references children(id) on delete cascade,
  registration_id   uuid references patient_registrations(id) on delete cascade,
  uploader_id       uuid references auth.users(id),

  file_name         text not null,
  file_path         text not null,                          -- path di Supabase Storage bucket
  file_size         int,
  mime_type         text,
  category          text,                                   -- 'assessment_prior','psikolog_dsa','rekam_medis','lainnya'
  description       text,

  created_at        timestamptz not null default now()
);

create index if not exists attach_child_idx on patient_attachments(child_id, created_at desc);
create index if not exists attach_reg_idx on patient_attachments(registration_id);

alter table patient_attachments enable row level security;

drop policy if exists attach_owner_read on patient_attachments;
create policy attach_owner_read on patient_attachments
  for select to authenticated
  using (
    uploader_id = auth.uid()
    or current_role_val() in ('super_admin','admin_cabang','psikolog','terapis')
    or exists (
      select 1 from children c
      join parents p on p.id = c.parent_id
      where c.id = patient_attachments.child_id
        and p.auth_user_id = auth.uid()
    )
  );

drop policy if exists attach_owner_insert on patient_attachments;
create policy attach_owner_insert on patient_attachments
  for insert to authenticated
  with check (uploader_id = auth.uid());

drop policy if exists attach_owner_delete on patient_attachments;
create policy attach_owner_delete on patient_attachments
  for delete to authenticated
  using (uploader_id = auth.uid() or current_role_val() in ('super_admin','admin_cabang'));


-- ============ 5. RM Number generator helper ============
-- Format: FC-YYMM-XXXX (auto sequential per bulan)

create sequence if not exists rm_number_seq;

create or replace function next_rm_number()
returns text
language sql
security definer
set search_path = public
as $$
  select 'FC-RM-' || to_char(now(), 'YYMM') || '-' ||
         lpad(nextval('rm_number_seq')::text, 4, '0');
$$;

grant execute on function next_rm_number() to authenticated;


-- ============ 6. RPC: assign RM to registration ============
-- Ketika admin input RM, sekaligus buat rows di `parents` & `children`
-- dan link ke registrasi.

create or replace function assign_rm_to_registration(
  p_registration_id uuid,
  p_rm_number text
)
returns table(child_id uuid, parent_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reg patient_registrations%rowtype;
  v_parent_id uuid;
  v_child_id uuid;
  v_branch_id uuid;
  v_wa text;
begin
  -- Cek caller
  if current_role_val() not in ('super_admin','admin_cabang') then
    raise exception 'Hanya super_admin/admin_cabang yang boleh assign RM';
  end if;

  select * into v_reg from patient_registrations where id = p_registration_id;
  if not found then raise exception 'Registration tidak ditemukan'; end if;
  if v_reg.status = 'rm_assigned' then raise exception 'RM sudah ter-assign'; end if;

  -- Cek RM belum dipakai
  if exists (select 1 from children where rm_number = p_rm_number) then
    raise exception 'Nomor RM % sudah digunakan', p_rm_number;
  end if;

  -- Get first branch (single klinik)
  select id into v_branch_id from branches order by created_at limit 1;

  -- Insert parent (kalau belum ada by email)
  v_wa := coalesce(v_reg.father_address, v_reg.mother_address, '');  -- WA dari registration tidak ada, pakai email/pending
  insert into parents (full_name, whatsapp, email, address, auth_user_id)
  values (
    coalesce(v_reg.father_name, v_reg.mother_name, 'Wali'),
    '',  -- WA tidak ada di FRM-007, admin bisa lengkapi manual nanti
    coalesce(v_reg.submitter_email::text, 'unknown@flourishcare.id'),
    coalesce(v_reg.father_address, v_reg.mother_address, ''),
    v_reg.submitter_user_id
  )
  returning id into v_parent_id;

  -- Insert child dengan RM
  insert into children (parent_id, rm_number, full_name, dob, gender, primary_condition, notes)
  values (
    v_parent_id,
    p_rm_number,
    v_reg.patient_name,
    coalesce(v_reg.date_of_birth, current_date),
    v_reg.gender,
    v_reg.chief_complaint,
    v_reg.development_history
  )
  returning id into v_child_id;

  -- Update registration
  update patient_registrations set
    status = 'rm_assigned',
    rm_number = p_rm_number,
    rm_assigned_at = now(),
    rm_assigned_by = auth.uid(),
    linked_child_id = v_child_id,
    linked_parent_id = v_parent_id
  where id = p_registration_id;

  return query select v_child_id, v_parent_id;
end;
$$;

grant execute on function assign_rm_to_registration(uuid, text) to authenticated;

-- ============ 7. STORAGE — patient-attachments bucket ============
-- Bucket ini diciptakan lewat Dashboard Supabase, tapi kita dokumentasikan di sini.
-- Buka: Supabase Dashboard → Storage → New bucket
--   Name: patient-attachments
--   Public: NO
--   File size limit: 20 MB
-- Kemudian buat policy:
--   INSERT: authenticated (dengan check owner)
--   SELECT: authenticated
--   DELETE: authenticated (dengan check owner atau admin)

-- Auto-create bucket + policies (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'patient-attachments',
  'patient-attachments',
  false,
  20971520,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Helper: is auth.uid() the parent of the child folder in path?
--   path convention: <child_id>/<timestamp>_<name>
create or replace function public.is_child_parent(p_child_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from children c
    join parents p on p.id = c.parent_id
    where c.id = p_child_id and p.auth_user_id = auth.uid()
  );
$$;

grant execute on function public.is_child_parent(uuid) to authenticated;

-- Storage policies
drop policy if exists patient_attach_insert on storage.objects;
create policy patient_attach_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'patient-attachments'
    and (
      current_role_val() in ('super_admin','admin_cabang','psikolog','terapis')
      or public.is_child_parent((split_part(name, '/', 1))::uuid)
    )
  );

drop policy if exists patient_attach_select on storage.objects;
create policy patient_attach_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'patient-attachments'
    and (
      current_role_val() in ('super_admin','admin_cabang','psikolog','terapis')
      or public.is_child_parent((split_part(name, '/', 1))::uuid)
    )
  );

drop policy if exists patient_attach_delete on storage.objects;
create policy patient_attach_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'patient-attachments'
    and (
      current_role_val() in ('super_admin','admin_cabang')
      or public.is_child_parent((split_part(name, '/', 1))::uuid)
    )
  );
