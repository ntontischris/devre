'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  updateNotificationPreferences,
  getNotificationPreferences,
} from '@/lib/actions/notifications';

export function NotificationPreferences() {
  const t = useTranslations('client.settings');
  const tCommon = useTranslations('common');

  const NOTIFICATION_TYPES_LIST = [
    {
      id: 'project_updates',
      label: t('projectUpdates'),
      description: t('projectUpdatesDescription'),
    },
    {
      id: 'new_deliverables',
      label: t('newDeliverables'),
      description: t('newDeliverablesDescription'),
    },
    {
      id: 'invoice_reminders',
      label: t('invoiceReminders'),
      description: t('invoiceRemindersDescription'),
    },
    {
      id: 'messages',
      label: t('messages'),
      description: t('messagesDescription'),
    },
    {
      id: 'filming_reminders',
      label: t('filmingReminders'),
      description: t('filmingRemindersDescription'),
    },
  ];

  const [loading, setLoading] = useState(false);
  const [isLoadingPrefs, setIsLoadingPrefs] = useState(true);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    project_updates: true,
    new_deliverables: true,
    invoice_reminders: true,
    messages: true,
    filming_reminders: true,
  });

  useEffect(() => {
    const loadPreferences = async () => {
      const result = await getNotificationPreferences();
      if (!result.error && result.data) {
        setPreferences(result.data);
      }
      setIsLoadingPrefs(false);
    };
    loadPreferences();
  }, []);

  const handleToggle = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSave = async () => {
    setLoading(true);

    const result = await updateNotificationPreferences(preferences);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(t('notificationsSaved'));
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('notificationsTitle')}</CardTitle>
        <CardDescription>{t('notificationsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {NOTIFICATION_TYPES_LIST.map((type) => (
          <div key={type.id} className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <Label htmlFor={type.id} className="font-medium">
                {type.label}
              </Label>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </div>
            <Switch
              id={type.id}
              checked={preferences[type.id]}
              onCheckedChange={() => handleToggle(type.id)}
              disabled={loading || isLoadingPrefs}
            />
          </div>
        ))}

        <div className="pt-4">
          <Button onClick={handleSave} disabled={loading || isLoadingPrefs}>
            {loading ? tCommon('saving') : tCommon('save')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
