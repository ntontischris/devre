'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize';

interface ContractViewProps {
  contract: any;
  showSignature?: boolean;
}

export function ContractView({ contract, showSignature = false }: ContractViewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{contract.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={contract.status} />
                  <span className="text-sm text-muted-foreground">
                    Created {format(new Date(contract.created_at), 'MMMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {contract.expires_at && (
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Expires {format(new Date(contract.expires_at), 'MMMM d, yyyy')}
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-6">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(contract.content) }}
          />
        </CardContent>
      </Card>

      {showSignature && contract.status === 'signed' && contract.signature_image && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Signature</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="border rounded-lg p-4 bg-muted/10 inline-block">
                <img
                  src={contract.signature_image}
                  alt="Contract signature"
                  className="h-24"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Signed on {format(new Date(contract.signed_at), 'MMMM d, yyyy \'at\' h:mm a')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
