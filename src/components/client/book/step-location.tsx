'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { BookingFormData } from './booking-wizard';

interface StepLocationProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}

export function StepLocation({ formData, updateFormData }: StepLocationProps) {
  const t = useTranslations('booking');

  const BUDGET_RANGES = [
    { value: 'under_1000', label: t('budgetUnder1000') },
    { value: '1000_2500', label: t('budget1000_2500') },
    { value: '2500_5000', label: t('budget2500_5000') },
    { value: '5000_10000', label: t('budget5000_10000') },
    { value: '10000_plus', label: t('budget10000Plus') },
    { value: 'flexible', label: t('budgetFlexible') },
  ];

  return (
    <div className="space-y-6">
      {/* Location */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="location">{t('filmingLocationLabel')}</Label>
        </div>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => updateFormData({ location: e.target.value })}
          placeholder={t('filmingLocationPlaceholder')}
        />
        <p className="text-xs text-muted-foreground">
          {t('whereWillFilming')}
        </p>
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="budget">{t('budgetRangeLabel')}</Label>
        </div>
        <Select
          value={formData.budget_range}
          onValueChange={(value) => updateFormData({ budget_range: value })}
        >
          <SelectTrigger id="budget">
            <SelectValue placeholder={t('selectBudgetRange')} />
          </SelectTrigger>
          <SelectContent>
            {BUDGET_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t('locationHelperText')}
        </p>
      </div>
    </div>
  );
}
