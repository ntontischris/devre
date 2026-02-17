'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';
import type { UserRole } from '@/lib/constants';

function getDashboardForRole(role: UserRole): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/admin/dashboard';
    case 'employee':
      return '/employee/dashboard';
    case 'salesman':
      return '/salesman/dashboard';
    default:
      return '/client/dashboard';
  }
}

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
        router.push(getDashboardForRole(auth.profile.role));
      }
    }
  }, [auth.isLoading, auth.user, auth.profile, roles, router]);

  return auth;
}
