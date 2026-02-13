'use client';

import { useAuthContext } from '@/components/providers/auth-provider';

/**
 * Hook to access the current authenticated user, their profile, and auth state.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  return useAuthContext();
}
