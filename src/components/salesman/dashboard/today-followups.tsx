'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Building2, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Lead {
  id: string;
  contact_name: string;
  company_name: string | null;
  last_contacted_at: string | null;
  stage: string;
}

interface TodayFollowupsProps {
  leads: Lead[];
}

export function TodayFollowups({ leads }: TodayFollowupsProps) {
  const t = useTranslations('salesman.dashboard');
  const tCommon = useTranslations('common');

  if (leads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('todayFollowups')}</CardTitle>
          <CardDescription>{t('followupsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              {t('noFollowups')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('todayFollowups')}</CardTitle>
        <CardDescription>{leads.length} {tCommon('leadsNeedAttention')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.slice(0, 5).map((lead) => (
            <div key={lead.id} className="flex items-start justify-between gap-4 pb-4 border-b last:border-0 last:pb-0">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{lead.contact_name}</p>
                </div>
                {lead.company_name && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{lead.company_name}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {lead.last_contacted_at
                    ? `${tCommon('lastContacted')} ${formatDistanceToNow(new Date(lead.last_contacted_at), { addSuffix: true })}`
                    : tCommon('neverContacted')}
                </p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/salesman/leads/${lead.id}`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
          {leads.length > 5 && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/salesman/leads">{tCommon('viewAll')} {leads.length} {tCommon('leads')}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
