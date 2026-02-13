'use client'

import { useState, useEffect, useMemo } from 'react'
import { TaskBoard } from '@/components/admin/tasks/task-board'
import { TaskFilters } from '@/components/admin/tasks/task-filters'
import { getTasksByProject } from '@/lib/actions/tasks'
import { Loader2 } from 'lucide-react'

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'
type Priority = 'low' | 'medium' | 'high' | 'urgent'

type Task = {
  id: string
  project_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  assigned_to: string | null
  due_date: string | null
  order_index: number
  metadata: Record<string, unknown>
  created_by: string
  created_at: string
  updated_at: string
}

type TasksTabProps = {
  projectId: string
}

export function TasksTab({ projectId }: TasksTabProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<{ priority?: Priority }>({})

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      setError(null)

      const result = await getTasksByProject(projectId)

      if (result.error) {
        setError(result.error)
      } else {
        setTasks((result.data as Task[]) ?? [])
      }

      setIsLoading(false)
    }

    fetchTasks()
  }, [projectId])

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]

    if (filters.priority) {
      filtered = filtered.filter((task) => task.priority === filters.priority)
    }

    return filtered
  }, [filters, tasks])

  const handleFilterChange = (newFilters: { priority?: Priority }) => {
    setFilters(newFilters)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-destructive">Failed to load tasks</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TaskFilters onFilterChange={handleFilterChange} />
      <TaskBoard projectId={projectId} tasks={filteredTasks} />
    </div>
  )
}
