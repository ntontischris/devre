'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { UserPlus, Search } from 'lucide-react';
import { LEAD_STAGES, LEAD_STAGE_LABELS, LEAD_SOURCE_LABELS } from '@/lib/constants';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

type LeadRow = {
  id: string;
  contact_name: string;
  email: string;
  company_name: string | null;
  source: string;
  stage: string;
  deal_value: number | null;
  assigned_to: string;
  assigned_user: { display_name: string | null } | null;
  last_contacted_at: string | null;
  created_at: string;
};

type AllLeadsTableProps = {
  leads: LeadRow[];
};

export function AllLeadsTable({ leads }: AllLeadsTableProps) {
  const t = useTranslations('leads')
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.contact_name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      (lead.company_name ?? '').toLowerCase().includes(search.toLowerCase());

    const matchesStage = stageFilter === 'all' || lead.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  if (leads.length === 0) {
    return (
      <EmptyState
        icon={UserPlus}
        title={t('noLeads')}
        description={t('noLeadsDescription')}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchLeads')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('filterByStage')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {LEAD_STAGES.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {LEAD_STAGE_LABELS[stage]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Deal Value</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="font-medium hover:underline"
                  >
                    {lead.contact_name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </TableCell>
                <TableCell>{lead.company_name ?? '-'}</TableCell>
                <TableCell>
                  <StatusBadge status={lead.stage} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {LEAD_SOURCE_LABELS[lead.source as keyof typeof LEAD_SOURCE_LABELS] ?? lead.source}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {lead.deal_value != null ? `€${lead.deal_value.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell>
                  {lead.assigned_user?.display_name ?? 'Unassigned'}
                </TableCell>
                <TableCell>
                  {lead.last_contacted_at
                    ? format(new Date(lead.last_contacted_at), 'MMM d, yyyy')
                    : 'Never'}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No leads match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
