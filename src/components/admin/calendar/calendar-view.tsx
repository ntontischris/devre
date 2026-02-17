'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import elLocale from '@fullcalendar/core/locales/el';
import { useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { EventDialog } from './event-dialog';
import type { CalendarEvent } from '@/lib/queries/calendar';
import type { EventClickArg } from '@fullcalendar/core';

type CalendarViewProps = {
  events: CalendarEvent[];
};

export function CalendarView({ events }: CalendarViewProps) {
  const locale = useLocale();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setIsDialogOpen(true);
    }
  };

  const formattedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    backgroundColor: event.color,
    borderColor: event.color,
  }));

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={formattedEvents}
            eventClick={handleEventClick}
            editable={false}
            selectable={true}
            height="auto"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
            }}
            locale={locale}
            locales={[elLocale]}
          />
        </CardContent>
      </Card>

      {selectedEvent && (
        <EventDialog
          event={selectedEvent}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  );
}
