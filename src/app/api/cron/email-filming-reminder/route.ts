import { NextRequest, NextResponse } from 'next/server';

import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, hasEmailBeenSent } from '@/lib/email/send-email';
import { FilmingReminderEmail } from '@/lib/email/templates/filming-reminder';
import { getEmailTranslations } from '@/lib/email/translations';
import { SERVICE_CATEGORIES } from '@/lib/constants/services';

export const dynamic = 'force-dynamic';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.devremedia.com';

// Package IDs that represent monthly subscriptions (have contractDuration)
const MONTHLY_PACKAGE_IDS = SERVICE_CATEGORIES.flatMap((cat) =>
  cat.packages.filter((p) => p.contractDuration).map((p) => p.id),
);

function findPackage(packageId: string) {
  for (const category of SERVICE_CATEGORIES) {
    const pkg = category.packages.find((p) => p.id === packageId);
    if (pkg) return pkg;
  }
  return null;
}

async function handleCron(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if today is the 25th (Athens timezone)
  const now = new Date();
  const athensDay = parseInt(
    now.toLocaleDateString('en-GB', { timeZone: 'Europe/Athens', day: 'numeric' }),
    10,
  );

  if (athensDay !== 25) {
    return NextResponse.json({ skipped: true, reason: 'Not the 25th of the month' });
  }

  const supabase = createAdminClient();

  // Find active clients with signed contracts for monthly packages
  const { data: contracts } = await supabase
    .from('contracts')
    .select('client_id, service_type, created_at')
    .eq('status', 'signed')
    .in('service_type', MONTHLY_PACKAGE_IDS)
    .order('created_at', { ascending: false });

  if (!contracts || contracts.length === 0) {
    return NextResponse.json({ sent: 0, reason: 'No active monthly contracts' });
  }

  // Deduplicate: one email per client, using most recent contract
  const clientContractMap = new Map<string, string>();
  for (const contract of contracts) {
    if (contract.client_id && contract.service_type && !clientContractMap.has(contract.client_id)) {
      clientContractMap.set(contract.client_id, contract.service_type);
    }
  }

  const clientIds = [...clientContractMap.keys()];

  // Fetch active clients
  const { data: clients } = await supabase
    .from('clients')
    .select('id, email, contact_name, preferred_locale, status')
    .in('id', clientIds)
    .eq('status', 'active');

  if (!clients || clients.length === 0) {
    return NextResponse.json({ sent: 0, reason: 'No active clients with monthly packages' });
  }

  const currentMonth = now.toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' }).slice(0, 7); // YYYY-MM
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const client of clients) {
    // Dedup check
    const alreadySent = await hasEmailBeenSent({
      emailType: 'filming_reminder',
      clientId: client.id,
      dateKey: currentMonth,
    });

    if (alreadySent) {
      skipped++;
      continue;
    }

    const packageId = clientContractMap.get(client.id);
    if (!packageId) {
      skipped++;
      continue;
    }

    const pkg = findPackage(packageId);
    if (!pkg) {
      skipped++;
      continue;
    }

    const locale = (client.preferred_locale as 'el' | 'en') ?? 'el';
    const t = getEmailTranslations(locale).filmingReminder;

    const result = await sendEmail({
      to: client.email,
      subject: t.subject,
      react: FilmingReminderEmail({
        clientName: client.contact_name,
        packageName: pkg.name,
        packageDeliverables: pkg.deliverables,
        locale,
        ctaUrl: `${APP_URL}/client/dashboard`,
      }),
      emailType: 'filming_reminder',
      clientId: client.id,
      metadata: { packageId, packageName: pkg.name, month: currentMonth },
    });

    if (result.success) {
      sent++;
    } else {
      errors++;
    }
  }

  return NextResponse.json({ sent, skipped, errors, totalClients: clients.length });
}

// Vercel crons send GET requests
export async function GET(request: NextRequest) {
  return handleCron(request);
}

export async function POST(request: NextRequest) {
  return handleCron(request);
}
