import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/admin';

type OtpType = 'signup' | 'recovery' | 'email' | 'invite' | 'magiclink';

/**
 * Email confirmation handler for Supabase.
 * Handles: signup confirmation, password recovery, email change, invite.
 *
 * Supports both flows:
 * - token_hash: direct OTP verification (custom email templates)
 * - code: PKCE code exchange (Supabase Cloud default)
 *
 * Redirect logic:
 * - Invited user or missing display_name → /onboarding
 * - Recovery for existing user (not re-invite) → /update-password
 * - Otherwise → `next` param or /
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const code = searchParams.get('code');
  const type = searchParams.get('type') as OtpType | null;
  const rawNext = searchParams.get('next') ?? '/';
  // Prevent open redirect: only allow relative paths starting with /
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

  if ((token_hash && type) || code) {
    // Collect cookies to set on the final redirect response
    const responseCookies: { name: string; value: string; options: Record<string, unknown> }[] = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            responseCookies.push(
              ...cookiesToSet.map(({ name, value, options }) => ({
                name,
                value,
                options: options as Record<string, unknown>,
              })),
            );
          },
        },
      },
    );

    // Use token_hash (OTP) or code (PKCE) to establish session
    const { data, error } =
      token_hash && type
        ? await supabase.auth.verifyOtp({ type, token_hash })
        : await supabase.auth.exchangeCodeForSession(code!);

    if (!error) {
      let redirectPath = next;

      if (data.user) {
        const adminClient = createAdminClient();
        const { data: profile } = await adminClient
          .from('user_profiles')
          .select('display_name')
          .eq('id', data.user.id)
          .single();

        const isInvitedAndNotOnboarded = !!data.user.user_metadata?.invited_by;

        // Detect recovery: URL type param OR recent recovery_sent_at on user
        const isRecovery =
          type === 'recovery' ||
          (data.user.recovery_sent_at &&
            Date.now() - new Date(data.user.recovery_sent_at).getTime() < 10 * 60 * 1000);

        if (!profile?.display_name || isInvitedAndNotOnboarded) {
          // Invited user or re-invited user → onboarding to set password + name
          redirectPath = '/onboarding';
        } else if (isRecovery) {
          // Regular password recovery (not re-invite) → update password page
          redirectPath = '/update-password';
        }
      }

      const response = NextResponse.redirect(`${origin}${redirectPath}`);
      for (const { name, value, options } of responseCookies) {
        response.cookies.set(name, value, options);
      }
      return response;
    }
  }

  // Return to login with error if verification failed
  return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
}
