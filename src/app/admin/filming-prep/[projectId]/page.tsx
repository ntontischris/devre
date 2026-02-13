import { getProject } from '@/lib/actions/projects';
import { notFound } from 'next/navigation';
import { FilmingPrepContent } from './filming-prep-content';
import type { Metadata } from 'next';

interface FilmingPrepPageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({ params }: FilmingPrepPageProps): Promise<Metadata> {
  const { projectId } = await params;
  const result = await getProject(projectId);

  if (result.error || !result.data) {
    return {
      title: 'Filming Preparation - Devre Media',
    };
  }

  return {
    title: `Filming Prep - ${result.data.title} - Devre Media`,
    description: `Manage equipment, shot lists, and concept notes for ${result.data.title}`,
  };
}

export default async function FilmingPrepPage({ params }: FilmingPrepPageProps) {
  const { projectId } = await params;
  const result = await getProject(projectId);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <FilmingPrepContent
      projectId={projectId}
      projectTitle={result.data.title}
    />
  );
}
