-- =============================================================================
-- FIX: Allow admins to update any user profile (role changes, deactivation)
-- =============================================================================
-- Previously only "Users can update their own profile" existed, which blocked
-- admins from changing other users' roles or deactivation status via RLS.
-- =============================================================================

CREATE POLICY "Admins can update all user profiles"
  ON public.user_profiles FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
