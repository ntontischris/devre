import { Text, Button, Section } from '@react-email/components';

import { BaseLayout } from './base-layout';
import { getEmailTranslations } from '../translations';

interface ProjectCompletedEmailProps {
  clientName: string;
  projectTitle: string;
  deliverableCount: number;
  locale: 'el' | 'en';
  ctaUrl: string;
}

export function ProjectCompletedEmail({
  clientName,
  projectTitle,
  deliverableCount,
  locale,
  ctaUrl,
}: ProjectCompletedEmailProps) {
  const t = getEmailTranslations(locale).projectCompleted;

  return (
    <BaseLayout preview={t.subject(projectTitle)} locale={locale}>
      <Text style={greeting}>{t.greeting(clientName)}</Text>
      <Text style={bodyText}>{t.body(projectTitle, deliverableCount)}</Text>

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

const ctaSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
} as const;

const ctaButton = {
  backgroundColor: '#16a34a',
  color: '#ffffff',
  padding: '12px 32px',
  borderRadius: '6px',
  fontSize: '15px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  display: 'inline-block',
} as const;
