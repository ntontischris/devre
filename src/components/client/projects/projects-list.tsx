'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { PROJECT_TYPE_LABELS, PROJECT_STATUS_LABELS } from '@/lib/constants';
import { format } from 'date-fns';
import { FolderKanban, Calendar, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectsListProps {
  projects: any[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="You don't have any projects at the moment"
        action={{
          label: 'Book a filming',
          onClick: () => router.push('/client/book'),
        }}
      />
    );
  }

  // Group projects by status
  const activeProjects = projects.filter(p =>
    p.status !== 'archived' && p.status !== 'delivered'
  );
  const completedProjects = projects.filter(p =>
    p.status === 'delivered' || p.status === 'archived'
  );

  return (
    <div className="space-y-8">
      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Active Projects</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Completed Projects</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow group"
      onClick={() => router.push(`/client/projects/${project.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2 flex-1">
            {project.title}
          </CardTitle>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <StatusBadge status={project.status} />

        <div className="text-sm text-muted-foreground">
          {PROJECT_TYPE_LABELS[project.project_type as keyof typeof PROJECT_TYPE_LABELS] || project.project_type}
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}

        {project.filming_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(project.filming_date), 'MMM d, yyyy')}
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Created {format(new Date(project.created_at), 'MMM d, yyyy')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
