import { getContractTemplates } from '@/lib/actions/contracts';
import { TemplatesContent } from './templates-content';

export const metadata = {
  title: 'Contract Templates | Devre Media',
  description: 'Manage contract templates',
};

export default async function ContractTemplatesPage() {
  const result = await getContractTemplates();

  if (result.error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-600">
          <p>Failed to load templates: {result.error}</p>
        </div>
      </div>
    );
  }

  const templates = result.data ?? [];

  return (
    <div className="space-y-6">
      <TemplatesContent templates={templates} />
    </div>
  );
}
