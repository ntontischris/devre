import { getInvoices } from '@/lib/actions/invoices';
import { InvoicesContent } from './invoices-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Invoices',
};

export default async function InvoicesPage() {
  const result = await getInvoices();

  if (result.error) {
    return (
      <div className="p-8">
        <p className="text-destructive">Error: {result.error}</p>
      </div>
    );
  }

  return <InvoicesContent invoices={result.data ?? []} />;
}
