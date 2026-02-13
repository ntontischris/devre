import { getClients } from '@/lib/actions/clients';
import { getProjects } from '@/lib/actions/projects';
import { getNextInvoiceNumber } from '@/lib/actions/invoices';
import { InvoiceForm } from '@/components/admin/invoices/invoice-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Invoice',
};

export default async function NewInvoicePage() {
  const [clientsResult, projectsResult, nextInvoiceNumber] = await Promise.all([
    getClients({ status: 'active' }),
    getProjects(),
    getNextInvoiceNumber(),
  ]);

  if (clientsResult.error) {
    return (
      <div className="p-8">
        <p className="text-destructive">Error loading clients: {clientsResult.error}</p>
      </div>
    );
  }

  if (projectsResult.error) {
    return (
      <div className="p-8">
        <p className="text-destructive">Error loading projects: {projectsResult.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Invoice</h1>
        <p className="text-muted-foreground mt-2">Create a new invoice for a client</p>
      </div>
      <InvoiceForm
        clients={clientsResult.data ?? []}
        projects={projectsResult.data ?? []}
        nextInvoiceNumber={nextInvoiceNumber}
      />
    </div>
  );
}
