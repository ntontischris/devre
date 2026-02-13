import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Auth callback handler for Supabase authentication flows
 * Handles: email confirmation, magic link, OAuth redirects
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to the requested page or home
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login with error if authentication failed
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
