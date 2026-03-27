-- Email logs table for tracking all automated emails sent via Resend
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type TEXT NOT NULL CHECK (email_type IN ('filming_reminder', 'invoice_sent', 'project_delivered', 'holiday_greeting')),
  recipient_email TEXT NOT NULL,
  recipient_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  resend_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for deduplication queries and admin listing
CREATE INDEX idx_email_logs_dedup ON email_logs (email_type, recipient_client_id, created_at);
CREATE INDEX idx_email_logs_created ON email_logs (created_at DESC);

-- RLS: service_role only (same as contract_reminders)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Add preferred_locale to clients for per-client email language
ALTER TABLE clients ADD COLUMN IF NOT EXISTS preferred_locale TEXT DEFAULT 'el' CHECK (preferred_locale IN ('el', 'en'));
