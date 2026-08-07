-- Fix sinkronisasi jadwal psikolog: pastikan slot tampil di booking wizard.
-- Jalankan di Supabase SQL Editor → New query → paste → Run.

-- ============ 1. Ensure RLS policies on psychologist_schedules ============

-- Idempotent re-create supaya kalau migration sebelumnya gagal, ini yang tegakkan.
alter table psychologist_schedules enable row level security;

drop policy if exists psi_schedules_read on psychologist_schedules;
create policy psi_schedules_read on psychologist_schedules
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists psi_schedules_admin on psychologist_schedules;
create policy psi_schedules_admin on psychologist_schedules
  for all
  to authenticated
  using (current_role_val() in ('super_admin','admin_cabang'))
  with check (current_role_val() in ('super_admin','admin_cabang'));

grant select on psychologist_schedules to anon, authenticated;

-- ============ 2. RPC online_available_slots — SECURITY DEFINER ============
-- Sub-query ke online_bookings di dalam function dulu di-block RLS untuk non-admin user.
-- Dengan SECURITY DEFINER, function bypass RLS dan bisa lihat SEMUA booking untuk cek konflik.

drop function if exists online_available_slots(uuid, date);

create or replace function online_available_slots(p_staff_id uuid, p_date date)
returns table(slot_time time, is_available boolean)
language sql
stable
security definer
set search_path = public
as $$
  with slots as (
    select
      (s.start_time + (interval '1 minute' * s.session_duration_min * gs.n))::time as slot_time,
      s.session_duration_min
    from psychologist_schedules s
    cross join generate_series(0, 11) as gs(n)
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

revoke all on function online_available_slots(uuid, date) from public;
grant execute on function online_available_slots(uuid, date) to anon, authenticated;

-- ============ 3. Diagnostic queries — buka di SQL Editor lain untuk cek ============
-- (Copy-paste & jalankan satu-satu untuk debug kalau masih tidak muncul)

-- Cek: apakah ada schedule aktif untuk psikolog tertentu?
--   select * from psychologist_schedules
--    where staff_id = '<paste-staff-id>' and is_active;

-- Cek: apa yang RPC return untuk hari & psi tertentu?
--   select * from online_available_slots('<staff-id>', '2026-08-10'::date);

-- Cek: daftar semua staff_profiles + jumlah schedule aktifnya
--   select sp.id, sp.title,
--          (select count(*) from psychologist_schedules ps
--            where ps.staff_id = sp.id and ps.is_active) as active_schedules
--     from staff_profiles sp
--     where sp.is_visible
--     order by sp.display_order;
