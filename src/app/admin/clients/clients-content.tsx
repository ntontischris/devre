'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Client } from '@/types/index';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { SearchInput } from '@/components/shared/search-input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useClientColumns } from './columns';
import { CLIENT_STATUSES, CLIENT_STATUS_LABELS } from '@/lib/constants';

interface ClientsContentProps {
  clients: Client[];
}

export function ClientsContent({ clients }: ClientsContentProps) {
  const t = useTranslations('clients');
  const tc = useTranslations('common');
  const columns = useClientColumns();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        search === '' ||
        client.contact_name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase()) ||
        (client.company_name &&
          client.company_name.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
      >
        <Button asChild>
          <Link href="/admin/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('addClient')}
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row flex-1 gap-3">
          <SearchInput
            placeholder={t('description')}
            value={search}
            onChange={setSearch}
            className="w-full sm:max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={tc('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('status')}</SelectItem>
              {CLIENT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {CLIENT_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredClients}
        mobileHiddenColumns={['company_name', 'email', 'phone', 'created_at']}
      />
    </div>
  );
}
