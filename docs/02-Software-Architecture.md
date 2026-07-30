# 02 — Software Architecture

**Produk:** FlourishCare.id
**Versi:** 1.0
**Stack aktual:** React 19 + Vite 6 + TypeScript 5.8 + Tailwind CSS v4 + Supabase (Auth + Postgres) + Vercel

---

## 1. Diagram Konteks (High Level)

```
┌────────────────────────┐            ┌─────────────────────────┐
│   Browser (Chrome,     │  HTTPS     │        Vercel Edge      │
│   Safari, Firefox,     ├───────────►│  (Static React SPA +    │
│   Mobile Safari, etc.) │            │   SPA rewrite index)    │
└──────────┬─────────────┘            └───────────┬─────────────┘
           │                                       │
           │ HTTPS (JSON)                          │ (no server code
           ▼                                       │  saat ini)
   ┌───────────────────┐
   │  Supabase Cloud   │◄──── PostgREST / GoTrue / Realtime ────┐
   │  - Auth (GoTrue)  │                                        │
   │  - Postgres+RLS   │                                        │
   │  - Storage        │                                        │
   │  - Edge Functions │                                        │
   └───────┬───────────┘                                        │
           │                                                    │
           ▼                                                    │
   ┌───────────────────┐   ┌─────────────────┐   ┌─────────────┴────┐
   │   Midtrans /      │   │  WhatsApp Cloud │   │ Curator.io       │
   │   Xendit (roadmap)│   │  API (roadmap)  │   │ (Instagram feed) │
   └───────────────────┘   └─────────────────┘   └──────────────────┘
```

## 2. Prinsip Arsitektur

1. **SPA-first, backend-as-a-service.** Tidak ada server Node/Express milik sendiri; seluruh logika data ditangani Supabase (Postgres, Auth, RLS, Edge Functions untuk sisi server sensitif).
2. **Vercel = pipeline deployment tunggal.** Push ke `main` di GitHub → Vercel build → deploy production. Preview per PR otomatis.
3. **Security-at-the-database.** Otorisasi ditegakkan lewat RLS Postgres, bukan hanya di client. Peran client-side hanya untuk UX (menampilkan/menyembunyikan menu).
4. **Env-var driven.** Semua kunci/URL eksternal dibaca dari `import.meta.env.VITE_*` — tidak ada credential hardcoded (baseline saat ini: `src/lib/supabase.ts` masih hardcoded, wajib direfactor).
5. **Component-first, page-second.** Setiap halaman utama menyusun komponen dari `src/components/` — hindari mono-file besar (Dashboard.tsx 52KB saat ini adalah anti-pattern yang harus dipecah).

## 3. Struktur Folder Target

```
src/
├── main.tsx                    # Entry + StrictMode + BrowserRouter
├── App.tsx                     # Route table
├── Layout.tsx                  # Chrome (Navbar + Outlet + Footer)
├── index.css                   # Tailwind v4 + @theme brand tokens
│
├── config/
│   └── constants.ts            # WA number, brand, radius, dsb.
│
├── lib/
│   ├── supabase.ts             # createClient (env vars)
│   ├── utils.ts                # cn()
│   ├── motion.ts               # fadeUp variants shared
│   ├── format.ts               # rupiah(), date fmt
│   └── validation.ts           # Zod schemas
│
├── hooks/
│   ├── useAuth.ts              # session + role
│   ├── useRole.ts              # derived role helpers
│   └── useSupabaseQuery.ts     # (opsional pakai React Query)
│
├── providers/
│   ├── AuthProvider.tsx
│   └── QueryProvider.tsx
│
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Logo.tsx
│   ├── ProtectedRoute.tsx
│   ├── ui/                     # button, input, modal, table, badge, dsb.
│   └── forms/                  # BookingForm/*.tsx, LoginForm.tsx
│
├── features/                   # Domain-driven
│   ├── booking/
│   │   ├── api.ts              # supabase queries
│   │   ├── types.ts
│   │   └── steps/              # Step1..Step6
│   ├── dashboard/
│   │   ├── views/              # Overview, Booking, Jadwal, ...
│   │   ├── hooks/
│   │   └── api.ts
│   ├── attendance/
│   ├── medical-records/
│   └── finance/
│
├── pages/
│   ├── Homepage.tsx
│   ├── Services.tsx
│   ├── Team.tsx
│   ├── Pricing.tsx
│   ├── About.tsx
│   ├── Booking.tsx             # shell yang merangkai features/booking
│   ├── Dashboard.tsx           # shell tab yang merangkai features/dashboard
│   └── Login.tsx
│
└── types/
    └── database.ts             # generated dari `supabase gen types`
```

## 4. Routing

```
BrowserRouter
├── /                       Layout
│   ├── /                   Homepage
│   ├── /services           Services
│   ├── /team               Team
│   ├── /pricing            Pricing
│   ├── /about              About
│   ├── /booking            Booking
│   ├── /kontak             (roadmap)
│   ├── /blog               (roadmap)
│   ├── /privacy-policy     (roadmap)
│   └── /terms              (roadmap)
├── /login                  Login (tanpa Layout)
└── /dashboard              ProtectedRoute → Dashboard
```

- `ProtectedRoute` mengecek session Supabase; jika null → redirect `/login?redirect=/dashboard`.
- Sub-tab dashboard menggunakan `?tab=overview` (query param) atau `/dashboard/overview` (nested route) — pilih **nested route** untuk deep-linkable state.

## 5. State Management

- **Auth & role global:** React Context (`AuthProvider`).
- **Server state (data Supabase):** React Query (`@tanstack/react-query`). Menggantikan `useState + useEffect` fetching yang ada saat ini.
- **UI state lokal:** `useState` / `useReducer` per komponen.
- **Form state:** `react-hook-form` + `zod` untuk validasi.
- **URL state:** `useSearchParams` React Router untuk filter/tab.

Hindari Redux/Zustand kecuali ada state cross-cutting yang tidak natural di context/query.

## 6. Data Flow (Contoh: Submit Booking)

```
BookingWizard (client)
   │
   │ 1. Kumpulkan formData 6 step
   │ 2. Validasi Zod
   ▼
features/booking/api.ts::createBooking(payload)
   │
   │ supabase.from("bookings").insert(payload).select().single()
   │      ▲  RLS: hanya insert dengan parent_email = auth.email atau anon (public booking)
   ▼
Postgres bookings row + payments row (trigger)
   │
   │ Supabase trigger → Edge Function `notify_booking_created`
   ▼
- Kirim email konfirmasi (Resend/SES)
- Kirim WhatsApp confirm (WA Cloud API)
- Publish channel realtime `bookings:new` ke dashboard admin
```

## 7. Auth & Otorisasi

- **Identitas:** Supabase Auth (email+password).
- **Session:** persisted `localStorage` (default), refresh token otomatis.
- **AuthProvider** membaca `supabase.auth.getSession()` di mount dan berlangganan `onAuthStateChange`.
- **Profile & role:** tabel `profiles` dengan kolom `role` (enum). Setelah login, provider mengambil profil user.
- **RBAC:**
  - Client: `useRole()` memberi helper `isSuperAdmin`, `canSeeFinance`, dst — untuk UI.
  - Database: RLS + Postgres `security definer` functions — sebagai satu-satunya sumber otorisasi yang mengikat.

## 8. Konfigurasi & Environment

Semua kredensial datang dari environment variables — tidak boleh ada di git.

```
# .env.local
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_WA_NUMBER=628175028099
VITE_CURATOR_FEED_ID=9881e444-26c0-4abf-8a1b-c94e7456fa9d
```

Server-only secret (Edge Function) — TIDAK boleh di-`define`-kan di `vite.config.ts`:
- `MIDTRANS_SERVER_KEY`
- `WA_CLOUD_TOKEN`
- `SUPABASE_SERVICE_ROLE_KEY`

## 9. Build & Deployment Pipeline

```
Developer ── git push ─► GitHub main
                            │
                            ▼
                       Vercel Build
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
          npm ci     tsc --noEmit     vite build
                            │
                            ▼
                     dist/ deployed
                            │
                            ▼
                Production URL (flourishcare.id)
```

- `vercel.json` sudah mengonfigurasi SPA rewrite (semua path → `index.html`).
- **Preview deployment** otomatis per PR (URL preview di komentar PR).
- **Environment variables** di-set di Vercel Project → Settings → Environment (Development / Preview / Production).

## 10. Integrasi Eksternal

| Layanan | Peran | Autentikasi |
|---|---|---|
| Supabase | Auth, DB, Storage, Realtime, Edge Functions | anon key (client) + service role (server) |
| Curator.io | Instagram feed di Homepage | Feed ID publik (baca-only) |
| WhatsApp deep link (`wa.me`) | Kontak & CTA | Public URL |
| WhatsApp Cloud API (roadmap) | Reminder & konfirmasi otomatis | Bearer token, server-side only |
| Midtrans Snap (roadmap) | Payment gateway | Server key di Edge Function |
| Google Fonts | Poppins, Nunito | Public |
| Vercel Analytics (roadmap) | Web analytics | Otomatis |
| Sentry (roadmap) | Error tracking | DSN client |

## 11. Kualitas Non-Fungsional

- **Performance:** LCP ≤ 2.5 s pada 4G median; JS bundle utama ≤ 200 KB gzip; code splitting per route (`React.lazy`).
- **Accessibility:** WCAG 2.1 AA; kontras teks tercek; modal focus-trap; `lang="id"`; landmark HTML semantik.
- **Security:** RLS untuk semua tabel; secret hanya di Edge Function; CSP (Vercel headers); HTTPS enforced.
- **Reliability:** Error boundary root; retry & backoff untuk fetch eksternal; degradasi anggun jika Curator API down.
- **Observability:** Sentry error tracking; Vercel Analytics; audit log tabel `activity_logs` untuk mutasi admin.
- **Maintainability:** TypeScript `strict: true`; ESLint + Prettier; tests (Vitest + RTL) untuk komponen kritis + Playwright untuk journey booking dan login.

## 12. Batasan Arsitektur Saat Ini (Baseline → Target)

| Aspek | Saat Ini | Target |
|---|---|---|
| Kredensial Supabase | Hardcoded di `lib/supabase.ts` | `import.meta.env.VITE_*` |
| `GEMINI_API_KEY` di bundle client | Ya (`vite.config.ts:11`) | Hapus, tidak dipakai |
| Guard route `/dashboard` | Tidak ada | `<ProtectedRoute>` |
| Logout | Hanya `navigate("/")` | Panggil `supabase.auth.signOut()` |
| Role | Client-side dropdown demo | Dari `profiles.role` di Supabase |
| Booking submit | Dead-end tombol | Insert ke Supabase + payment gateway |
| Presensi | Simulasi `setTimeout` | Face API + geolocation |
| Dashboard code | Mono-file 1073 baris | Dipecah per tab di `features/dashboard/views` |
| Data manager server | Tidak ada | React Query |
| Test | Tidak ada | Vitest + Playwright |

## 13. Diagram Komponen (Target)

```
┌─────────────── App ───────────────┐
│  AuthProvider                     │
│  ├─ QueryClientProvider           │
│  │  ├─ BrowserRouter              │
│  │  │  ├─ / (Layout)              │
│  │  │  │   ├─ Navbar              │
│  │  │  │   ├─ Outlet ── pages/*   │
│  │  │  │   └─ Footer              │
│  │  │  ├─ /login → LoginForm      │
│  │  │  └─ /dashboard              │
│  │  │       └─ ProtectedRoute     │
│  │  │            └─ Dashboard     │
│  │  │                 ├─ Sidebar  │
│  │  │                 └─ Views/*  │
│  │  └─ Toaster                    │
│  └─ ErrorBoundary                 │
└───────────────────────────────────┘
```

## 14. Ringkasan Keputusan Arsitektur (ADR-Style)

- **ADR-001:** Pakai Supabase alih-alih backend custom → alasan: velocity tim kecil, kebutuhan bisnis relatif standar, RLS Postgres kuat.
- **ADR-002:** Pakai React Query untuk state server → menghilangkan boilerplate `useEffect + useState + loading + error` di setiap page.
- **ADR-003:** RBAC ditegakkan di RLS, tidak hanya UI → satu sumber kebenaran otorisasi.
- **ADR-004:** Semua sisi server-secret di Edge Function, tidak di bundle → hindari kebocoran.
- **ADR-005:** Aset gambar (foto tim, galeri) di Supabase Storage → hindari hotlink Pinterest.
