-- Seed data awal untuk FlourishCare v1.1
-- Jalankan SETELAH 0001_initial_schema.sql
-- Catatan:
-- - Data staff Achla & Rofanny di sini adalah PLACEHOLDER (title, bio, str_number).
--   Lengkapi via Dashboard → Pengaturan atau update langsung di Supabase.
-- - profile_id staff dibiarkan null; hubungkan setelah akun auth.users dibuat.

-- Cabang utama
insert into branches (id, name, address, city, phone, is_active)
values (
  '00000000-0000-0000-0000-000000000001',
  'Klinik Mitra Diani',
  'Klinik Mitra Diani Lantai 2, Jl. PKP Raya No.1, Kelapa Dua Wetan, Ciracas, Jakarta Timur',
  'Jakarta Timur',
  null,
  true
) on conflict (id) do nothing;

-- Staff publik yang muncul di halaman Team
insert into staff_profiles (id, profile_id, title, slug, bio, photo_url, specialties, therapy_types, str_number, is_visible, display_order)
values
  (
    '00000000-0000-0000-0000-000000001001',
    null,
    'Achla — Psikolog Anak',
    'achla',
    'Psikolog anak yang berfokus pada asesmen tumbuh kembang dan pendampingan orang tua.',
    null,
    array['Asesmen Anak','Konseling Keluarga','Kesiapan Sekolah'],
    array['konsultasi']::therapy_type[],
    null,
    true,
    1
  ),
  (
    '00000000-0000-0000-0000-000000001002',
    null,
    'Rofanny — Terapis',
    'rofanny',
    'Terapis anak yang berpengalaman menangani berbagai kebutuhan tumbuh kembang.',
    null,
    array['Terapi Wicara','Sensori Integrasi'],
    array['TW','SI']::therapy_type[],
    null,
    true,
    2
  )
on conflict (id) do nothing;
