import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vtquhqdfyirccxdzmpyr.supabase.co';
const supabaseKey = 'sb_publishable_rV4ay28GgXdI3TgnY3jkJA_YIVVJAKS';

export const supabase = createClient(supabaseUrl, supabaseKey);
