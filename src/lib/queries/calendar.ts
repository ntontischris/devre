'use server';

import { createClient } from '@/lib/supabase/server';

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color: string;
  type: 'project' | 'task' | 'invoice';
  entityId: string;
};

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    const supabase = await createClient();

    const [projectsResult, tasksResult, invoicesResult] = await Promise.all([
      supabase
        .from('projects')
        .select('id, title, start_date, deadline')
        .neq('status', 'archived')
        .not('start_date', 'is', null),
      supabase
        .from('tasks')
        .select('id, title, due_date, project:projects(title)')
        .neq('status', 'done')
        .not('due_date', 'is', null),
      supabase
        .from('invoices')
        .select('id, invoice_number, due_date, project:projects(title)')
        .in('status', ['sent', 'viewed', 'overdue'])
        .not('due_date', 'is', null),
    ]);

    const events: CalendarEvent[] = [];

    if (!projectsResult.error && projectsResult.data) {
      projectsResult.data.forEach((project) => {
        if (project.start_date) {
          events.push({
            id: `project-start-${project.id}`,
            title: `Start: ${project.title}`,
            start: project.start_date,
            allDay: true,
            color: 'hsl(var(--primary))',
            type: 'project',
            entityId: project.id,
          });
        }
        if (project.deadline) {
          events.push({
            id: `project-deadline-${project.id}`,
            title: `Deadline: ${project.title}`,
            start: project.deadline,
            allDay: true,
            color: 'hsl(var(--destructive))',
            type: 'project',
            entityId: project.id,
          });
        }
      });
    }

    if (!tasksResult.error && tasksResult.data) {
      tasksResult.data.forEach((task: any) => {
        if (task.due_date) {
          events.push({
            id: `task-${task.id}`,
            title: `Task: ${task.title}`,
            start: task.due_date,
            allDay: true,
            color: 'hsl(142 76% 36%)',
            type: 'task',
            entityId: task.id,
          });
        }
      });
    }

    if (!invoicesResult.error && invoicesResult.data) {
      invoicesResult.data.forEach((invoice: any) => {
        if (invoice.due_date) {
          events.push({
            id: `invoice-${invoice.id}`,
            title: `Invoice Due: ${invoice.invoice_number}`,
            start: invoice.due_date,
            allDay: true,
            color: 'hsl(25 95% 53%)',
            type: 'invoice',
            entityId: invoice.id,
          });
        }
      });
    }

    return events;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}
