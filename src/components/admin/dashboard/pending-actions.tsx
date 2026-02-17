'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, FileSignature } from 'lucide-react';
import Link from 'next/link';

type PendingAction = {
  type: 'invoice' | 'deliverable' | 'contract';
  id: string;
  title: string;
  subtitle: string;
  daysOverdue?: number;
};

type PendingActionsProps = {
  actions: PendingAction[];
};

export function PendingActions({ actions }: PendingActionsProps) {
  const t = useTranslations('dashboard');

  const getIcon = (type: PendingAction['type']) => {
    switch (type) {
      case 'invoice':
        return <FileText className="h-4 w-4" />;
      case 'deliverable':
        return <CheckCircle className="h-4 w-4" />;
      case 'contract':
        return <FileSignature className="h-4 w-4" />;
    }
  };

  const getLink = (action: PendingAction) => {
    switch (action.type) {
      case 'invoice':
        return `/admin/invoices/${action.id}`;
      case 'deliverable':
        return `/admin/projects/${action.id}#deliverables`;
      case 'contract':
        return `/admin/contracts/${action.id}`;
    }
  };

  const getTypeLabel = (type: PendingAction['type']) => {
    switch (type) {
      case 'invoice':
        return t('invoice');
      case 'deliverable':
        return t('deliverable');
      case 'contract':
        return t('contract');
    }
  };

  if (actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('pendingActions')}</CardTitle>
          <CardDescription>{t('pendingActionsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            {t('noPendingActions')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pendingActions')}</CardTitle>
        <CardDescription>{t('pendingActionsDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <Link
              key={`${action.type}-${action.id}`}
              href={getLink(action)}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="mt-0.5">{getIcon(action.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{action.title}</p>
                  <Badge variant="secondary" className="text-xs">
                    {getTypeLabel(action.type)}
                  </Badge>
                  {action.daysOverdue && action.daysOverdue > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {t('daysOverdue', { days: action.daysOverdue })}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{action.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
