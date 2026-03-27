import type { ReactElement } from 'react';

import { createAdminClient } from '@/lib/supabase/admin';
import { resend, RESEND_FROM_EMAIL } from './resend';

type EmailType = 'filming_reminder' | 'invoice_sent' | 'project_delivered' | 'holiday_greeting';

interface SendEmailInput {
  to: string;
  subject: string;
  react: ReactElement;
  emailType: EmailType;
  clientId?: string;
  metadata?: Record<string, unknown>;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  react,
  emailType,
  clientId,
  metadata = {},
}: SendEmailInput): Promise<SendEmailResult> {
  const supabase = createAdminClient();

  try {
    const { data, error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to,
      subject,
      react,
    });

    if (error) {
      await supabase.from('email_logs').insert({
        email_type: emailType,
        recipient_email: to,
        recipient_client_id: clientId ?? null,
        subject,
        status: 'failed',
        error_message: error.message,
        metadata,
      });
      console.error(`[Email] Failed to send ${emailType} to ${to}:`, error.message);
      return { success: false, error: error.message };
    }

    await supabase.from('email_logs').insert({
      email_type: emailType,
      recipient_email: to,
      recipient_client_id: clientId ?? null,
      subject,
      resend_message_id: data?.id ?? null,
      status: 'sent',
      metadata,
    });

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    await supabase.from('email_logs').insert({
      email_type: emailType,
      recipient_email: to,
      recipient_client_id: clientId ?? null,
      subject,
      status: 'failed',
      error_message: message,
      metadata,
    });
    console.error(`[Email] Exception sending ${emailType} to ${to}:`, message);
    return { success: false, error: message };
  }
}

/**
 * Check if an email of this type was already sent to this client today (or in a date range).
 * Used for deduplication in cron jobs.
 */
export async function hasEmailBeenSent({
  emailType,
  clientId,
  dateKey,
}: {
  emailType: EmailType;
  clientId: string;
  dateKey: string; // YYYY-MM or YYYY-MM-DD
}): Promise<boolean> {
  const supabase = createAdminClient();

  const startOfPeriod = dateKey.length === 7 ? `${dateKey}-01T00:00:00Z` : `${dateKey}T00:00:00Z`;
  const endOfPeriod =
    dateKey.length === 7
      ? `${dateKey}-31T23:59:59Z` // Supabase handles month-end correctly
      : `${dateKey}T23:59:59Z`;

  const { count } = await supabase
    .from('email_logs')
    .select('id', { count: 'exact', head: true })
    .eq('email_type', emailType)
    .eq('recipient_client_id', clientId)
    .eq('status', 'sent')
    .gte('created_at', startOfPeriod)
    .lte('created_at', endOfPeriod);

  return (count ?? 0) > 0;
}
