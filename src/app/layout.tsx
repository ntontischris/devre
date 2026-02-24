import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

// Namespaces only used server-side (via getTranslations) — excluded from client bundle
const SERVER_ONLY_NAMESPACES = [
  'auth',
  'dashboard',
  'clients',
  'projects',
  'filmingPrep',
  'calendar',
  'reports',
  'salesResources',
  'validation',
];

function pickClientMessages(messages: Record<string, unknown>) {
  const picked: Record<string, unknown> = {};
  for (const key of Object.keys(messages)) {
    if (!SERVER_ONLY_NAMESPACES.includes(key)) {
      picked[key] = messages[key];
    }
  }
  return picked;
}


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Devre Media System',
    template: '%s | DMS',
  },
  description: 'Videography client management, project tracking, financials, and video delivery.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://img.youtube.com" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
        suppressHydrationWarning
        style={{ margin: 0, backgroundColor: 'var(--background, #09090b)' }}
      >
        <NextIntlClientProvider messages={pickClientMessages(messages as Record<string, unknown>)}>
          <Providers>
            {children}
            <Toaster richColors position="top-right" />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
