'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { FileText, Plus } from 'lucide-react';
import { format } from 'date-fns';

type ContractItem = {
  id: string;
  title: string;
  status: string;
  project: { title: string } | null;
  created_at: string;
  signed_at: string | null;
};

type ClientContractsTabProps = {
  clientId: string;
  contracts: ContractItem[];
};

export function ClientContractsTab({ clientId, contracts }: ClientContractsTabProps) {
  const t = useTranslations('clients');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('title')}</CardTitle>
        <Button asChild size="sm">
          <Link href={`/admin/clients/${clientId}/contracts/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {t('addClient')}
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('noClients')}
            description={t('noClientsDescription')}
          />
        ) : (
          <div className="space-y-3">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/contracts/${contract.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {contract.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {contract.project ? `${t('totalProjects')}: ${contract.project.title}` : t('description')}
                    {' — '}
                    {format(new Date(contract.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <StatusBadge status={contract.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
