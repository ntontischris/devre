'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/shared/status-badge';
import { format } from 'date-fns';
import { ArrowLeft, Check, X, FolderKanban, Calendar, MapPin, DollarSign, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { reviewFilmingRequest, convertToProject } from '@/lib/actions/filming-requests';
import { toast } from 'sonner';
import { PROJECT_TYPE_LABELS } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FilmingRequest } from '@/types';
import { useTranslations } from 'next-intl';

interface FilmingRequestDetailProps {
  request: FilmingRequest & {
    preferred_dates?: Array<{ date?: string; time_slot?: string }>;
    reference_links?: string[];
  };
}

export function FilmingRequestDetail({ request }: FilmingRequestDetailProps) {
  const t = useTranslations('filmingRequests');
  const tc = useTranslations('common');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState((request as any).admin_notes || '');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'accepted' | 'declined'>('accepted');
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);

  const handleReview = async (status: 'accepted' | 'declined') => {
    setLoading(true);

    const result = await reviewFilmingRequest(request.id, {
      status,
      admin_notes: adminNotes || undefined,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(t('requestStatusUpdate', { status }));
      setReviewDialogOpen(false);
      router.refresh();
    }

    setLoading(false);
  };

  const handleConvertToProject = async () => {
    setLoading(true);

    const result = await convertToProject(request.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(t('convertedToProject'));
      setConvertDialogOpen(false);
      router.push(`/admin/projects/${(result.data as any).id}`);
    }

    setLoading(false);
  };

  const openReviewDialog = (status: 'accepted' | 'declined') => {
    setReviewStatus(status);
    setReviewDialogOpen(true);
  };

  const BUDGET_RANGE_LABELS: Record<string, string> = {
    under_1000: t('budgetUnder1000'),
    '1000_2500': t('budget1000_2500'),
    '2500_5000': t('budget2500_5000'),
    '5000_10000': t('budget5000_10000'),
    '10000_plus': t('budget10000Plus'),
    flexible: t('budgetFlexible'),
  };

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {(request as any).title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={request.status} />
              <span className="text-sm text-muted-foreground">
                {t('submitted')} {format(new Date(request.created_at), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          {request.status === 'pending' && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => openReviewDialog('declined')}
                disabled={loading}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                {t('decline')}
              </Button>
              <Button
                onClick={() => openReviewDialog('accepted')}
                disabled={loading}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                {t('accept')}
              </Button>
            </div>
          )}
          {request.status === 'accepted' && (
            <Button
              onClick={() => setConvertDialogOpen(true)}
              disabled={loading}
              className="gap-2"
            >
              <FolderKanban className="h-4 w-4" />
              {t('convertToProject')}
            </Button>
          )}
        </div>

        {/* Request Details */}
        <Card>
          <CardHeader>
            <CardTitle>{t('requestDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{t('projectType')}</div>
              <div className="text-base">
                {request.project_type
                  ? PROJECT_TYPE_LABELS[request.project_type as keyof typeof PROJECT_TYPE_LABELS]
                  : t('notSpecified')}
              </div>
            </div>

            {request.description && (
              <>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{tc('description')}</div>
                  <div className="text-sm whitespace-pre-wrap mt-1">
                    {request.description}
                  </div>
                </div>
              </>
            )}

            {request.reference_links && request.reference_links.length > 0 && (
              <>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {t('referenceLinks')}
                  </div>
                  <div className="space-y-1">
                    {request.reference_links.map((link: string, index: number) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <LinkIcon className="h-3 w-3" />
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Preferred Dates */}
        {request.preferred_dates && request.preferred_dates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('preferredDates')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {request.preferred_dates.map((dateInfo, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm p-2 border rounded">
                    <Check className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {dateInfo.date
                        ? format(new Date(dateInfo.date), 'MMMM d, yyyy')
                        : t('dateNotSpecified')}
                      {dateInfo.time_slot && ` - ${dateInfo.time_slot}`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Details */}
        {((request as any).location || request.budget_range) && (
          <Card>
            <CardHeader>
              <CardTitle>{t('additionalDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(request as any).location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">{t('location')}</div>
                    <div className="text-sm">{(request as any).location}</div>
                  </div>
                </div>
              )}

              {request.budget_range && (
                <div className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">{t('budgetRange')}</div>
                    <div className="text-sm">
                      {BUDGET_RANGE_LABELS[request.budget_range] || request.budget_range}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Admin Notes */}
        <Card>
          <CardHeader>
            <CardTitle>{t('adminNotes')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="admin-notes">{t('internalNotesInfo')}</Label>
            <Textarea
              id="admin-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={t('addNotesPlaceholder')}
              rows={4}
              disabled={request.status !== 'pending'}
            />
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewStatus === 'accepted' ? t('acceptRequest') : t('declineRequest')}
            </DialogTitle>
            <DialogDescription>
              {reviewStatus === 'accepted'
                ? t('acceptDescription')
                : t('declineDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="review-notes">{t('adminNotesOptional')}</Label>
            <Textarea
              id="review-notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={t('addInternalNotes')}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={loading}
            >
              {tc('cancel')}
            </Button>
            <Button
              onClick={() => handleReview(reviewStatus)}
              disabled={loading}
              variant={reviewStatus === 'declined' ? 'destructive' : 'default'}
            >
              {loading ? t('processing') : reviewStatus === 'accepted' ? t('accept') : t('decline')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Project Dialog */}
      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('convertToProject')}</DialogTitle>
            <DialogDescription>
              {t('convertDescription')}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConvertDialogOpen(false)}
              disabled={loading}
            >
              {tc('cancel')}
            </Button>
            <Button
              onClick={handleConvertToProject}
              disabled={loading}
            >
              {loading ? t('converting') : t('convertToProject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
