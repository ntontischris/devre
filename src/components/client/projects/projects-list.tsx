'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { PROJECT_TYPE_LABELS } from '@/lib/constants';
import { format } from 'date-fns';
import { FolderKanban, Calendar, ArrowRight, Clock, CheckCircle2, XCircle, Clapperboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/shared/empty-state';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type { Project, FilmingRequest } from '@/types';

const PROJECT_STAGES = [
  'briefing',
  'pre_production',
  'filming',
  'editing',
  'review',
  'revisions',
  'delivered',
] as const;

const BOOKING_STAGES = ['pending', 'reviewed', 'accepted', 'converted'] as const;

interface ProjectsListProps {
  projects: Project[];
  filmingRequests: FilmingRequest[];
}

export function ProjectsList({ projects, filmingRequests }: ProjectsListProps) {
  const router = useRouter();
  const t = useTranslations('client.projects');

  const activeProjects = projects.filter(
    (p) => p.status !== 'archived' && p.status !== 'delivered'
  );
  const completedProjects = projects.filter(
    (p) => p.status === 'delivered' || p.status === 'archived'
  );

  // Show only non-converted requests (converted ones appear as projects)
  const pendingRequests = filmingRequests.filter((r) => r.status !== 'converted');
  // Converted requests to cross-link with projects
  const convertedRequests = filmingRequests.filter((r) => r.status === 'converted');

  const isEmpty = projects.length === 0 && filmingRequests.length === 0;

  if (isEmpty) {
    return (
      <EmptyState
        icon={FolderKanban}
        title={t('noProjects')}
        description={t('noProjectsDescription')}
        action={{
          label: t('bookFilming'),
          onClick: () => router.push('/client/book'),
        }}
      />
    );
  }

  return (
    <div className="space-y-10">
      {/* Booking Requests */}
      {pendingRequests.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">{t('bookingRequests')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingRequests.map((request) => (
              <BookingRequestCard key={request.id} request={request} />
            ))}
          </div>
        </section>
      )}

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Clapperboard className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">{t('activeProjects')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project) => {
              const source = convertedRequests.find(
                (r) => r.converted_project_id === project.id
              );
              return (
                <ProjectCard key={project.id} project={project} fromRequest={!!source} />
              );
            })}
          </div>
        </section>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">{t('completedProjects')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} fromRequest={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Booking Request Card ─────────────────────────────── */

function BookingRequestCard({ request }: { request: FilmingRequest }) {
  const t = useTranslations('client.projects');

  const declined = request.status === 'declined';
  const stageIndex = declined
    ? -1
    : BOOKING_STAGES.indexOf(request.status as typeof BOOKING_STAGES[number]);

  const stageLabels = [
    t('stageSubmitted'),
    t('stageUnderReview'),
    t('stageAccepted'),
    t('stageInProduction'),
  ];

  return (
    <Card className={cn('border', declined && 'opacity-70')}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold line-clamp-2 flex-1">
            {request.title}
          </CardTitle>
          {declined ? (
            <XCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
          ) : (
            <StatusBadge status={request.status} />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {declined ? (
          <p className="text-xs text-muted-foreground">{t('requestDeclined')}</p>
        ) : (
          /* Progress dots */
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              {BOOKING_STAGES.map((_, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={cn(
                      'h-2.5 w-2.5 rounded-full flex-shrink-0 transition-colors',
                      i <= stageIndex
                        ? 'bg-primary'
                        : 'bg-muted-foreground/20'
                    )}
                  />
                  {i < BOOKING_STAGES.length - 1 && (
                    <div
                      className={cn(
                        'h-0.5 flex-1 mx-0.5 transition-colors',
                        i < stageIndex ? 'bg-primary' : 'bg-muted-foreground/20'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-primary font-medium">
              {stageLabels[stageIndex] ?? stageLabels[0]}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-2">
          {t('submitted')} {format(new Date(request.created_at), 'MMM d, yyyy')}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Project Card with status progress ───────────────── */

function ProjectCard({
  project,
  fromRequest,
}: {
  project: Project;
  fromRequest: boolean;
}) {
  const router = useRouter();
  const t = useTranslations('client.projects');

  const stageIndex = PROJECT_STAGES.indexOf(
    project.status as typeof PROJECT_STAGES[number]
  );
  const isDelivered = project.status === 'delivered' || project.status === 'archived';

  const stageLabelKeys = [
    'stageBriefing',
    'stagePreProduction',
    'stageFilming',
    'stageEditing',
    'stageReview',
    'stageRevisions',
    'stageDelivered',
  ] as const;

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow group"
      onClick={() => router.push(`/client/projects/${project.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold line-clamp-2">
              {project.title}
            </CardTitle>
            {fromRequest && (
              <span className="text-xs text-muted-foreground">{t('fromBooking')}</span>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status progress bar */}
        {!isDelivered ? (
          <div className="space-y-2">
            <div className="flex items-center gap-0.5">
              {PROJECT_STAGES.map((_, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full flex-shrink-0 transition-colors',
                      i < stageIndex
                        ? 'bg-primary/60'
                        : i === stageIndex
                        ? 'bg-primary ring-2 ring-primary/20'
                        : 'bg-muted-foreground/20'
                    )}
                  />
                  {i < PROJECT_STAGES.length - 1 && (
                    <div
                      className={cn(
                        'h-0.5 flex-1 transition-colors',
                        i < stageIndex ? 'bg-primary/60' : 'bg-muted-foreground/20'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-primary font-medium">
              {t(stageLabelKeys[stageIndex] ?? 'stageBriefing')}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {t('stageDelivered')}
            </span>
          </div>
        )}

        {project.project_type && (
          <div className="text-xs text-muted-foreground">
            {PROJECT_TYPE_LABELS[project.project_type as keyof typeof PROJECT_TYPE_LABELS] ||
              project.project_type}
          </div>
        )}

        {project.deadline && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {t('deadline')}: {format(new Date(project.deadline), 'MMM d, yyyy')}
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-2">
          {t('created')} {format(new Date(project.created_at), 'MMM d, yyyy')}
        </div>
      </CardContent>
    </Card>
  );
}
