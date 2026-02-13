import { getAllContracts } from '@/lib/actions/contracts';
import { PageHeader } from '@/components/shared/page-header';
import { ContractsListPage } from './contracts-list-page';

export default async function AdminContractsPage() {
  const result = await getAllContracts();
  const contracts = result.data ?? [];

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
