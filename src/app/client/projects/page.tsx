import { createClient } from '@/lib/supabase/server';
import { getProjects } from '@/lib/actions/projects';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { ProjectsList } from '@/components/client/projects/projects-list';

export default async function ClientProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const projectsResult = await getProjects({ client_id: user.id });
  const projects = projectsResult.data ?? [];

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 space-y-6">
      <PageHeader
        title="My Projects"
        description="View and manage all your projects"
      />

      <ProjectsList projects={projects} />
    </div>
  );
}
