import { getInvoice } from '@/lib/actions/invoices';
import { getClients } from '@/lib/actions/clients';
import { getProjects } from '@/lib/actions/projects';
import { InvoiceForm } from '@/components/admin/invoices/invoice-form';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface EditInvoicePageProps {
  params: Promise<{ invoiceId: string }>;
}

export async function generateMetadata({ params }: EditInvoicePageProps): Promise<Metadata> {
  const { invoiceId } = await params;
  const result = await getInvoice(invoiceId);

  if (result.error || !result.data) {
    return { title: 'Invoice Not Found' };
  }

  return {
    title: `Edit Invoice ${result.data.invoice_number}`,
  };
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { invoiceId } = await params;
  const [invoiceResult, clientsResult, projectsResult] = await Promise.all([
    getInvoice(invoiceId),
    getClients({ status: 'active' }),
    getProjects(),
  ]);

  if (invoiceResult.error || !invoiceResult.data) {
    notFound();
  }

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
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Invoice {invoiceResult.data.invoice_number}
        </h1>
        <p className="text-muted-foreground mt-2">Update invoice details</p>
      </div>
      <InvoiceForm
        invoice={invoiceResult.data}
        clients={clientsResult.data ?? []}
        projects={projectsResult.data ?? []}
        nextInvoiceNumber={invoiceResult.data.invoice_number}
      />
    </div>
  );
}
