import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env['SUPABASE_URL'] || process.env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn('Supabase URL or Service Role Key is missing. Please check your environment variables.');
}
export const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceRoleKey || '', {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
