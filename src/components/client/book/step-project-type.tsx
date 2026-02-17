'use client';

import { PROJECT_TYPES, PROJECT_TYPE_LABELS, type ProjectType } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Video, Camera, Share2, TrendingUp, Film, Music, Mic, MoreHorizontal, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookingFormData } from './booking-wizard';

interface StepProjectTypeProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}

const PROJECT_TYPE_ICONS: Record<ProjectType, LucideIcon> = {
  corporate_video: Video,
  event_coverage: Camera,
  social_media_content: Share2,
  commercial: TrendingUp,
  documentary: Film,
  music_video: Music,
  podcast: Mic,
  other: MoreHorizontal,
};

const PROJECT_TYPE_DESCRIPTIONS: Record<ProjectType, string> = {
  corporate_video: 'Εταιρικά profiles, testimonials, ετήσια video',
  event_coverage: 'Content on the spot — εγκαίνια, συνέδρια, events',
  social_media_content: 'Short-form content για social media',
  commercial: 'Διαφημιστικά και promotional video',
  documentary: 'Ντοκιμαντέρ και long-form storytelling',
  music_video: 'Music videos και performance recordings',
  podcast: 'Επαγγελματική παραγωγή podcast',
  other: 'Custom request — θα σας στείλουμε προσφορά',
};

export function StepProjectType({ formData, updateFormData }: StepProjectTypeProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {PROJECT_TYPES.map((type) => {
        const Icon = PROJECT_TYPE_ICONS[type];
        const isSelected = formData.project_type === type;

        return (
          <Card
            key={type}
            className={cn(
              'p-4 cursor-pointer transition-all hover:shadow-md',
              isSelected
                ? 'border-primary bg-primary/5 ring-2 ring-primary'
                : 'border-border hover:border-primary/50'
            )}
            onClick={() => updateFormData({ project_type: type, selected_package: undefined })}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'p-2 rounded-lg',
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">
                  {PROJECT_TYPE_LABELS[type]}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {PROJECT_TYPE_DESCRIPTIONS[type]}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
