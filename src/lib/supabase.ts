import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// For the frontend, use the anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For the backend API routes, we might need a service role key if RLS is enabled,
// but for a personal app without strict RLS, anon key is fine.
// Using a separate helper for server-side logic if needed.
export const getServiceSupabase = () => {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
    return createClient(supabaseUrl, serviceKey);
};
