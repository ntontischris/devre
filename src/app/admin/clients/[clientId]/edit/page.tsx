import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClient } from '@/lib/actions/clients';
import { Client } from '@/types/index';
import { PageHeader } from '@/components/shared/page-header';
import { ClientForm } from '@/components/admin/clients/client-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Edit Client',
};

interface EditClientPageProps {
  params: Promise<{
    clientId: string;
  }>;
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const { clientId } = await params;
  const result = await getClient(clientId);

  if (result.error || !result.data) {
    notFound();
  }

  const client = result.data as Client;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Client"
        description={`Update information for ${client.contact_name}`}
      >
        <Button variant="outline" asChild>
          <Link href={`/admin/clients/${clientId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Client
          </Link>
        </Button>
      </PageHeader>

      <ClientForm client={client} />
    </div>
  );
}
