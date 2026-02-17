'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { PRIORITY_LABELS } from '@/lib/constants';
import type { Task, Project } from '@/types';

interface OverdueTasksProps {
  tasks: (Task & { project: Pick<Project, 'title'> | null })[];
}

function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function OverdueTasks({ tasks }: OverdueTasksProps) {
  const t = useTranslations('employee.dashboard');
  const tCommon = useTranslations('common');

  return (
    <Card className={tasks.length > 0 ? 'border-red-200 bg-red-50/50' : ''}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <CardTitle className={tasks.length > 0 ? 'text-red-700' : ''}>
            {t('overdueTasks')}
          </CardTitle>
        </div>
        <CardDescription>
          {tasks.length} {tasks.length === 1 ? tCommon('task') : tCommon('tasks')} {tCommon('overdue')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {t('noOverdue')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const daysOverdue = task.due_date ? getDaysOverdue(task.due_date) : 0;
              return (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-red-200 bg-background hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium truncate">
                        {task.title}
                      </h4>
                      <StatusBadge status={task.status} />
                    </div>
                    {task.project && (
                      <p className="text-xs text-muted-foreground">
                        {task.project.title}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {PRIORITY_LABELS[task.priority]}
                      </Badge>
                      <Badge variant="destructive" className="text-xs">
                        {daysOverdue} {daysOverdue === 1 ? tCommon('day') : tCommon('days')} {tCommon('overdue')}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
            <Button asChild variant="outline" className="w-full mt-4">
              <Link href="/employee/tasks">
                {tCommon('viewAllTasks')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
