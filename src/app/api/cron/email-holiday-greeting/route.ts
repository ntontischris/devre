import { NextRequest, NextResponse } from 'next/server';

import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, hasEmailBeenSent } from '@/lib/email/send-email';
import { HolidayGreetingEmail } from '@/lib/email/templates/holiday-greeting';
import { getEmailTranslations } from '@/lib/email/translations';
import { isGreekHolidayToday } from '@/lib/email/greek-holidays';

export const dynamic = 'force-dynamic';

async function handleCron(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { isHoliday, holiday } = isGreekHolidayToday();

  if (!isHoliday || !holiday) {
    return NextResponse.json({ skipped: true, reason: 'No holiday today' });
  }

  const supabase = createAdminClient();

  // Get all active clients
  const { data: clients } = await supabase
    .from('clients')
    .select('id, email, contact_name, preferred_locale')
    .eq('status', 'active');

  if (!clients || clients.length === 0) {
    return NextResponse.json({ sent: 0, holiday: holiday.nameEl, reason: 'No active clients' });
  }

  const today = holiday.date;
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const client of clients) {
    // Dedup check
    const alreadySent = await hasEmailBeenSent({
      emailType: 'holiday_greeting',
      clientId: client.id,
      dateKey: today,
    });

    if (alreadySent) {
      skipped++;
      continue;
    }

    const locale = (client.preferred_locale as 'el' | 'en') ?? 'el';
    const t = getEmailTranslations(locale).holidayGreeting;

    const holidayName = locale === 'el' ? holiday.nameEl : holiday.nameEn;
    const greetingMessage = locale === 'el' ? holiday.greetingEl : holiday.greetingEn;

    const result = await sendEmail({
      to: client.email,
      subject: t.subject(holidayName),
      react: HolidayGreetingEmail({
        clientName: client.contact_name,
        holidayName,
        greetingMessage,
        locale,
      }),
      emailType: 'holiday_greeting',
      clientId: client.id,
      metadata: { holidayDate: today, holidayName: holiday.nameEl },
    });

    if (result.success) {
      sent++;
    } else {
      errors++;
    }
  }

  return NextResponse.json({
    sent,
    skipped,
    errors,
    holiday: holiday.nameEl,
    totalClients: clients.length,
  });
}

// Vercel crons send GET requests
export async function GET(request: NextRequest) {
  return handleCron(request);
}

export async function POST(request: NextRequest) {
  return handleCron(request);
}
