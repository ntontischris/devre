import { Text, Button, Section } from '@react-email/components';

import { BaseLayout } from './base-layout';
import { getEmailTranslations } from '../translations';

interface InvoiceNotificationEmailProps {
  clientName: string;
  invoiceNumber: string;
  total: string;
  dueDate: string;
  locale: 'el' | 'en';
  ctaUrl: string;
}

export function InvoiceNotificationEmail({
  clientName,
  invoiceNumber,
  total,
  dueDate,
  locale,
  ctaUrl,
}: InvoiceNotificationEmailProps) {
  const t = getEmailTranslations(locale).invoiceNotification;

  return (
    <BaseLayout preview={t.subject(invoiceNumber)} locale={locale}>
      <Text style={greeting}>{t.greeting(clientName)}</Text>
      <Text style={bodyText}>{t.body(invoiceNumber, total, dueDate)}</Text>

      {/* Invoice summary box */}
      <Section style={summaryBox}>
        <Text style={summaryLabel}>{locale === 'el' ? 'Τιμολόγιο' : 'Invoice'}</Text>
        <Text style={summaryValue}>{invoiceNumber}</Text>
        <Text style={summaryLabel}>{locale === 'el' ? 'Ποσό' : 'Amount'}</Text>
        <Text style={summaryValue}>{total}</Text>
        <Text style={summaryLabel}>{locale === 'el' ? 'Λήξη' : 'Due'}</Text>
        <Text style={summaryValue}>{dueDate}</Text>
      </Section>

      <Section style={ctaSection}>
        <Button style={ctaButton} href={ctaUrl}>
          {t.cta}
        </Button>
      </Section>
    </BaseLayout>
  );
}

const greeting = {
  fontSize: '16px',
  color: '#18181b',
  marginBottom: '16px',
} as const;

const bodyText = {
  fontSize: '15px',
  color: '#3f3f46',
  lineHeight: '1.6',
  marginBottom: '24px',
} as const;

const summaryBox = {
  backgroundColor: '#fafafa',
  border: '1px solid #e4e4e7',
  borderRadius: '8px',
  padding: '20px 24px',
  marginBottom: '24px',
} as const;

const summaryLabel = {
  fontSize: '12px',
  color: '#71717a',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginBottom: '2px',
  marginTop: '12px',
} as const;

const summaryValue = {
  fontSize: '16px',
  color: '#18181b',
  fontWeight: '600' as const,
  marginTop: '0',
  marginBottom: '0',
} as const;

const ctaSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
} as const;

const ctaButton = {
  backgroundColor: '#2563eb',
  color: '#ffffff',
  padding: '12px 32px',
  borderRadius: '6px',
  fontSize: '15px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  display: 'inline-block',
} as const;
