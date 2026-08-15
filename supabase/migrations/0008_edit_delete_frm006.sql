-- ================================================================
-- Migration 0008: Edit/Delete features + FRM-006 (Pemeriksaan Ulang)
--                 + therapy_type for FRM-008 + admin fee
-- ================================================================

-- 1. Kolom `therapy_type` untuk FRM-008 (BT / SI / OT / TW)
alter table public.development_reports
  add column if not exists therapy_type text check (therapy_type in ('BT','SI','OT','TW','LAINNYA'));

-- 2. Tambahkan kolom updated_at kalau belum ada (untuk track edit)
alter table public.patient_registrations
  add column if not exists updated_at timestamptz not null default now();
alter table public.medical_examinations
  add column if not exists updated_at timestamptz not null default now();
alter table public.development_reports
  add column if not exists updated_at timestamptz not null default now();

-- Trigger auto-update updated_at
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_touch_reg on public.patient_registrations;
create trigger trg_touch_reg before update on public.patient_registrations
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_touch_exam on public.medical_examinations;
create trigger trg_touch_exam before update on public.medical_examinations
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_touch_dev on public.development_reports;
create trigger trg_touch_dev before update on public.development_reports
  for each row execute function public.touch_updated_at();

-- 3. FRM-006 Laporan Pemeriksaan Ulang
create table if not exists public.reexamination_reports (
  id                      uuid primary key default gen_random_uuid(),
  child_id                uuid not null references children(id) on delete cascade,
  examiner_id             uuid not null references profiles(id),
  examination_date        date not null default current_date,
  patient_age             text,
  parent_name             text,
  address                 text,
  subjective_info         text,          -- Prenatal, natal, postnatal, dll
  objective_info          text,          -- Hasil observasi
  conclusion              text,          -- Kesimpulan
  additional_notes        text,
  signed_at               timestamptz,
  signed_by_name          text,
  signed_by_title         text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists reexam_child_idx on public.reexamination_reports(child_id);
create index if not exists reexam_date_idx on public.reexamination_reports(examination_date desc);

alter table public.reexamination_reports enable row level security;

drop policy if exists reexam_staff_all on public.reexamination_reports;
create policy reexam_staff_all on public.reexamination_reports
  for all to authenticated
  using (current_role_val() in ('super_admin','admin_cabang','psikolog','terapis'))
  with check (current_role_val() in ('super_admin','admin_cabang','psikolog','terapis'));

drop policy if exists reexam_parent_read on public.reexamination_reports;
create policy reexam_parent_read on public.reexamination_reports
  for select to authenticated
  using (exists (
    select 1 from children c
    join parents p on p.id = c.parent_id
    where c.id = child_id and p.auth_user_id = auth.uid()
  ));

drop trigger if exists trg_touch_reexam on public.reexamination_reports;
create trigger trg_touch_reexam before update on public.reexamination_reports
  for each row execute function public.touch_updated_at();

-- 4. RPC: hapus pendaftaran pasien sekaligus data anak & parent (kalau tidak dipakai)
create or replace function public.delete_patient_registration(p_registration_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_child_id uuid;
  v_parent_id uuid;
  v_role user_role;
begin
  select current_role_val() into v_role;
  if v_role is null or v_role not in ('super_admin') then
    raise exception 'Hanya super_admin yang boleh menghapus data pendaftaran pasien.';
  end if;

  select linked_child_id, linked_parent_id into v_child_id, v_parent_id
    from patient_registrations where id = p_registration_id;

  -- Hapus pendaftaran
  delete from patient_registrations where id = p_registration_id;

  -- Hapus child (kalau ada). Cascade akan bersihkan medical_examinations,
  -- development_reports, reexamination_reports, patient_attachments.
  if v_child_id is not null then
    delete from children where id = v_child_id;
  end if;

  -- Hapus parent kalau tidak punya anak lain lagi
  if v_parent_id is not null then
    if not exists (select 1 from children where parent_id = v_parent_id) then
      delete from parents where id = v_parent_id;
    end if;
  end if;
end;
$$;

grant execute on function public.delete_patient_registration(uuid) to authenticated;

-- 5. Biaya admin — CATATAN: enum online_booking_mode perlu di-ALTER dulu di query TERPISAH:
--    alter type public.online_booking_mode add value if not exists 'admin_fee';
-- Setelah itu (di query baru), jalankan:
--    insert into public.online_booking_prices (mode, price, updated_at)
--    values ('admin_fee', 25000, now())
--    on conflict (mode) do nothing;
-- PostgreSQL tidak mengizinkan penggunaan enum baru di statement/transaction yang sama dengan ALTER TYPE.

-- 6. Reload PostgREST schema cache
notify pgrst, 'reload schema';
