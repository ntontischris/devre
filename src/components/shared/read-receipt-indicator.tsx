'use client';

import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadReceiptIndicatorProps {
  readAt: string | null;
  className?: string;
}

export function ReadReceiptIndicator({ readAt, className }: ReadReceiptIndicatorProps) {
  if (readAt) {
    return (
      <div className={cn('flex items-center gap-1 text-xs text-muted-foreground', className)}>
        <CheckCheck className="h-3 w-3" />
        <span>Read</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1 text-xs text-muted-foreground', className)}>
      <Check className="h-3 w-3" />
      <span>Sent</span>
    </div>
  );
}
