import { getProjects } from '@/lib/actions/projects';
import { ProjectWithClient } from '@/types';
import { ProjectsContent } from './projects-content';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('projects');
  return { title: t('title') };
}

export default async function ProjectsPage() {
  const result = await getProjects();

  if (result.error) {
    redirect('/admin/dashboard');
  }

  const projects = result.data as ProjectWithClient[];

  return <ProjectsContent projects={projects} />;
}
