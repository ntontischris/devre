import { PageHeader } from '@/components/shared/page-header';
import { getCalendarEvents } from '@/lib/queries/calendar';
import { CalendarViewWrapper } from '@/components/admin/calendar/calendar-view-wrapper';

export default async function CalendarPage() {
  const events = await getCalendarEvents();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="View all project deadlines, tasks, and invoice due dates"
      />

      <CalendarViewWrapper events={events} />
    </div>
  );
}
