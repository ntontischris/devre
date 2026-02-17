'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function LandingContactForm() {
  const t = useTranslations('landing.contact');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    };

    try {
      // Submit as a filming request via the existing system
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error } = await supabase.from('filming_requests').insert({
        contact_name: data.name,
        contact_email: data.email,
        contact_phone: data.phone || null,
        title: data.subject || 'Website Contact Form',
        description: data.message,
        status: 'pending',
      });

      if (error) throw error;
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <p className="text-lg font-medium text-white">{t('success')}</p>
        <Button
          variant="ghost"
          className="mt-6 text-zinc-400 hover:text-white"
          onClick={() => setStatus('idle')}
        >
          {t('sendAnother')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name" className="text-sm font-medium text-zinc-300">
            {t('nameLabel')}
          </Label>
          <Input
            id="contact-name"
            name="name"
            required
            placeholder={t('namePlaceholder')}
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-amber-500/50 focus:ring-amber-500/20 h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email" className="text-sm font-medium text-zinc-300">
            {t('emailLabel')}
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder={t('emailPlaceholder')}
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-amber-500/50 focus:ring-amber-500/20 h-11"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-phone" className="text-sm font-medium text-zinc-300">
            {t('phoneLabel')}
          </Label>
          <Input
            id="contact-phone"
            name="phone"
            placeholder={t('phonePlaceholder')}
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-amber-500/50 focus:ring-amber-500/20 h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-subject" className="text-sm font-medium text-zinc-300">
            {t('subjectLabel')}
          </Label>
          <Input
            id="contact-subject"
            name="subject"
            placeholder={t('subjectPlaceholder')}
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-amber-500/50 focus:ring-amber-500/20 h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message" className="text-sm font-medium text-zinc-300">
          {t('messageLabel')}
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder={t('messagePlaceholder')}
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-amber-500/50 focus:ring-amber-500/20 resize-none"
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          {t('error')}
        </div>
      )}

      <Button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-amber-500 text-zinc-950 hover:bg-amber-400 font-semibold h-12 text-base shadow-lg shadow-amber-500/20 disabled:opacity-50"
      >
        {status === 'sending' ? (
          t('sending')
        ) : (
          <>
            {t('send')}
            <Send className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
