-- Fix: recreate admin storage policy with WITH CHECK for INSERT/UPDATE
-- The original migration had WITH CHECK but it may not have been applied correctly
DROP POLICY IF EXISTS "Admins full access to invoices bucket" ON storage.objects;

CREATE POLICY "Admins full access to invoices bucket"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'invoices'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  )
)
WITH CHECK (
  bucket_id = 'invoices'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  )
);
