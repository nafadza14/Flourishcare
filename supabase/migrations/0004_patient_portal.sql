-- FlourishCare — Patient Portal RLS extensions
-- Jalankan SETELAH 0003_admin_settings.sql
--
-- Tujuan:
-- 1. Patient (user_id di online_bookings) bisa read online_bookings, online_payments, dan progress_notes miliknya.
-- 2. Patient bisa lihat rekam medis anaknya (dari relasi children.parent_id via parents.auth_user_id).
--
-- Data ownership diidentifikasi via:
-- - online_bookings.user_id = auth.uid()  (booking online yang mereka buat sendiri)
-- - parents.auth_user_id = auth.uid()      (relasi klinik-parent — dipakai untuk booking offline & rekam medis)

-- ============ RLS: online_bookings — pastikan owner bisa read ============
-- (Sudah ada di 0002, tapi kita re-affirm untuk kejelasan)
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

-- ============ RLS: online_payments — patient boleh lihat pembayaran booking-nya ============
-- (Sudah ada di 0002)

-- ============ RLS: progress_notes untuk patient ============
-- Patient boleh read progress_notes dari anaknya yang di-publish (is_shared=true).
drop policy if exists progress_notes_patient_read on progress_notes;
create policy progress_notes_patient_read on progress_notes
  for select using (
    is_shared = true
    and exists (
      select 1 from children c
       join parents p on p.id = c.parent_id
       where c.id = progress_notes.child_id
         and p.auth_user_id = auth.uid()
    )
  );

-- ============ RLS: medical_records untuk patient ============
-- Patient boleh read rekam medis anaknya (jika kelak di-share via kolom visibility).
drop policy if exists medical_records_patient_read on medical_records;
create policy medical_records_patient_read on medical_records
  for select using (
    visibility = 'shared_to_parent'
    and exists (
      select 1 from children c
       join parents p on p.id = c.parent_id
       where c.id = medical_records.child_id
         and p.auth_user_id = auth.uid()
    )
  );

-- Tambah opsi 'shared_to_parent' ke visibility medical_records (kalau belum ada).
-- (kolom visibility = text, jadi bebas — cukup catat konvensi baru di sini.)

-- ============ RLS: children — patient bisa read anaknya sendiri ============
drop policy if exists children_patient_read on children;
create policy children_patient_read on children
  for select using (
    exists (
      select 1 from parents p
       where p.id = children.parent_id
         and p.auth_user_id = auth.uid()
    )
    or current_role_val() in ('super_admin','admin_cabang','psikolog','terapis')
  );

-- ============ RLS: parents — self read ============
drop policy if exists parents_self_read on parents;
create policy parents_self_read on parents
  for select using (
    auth_user_id = auth.uid()
    or current_role_val() in ('super_admin','admin_cabang','psikolog','terapis')
  );

drop policy if exists parents_self_update on parents;
create policy parents_self_update on parents
  for update using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

drop policy if exists parents_signup_insert on parents;
create policy parents_signup_insert on parents
  for insert with check (auth_user_id = auth.uid());

-- ============ RPC: patient overview snapshot ============
-- Return ringkasan untuk patient portal (jumlah booking, upcoming session, dll)
create or replace function patient_portal_summary()
returns table(
  total_bookings int,
  total_paid_amount numeric,
  upcoming_count int,
  completed_count int
)
language sql stable security definer
set search_path = public
as $$
  select
    (select count(*)::int from online_bookings where user_id = auth.uid()),
    (select coalesce(sum(op.amount),0) from online_payments op
       join online_bookings ob on ob.id = op.booking_id
      where ob.user_id = auth.uid() and op.status = 'paid'),
    (select count(*)::int from online_bookings
      where user_id = auth.uid() and scheduled_at >= now() and status in ('confirmed','awaiting_confirmation')),
    (select count(*)::int from online_bookings
      where user_id = auth.uid() and status = 'completed')
$$;

grant execute on function patient_portal_summary() to authenticated;
