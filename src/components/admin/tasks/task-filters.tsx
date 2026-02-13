'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PRIORITIES, PRIORITY_LABELS } from '@/lib/constants'

type Priority = 'low' | 'medium' | 'high' | 'urgent'

type TaskFiltersProps = {
  onFilterChange: (filters: { priority?: Priority }) => void
}

export function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const handlePriorityChange = (value: string) => {
    if (value === 'all') {
      onFilterChange({})
    } else {
      onFilterChange({ priority: value as Priority })
    }
  }

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <label htmlFor="priority-filter" className="text-sm font-medium text-muted-foreground">
          Priority:
        </label>
        <Select defaultValue="all" onValueChange={handlePriorityChange}>
          <SelectTrigger id="priority-filter" className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {PRIORITIES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
