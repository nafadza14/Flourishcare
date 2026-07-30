# 07 — Engineering Guidelines

**Produk:** FlourishCare.id
**Versi:** 1.0
**Audiens:** Setiap developer yang mengubah kode di repo `Flourishcare`.

Tujuan: menjaga konsistensi, keamanan, dan kualitas kode di sepanjang siklus hidup produk. Panduan ini ringkas — pilih standar, tegakkan otomatis.

---

## 1. Prinsip Umum

1. **Konsistensi > preferensi pribadi.** Kalau ada aturan di dokumen ini, ikuti — meski Anda punya style favorit sendiri.
2. **Automate the guard.** Semua aturan yang bisa di-lint harus di-lint. Manual review hanya untuk yang tidak bisa dilint.
3. **Small PR.** Idealnya < 400 baris berubah. PR besar dipecah.
4. **Prod-first.** Setiap perubahan harus aman untuk production (env-var, RLS, error boundary, loading state).
5. **Documented decisions.** Keputusan arsitektur non-obvious ditulis di `docs/adr/NNNN-*.md`.

---

## 2. Tooling Wajib

- **Node** — versi LTS terbaru (≥ 20).
- **npm** — sesuai `package-lock.json` yang di-commit.
- **TypeScript** — `strict: true` (aktifkan; saat ini masih false).
- **ESLint** — `eslint-config-react`, `@typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`.
- **Prettier** — konfigurasi default + `printWidth: 100`.
- **Husky + lint-staged** — pre-commit hook menjalankan `eslint --fix` + `prettier --write` + `tsc --noEmit` pada file yang berubah.
- **Vitest + React Testing Library** — unit & component test.
- **Playwright** — E2E (login, booking wizard end-to-end).
- **Storybook** (opsional) — dokumentasi komponen UI.

Script standar di `package.json`:
```json
{
  "dev": "vite --host 0.0.0.0",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext .ts,.tsx",
  "format": "prettier --write .",
  "test": "vitest",
  "test:e2e": "playwright test",
  "typecheck": "tsc --noEmit"
}
```

---

## 3. Struktur Repo & Naming

- Folder mengikuti `02-Software-Architecture.md` §3.
- File TSX komponen React → `PascalCase.tsx`.
- File hook/utility TS → `camelCase.ts` (`useAuth.ts`, `format.ts`).
- Satu komponen per file (kecuali sub-komponen private).
- Test co-located: `Button.tsx` + `Button.test.tsx`.
- Barrel `index.ts` diperbolehkan untuk `components/ui/`, tidak untuk `pages/`.

---

## 4. TypeScript

- `strict: true` (aktifkan).
- `noImplicitAny: true`, `noUnusedLocals: true`, `noUnusedParameters: true`.
- Type dari Supabase: generate otomatis `supabase gen types typescript --project-id <id> > src/types/database.ts` dan re-generate saat schema berubah.
- Hindari `any`. Kalau tidak bisa dihindari (mis. legacy), tandai `// TODO(type): ...`.
- Prefer `type` alias untuk union & primitif; `interface` untuk shape yang mungkin di-`extend`.
- Discriminated union untuk state (`type LoadState = {status:'idle'} | {status:'loading'} | {status:'error', err:Error} | {status:'ok', data:T}`).

---

## 5. React

- **React 19** — pakai `use()` untuk membuka promise di komponen jika perlu.
- Function component saja, no class.
- Hooks aturan: **rules-of-hooks** di top-level; jangan bersyarat.
- Pisahkan komponen "presentational" (dumb) dan "container" (fetch/state).
- Hindari `useEffect` untuk fetch data — gunakan React Query.
- Hindari memoize prematur (`useMemo`/`useCallback`) — hanya kalau ada profil ukur.
- Key list: gunakan id stabil, bukan index.
- Prop drilling > 2 tingkat = pindah ke context/query.

---

## 6. Styling (Tailwind v4)

- Konfigurasi via `@theme` di `src/index.css` (bukan `tailwind.config.js`).
- Warna brand di-token (`--color-primary`, `--color-secondary`, `--color-background`, `--color-text-primary`, `--color-text-secondary`).
- Font system via CSS variable, load via preconnect di `<head>`.
- Gunakan `cn(...)` (dari `src/lib/utils.ts`) untuk conditional class.
- Hindari class arbitrary panjang (`shadow-[0_0_15px_rgba(...)]`); buat token di `@theme`.
- Komponen UI reusable (Button, Input, Modal, Badge) menggunakan **cva** (`class-variance-authority`) untuk varian.

---

## 7. Motion

- Pakai **satu** library: `framer-motion` (bukan campur `motion` dan `framer-motion`).
- Definisi `fadeUp`, `staggerContainer`, dll di `src/lib/motion.ts` — jangan di-copy antar file.
- Respect `prefers-reduced-motion` — bungkus dengan hook `useReducedMotion()`.

---

## 8. Data Fetching (React Query)

- Query key konvensi: `['bookings', 'list', {filter}]`, `['bookings', 'byId', id]`.
- Semua network call di `features/<domain>/api.ts` — komponen tidak memanggil `supabase.from` langsung.
- Mutasi selalu punya `onError` yang menampilkan toast + `onSuccess` invalidate query terkait.
- Set stale time defaut 30 detik; override per query.

---

## 9. Form

- **react-hook-form** + **zod** + `@hookform/resolvers/zod`.
- Skema Zod di `src/lib/validation.ts`.
- Pesan error dalam Bahasa Indonesia.
- Field wajib ditandai visual (`*`) dan `aria-required`.

---

## 10. Aksesibilitas

- Semua interaksi keyboard-accessible; test dengan Tab.
- `focus-visible` selalu terlihat.
- Modal:
  - `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
  - Focus trap.
  - `Esc` menutup.
  - Restore focus ke trigger.
- Alt image deskriptif; ikon dekoratif `aria-hidden="true"`.
- Warna kontras minimum WCAG AA (4.5:1 body, 3:1 heading besar).
- `<html lang="id">`.

---

## 11. Keamanan

- **Tidak ada credential di git.** `git secret scan` (Gitleaks) di CI.
- Semua kredensial via `import.meta.env.VITE_*` (client) atau `Deno.env.get(...)` (Edge Function).
- Service role key **tidak pernah** di client.
- Validasi input di UI + validasi ulang di server (Zod di Edge Function).
- Escape HTML (React default) — hindari `dangerouslySetInnerHTML`.
- Header keamanan Vercel (`vercel.json`):
  ```json
  {
    "headers": [{
      "source": "/(.*)",
      "headers": [
        {"key":"Content-Security-Policy","value":"default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; connect-src 'self' https://*.supabase.co https://api.curator.io"},
        {"key":"X-Content-Type-Options","value":"nosniff"},
        {"key":"Referrer-Policy","value":"strict-origin-when-cross-origin"},
        {"key":"Permissions-Policy","value":"camera=(self), geolocation=(self), microphone=()"}
      ]
    }]
  }
  ```

---

## 12. Testing

- **Unit / component:** Vitest + RTL. Target coverage prioritas: `features/booking/**`, `features/auth/**`, `components/ui/**`, `lib/**`.
- **E2E:** Playwright — happy path booking wizard, login, ProtectedRoute redirect, dashboard tab switch.
- CI menjalankan `npm run lint && npm run typecheck && npm run test -- --run && npm run build` di PR.
- Merge dilarang jika CI merah.

---

## 13. Git & PR

- Branch: `main` (production), `feat/<topic>`, `fix/<topic>`, `chore/<topic>`.
- Commit message: **Conventional Commits** — `feat(booking): add slot conflict check`, `fix(auth): guard dashboard route`, `chore(deps): bump react to 19.1`.
- Squash-merge ke `main`.
- PR template minimal:
  - Ringkasan perubahan.
  - Screenshot / video (UI).
  - Cara test manual.
  - Checklist: lint, tests, migration SQL (jika ada), env vars baru (jika ada).

---

## 14. Vercel & Vercel Env

- **Environment:** Development / Preview / Production.
- **Wajib set:**
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_WA_NUMBER`
  - `VITE_CURATOR_FEED_ID`
- **Preview per PR:** aktif; URL preview di komentar PR.
- **Rollback:** via Vercel dashboard atau `vercel rollback <deployment-url>`.
- **Domain:** `flourishcare.id` (produksi) + `www` (redirect).

---

## 15. Supabase

- Semua perubahan schema via **migration file** di `supabase/migrations/*.sql`, tidak edit langsung di Studio production.
- Local dev: `supabase start` (Docker) → schema selalu match production.
- Preview environment: gunakan project Supabase branch (Supabase Preview Branches, jika tersedia) atau project terpisah `flourishcare-staging`.
- RLS **wajib** untuk setiap tabel bisnis; migration yang membuat tabel tanpa RLS ditolak review.

---

## 16. Logging & Error Handling

- Root `ErrorBoundary` di `App.tsx` — degradasi anggun dengan tombol muat ulang.
- Client error → Sentry (roadmap) dengan user context (id + role).
- Console error di produksi = red flag — muncul di release notes.
- Tampilkan pesan error yang bisa dimengerti user; sembunyikan detail teknis.

---

## 17. Kinerja

- Code splitting per route: `const Dashboard = React.lazy(() => import('./pages/Dashboard'))`.
- Gambar: `<img loading="lazy" width="..." height="..." alt="..." />` untuk mencegah CLS.
- Font: preconnect + font-display swap.
- Bundle ≤ 200 KB gzip untuk halaman publik utama.
- Lighthouse ≥ 90 (Perf, A11y, Best Practice, SEO) di PR CI (via `@lhci/cli`).

---

## 18. Aturan Copywriting

- Bahasa Indonesia untuk seluruh copy publik & dashboard.
- Angka klaim (jumlah keluarga, rating, radius) diambil dari **satu sumber** di `config/constants.ts` — hindari inkonsistensi copywriting.
- Alamat & jam operasional dikelola di tabel `branches` — jangan hardcode.

---

## 19. Dependencies

- Tambah dependency wajib disertai justifikasi di PR.
- Hindari duplikasi (mis. `motion` vs `framer-motion`).
- `express`, `dotenv`, `tsx`, `@google/genai` → **hapus** dari `package.json` jika tidak dipakai (baseline saat ini semua tidak dipakai).
- Update dependency: Dependabot / Renovate mingguan; review breaking change.

---

## 20. Rilis

- **Versioning:** semver di `package.json` (`v0.x` sampai launch publik; `v1.0.0` saat GA).
- **Changelog:** `CHANGELOG.md` mengikuti "Keep a Changelog".
- **Tag rilis:** `v<semver>` di GitHub; Vercel deploy production dari tag.

---

## 21. Definition of Done

Sebuah PR dianggap "done" hanya jika:
- Fitur berperilaku sesuai spesifikasi (`03`/`05`).
- Tests baru menambah coverage untuk skenario baru.
- Tidak menurunkan Lighthouse.
- Env vars & migration terdokumentasi.
- Copywriting sudah review (Bahasa Indonesia, konsisten).
- A11y check dasar lulus (Tab-through, screen reader spot-check).
- Screenshot before/after untuk perubahan UI.
