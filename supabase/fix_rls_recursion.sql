-- Fix RLS Recursion pada tabel profiles
--
-- MASALAH:
-- Helper `current_role_val()` melakukan SELECT dari `profiles`.
-- Karena `profiles` punya RLS, SELECT tersebut memicu RLS yang memanggil
-- `current_role_val()` lagi. Hasilnya: "infinite recursion detected in policy
-- for relation profiles" atau query menggantung.
--
-- SOLUSI:
-- Tandai `current_role_val()` sebagai SECURITY DEFINER agar bypass RLS
-- saat helper ini dijalankan.
--
-- Jalankan file ini di Supabase → SQL Editor → New query → Run.

create or replace function current_role_val()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid()
$$;

-- Pastikan hanya authenticated & anon yang bisa memanggil
revoke all on function current_role_val() from public;
grant execute on function current_role_val() to authenticated, anon;

-- Sanity check: policy self-read profiles harus tetap dominan.
-- Kalau policy sebelumnya belum ada karena error, buat ulang:
drop policy if exists profiles_self_read on profiles;
create policy profiles_self_read on profiles
  for select using (id = auth.uid() or current_role_val() = 'super_admin');

drop policy if exists profiles_admin_all on profiles;
create policy profiles_admin_all on profiles
  for all using (current_role_val() = 'super_admin')
  with check (current_role_val() = 'super_admin');
