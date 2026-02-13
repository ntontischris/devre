import { getClients } from '@/lib/actions/clients';
import { Client } from '@/types';
import { PageHeader } from '@/components/shared/page-header';
import { ProjectForm } from '@/components/admin/projects/project-form';
import { Card, CardContent } from '@/components/ui/card';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'New Project',
};

export default async function NewProjectPage() {
  const result = await getClients();

  if (result.error) {
    redirect('/admin/projects');
  }

  const clients = result.data as Client[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Project"
        description="Create a new video production project"
      />

      <Card>
        <CardContent className="pt-6">
          <ProjectForm clients={clients} />
        </CardContent>
      </Card>
    </div>
  );
}
