'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';

interface PipelineSummaryProps {
  summary: {
    new: number;
    contacted: number;
    qualified: number;
    proposal: number;
    negotiation: number;
    won: number;
    lost: number;
  };
  pipelineValue: {
    total: number;
    weighted: number;
  };
}

const STAGE_COLORS: Record<string, string> = {
  new: 'text-blue-600 dark:text-blue-400',
  contacted: 'text-purple-600 dark:text-purple-400',
  qualified: 'text-yellow-600 dark:text-yellow-400',
  proposal: 'text-orange-600 dark:text-orange-400',
  negotiation: 'text-pink-600 dark:text-pink-400',
  won: 'text-green-600 dark:text-green-400',
  lost: 'text-gray-600 dark:text-gray-400',
};

export function PipelineSummary({ summary, pipelineValue }: PipelineSummaryProps) {
  const t = useTranslations('salesman.dashboard');
  const tStatus = useTranslations('statuses.leadStage');

  const activeLeads = summary.new + summary.contacted + summary.qualified + summary.proposal + summary.negotiation;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Pipeline Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('pipelineSummary')}</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{pipelineValue.total.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Weighted: €{pipelineValue.weighted.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Active Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('activeLeads')}</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeLeads}</div>
          <p className="text-xs text-muted-foreground">
            {summary.won} {tStatus('won')}, {summary.lost} {tStatus('lost')}
          </p>
        </CardContent>
      </Card>

      {/* Pipeline by Stage */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{t('pipelineByStage')}</CardTitle>
          <CardDescription>{t('pipelineBreakdown')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(summary).map(([stage, count]) => {
              if (stage === 'won' || stage === 'lost') return null;
              return (
                <div key={stage} className="space-y-1">
                  <p className="text-sm text-muted-foreground">{tStatus(stage as 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation')}</p>
                  <p className={`text-2xl font-bold ${STAGE_COLORS[stage]}`}>{count}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
