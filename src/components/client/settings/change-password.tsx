'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

/**
 * Read the access token from the Supabase auth cookie.
 * Bypasses the Supabase JS client which uses navigator.locks
 * and throws AbortError in certain conditions.
 */
function getAccessToken(): string | null {
  try {
    const cookies = document.cookie.split('; ');
    const single = cookies.find((c) => c.includes('auth-token=') && !c.match(/auth-token\.\d+=/));

    let raw: string;
    if (single) {
      raw = single.split('=').slice(1).join('=');
    } else {
      const chunks: string[] = [];
      for (let i = 0; ; i++) {
        const chunk = cookies.find((c) => c.match(new RegExp(`auth-token\\.${i}=`)));
        if (!chunk) break;
        chunks.push(chunk.split('=').slice(1).join('='));
      }
      if (chunks.length === 0) return null;
      raw = chunks.join('');
    }

    const json = raw.startsWith('base64-') ? atob(raw.slice(7)) : raw;
    const session = JSON.parse(json);
    return session.access_token ?? null;
  } catch {
    return null;
  }
}

export function ChangePassword() {
  const t = useTranslations('client.settings');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error(t('passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        toast.error(t('sessionExpired'));
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ password: formData.newPassword }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        toast.error(body?.message ?? body?.msg ?? t('passwordChangeError'));
        return;
      }

      toast.success(t('passwordChangeSuccess'));
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch {
      toast.error(t('passwordChangeError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('changePasswordTitle')}</CardTitle>
        <CardDescription>{t('changePasswordDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-password">{t('currentPassword')}</Label>
            <Input
              id="current-password"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              required
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password">{t('newPassword')}</Label>
            <Input
              id="new-password"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">{t('passwordRequirements')}</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t('confirmNewPassword')}</Label>
            <Input
              id="confirm-password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? t('changingPassword') : t('changePasswordButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
