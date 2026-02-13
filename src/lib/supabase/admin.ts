import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client using the service role key.
 * ONLY use this server-side for operations that need to bypass RLS.
 * Never expose the service role key to the client.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
