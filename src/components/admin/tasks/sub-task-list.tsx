'use client'

import { useState } from 'react'
import { Plus, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { updateTask } from '@/lib/actions/tasks'

type SubTask = {
  id: string
  title: string
  completed: boolean
}

type SubTaskListProps = {
  taskId: string
  initialSubTasks: SubTask[]
}

export function SubTaskList({ taskId, initialSubTasks }: SubTaskListProps) {
  const router = useRouter()
  const t = useTranslations('tasks')
  const tc = useTranslations('common')
  const tToast = useTranslations('toast')
  const [subTasks, setSubTasks] = useState<SubTask[]>(initialSubTasks)
  const [isAdding, setIsAdding] = useState(false)
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const updateSubTasks = async (updatedSubTasks: SubTask[]) => {
    setIsLoading(true)

    const result = await updateTask(taskId, {
      metadata: { sub_tasks: updatedSubTasks },
    })

    setIsLoading(false)

    if (result.error) {
      toast.error(tToast('updateError'), {
        description: result.error,
      })
      return false
    }

    setSubTasks(updatedSubTasks)
    router.refresh()
    return true
  }

  const handleAddSubTask = async () => {
    if (!newSubTaskTitle.trim()) {
      toast.error(tToast('validationError'))
      return
    }

    const newSubTask: SubTask = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newSubTaskTitle.trim(),
      completed: false,
    }

    const updatedSubTasks = [...subTasks, newSubTask]
    const success = await updateSubTasks(updatedSubTasks)

    if (success) {
      setNewSubTaskTitle('')
      setIsAdding(false)
      toast.success(t('taskCreated'))
    }
  }

  const handleToggleSubTask = async (subTaskId: string) => {
    const updatedSubTasks = subTasks.map((st) =>
      st.id === subTaskId ? { ...st, completed: !st.completed } : st
    )

    await updateSubTasks(updatedSubTasks)
  }

  const handleDeleteSubTask = async (subTaskId: string) => {
    const updatedSubTasks = subTasks.filter((st) => st.id !== subTaskId)
    const success = await updateSubTasks(updatedSubTasks)

    if (success) {
      toast.success(t('taskDeleted'))
    }
  }

  const completedCount = subTasks.filter((st) => st.completed).length
  const totalCount = subTasks.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {t('subtasksHeading')} {totalCount > 0 && `(${completedCount}/${totalCount})`}
        </h3>
        {!isAdding && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-1" />
            {tc('add')}
          </Button>
        )}
      </div>

      {totalCount > 0 && (
        <div className="space-y-2">
          {subTasks.map((subTask) => (
            <div
              key={subTask.id}
              className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 group"
            >
              <Checkbox
                id={`subtask-${subTask.id}`}
                checked={subTask.completed}
                onCheckedChange={() => handleToggleSubTask(subTask.id)}
                disabled={isLoading}
                className="mt-0.5"
              />
              <label
                htmlFor={`subtask-${subTask.id}`}
                className={`flex-1 text-sm cursor-pointer ${
                  subTask.completed ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {subTask.title}
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteSubTask(subTask.id)}
                disabled={isLoading}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isAdding && (
        <div className="space-y-2">
          <Input
            placeholder={t('subtaskTitlePlaceholder')}
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            disabled={isLoading}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddSubTask()
              } else if (e.key === 'Escape') {
                setNewSubTaskTitle('')
                setIsAdding(false)
              }
            }}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAddSubTask}
              size="sm"
              disabled={isLoading}
              className="flex-1"
            >
              <Check className="h-4 w-4 mr-1" />
              {tc('add')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setNewSubTaskTitle('')
                setIsAdding(false)
              }}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {!isAdding && totalCount === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          {t('noSubtasksYet')}
        </p>
      )}
    </div>
  )
}
