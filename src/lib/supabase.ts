import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum di-set. " +
      "Fitur auth & data akan dinonaktifkan. Set env var di Vercel → Settings → Environment Variables, lalu redeploy."
  );
}

// Fallback URL yang valid supaya createClient TIDAK throw saat module load.
// Semua query akan gagal graceful, tapi UI tetap render.
const SAFE_URL = "https://placeholder.supabase.co";
const SAFE_KEY = "placeholder-anon-key";

export const supabase = createClient<Database>(
  supabaseUrl || SAFE_URL,
  supabaseAnonKey || SAFE_KEY,
  {
    auth: {
      persistSession: isSupabaseConfigured,
      autoRefreshToken: isSupabaseConfigured,
      detectSessionInUrl: isSupabaseConfigured,
    },
  }
);
