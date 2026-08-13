import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vtquhqdfyirccxdzmpyr.supabase.co';
const supabaseKey = 'sb_publishable_rV4ay28GgXdI3TgnY3jkJA_YIVVJAKS';

// Konfigurasi eksplisit: session persisten di localStorage + auto refresh token
// agar user tidak "auto logout" saat token expire (default 1 jam).
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'flourishcare-auth',
    flowType: 'pkce',
  },
});
