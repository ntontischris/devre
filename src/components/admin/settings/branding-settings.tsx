'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateCompanySettings, getCompanySettings } from '@/lib/actions/settings';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { CompanySettings } from '@/lib/actions/settings';

type BrandingSettingsProps = {
  settings: CompanySettings;
};

export function BrandingSettings({ settings }: BrandingSettingsProps) {
  const router = useRouter();
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color || '#000000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await updateCompanySettings({
      ...settings,
      primary_color: primaryColor,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Branding settings updated');
      router.refresh();
    }

    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
        <CardDescription>
          Customize the appearance of your client portal and documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Primary Color</Label>
            <div className="flex gap-3 items-center">
              <Input
                id="primary_color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              This color will be used for buttons, links, and accents
            </p>
          </div>

          <div className="space-y-2">
            <Label>Logo Upload</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Logo upload functionality will be available soon
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                For now, use the Logo URL field in Company Profile
              </p>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
