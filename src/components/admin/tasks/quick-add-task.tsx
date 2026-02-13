'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTask } from '@/lib/actions/tasks'

type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done'

type QuickAddTaskProps = {
  projectId: string
  status: TaskStatus
}

export function QuickAddTask({ projectId, status }: QuickAddTaskProps) {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Task title is required')
      return
    }

    setIsLoading(true)

    const result = await createTask({
      title: title.trim(),
      project_id: projectId,
      status,
    })

    setIsLoading(false)

    if (result.error) {
      toast.error('Failed to create task', {
        description: result.error,
      })
    } else {
      toast.success('Task created successfully')
      setTitle('')
      setIsAdding(false)
      router.refresh()
    }
  }

  const handleCancel = () => {
    setTitle('')
    setIsAdding(false)
  }

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add task
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            handleCancel()
          }
        }}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isLoading} className="flex-1">
          Add
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
