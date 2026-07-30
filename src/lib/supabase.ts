import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast di dev; di production build Vite akan membuang string ini.
  // eslint-disable-next-line no-console
  console.error(
    "Environment variable VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum di-set. " +
      "Buat file .env berdasarkan .env.example."
  );
}

export const supabase = createClient<Database>(
  supabaseUrl ?? "",
  supabaseAnonKey ?? "",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
