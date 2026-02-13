'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Receipt, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { INVOICE_STATUS_LABELS } from '@/lib/constants';
import { format } from 'date-fns';

interface PendingActionsProps {
  invoices: any[];
  projects: any[];
}

export function PendingActions({ invoices, projects }: PendingActionsProps) {
  const router = useRouter();

  // Get unsigned contracts count (placeholder - would need contracts query)
  const unsignedContracts: any[] = [];

  const pendingItems = [
    ...invoices.map(invoice => ({
      type: 'invoice',
      id: invoice.id,
      title: `Invoice ${invoice.invoice_number}`,
      description: `${INVOICE_STATUS_LABELS[invoice.status as keyof typeof INVOICE_STATUS_LABELS]} - €${invoice.total?.toFixed(2) || '0.00'}`,
      action: 'Pay Now',
      icon: Receipt,
      onClick: () => router.push(`/client/invoices/${invoice.id}`),
    })),
    ...unsignedContracts.map(contract => ({
      type: 'contract',
      id: contract.id,
      title: contract.title,
      description: 'Signature required',
      action: 'Sign Contract',
      icon: FileText,
      onClick: () => router.push(`/client/contracts/${contract.id}/sign`),
    })),
  ];

  if (pendingItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No pending actions at the moment. You're all caught up!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <AlertCircle className="h-5 w-5 text-orange-500" />
        <CardTitle>Pending Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={item.onClick}
                >
                  {item.action}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
