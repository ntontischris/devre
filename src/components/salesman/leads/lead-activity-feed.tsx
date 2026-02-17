'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  Phone,
  Mail,
  Calendar,
  StickyNote,
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { LEAD_ACTIVITY_TYPE_LABELS } from '@/lib/constants'
import type { LeadActivity, LeadActivityType } from '@/types'
import { useTranslations } from 'next-intl'

type LeadActivityFeedProps = {
  activities: Array<LeadActivity & { user?: { display_name: string } }>
}

const activityIcons: Record<LeadActivityType, React.ComponentType<{ className?: string }>> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: StickyNote,
  stage_change: ArrowRight,
  other: MoreHorizontal,
}

const activityColors: Record<LeadActivityType, string> = {
  call: 'text-blue-600 bg-blue-50',
  email: 'text-purple-600 bg-purple-50',
  meeting: 'text-green-600 bg-green-50',
  note: 'text-amber-600 bg-amber-50',
  stage_change: 'text-indigo-600 bg-indigo-50',
  other: 'text-gray-600 bg-gray-50',
}

export function LeadActivityFeed({ activities }: LeadActivityFeedProps) {
  const t = useTranslations('leads')

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{t('noActivities')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = activityIcons[activity.activity_type]
        const colorClass = activityColors[activity.activity_type]

        return (
          <Card key={activity.id} className="p-4">
            <div className="flex gap-4">
              <div className={`p-2 rounded-lg h-fit ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {LEAD_ACTIVITY_TYPE_LABELS[activity.activity_type]}
                      {activity.user && ` • ${activity.user.display_name}`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </span>
                </div>

                {activity.description && (
                  <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
