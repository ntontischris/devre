'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';

/**
 * Hook that redirects to login if the user is not authenticated.
 * Returns the auth state for convenience.
 */
export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      router.push('/login');
    }
  }, [auth.isLoading, auth.user, router]);

  return auth;
}
