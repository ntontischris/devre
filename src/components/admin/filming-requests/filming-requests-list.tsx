'use client';

import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { format } from 'date-fns';
import { Video, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PROJECT_TYPE_LABELS } from '@/lib/constants';
import type { FilmingRequest } from '@/types';
import { useTranslations } from 'next-intl';

interface FilmingRequestsListProps {
  requests: FilmingRequest[];
}

export function FilmingRequestsList({ requests }: FilmingRequestsListProps) {
  const t = useTranslations('filmingRequests');
  const router = useRouter();

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={Video}
            title={t('noRequests')}
            description={t('noSubmittedRequests')}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <Card
          key={request.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(`/admin/filming-requests/${request.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-sm truncate">
                    {(request as any).title}
                  </span>
                  <StatusBadge status={request.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {request.project_type
                      ? PROJECT_TYPE_LABELS[request.project_type as keyof typeof PROJECT_TYPE_LABELS]
                      : t('notSpecified')}
                  </span>
                  <span>{format(new Date(request.created_at), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
