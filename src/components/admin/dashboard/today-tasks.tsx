'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { CalendarClock } from 'lucide-react';

type TodayTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  project_id: string;
  project: { title: string } | null;
  assigned_user: { display_name: string | null } | null;
};

type TodayTasksProps = {
  tasks: TodayTask[];
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export function TodayTasks({ tasks }: TodayTasksProps) {
  const t = useTranslations('dashboard');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <CalendarClock className="h-5 w-5 text-muted-foreground" />
        <CardTitle className="text-lg">{t('todayTasks')}</CardTitle>
        {tasks.length > 0 && (
          <Badge variant="secondary" className="ml-auto">{tasks.length}</Badge>
        )}
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('noTasks')}</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isOverdue = task.due_date && new Date(task.due_date) < new Date(new Date().toISOString().split('T')[0]);
              return (
                <div key={task.id} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/projects/${task.project_id}/tasks`}
                      className="text-sm font-medium hover:underline"
                    >
                      {task.title}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">
                      {task.project?.title ?? t('unknown')}
                      {task.assigned_user?.display_name && ` — ${task.assigned_user.display_name}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={PRIORITY_COLORS[task.priority] ?? ''} variant="secondary">
                      {task.priority}
                    </Badge>
                    <StatusBadge status={task.status} />
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">{t('overdue')}</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
