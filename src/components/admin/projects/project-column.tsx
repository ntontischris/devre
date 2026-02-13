'use client';

import { useDroppable } from '@dnd-kit/core';
import { ProjectWithClient } from '@/types';
import { ProjectStatus, PROJECT_STATUS_LABELS } from '@/lib/constants';
import { ProjectCard } from './project-card';

interface ProjectColumnProps {
  status: ProjectStatus;
  projects: ProjectWithClient[];
  isOver?: boolean;
  isDragging?: boolean;
}

const STATUS_ACCENT: Record<ProjectStatus, string> = {
  briefing: 'bg-slate-400',
  pre_production: 'bg-blue-400',
  filming: 'bg-purple-400',
  editing: 'bg-amber-400',
  review: 'bg-orange-400',
  revisions: 'bg-rose-400',
  delivered: 'bg-emerald-400',
  archived: 'bg-gray-400',
};

const STATUS_RING: Record<ProjectStatus, string> = {
  briefing: 'ring-slate-300 dark:ring-slate-600',
  pre_production: 'ring-blue-300 dark:ring-blue-600',
  filming: 'ring-purple-300 dark:ring-purple-600',
  editing: 'ring-amber-300 dark:ring-amber-600',
  review: 'ring-orange-300 dark:ring-orange-600',
  revisions: 'ring-rose-300 dark:ring-rose-600',
  delivered: 'ring-emerald-300 dark:ring-emerald-600',
  archived: 'ring-gray-300 dark:ring-gray-600',
};

const STATUS_BG: Record<ProjectStatus, string> = {
  briefing: 'bg-slate-50/80 dark:bg-slate-900/30',
  pre_production: 'bg-blue-50/80 dark:bg-blue-900/30',
  filming: 'bg-purple-50/80 dark:bg-purple-900/30',
  editing: 'bg-amber-50/80 dark:bg-amber-900/30',
  review: 'bg-orange-50/80 dark:bg-orange-900/30',
  revisions: 'bg-rose-50/80 dark:bg-rose-900/30',
  delivered: 'bg-emerald-50/80 dark:bg-emerald-900/30',
  archived: 'bg-gray-50/80 dark:bg-gray-900/30',
};

export function ProjectColumn({ status, projects, isOver, isDragging }: ProjectColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="flex-shrink-0 w-[220px] xl:w-auto xl:min-w-0" ref={setNodeRef}>
      <div
        className={`
          rounded-lg border h-full transition-all duration-200
          ${isOver ? `ring-2 ${STATUS_RING[status]} ${STATUS_BG[status]}` : 'bg-muted/30'}
          ${isDragging && !isOver ? 'opacity-60' : ''}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 px-2 py-2 border-b">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_ACCENT[status]}`} />
          <h3 className="font-semibold text-[11px] uppercase tracking-wide text-muted-foreground truncate flex-1">
            {PROJECT_STATUS_LABELS[status]}
          </h3>
          <span className="text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-1.5 py-0.5 flex-shrink-0">
            {projects.length}
          </span>
        </div>

        {/* Cards */}
        <div className="p-1.5 space-y-1.5 min-h-[80px] max-h-[calc(100vh-240px)] overflow-y-auto">
          {projects.length === 0 && (
            <div
              className={`
                flex items-center justify-center h-[60px] rounded text-[10px] transition-all duration-200
                ${isOver
                  ? 'border-2 border-dashed border-muted-foreground/30 text-muted-foreground'
                  : 'text-muted-foreground/40'
                }
              `}
            >
              {isOver ? 'Drop here' : 'Empty'}
            </div>
          )}
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
