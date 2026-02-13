import { getProjects } from '@/lib/actions/projects';
import { ProjectWithClient } from '@/types';
import { ProjectsContent } from './projects-content';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Projects',
};

export default async function ProjectsPage() {
  const result = await getProjects();

  if (result.error) {
    redirect('/admin/dashboard');
  }

  const projects = result.data as ProjectWithClient[];

  return <ProjectsContent projects={projects} />;
}
