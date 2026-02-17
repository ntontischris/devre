'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import { ProjectWithClient } from '@/types';
import { PROJECT_STATUSES, ProjectStatus } from '@/lib/constants';
import { ProjectColumn } from './project-column';
import { ProjectCard } from './project-card';
import { updateProjectStatus } from '@/lib/actions/projects';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface ProjectBoardProps {
  projects: ProjectWithClient[];
}

export function ProjectBoard({ projects }: ProjectBoardProps) {
  const t = useTranslations('projects');
  const router = useRouter();
  const [localProjects, setLocalProjects] = useState(projects);
  const [activeProject, setActiveProject] = useState<ProjectWithClient | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const projectsByStatus = PROJECT_STATUSES.reduce((acc, status) => {
    acc[status] = localProjects.filter((p) => p.status === status);
    return acc;
  }, {} as Record<ProjectStatus, ProjectWithClient[]>);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const project = localProjects.find((p) => p.id === event.active.id);
    setActiveProject(project || null);
  }, [localProjects]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setOverColumnId(null);
      return;
    }
    setOverColumnId(over.id as string);
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    const draggedProject = activeProject;

    setActiveProject(null);
    setOverColumnId(null);

    if (!over || !draggedProject) return;

    const newStatus = over.id as ProjectStatus;
    if (draggedProject.status === newStatus) return;

    setLocalProjects((prev) =>
      prev.map((p) =>
        p.id === draggedProject.id ? { ...p, status: newStatus } : p
      )
    );

    const result = await updateProjectStatus(active.id as string, newStatus);
    if (result.error) {
      setLocalProjects((prev) =>
        prev.map((p) =>
          p.id === draggedProject.id ? { ...p, status: draggedProject.status } : p
        )
      );
      toast.error(result.error);
    } else {
      toast.success(t('projectUpdated'));
      router.refresh();
    }
  }, [activeProject, router, t]);

  const handleDragCancel = useCallback(() => {
    setActiveProject(null);
    setOverColumnId(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-2 overflow-x-auto pb-3 xl:grid xl:grid-cols-8 xl:overflow-visible xl:pb-0">
        {PROJECT_STATUSES.map((status) => (
          <ProjectColumn
            key={status}
            status={status}
            projects={projectsByStatus[status]}
            isOver={overColumnId === status}
            isDragging={!!activeProject}
          />
        ))}
      </div>

      <DragOverlay>
        {activeProject ? (
          <ProjectCard project={activeProject} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
