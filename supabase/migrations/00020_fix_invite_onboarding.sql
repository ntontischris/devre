-- Fix: invited users should go through onboarding (set password + display name)
-- The old trigger always set display_name, so the callback thought onboarding was complete.
-- Now invited users get display_name = NULL so the callback redirects to /onboarding.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'role', 'client'),
    CASE
      WHEN new.raw_user_meta_data ->> 'invited_by' IS NOT NULL THEN NULL
      ELSE COALESCE(new.raw_user_meta_data ->> 'display_name', new.email)
    END
  );

  -- Only auto-link client record if:
  -- 1. The user was invited (has invited_by metadata from the invite flow)
  -- 2. The client email matches and hasn't been linked yet
  IF new.raw_user_meta_data ->> 'invited_by' IS NOT NULL THEN
    UPDATE public.clients
    SET user_id = new.id
    WHERE email = new.email
    AND user_id IS NULL;
  END IF;

  RETURN new;
END;
$$;
