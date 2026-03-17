-- =====================================================================
-- MIGRATION: Restrict client access to non-draft invoices and contracts
-- =====================================================================

-- Restrict client access to non-draft invoices
DROP POLICY IF EXISTS "Clients can view own invoices" ON public.invoices;
CREATE POLICY "Clients can view own invoices"
  ON public.invoices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = invoices.client_id
      AND clients.user_id = auth.uid()
    )
    AND status != 'draft'
  );

-- Restrict client access to non-draft contracts
DROP POLICY IF EXISTS "Clients can view own contracts" ON public.contracts;
CREATE POLICY "Clients can view own contracts"
  ON public.contracts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = contracts.client_id
      AND clients.user_id = auth.uid()
    )
    AND status != 'draft'
  );
