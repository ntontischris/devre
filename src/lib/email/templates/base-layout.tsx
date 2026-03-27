import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Img,
  Hr,
  Preview,
} from '@react-email/components';
import type { ReactNode } from 'react';

import { getEmailTranslations } from '../translations';

interface BaseLayoutProps {
  preview: string;
  locale: 'el' | 'en';
  children: ReactNode;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.devremedia.com';

export function BaseLayout({ preview, locale, children }: BaseLayoutProps) {
  const t = getEmailTranslations(locale);

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${APP_URL}/logo-white.png`}
              width="160"
              height="40"
              alt="Devre Media"
              style={logo}
            />
            <Text style={tagline}>{t.base.companyTagline}</Text>
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>Devre Media &copy; {new Date().getFullYear()}</Text>
            <Text style={footerHint}>{t.base.unsubscribeHint}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// --- Styles ---

const body = {
  backgroundColor: '#f4f4f5',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: '0',
  padding: '0',
} as const;

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  overflow: 'hidden' as const,
  marginTop: '40px',
  marginBottom: '40px',
} as const;

const header = {
  backgroundColor: '#18181b',
  padding: '32px 40px 24px',
  textAlign: 'center' as const,
} as const;

const logo = {
  margin: '0 auto',
} as const;

const tagline = {
  color: '#a1a1aa',
  fontSize: '13px',
  marginTop: '8px',
  marginBottom: '0',
} as const;

const content = {
  padding: '32px 40px',
} as const;

const divider = {
  borderColor: '#e4e4e7',
  margin: '0 40px',
} as const;

const footer = {
  padding: '24px 40px',
  textAlign: 'center' as const,
} as const;

const footerText = {
  color: '#71717a',
  fontSize: '12px',
  marginBottom: '4px',
} as const;

const footerHint = {
  color: '#a1a1aa',
  fontSize: '11px',
  marginTop: '0',
} as const;
