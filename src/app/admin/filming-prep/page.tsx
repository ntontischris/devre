import { getProjects } from '@/lib/actions/projects';
import { PageHeader } from '@/components/shared/page-header';
import { ProjectPrepList } from '@/components/admin/filming-prep/project-prep-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Filming Preparation - Devre Media',
  description: 'Prepare equipment lists, shot lists, and concept notes for upcoming projects',
};

export default async function FilmingPrepIndexPage() {
  const result = await getProjects();
  const projects = (result.data ?? []).filter(
    (p: any) => p.status !== 'archived' && p.status !== 'delivered'
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Filming Preparation"
        description="Manage equipment lists, shot lists, and concept notes for your projects"
      />
      <ProjectPrepList projects={projects} />
    </div>
  );
}
