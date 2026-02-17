'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PROJECT_TYPE_LABELS, SERVICE_CATEGORIES } from '@/lib/constants';
import { Check, Video, FileText, Calendar, MapPin, DollarSign, Package } from 'lucide-react';
import { format } from 'date-fns';
import type { BookingFormData } from './booking-wizard';
import { Separator } from '@/components/ui/separator';

interface StepReviewProps {
  formData: BookingFormData;
}

function getSelectedPackageInfo(formData: BookingFormData) {
  if (!formData.selected_package || !formData.project_type) return null;
  const category = SERVICE_CATEGORIES.find(
    (c) => c.projectType === formData.project_type
  );
  if (!category) return null;
  const pkg = category.packages.find((p) => p.id === formData.selected_package);
  if (!pkg) return null;
  return { category, pkg };
}

export function StepReview({ formData }: StepReviewProps) {
  const packageInfo = getSelectedPackageInfo(formData);

  const BUDGET_RANGE_LABELS: Record<string, string> = {
    under_1000: 'Under €1,000',
    '1000_2500': '€1,000 - €2,500',
    '2500_5000': '€2,500 - €5,000',
    '5000_10000': '€5,000 - €10,000',
    '10000_plus': '€10,000+',
    flexible: 'Flexible / To Be Discussed',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <Check className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium">Review Your Request</h3>
          <p className="text-sm text-muted-foreground">
            Please review your filming request before submitting
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Video className="h-4 w-4" />
            Project Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Project Type</div>
            <div className="text-base">
              {formData.project_type
                ? PROJECT_TYPE_LABELS[formData.project_type]
                : 'Not specified'}
            </div>
          </div>

          <Separator />

          <div>
            <div className="text-sm font-medium text-muted-foreground">Title</div>
            <div className="text-base">{formData.title || 'Not specified'}</div>
          </div>

          {formData.description && (
            <>
              <Separator />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Description</div>
                <div className="text-sm whitespace-pre-wrap">{formData.description}</div>
              </div>
            </>
          )}

          {formData.reference_links.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Reference Links
                </div>
                <div className="space-y-1">
                  {formData.reference_links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline block"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Selected Package */}
      {packageInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              Επιλεγμένο Πακέτο
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {packageInfo.category.label} — {packageInfo.pkg.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {packageInfo.pkg.deliverables}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {packageInfo.pkg.price.toLocaleString('el-GR')}&euro;
                  <span className="text-xs font-normal text-muted-foreground">
                    /μήνα
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {packageInfo.pkg.includes}
            </div>
            <div className="text-xs text-muted-foreground">
              Παράδοση: {packageInfo.pkg.deliveryTime}
              {packageInfo.pkg.contractDuration &&
                ` | ${packageInfo.pkg.contractDuration}`}
            </div>
          </CardContent>
        </Card>
      )}

      {formData.preferred_dates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Preferred Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {formData.preferred_dates.map((dateInfo, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {dateInfo.date
                      ? format(new Date(dateInfo.date), 'MMMM d, yyyy')
                      : 'Date not specified'}
                    {dateInfo.time_slot && ` - ${dateInfo.time_slot}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Additional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Location</div>
                <div className="text-sm">{formData.location}</div>
              </div>
            </div>
          )}

          {formData.budget_range && (
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Budget Range</div>
                <div className="text-sm">
                  {BUDGET_RANGE_LABELS[formData.budget_range] || formData.budget_range}
                </div>
              </div>
            </div>
          )}

          {!formData.location && !formData.budget_range && (
            <div className="text-sm text-muted-foreground">
              No additional details provided
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
