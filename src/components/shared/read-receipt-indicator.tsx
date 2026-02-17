'use client';

import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ReadReceiptIndicatorProps {
  readAt: string | null;
  className?: string;
}

export function ReadReceiptIndicator({ readAt, className }: ReadReceiptIndicatorProps) {
  const t = useTranslations('messages');
  if (readAt) {
    return (
      <div className={cn('flex items-center gap-1 text-xs text-muted-foreground', className)}>
        <CheckCheck className="h-3 w-3" />
        <span>{t('readReceipt')}</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1 text-xs text-muted-foreground', className)}>
      <Check className="h-3 w-3" />
      <span>{t('sent')}</span>
    </div>
  );
}
