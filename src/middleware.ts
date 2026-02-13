import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/signup', '/forgot-password', '/update-password'];
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/update-password'];
const ADMIN_ROUTES_PREFIX = '/admin';
const CLIENT_ROUTES_PREFIX = '/client';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Allow auth callback routes to pass through
  if (pathname.startsWith('/auth/')) {
    return supabaseResponse;
  }

  // If user is NOT authenticated
  if (!user) {
    // Allow public/auth routes
    if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
      return supabaseResponse;
    }
    // Allow the home page
    if (pathname === '/') {
      return supabaseResponse;
    }
    // Redirect to login for all other routes
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // User IS authenticated — get their role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'client';
  const isAdmin = role === 'super_admin' || role === 'admin';

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = isAdmin ? '/admin/dashboard' : '/client/dashboard';
    return NextResponse.redirect(url);
  }

  // Redirect root to appropriate dashboard
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = isAdmin ? '/admin/dashboard' : '/client/dashboard';
    return NextResponse.redirect(url);
  }

  // Protect admin routes — only admin/super_admin
  if (pathname.startsWith(ADMIN_ROUTES_PREFIX) && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = '/client/dashboard';
    return NextResponse.redirect(url);
  }

  // Protect client routes — only clients (admins can also access for testing)
  if (pathname.startsWith(CLIENT_ROUTES_PREFIX) && role !== 'client' && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
