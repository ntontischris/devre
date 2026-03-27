import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/send-email';
import { InvoiceNotificationEmail } from '@/lib/email/templates/invoice-notification';
import { getEmailTranslations } from '@/lib/email/translations';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.devremedia.com';

interface InvoiceSentData {
  invoiceId: string;
  clientId: string;
  invoiceNumber: string;
  total: number;
  currency: string;
  dueDate: string;
}

export async function triggerInvoiceSentEmail({
  invoiceId,
  clientId,
  invoiceNumber,
  total,
  currency,
  dueDate,
}: InvoiceSentData): Promise<void> {
  const supabase = createAdminClient();

  const { data: client } = await supabase
    .from('clients')
    .select('email, contact_name, preferred_locale')
    .eq('id', clientId)
    .single();

  if (!client?.email) return;

  const locale = (client.preferred_locale as 'el' | 'en') ?? 'el';
  const t = getEmailTranslations(locale).invoiceNotification;

  const formattedTotal = `${currency === 'EUR' ? '€' : currency}${total.toFixed(2)}`;
  const formattedDate = new Date(dueDate).toLocaleDateString(locale === 'el' ? 'el-GR' : 'en-GB');

  await sendEmail({
    to: client.email,
    subject: t.subject(invoiceNumber),
    react: InvoiceNotificationEmail({
      clientName: client.contact_name,
      invoiceNumber,
      total: formattedTotal,
      dueDate: formattedDate,
      locale,
      ctaUrl: `${APP_URL}/client/invoices`,
    }),
    emailType: 'invoice_sent',
    clientId,
    metadata: { invoiceId, invoiceNumber },
  });
}
