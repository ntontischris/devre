'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import type { CalendarEvent } from '@/lib/queries/calendar';

type EventDialogProps = {
  event: CalendarEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EventDialog({ event, open, onOpenChange }: EventDialogProps) {
  const router = useRouter();

  const getEventLink = () => {
    switch (event.type) {
      case 'project':
        return `/admin/projects/${event.entityId}`;
      case 'task':
        return `/admin/projects/${event.entityId}#tasks`;
      case 'invoice':
        return `/admin/invoices/${event.entityId}`;
    }
  };

  const getTypeLabel = () => {
    switch (event.type) {
      case 'project':
        return 'Project';
      case 'task':
        return 'Task';
      case 'invoice':
        return 'Invoice';
    }
  };

  const handleViewDetails = () => {
    router.push(getEventLink());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {event.title}
            <Badge variant="secondary">{getTypeLabel()}</Badge>
          </DialogTitle>
          <DialogDescription>
            {format(new Date(event.start), 'EEEE, MMMM d, yyyy')}
            {event.end && ` - ${format(new Date(event.end), 'EEEE, MMMM d, yyyy')}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded"
              style={{ backgroundColor: event.color }}
            />
            <span className="text-sm text-muted-foreground">
              {event.allDay ? 'All day event' : 'Timed event'}
            </span>
          </div>

          <Button onClick={handleViewDetails} className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
