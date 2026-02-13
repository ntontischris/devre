'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const NOTIFICATION_TYPES = [
  {
    id: 'project_updates',
    label: 'Project Updates',
    description: 'Get notified about changes to your projects',
  },
  {
    id: 'new_deliverables',
    label: 'New Deliverables',
    description: 'Receive alerts when new deliverables are uploaded',
  },
  {
    id: 'invoice_reminders',
    label: 'Invoice Reminders',
    description: 'Get reminders about pending invoice payments',
  },
  {
    id: 'messages',
    label: 'Messages',
    description: 'Receive notifications for new messages',
  },
  {
    id: 'filming_reminders',
    label: 'Filming Reminders',
    description: 'Get reminded about upcoming filming dates',
  },
];

export function NotificationPreferences() {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    project_updates: true,
    new_deliverables: true,
    invoice_reminders: true,
    messages: true,
    filming_reminders: true,
  });

  const handleToggle = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSave = async () => {
    setLoading(true);

    // Placeholder - in production, save to database
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('Notification preferences updated');
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose what notifications you want to receive via email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {NOTIFICATION_TYPES.map((type) => (
          <div key={type.id} className="flex items-center justify-between space-x-4">
            <div className="flex-1">
              <Label htmlFor={type.id} className="font-medium">
                {type.label}
              </Label>
              <p className="text-sm text-muted-foreground">
                {type.description}
              </p>
            </div>
            <Switch
              id={type.id}
              checked={preferences[type.id]}
              onCheckedChange={() => handleToggle(type.id)}
              disabled={loading}
            />
          </div>
        ))}

        <div className="pt-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
