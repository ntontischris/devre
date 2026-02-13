'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { AnnotationList } from '@/components/shared/annotation-list'

const VideoPlayer = dynamic(
  () => import('@/components/shared/video-player').then((mod) => mod.VideoPlayer),
  { ssr: false },
)
import { AddAnnotationDialog } from '@/components/shared/add-annotation-dialog'
import { ApprovalActions } from '@/components/admin/deliverables/approval-actions'
import { VersionHistory } from '@/components/admin/deliverables/version-history'
import { getAnnotations, resolveAnnotation, getDeliverablesByProject } from '@/lib/actions/deliverables'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ArrowLeft, Download, Plus, Loader2 } from 'lucide-react'
import type { DeliverableStatus } from '@/lib/constants'

type Deliverable = {
  id: string
  project_id: string
  title: string
  description: string | null
  file_path: string
  file_size: number | null
  file_type: string | null
  version_number: number
  status: DeliverableStatus
  download_count: number
  expires_at: string | null
  uploaded_by: string | null
  created_at: string
}

type VideoAnnotation = {
  id: string
  deliverable_id: string
  created_by: string | null
  timestamp_seconds: number
  content: string
  resolved: boolean
  created_at: string
}

type DeliverableDetailProps = {
  deliverable: Deliverable
  projectId: string
  onBack: () => void
}

export function DeliverableDetail({
  deliverable,
  projectId,
  onBack,
}: DeliverableDetailProps) {
  const [annotations, setAnnotations] = useState<VideoAnnotation[]>([])
  const [versionHistory, setVersionHistory] = useState<Deliverable[]>([])
  const [isLoadingAnnotations, setIsLoadingAnnotations] = useState(true)
  const [isLoadingVersions, setIsLoadingVersions] = useState(true)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isAnnotationDialogOpen, setIsAnnotationDialogOpen] = useState(false)
  const [selectedTimestamp, setSelectedTimestamp] = useState(0)

  const fetchAnnotations = async () => {
    setIsLoadingAnnotations(true)
    const result = await getAnnotations(deliverable.id)

    if (result.error) {
      toast.error('Failed to load annotations')
    } else {
      setAnnotations((result.data as VideoAnnotation[]) ?? [])
    }

    setIsLoadingAnnotations(false)
  }

  const fetchVersionHistory = async () => {
    setIsLoadingVersions(true)
    const result = await getDeliverablesByProject(projectId)

    if (result.error) {
      toast.error('Failed to load version history')
    } else {
      const allDeliverables = (result.data as Deliverable[]) ?? []
      setVersionHistory(allDeliverables)
    }

    setIsLoadingVersions(false)
  }

  const fetchVideoUrl = async () => {
    try {
      const supabase = createClient()
      const { data } = supabase.storage
        .from('deliverables')
        .getPublicUrl(deliverable.file_path)

      setVideoUrl(data.publicUrl)
    } catch (error) {
      console.error('Failed to get video URL:', error)
      toast.error('Failed to load video')
    }
  }

  useEffect(() => {
    fetchAnnotations()
    fetchVersionHistory()
    fetchVideoUrl()
  }, [deliverable.id])

  const handleAnnotationClick = (annotation: VideoAnnotation) => {
    // Video player will handle seeking to timestamp
  }

  const handleTimeClick = (seconds: number) => {
    setSelectedTimestamp(seconds)
    setIsAnnotationDialogOpen(true)
  }

  const handleResolve = async (annotationId: string) => {
    const result = await resolveAnnotation(annotationId)

    if (result.error) {
      toast.error('Failed to update annotation')
    } else {
      toast.success('Annotation updated')
      fetchAnnotations()
    }
  }

  const handleDownload = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.storage
        .from('deliverables')
        .download(deliverable.file_path)

      if (error) throw error

      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = deliverable.title
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Download started')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download file')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{deliverable.title}</h2>
            <p className="text-sm text-muted-foreground">
              Version {deliverable.version_number}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Video & Annotations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          {videoUrl ? (
            <VideoPlayer
              src={videoUrl}
              annotations={annotations}
              onTimeClick={handleTimeClick}
              onAnnotationClick={handleAnnotationClick}
            />
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Annotations Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Annotations & Feedback</h3>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedTimestamp(0)
                  setIsAnnotationDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Annotation
              </Button>
            </div>

            {isLoadingAnnotations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <AnnotationList
                annotations={annotations}
                onAnnotationClick={handleAnnotationClick}
                onResolve={handleResolve}
              />
            )}
          </div>
        </div>

        {/* Right Column - Approval & Version History */}
        <div className="space-y-6">
          {/* Approval Actions */}
          <div className="rounded-lg border bg-card p-6">
            <ApprovalActions
              deliverable={deliverable}
              onStatusChange={() => {
                onBack()
              }}
            />
          </div>

          {/* Version History */}
          <div className="rounded-lg border bg-card p-6">
            {isLoadingVersions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <VersionHistory
                deliverables={versionHistory}
                currentId={deliverable.id}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Annotation Dialog */}
      <AddAnnotationDialog
        open={isAnnotationDialogOpen}
        onOpenChange={setIsAnnotationDialogOpen}
        timestamp={selectedTimestamp}
        deliverableId={deliverable.id}
        onCreated={fetchAnnotations}
      />
    </div>
  )
}
