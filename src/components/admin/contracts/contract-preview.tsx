'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { sanitizeHtml } from '@/lib/sanitize';

interface ContractPreviewProps {
  title: string;
  content: string;
  status: string;
  createdAt: string;
  expiresAt?: string | null;
  signedAt?: string | null;
}

export function ContractPreview({
  title,
  content,
  status,
  createdAt,
  expiresAt,
  signedAt,
}: ContractPreviewProps) {
  return (
    <Card className="print:shadow-none">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>Created {format(new Date(createdAt), 'MMM d, yyyy')}</span>
              {expiresAt && (
                <span>Expires {format(new Date(expiresAt), 'MMM d, yyyy')}</span>
              )}
              {signedAt && (
                <span>Signed {format(new Date(signedAt), 'MMM d, yyyy')}</span>
              )}
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
      </CardContent>
    </Card>
  );
}
