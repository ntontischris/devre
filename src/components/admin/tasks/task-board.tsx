'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { TaskColumn } from './task-column'
import { TaskCard } from './task-card'
import { TaskDetailSheet } from './task-detail-sheet'
import { updateTaskStatus } from '@/lib/actions/tasks'
import { TASK_STATUSES } from '@/lib/constants'

type Task = {
  id: string
  project_id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to: string | null
  due_date: string | null
  order_index: number
  metadata: Record<string, unknown>
  created_by: string
  created_at: string
  updated_at: string
}

type TaskBoardProps = {
  projectId: string
  tasks: Task[]
}

export function TaskBoard({ projectId, tasks }: TaskBoardProps) {
  const router = useRouter()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Task['status']

    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return

    // Optimistically update UI
    const tasksInNewStatus = tasks.filter((t) => t.status === newStatus)
    const newSortOrder = tasksInNewStatus.length

    const result = await updateTaskStatus(taskId, newStatus, newSortOrder)

    if (result.error) {
      toast.error('Failed to update task status', {
        description: result.error,
      })
    } else {
      toast.success('Task moved successfully')
      router.refresh()
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsSheetOpen(true)
  }

  const handleSheetClose = (open: boolean) => {
    setIsSheetOpen(open)
    if (!open) {
      setSelectedTask(null)
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TASK_STATUSES.map((status) => {
            const statusTasks = tasks.filter((task) => task.status === status)
            return (
              <TaskColumn
                key={status}
                status={status}
                tasks={statusTasks}
                projectId={projectId}
                onTaskClick={handleTaskClick}
              />
            )
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 opacity-80">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDetailSheet
        task={selectedTask}
        open={isSheetOpen}
        onOpenChange={handleSheetClose}
        projectId={projectId}
      />
    </>
  )
}
