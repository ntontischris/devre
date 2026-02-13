'use client';

import { useState, useEffect } from 'react';
import { ProjectWithClient } from '@/types';
import { PageHeader } from '@/components/shared/page-header';
import { ViewToggle } from '@/components/admin/projects/view-toggle';
import { ProjectBoard } from '@/components/admin/projects/project-board';
import { ProjectList } from '@/components/admin/projects/project-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface ProjectsContentProps {
  projects: ProjectWithClient[];
}

export function ProjectsContent({ projects }: ProjectsContentProps) {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  useEffect(() => {
    const savedView = localStorage.getItem('projects-view') as 'kanban' | 'list' | null;
    if (savedView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setView(savedView);
    }
  }, []);

  const handleViewChange = (newView: 'kanban' | 'list') => {
    setView(newView);
    localStorage.setItem('projects-view', newView);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage all your video production projects"
      >
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onViewChange={handleViewChange} />
          <Button asChild>
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>
      </PageHeader>

      {view === 'kanban' ? (
        <ProjectBoard projects={projects} />
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}
