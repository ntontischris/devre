'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import dynamic from 'next/dynamic';
import { EmptyState } from '@/components/shared/empty-state';

const VideoPlayer = dynamic(
  () => import('@/components/shared/video-player').then((mod) => mod.VideoPlayer),
  { ssr: false },
);
import { AnnotationList } from '@/components/shared/annotation-list';
import { AddAnnotationDialog } from '@/components/shared/add-annotation-dialog';
import { format } from 'date-fns';
import {
  FileVideo,
  Download,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Plus,
  Loader2,
  Eye,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { updateDeliverableStatus, getAnnotations, resolveAnnotation } from '@/lib/actions/deliverables';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type VideoAnnotation = {
  id: string;
  deliverable_id: string;
  created_by: string | null;
  timestamp_seconds: number;
  content: string;
  resolved: boolean;
  created_at: string;
};

interface DeliverablesTabProps {
  deliverables: any[];
  projectId: string;
}

export function DeliverablesTab({ deliverables, projectId }: DeliverablesTabProps) {
  const router = useRouter();
  const [selectedDeliverable, setSelectedDeliverable] = useState<any>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewType, setReviewType] = useState<'approved' | 'revision_requested'>('approved');
  const [revisionNotes, setRevisionNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Annotation state
  const [annotations, setAnnotations] = useState<VideoAnnotation[]>([]);
  const [isLoadingAnnotations, setIsLoadingAnnotations] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAnnotationDialogOpen, setIsAnnotationDialogOpen] = useState(false);
  const [selectedTimestamp, setSelectedTimestamp] = useState(0);

  // Fetch annotations when a deliverable is selected
  useEffect(() => {
    if (selectedDeliverable) {
      fetchAnnotations();
      fetchVideoUrl();
    }
  }, [selectedDeliverable?.id]);

  const fetchAnnotations = async () => {
    if (!selectedDeliverable) return;
    setIsLoadingAnnotations(true);
    const result = await getAnnotations(selectedDeliverable.id);
    if (result.error) {
      toast.error('Failed to load annotations');
    } else {
      setAnnotations((result.data as VideoAnnotation[]) ?? []);
    }
    setIsLoadingAnnotations(false);
  };

  const fetchVideoUrl = async () => {
    if (!selectedDeliverable?.file_path) {
      setVideoUrl(selectedDeliverable?.file_url ?? null);
      return;
    }
    try {
      const supabase = createClient();
      const { data } = supabase.storage
        .from('deliverables')
        .getPublicUrl(selectedDeliverable.file_path);
      setVideoUrl(data.publicUrl);
    } catch {
      setVideoUrl(selectedDeliverable?.file_url ?? null);
    }
  };

  const handleResolve = async (annotationId: string) => {
    const result = await resolveAnnotation(annotationId);
    if (result.error) {
      toast.error('Failed to update annotation');
    } else {
      toast.success('Annotation updated');
      fetchAnnotations();
    }
  };

  const handleAnnotationClick = (_annotation: VideoAnnotation) => {
    // Video player handles seeking via onAnnotationClick internally
  };

  const handleTimeClick = (seconds: number) => {
    setSelectedTimestamp(seconds);
    setIsAnnotationDialogOpen(true);
  };

  const handleDownload = async (deliverable: any) => {
    if (deliverable.file_path) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.storage
          .from('deliverables')
          .download(deliverable.file_path);
        if (error) throw error;
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = deliverable.title;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Download started');
      } catch {
        toast.error('Failed to download file');
      }
    } else if (deliverable.file_url) {
      window.open(deliverable.file_url, '_blank');
    }
  };

  if (deliverables.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={FileVideo}
            title="No deliverables yet"
            description="Your project deliverables will appear here once uploaded"
          />
        </CardContent>
      </Card>
    );
  }

  const handleReview = async (deliverableId: string, status: 'approved' | 'revision_requested') => {
    if (status === 'revision_requested' && !revisionNotes.trim()) {
      toast.error('Please provide revision notes');
      return;
    }

    setLoading(true);
    const result = await updateDeliverableStatus(deliverableId, status);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        status === 'approved'
          ? 'Deliverable approved successfully'
          : 'Revision request submitted'
      );
      setReviewDialogOpen(false);
      setRevisionNotes('');
      router.refresh();
    }
    setLoading(false);
  };

  const openReviewDialog = (deliverable: any, type: 'approved' | 'revision_requested') => {
    setReviewType(type);
    setReviewDialogOpen(true);
  };

  const handleBackToList = () => {
    setSelectedDeliverable(null);
    setAnnotations([]);
    setVideoUrl(null);
  };

  // ── Detail View ──
  if (selectedDeliverable) {
    const resolvedVideoSrc = videoUrl ?? selectedDeliverable.file_url;

    return (
      <>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={handleBackToList}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold">{selectedDeliverable.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selectedDeliverable.status} />
                  <span className="text-sm text-muted-foreground">
                    v{selectedDeliverable.version_number}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleDownload(selectedDeliverable)}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Video Player with Annotations */}
          {resolvedVideoSrc ? (
            <VideoPlayer
              src={resolvedVideoSrc}
              annotations={annotations}
              onTimeClick={handleTimeClick}
              onAnnotationClick={handleAnnotationClick}
            />
          ) : (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Review Actions */}
          {selectedDeliverable.status === 'pending_review' && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => openReviewDialog(selectedDeliverable, 'approved')}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => openReviewDialog(selectedDeliverable, 'revision_requested')}
                className="gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                Request Revision
              </Button>
            </div>
          )}

          {/* Annotations Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Annotations & Feedback</h3>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedTimestamp(0);
                  setIsAnnotationDialogOpen(true);
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

        {/* Add Annotation Dialog */}
        <AddAnnotationDialog
          open={isAnnotationDialogOpen}
          onOpenChange={setIsAnnotationDialogOpen}
          timestamp={selectedTimestamp}
          deliverableId={selectedDeliverable.id}
          onCreated={fetchAnnotations}
        />

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {reviewType === 'approved' ? 'Approve Deliverable' : 'Request Revision'}
              </DialogTitle>
              <DialogDescription>
                {reviewType === 'approved'
                  ? 'Confirm that you approve this deliverable.'
                  : 'Provide details about the revisions needed.'}
              </DialogDescription>
            </DialogHeader>

            {reviewType === 'revision_requested' && (
              <div className="space-y-2">
                <Label htmlFor="revision-notes">Revision Notes *</Label>
                <Textarea
                  id="revision-notes"
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Describe what needs to be changed..."
                  rows={4}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setReviewDialogOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  selectedDeliverable && handleReview(selectedDeliverable.id, reviewType)
                }
                disabled={loading}
              >
                {loading ? 'Submitting...' : reviewType === 'approved' ? 'Approve' : 'Submit'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // ── List View ──
  return (
    <>
      <div className="space-y-6">
        {deliverables.map((deliverable) => (
          <Card key={deliverable.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {deliverable.title}
                    <span className="text-sm font-normal text-muted-foreground">
                      v{deliverable.version_number}
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={deliverable.status} />
                    <span className="text-xs text-muted-foreground">
                      Uploaded {format(new Date(deliverable.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {deliverable.description && (
                <p className="text-sm text-muted-foreground">
                  {deliverable.description}
                </p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={() => setSelectedDeliverable(deliverable)}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Review
                </Button>

                {deliverable.status === 'pending_review' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDeliverable(deliverable);
                        openReviewDialog(deliverable, 'approved');
                      }}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDeliverable(deliverable);
                        openReviewDialog(deliverable, 'revision_requested');
                      }}
                      className="gap-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      Request Revision
                    </Button>
                  </>
                )}

                <Button
                  variant="ghost"
                  onClick={() => handleDownload(deliverable)}
                  className="gap-2 ml-auto"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Review Dialog (from list view) */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewType === 'approved' ? 'Approve Deliverable' : 'Request Revision'}
            </DialogTitle>
            <DialogDescription>
              {reviewType === 'approved'
                ? 'Confirm that you approve this deliverable.'
                : 'Provide details about the revisions needed.'}
            </DialogDescription>
          </DialogHeader>

          {reviewType === 'revision_requested' && (
            <div className="space-y-2">
              <Label htmlFor="revision-notes-list">Revision Notes *</Label>
              <Textarea
                id="revision-notes-list"
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Describe what needs to be changed..."
                rows={4}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedDeliverable && handleReview(selectedDeliverable.id, reviewType)
              }
              disabled={loading}
            >
              {loading ? 'Submitting...' : reviewType === 'approved' ? 'Approve' : 'Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
