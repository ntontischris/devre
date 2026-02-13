import { getProject } from '@/lib/actions/projects';
import { getContractsByProject } from '@/lib/actions/contracts';
import { ProjectWithClient } from '@/types';
import { ProjectDetail } from './project-detail';
import { notFound } from 'next/navigation';

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const result = await getProject(projectId);

  if (result.error) {
    return { title: 'Project Not Found' };
  }

  const project = result.data as ProjectWithClient;
  return { title: project.title };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const result = await getProject(projectId);

  if (result.error) {
    notFound();
  }

  const project = result.data as ProjectWithClient;

  // Fetch contracts for this project
  const contractsResult = await getContractsByProject(projectId);
  const contracts = contractsResult.data ?? [];

  return <ProjectDetail project={project} contracts={contracts} />;
}
