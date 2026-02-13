'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import type { CalendarEvent } from '@/lib/queries/calendar';

const CalendarView = dynamic(
  () => import('./calendar-view').then((mod) => mod.CalendarView),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    ),
  },
);

type CalendarViewWrapperProps = {
  events: CalendarEvent[];
};

export function CalendarViewWrapper({ events }: CalendarViewWrapperProps) {
  return <CalendarView events={events} />;
}
