'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  Film,
  Mic,
  Zap,
  Clapperboard,
  Camera,
  FileText,
  Music,
  MoreHorizontal,
  Plus,
  X,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

import { publicBookingSchema, type PublicBookingInput } from '@/lib/schemas/filming-request';
import { createPublicFilmingRequest } from '@/lib/actions/filming-requests';
import {
  PROJECT_TYPES,
  getServiceCategory,
  type ProjectType,
} from '@/lib/constants';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type PublicBookingFormData = PublicBookingInput;

const PROJECT_TYPE_ICONS: Record<ProjectType, React.ComponentType<{ className?: string }>> = {
  social_media_content: Film,
  podcast: Mic,
  event_coverage: Zap,
  corporate_video: Clapperboard,
  commercial: Camera,
  documentary: FileText,
  music_video: Music,
  other: MoreHorizontal,
};

export function PublicBookingForm() {
  const t = useTranslations('publicBooking');
  const statusT = useTranslations('statuses');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<PublicBookingFormData>({
    resolver: zodResolver(publicBookingSchema),
    defaultValues: {
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      contact_company: '',
      title: '',
      description: '',
      project_type: undefined,
      selected_package: '',
      budget_range: '',
      location: '',
      preferred_dates: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'preferred_dates',
  });

  const selectedProjectType = watch('project_type');
  const serviceCategory = selectedProjectType
    ? getServiceCategory(selectedProjectType)
    : undefined;

  const onSubmit = async (data: PublicBookingFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createPublicFilmingRequest(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        setIsSuccess(true);
      }
    } catch (error) {
      toast.error(t('submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <CheckCircle2 className="h-16 w-16 text-amber-500 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">{t('successTitle')}</h2>
        <p className="text-zinc-400 mb-8 max-w-md">{t('successDescription')}</p>
        <Button asChild className="bg-amber-500 hover:bg-amber-400 text-zinc-950">
          <Link href="/">{t('backToHome')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Contact Info Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {t('contactInfoSection')}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact_name" className="text-zinc-300">
              {t('nameLabel')} <span className="text-red-400">*</span>
            </Label>
            <Input
              id="contact_name"
              {...register('contact_name')}
              placeholder={t('namePlaceholder')}
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
            />
            {errors.contact_name && (
              <p className="text-sm text-red-400">{errors.contact_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email" className="text-zinc-300">
              {t('emailLabel')} <span className="text-red-400">*</span>
            </Label>
            <Input
              id="contact_email"
              type="email"
              {...register('contact_email')}
              placeholder={t('emailPlaceholder')}
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
            />
            {errors.contact_email && (
              <p className="text-sm text-red-400">{errors.contact_email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone" className="text-zinc-300">
              {t('phoneLabel')}
            </Label>
            <Input
              id="contact_phone"
              {...register('contact_phone')}
              placeholder={t('phonePlaceholder')}
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_company" className="text-zinc-300">
              {t('companyLabel')}
            </Label>
            <Input
              id="contact_company"
              {...register('contact_company')}
              placeholder={t('companyPlaceholder')}
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>
        </div>
      </section>

      {/* Project Type Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {t('projectTypeSection')}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PROJECT_TYPES.map((type) => {
            const Icon = PROJECT_TYPE_ICONS[type];
            const isSelected = selectedProjectType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setValue('project_type', type);
                  setValue('selected_package', '');
                }}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all
                  ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                      : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600'
                  }
                `}
              >
                <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-amber-500' : 'text-zinc-400'}`} />
                <span className={`text-sm font-medium text-center ${isSelected ? 'text-amber-500' : 'text-zinc-300'}`}>
                  {statusT(`projectType.${type}`)}
                </span>
              </button>
            );
          })}
        </div>
        {errors.project_type && (
          <p className="text-sm text-red-400">{errors.project_type.message}</p>
        )}
      </section>

      {/* Package Selection (conditional) */}
      {serviceCategory && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {t('packageSection')}
          </h2>

          {serviceCategory.packages.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {serviceCategory.packages.map((pkg) => {
                const isSelected = watch('selected_package') === pkg.id;

                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setValue('selected_package', pkg.id)}
                    className={`
                      p-4 rounded-lg border-2 text-left transition-all
                      ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                          : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600'
                      }
                    `}
                  >
                    <h3 className={`font-semibold mb-2 ${isSelected ? 'text-amber-500' : 'text-white'}`}>
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-1">{pkg.deliverables}</p>
                    <p className="text-sm text-zinc-500 mb-2">{pkg.includes}</p>
                    <p className={`text-lg font-bold ${isSelected ? 'text-amber-500' : 'text-white'}`}>
                      €{pkg.price.toLocaleString()}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700 text-center">
              <p className="text-zinc-400">{t('noPackages')}</p>
            </div>
          )}
        </section>
      )}

      {/* Project Details Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {t('detailsSection')}
        </h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-300">
              {t('titleLabel')} <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder={t('titlePlaceholder')}
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
            />
            {errors.title && (
              <p className="text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-300">
              {t('descriptionLabel')}
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder={t('descriptionPlaceholder')}
              rows={4}
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>
        </div>
      </section>

      {/* Preferred Dates Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">
            {t('datesSection')}
          </h2>
          <p className="text-sm text-zinc-400">{t('datesHelp')}</p>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="date"
                  {...register(`preferred_dates.${index}.date`)}
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
              <div className="flex-1">
                <Input
                  {...register(`preferred_dates.${index}.time_slot`)}
                  placeholder={t('timeSlotPlaceholder')}
                  className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ date: '', time_slot: '' })}
            className="w-full border-zinc-700 bg-zinc-800/30 text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('addDate')}
          </Button>
        </div>
      </section>

      {/* Location & Budget Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {t('locationBudgetSection')}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-zinc-300">
              {t('locationLabel')}
            </Label>
            <Input
              id="location"
              {...register('location')}
              placeholder={t('locationPlaceholder')}
              className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget_range" className="text-zinc-300">
              {t('budgetLabel')}
            </Label>
            <Select
              value={watch('budget_range') || undefined}
              onValueChange={(value) => setValue('budget_range', value)}
            >
              <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
                <SelectValue placeholder={t('selectBudget')} />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="under_1000" className="text-white hover:bg-zinc-700 focus:bg-zinc-700">{t('budgetUnder1000')}</SelectItem>
                <SelectItem value="1000_2500" className="text-white hover:bg-zinc-700 focus:bg-zinc-700">{t('budget1000_2500')}</SelectItem>
                <SelectItem value="2500_5000" className="text-white hover:bg-zinc-700 focus:bg-zinc-700">{t('budget2500_5000')}</SelectItem>
                <SelectItem value="5000_10000" className="text-white hover:bg-zinc-700 focus:bg-zinc-700">{t('budget5000_10000')}</SelectItem>
                <SelectItem value="10000_plus" className="text-white hover:bg-zinc-700 focus:bg-zinc-700">{t('budget10000Plus')}</SelectItem>
                <SelectItem value="flexible" className="text-white hover:bg-zinc-700 focus:bg-zinc-700">{t('budgetFlexible')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold py-6 text-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            t('submitRequest')
          )}
        </Button>
      </div>
    </form>
  );
}
