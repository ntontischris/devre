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
import { useTranslations } from 'next-intl'
import { LeadColumn } from './lead-column'
import { LeadCard } from './lead-card'
import { updateLeadStage } from '@/lib/actions/leads'
import { LEAD_STAGES } from '@/lib/constants'
import type { Lead, LeadStage } from '@/types'

type LeadPipelineProps = {
  leads: Lead[]
}

export function LeadPipeline({ leads }: LeadPipelineProps) {
  const router = useRouter()
  const tToast = useTranslations('toast')
  const [activeLead, setActiveLead] = useState<Lead | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    const lead = leads.find((l) => l.id === event.active.id)
    if (lead) {
      setActiveLead(lead)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveLead(null)

    if (!over) return

    const leadId = active.id as string
    const newStage = over.id as LeadStage

    const lead = leads.find((l) => l.id === leadId)
    if (!lead || lead.stage === newStage) return

    const result = await updateLeadStage(leadId, newStage)

    if (result.error) {
      toast.error(tToast('updateError'), {
        description: result.error,
      })
    } else {
      toast.success(tToast('updateSuccess'))
      router.refresh()
    }
  }

  const handleLeadClick = (lead: Lead) => {
    router.push(`/salesman/leads/${lead.id}`)
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex gap-4 min-w-full">
            {LEAD_STAGES.map((stage) => {
              const stageLeads = leads.filter((lead) => lead.stage === stage)
              return (
                <div key={stage} className="w-80 flex-shrink-0">
                  <LeadColumn
                    stage={stage}
                    leads={stageLeads}
                    onLeadClick={handleLeadClick}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="rotate-3 opacity-80">
              <LeadCard lead={activeLead} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  )
}
