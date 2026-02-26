'use client';

import { useDraggable } from '@dnd-kit/core';
import { ProjectWithClient } from '@/types';
import { Card } from '@/components/ui/card';
import { Building2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: ProjectWithClient;
  isOverlay?: boolean;
}

const PRIORITY_BORDER: Record<string, string> = {
  urgent: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-amber-400',
  low: 'border-l-blue-400',
};

const PRIORITY_DOT: Record<string, string> = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-400',
  low: 'bg-blue-400',
};

export function ProjectCard({ project, isOverlay }: ProjectCardProps) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: project.id,
  });

  const handleClick = () => {
    if (!isDragging) {
      router.push(`/admin/projects/${project.id}`);
    }
  };

  if (isOverlay) {
    return (
      <Card className={`p-2.5 shadow-2xl border-l-[3px] w-[200px] bg-background rotate-[2deg] ${PRIORITY_BORDER[project.priority] || 'border-l-transparent'}`}>
        <CardInner project={project} />
      </Card>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`transition-opacity duration-150 cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-30' : 'opacity-100'}`}
    >
      <Card
        className={`
          border-l-[3px] p-2.5
          ${PRIORITY_BORDER[project.priority] || 'border-l-transparent'}
          hover:shadow-md transition-shadow duration-200
        `}
      >
        <CardInner project={project} />
      </Card>
    </div>
  );
}

function CardInner({ project }: { project: ProjectWithClient }) {
  return (
    <>
      <h4 className="font-medium text-xs leading-snug line-clamp-2 mb-1">
        {project.title}
      </h4>

      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1.5">
        <Building2 className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">
          {project.client?.company_name || project.client?.contact_name}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[project.priority] || 'bg-gray-400'}`} />
          <span className="text-[10px] text-muted-foreground capitalize">
            {project.priority}
          </span>
        </div>

        {project.deadline && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <Calendar className="h-2.5 w-2.5" />
            {format(new Date(project.deadline), 'MMM d')}
          </span>
        )}
      </div>
    </>
  );
}
