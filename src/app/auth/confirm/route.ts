import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Email confirmation handler for Supabase
 * Handles: signup confirmation, password recovery, email change
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as 'signup' | 'recovery' | 'email' | null;
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Redirect to the requested page or home
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Return to login with error if verification failed
  return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
}
