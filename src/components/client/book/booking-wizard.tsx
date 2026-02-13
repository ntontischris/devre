'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { StepProjectType } from './step-project-type';
import { StepDetails } from './step-details';
import { StepDates } from './step-dates';
import { StepLocation } from './step-location';
import { StepReview } from './step-review';
import { createFilmingRequest } from '@/lib/actions/filming-requests';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { ProjectType } from '@/lib/constants';

const STEPS = [
  { id: 1, name: 'Project Type', component: StepProjectType },
  { id: 2, name: 'Details', component: StepDetails },
  { id: 3, name: 'Dates', component: StepDates },
  { id: 4, name: 'Location & Budget', component: StepLocation },
  { id: 5, name: 'Review', component: StepReview },
];

export interface BookingFormData {
  project_type?: ProjectType;
  title: string;
  description: string;
  reference_links: string[];
  preferred_dates: Array<{ date: string; time_slot: string }>;
  location: string;
  budget_range: string;
}

export function BookingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    title: '',
    description: '',
    reference_links: [],
    preferred_dates: [],
    location: '',
    budget_range: '',
  });

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return !!formData.project_type;
      case 2:
        return formData.title.trim().length > 0;
      case 3:
        return true; // Optional
      case 4:
        return true; // Optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const result = await createFilmingRequest({
      project_type: formData.project_type,
      title: formData.title,
      description: formData.description || undefined,
      reference_links: formData.reference_links.length > 0 ? formData.reference_links : undefined,
      preferred_dates: formData.preferred_dates.length > 0 ? formData.preferred_dates : undefined,
      location: formData.location || undefined,
      budget_range: formData.budget_range || undefined,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Filming request submitted successfully!');
      router.push('/client/dashboard');
    }

    setLoading(false);
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors',
                  currentStep > step.id
                    ? 'bg-primary border-primary text-primary-foreground'
                    : currentStep === step.id
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div
                className={cn(
                  'text-xs mt-2 text-center',
                  currentStep >= step.id
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {step.name}
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 flex-1 mx-2 transition-colors',
                  currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent formData={formData} updateFormData={updateFormData} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < STEPS.length ? (
            <Button onClick={handleNext} disabled={!canGoNext()}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading || !canGoNext()}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
