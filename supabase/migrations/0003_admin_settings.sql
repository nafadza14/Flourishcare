-- FlourishCare — Admin Settings (harga booking + akses schedule editor)
-- Jalankan SETELAH 0002_booking_online.sql

-- ============ Tabel harga booking online ============
create table if not exists online_booking_prices (
  mode        online_booking_mode primary key,
  price       numeric(12,2) not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references profiles(id)
);

-- Seed harga default (Rp 225.000 untuk online & homecare)
insert into online_booking_prices (mode, price) values
  ('online',   225000),
  ('homecare', 225000)
on conflict (mode) do nothing;

-- RLS
alter table online_booking_prices enable row level security;

drop policy if exists online_prices_read on online_booking_prices;
create policy online_prices_read on online_booking_prices
  for select using (true);  -- public read (dipakai di halaman book)

drop policy if exists online_prices_admin on online_booking_prices;
create policy online_prices_admin on online_booking_prices
  for update using (current_role_val() in ('super_admin','admin_cabang'))
  with check (current_role_val() in ('super_admin','admin_cabang'));

-- Trigger updated_at
drop trigger if exists t_touch_online_prices on online_booking_prices;
create trigger t_touch_online_prices before update on online_booking_prices
  for each row execute function touch_updated_at();

-- ============ Grant tambahan untuk psychologist_schedules ============
-- Sudah ada policy admin di 0002, tinggal pastikan insert & delete diizinkan.
-- (0002 sudah pakai `for all` — sudah cukup, tidak perlu tambah.)

-- ============ RPC helper: list psychologists dengan schedule count ============
create or replace function admin_psychologists_summary()
returns table(
  id uuid,
  title text,
  photo_url text,
  schedule_count int
)
language sql stable as $$
  select
    sp.id,
    sp.title,
    sp.photo_url,
    (select count(*)::int from psychologist_schedules ps where ps.staff_id = sp.id and ps.is_active) as schedule_count
  from staff_profiles sp
  where sp.is_visible
  order by sp.display_order;
$$;

grant execute on function admin_psychologists_summary() to authenticated;
