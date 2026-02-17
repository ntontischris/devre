'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { updateNotificationSettings } from '@/lib/actions/settings';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import type { NotificationSettings } from '@/lib/actions/settings';

type NotificationSettingsProps = {
  userId: string;
  settings: NotificationSettings;
};

export function NotificationSettingsComponent({ userId, settings }: NotificationSettingsProps) {
  const router = useRouter();
  const tToast = useTranslations('toast');
  const t = useTranslations('settings');
  const tc = useTranslations('common');
  const [formData, setFormData] = useState<NotificationSettings>(settings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await updateNotificationSettings(userId, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(tToast('saveSuccess'));
      router.refresh();
    }

    setIsSubmitting(false);
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('emailNotifications')}</CardTitle>
        <CardDescription>
          {t('emailNotificationsDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email_new_project">{t('newProjectCreated')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('newProjectDescription')}
                </p>
              </div>
              <Switch
                id="email_new_project"
                checked={formData.email_new_project}
                onCheckedChange={(checked) => updateSetting('email_new_project', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email_project_deadline">{t('projectDeadlines')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('projectDeadlinesDescription')}
                </p>
              </div>
              <Switch
                id="email_project_deadline"
                checked={formData.email_project_deadline}
                onCheckedChange={(checked) => updateSetting('email_project_deadline', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email_invoice_paid">{t('invoicePaid')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('invoicePaidDescription')}
                </p>
              </div>
              <Switch
                id="email_invoice_paid"
                checked={formData.email_invoice_paid}
                onCheckedChange={(checked) => updateSetting('email_invoice_paid', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email_new_message">{t('newMessages')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('newMessagesDescription')}
                </p>
              </div>
              <Switch
                id="email_new_message"
                checked={formData.email_new_message}
                onCheckedChange={(checked) => updateSetting('email_new_message', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email_deliverable_feedback">{t('deliverableFeedback')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('deliverableFeedbackDescription')}
                </p>
              </div>
              <Switch
                id="email_deliverable_feedback"
                checked={formData.email_deliverable_feedback}
                onCheckedChange={(checked) =>
                  updateSetting('email_deliverable_feedback', checked)
                }
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? tc('saving') : t('saveChanges')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
