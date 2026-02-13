import { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { ClientForm } from '@/components/admin/clients/client-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'New Client',
};

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Client"
        description="Add a new client to your system"
      >
        <Button variant="outline" asChild>
          <Link href="/admin/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
      </PageHeader>

      <ClientForm />
    </div>
  );
}
