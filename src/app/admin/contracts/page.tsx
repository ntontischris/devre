import { getAllContracts } from '@/lib/actions/contracts';
import { PageHeader } from '@/components/shared/page-header';
import { ContractsListPage } from './contracts-list-page';

export default async function AdminContractsPage() {
  const result = await getAllContracts();
  const contracts = (result.data ?? []) as Array<{
    id: string;
    title: string;
    status: string;
    created_at: string;
    client?: { company_name?: string; contact_name?: string } | null;
    project?: { title?: string } | null;
  }>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contracts"
        description="Manage all project contracts and agreements"
      />
      <ContractsListPage contracts={contracts} />
    </div>
  );
}
