'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';
import type { UserRole } from '@/lib/constants';

/**
 * Hook that redirects if the user doesn't have the required role.
 * Accepts a single role or an array of allowed roles.
 */
export function useRequireRole(allowedRoles: UserRole | UserRole[]) {
  const auth = useAuth();
  const router = useRouter();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.user) {
        router.push('/login');
        return;
      }

      if (auth.profile && !roles.includes(auth.profile.role)) {
        // Redirect to appropriate dashboard based on actual role
        if (auth.profile.role === 'client') {
          router.push('/client/dashboard');
        } else {
          router.push('/admin/dashboard');
        }
      }
    }
  }, [auth.isLoading, auth.user, auth.profile, roles, router]);

  return auth;
}
