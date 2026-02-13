'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import type { BookingFormData } from './booking-wizard';

interface StepDetailsProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
}

export function StepDetails({ formData, updateFormData }: StepDetailsProps) {
  const addReferenceLink = () => {
    updateFormData({
      reference_links: [...formData.reference_links, ''],
    });
  };

  const updateReferenceLink = (index: number, value: string) => {
    const newLinks = [...formData.reference_links];
    newLinks[index] = value;
    updateFormData({ reference_links: newLinks });
  };

  const removeReferenceLink = (index: number) => {
    const newLinks = formData.reference_links.filter((_, i) => i !== index);
    updateFormData({ reference_links: newLinks });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          Project Title *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          placeholder="e.g., Company Overview Video 2024"
          required
        />
        <p className="text-xs text-muted-foreground">
          A brief, descriptive title for your project
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Project Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          placeholder="Describe what you're looking to create, your goals, target audience, and any specific requirements..."
          rows={6}
        />
        <p className="text-xs text-muted-foreground">
          The more details you provide, the better we can understand your vision
        </p>
      </div>

      {/* Reference Links */}
      <div className="space-y-2">
        <Label>Reference Links (Optional)</Label>
        <p className="text-xs text-muted-foreground">
          Share links to videos or content that inspire your project
        </p>

        <div className="space-y-2">
          {formData.reference_links.map((link, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={link}
                onChange={(e) => updateReferenceLink(index, e.target.value)}
                placeholder="https://example.com/video"
                type="url"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeReferenceLink(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addReferenceLink}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Reference Link
          </Button>
        </div>
      </div>
    </div>
  );
}
