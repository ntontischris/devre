import { createClient } from '@/lib/supabase/server';
import { getInvoices } from '@/lib/actions/invoices';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { InvoicesList } from './invoices-list';

export default async function ClientInvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const invoicesResult = await getInvoices({ client_id: user.id });
  const invoices = invoicesResult.data ?? [];

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 space-y-6">
      <PageHeader
        title="My Invoices"
        description="View and manage your invoices"
      />

      <InvoicesList invoices={invoices} />
    </div>
  );
}
