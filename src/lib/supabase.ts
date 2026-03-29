import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create client on client side with valid env vars
let supabase: ReturnType<typeof createClient> | null = null;

if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Automatically detect and process auth tokens from URL hash
      // This is crucial for password reset and magic link flows
      detectSessionInUrl: true,
      // Auto-refresh tokens before they expire
      autoRefreshToken: true,
      // Persist session in localStorage
      persistSession: true,
      // Storage key prefix (default is supabase.auth.token)
      storageKey: 'supabase_auth_token',
    },
  });
}

export { supabase };
