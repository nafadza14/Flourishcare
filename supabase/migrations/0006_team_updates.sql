-- FlourishCare — Team update: rename Rofanny → Roffany, tambah Putri Solihah (terapis)
-- Jalankan SETELAH 0005_fix_slots_sync.sql

-- ============ 1. Tambah kolom is_bookable_online ============
-- Untuk membedakan psikolog (bisa di-book online) vs terapis (tidak bisa)
alter table staff_profiles
  add column if not exists is_bookable_online boolean not null default true;

-- ============ 2. Update Achla — bookable online ============
update staff_profiles
   set title = 'Achla Himmah, M.Psi., Psikolog',
       is_bookable_online = true
 where id = '00000000-0000-0000-0000-000000001001';

-- ============ 3. Update Rofanny → Roffany Hasnatu P K, M.Psi., Psikolog ============
update staff_profiles
   set title = 'Roffany Hasnatu P K, M.Psi., Psikolog',
       slug = 'roffany-hasnatu-p-k',
       bio = 'Psikolog anak yang berdedikasi mendampingi anak dan orang tua di setiap tahap tumbuh kembang. Roffany berpengalaman dalam asesmen perkembangan, konseling anak, serta membantu keluarga menyusun strategi intervensi yang selaras dengan kebutuhan si kecil.',
       photo_url = '/team/roffany.jpeg',
       specialties = array['Asesmen Perkembangan','Konseling Anak','Intervensi Terapi','Kolaborasi Keluarga'],
       therapy_types = array['konsultasi']::therapy_type[],
       is_bookable_online = true,
       display_order = 2
 where id = '00000000-0000-0000-0000-000000001002';

-- ============ 4. Insert Putri Solihah (Terapis, tidak bookable online) ============
insert into staff_profiles (id, profile_id, title, slug, bio, photo_url, specialties, therapy_types, is_visible, is_bookable_online, display_order)
values (
  '00000000-0000-0000-0000-000000001004',
  null,
  'Putri Solihah, Terapis Anak',
  'putri-solihah',
  'Terapis anak yang berpengalaman dalam berbagai jenis terapi tumbuh kembang. Putri mendampingi anak-anak dalam sesi terapi on-site di Klinik Mitra Diani dengan pendekatan yang hangat dan menyenangkan.',
  null,
  array['Terapi Wicara','Sensori Integrasi','Okupasi Terapi'],
  array['TW','SI','OT']::therapy_type[],
  true,
  false,   -- terapis: tidak muncul di booking online, hanya di halaman Team
  3
) on conflict (id) do update
   set title = excluded.title,
       bio = excluded.bio,
       specialties = excluded.specialties,
       therapy_types = excluded.therapy_types,
       is_visible = excluded.is_visible,
       is_bookable_online = excluded.is_bookable_online,
       display_order = excluded.display_order;

-- ============ 5. (Opsional) Sembunyikan Azna jika tidak diinginkan ============
-- Uncomment kalau Azna tidak lagi diperlukan:
-- update staff_profiles set is_visible = false, is_bookable_online = false
--   where id = '00000000-0000-0000-0000-000000001003';
