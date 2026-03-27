import { Text, Section } from '@react-email/components';

import { BaseLayout } from './base-layout';
import { getEmailTranslations } from '../translations';

interface HolidayGreetingEmailProps {
  clientName: string;
  holidayName: string;
  greetingMessage: string;
  locale: 'el' | 'en';
}

export function HolidayGreetingEmail({
  clientName,
  holidayName,
  greetingMessage,
  locale,
}: HolidayGreetingEmailProps) {
  const t = getEmailTranslations(locale).holidayGreeting;

  return (
    <BaseLayout preview={t.subject(holidayName)} locale={locale}>
      <Text style={greeting}>{t.greeting(clientName)}</Text>
      <Section style={messageSection}>
        <Text style={message}>{greetingMessage}</Text>
      </Section>
      <Text style={signoff}>{t.signoff}</Text>
    </BaseLayout>
  );
}

const greeting = {
  fontSize: '16px',
  color: '#18181b',
  marginBottom: '24px',
} as const;

const messageSection = {
  backgroundColor: '#fefce8',
  border: '1px solid #fde68a',
  borderRadius: '8px',
  padding: '24px',
  marginBottom: '24px',
} as const;

const message = {
  fontSize: '16px',
  color: '#3f3f46',
  lineHeight: '1.7',
  textAlign: 'center' as const,
  margin: '0',
} as const;

const signoff = {
  fontSize: '14px',
  color: '#52525b',
  whiteSpace: 'pre-line' as const,
  marginTop: '16px',
} as const;
