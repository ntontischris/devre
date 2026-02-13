'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Calendar } from 'lucide-react';
import type { BookingFormData } from './booking-wizard';

interface StepDatesProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}

export function StepDates({ formData, updateFormData }: StepDatesProps) {
  const addPreferredDate = () => {
    updateFormData({
      preferred_dates: [...formData.preferred_dates, { date: '', time_slot: '' }],
    });
  };

  const updatePreferredDate = (index: number, field: 'date' | 'time_slot', value: string) => {
    const newDates = [...formData.preferred_dates];
    newDates[index][field] = value;
    updateFormData({ preferred_dates: newDates });
  };

  const removePreferredDate = (index: number) => {
    const newDates = formData.preferred_dates.filter((_, i) => i !== index);
    updateFormData({ preferred_dates: newDates });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <Label>Preferred Filming Dates (Optional)</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Let us know when you'd like to schedule the filming. We'll confirm availability.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {formData.preferred_dates.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">
              No dates added yet. Add your preferred dates below.
            </div>
          )}

          {formData.preferred_dates.map((dateInfo, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1 grid gap-2 md:grid-cols-2">
                <Input
                  type="date"
                  value={dateInfo.date}
                  onChange={(e) => updatePreferredDate(index, 'date', e.target.value)}
                  placeholder="Select date"
                />
                <Input
                  type="text"
                  value={dateInfo.time_slot}
                  onChange={(e) => updatePreferredDate(index, 'time_slot', e.target.value)}
                  placeholder="e.g., Morning, 2-5 PM"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removePreferredDate(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addPreferredDate}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Preferred Date
          </Button>
        </div>
      </div>
    </div>
  );
}
