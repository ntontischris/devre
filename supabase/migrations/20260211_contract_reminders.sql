-- Create contract_reminders table for tracking sent reminders
CREATE TABLE IF NOT EXISTS public.contract_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  days_before_expiry INTEGER NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(contract_id, days_before_expiry)
);

-- Add index for efficient queries
CREATE INDEX IF NOT EXISTS idx_contract_reminders_contract_id
  ON public.contract_reminders(contract_id);

CREATE INDEX IF NOT EXISTS idx_contract_reminders_sent_at
  ON public.contract_reminders(sent_at);

-- Add RLS policies
ALTER TABLE public.contract_reminders ENABLE ROW LEVEL SECURITY;

-- Only service role can access reminders (for the edge function)
CREATE POLICY "Service role can manage reminders"
  ON public.contract_reminders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.contract_reminders IS 'Tracks contract reminder emails sent to clients';
