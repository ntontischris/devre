import { PageHeader } from '@/components/shared/page-header';
import { getCalendarEvents } from '@/lib/queries/calendar';
import { CalendarViewWrapper } from '@/components/admin/calendar/calendar-view-wrapper';
import { getTranslations } from 'next-intl/server';

export default async function CalendarPage() {
  const t = await getTranslations('calendar');
  const events = await getCalendarEvents();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
      />

      <CalendarViewWrapper events={events} />
    </div>
  );
}
