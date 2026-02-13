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
import type { BookingFormData } from './booking-wizard';

interface StepLocationProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}

const BUDGET_RANGES = [
  { value: 'under_1000', label: 'Under €1,000' },
  { value: '1000_2500', label: '€1,000 - €2,500' },
  { value: '2500_5000', label: '€2,500 - €5,000' },
  { value: '5000_10000', label: '€5,000 - €10,000' },
  { value: '10000_plus', label: '€10,000+' },
  { value: 'flexible', label: 'Flexible / To Be Discussed' },
];

export function StepLocation({ formData, updateFormData }: StepLocationProps) {
  return (
    <div className="space-y-6">
      {/* Location */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="location">Filming Location (Optional)</Label>
        </div>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => updateFormData({ location: e.target.value })}
          placeholder="e.g., Athens, Greece or Our Office at 123 Main St"
        />
        <p className="text-xs text-muted-foreground">
          Where will the filming take place?
        </p>
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="budget">Budget Range (Optional)</Label>
        </div>
        <Select
          value={formData.budget_range}
          onValueChange={(value) => updateFormData({ budget_range: value })}
        >
          <SelectTrigger id="budget">
            <SelectValue placeholder="Select your budget range" />
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
          This helps us tailor our proposal to your needs
        </p>
      </div>
    </div>
  );
}
