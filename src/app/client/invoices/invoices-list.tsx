'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { format } from 'date-fns';
import { Receipt, CreditCard, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { InvoiceWithRelations } from '@/types';

interface InvoicesListProps {
  invoices: InvoiceWithRelations[];
}

export function InvoicesList({ invoices }: InvoicesListProps) {
  const router = useRouter();

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={Receipt}
            title="No invoices yet"
            description="Your invoices will appear here once created"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <Card
          key={invoice.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(`/client/invoices/${invoice.id}`)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-sm">
                    {invoice.invoice_number}
                  </span>
                  <StatusBadge status={invoice.status} />
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {invoice.project?.title || 'N/A'}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Due {format(new Date(invoice.due_date), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="font-bold text-lg">
                    &euro;{invoice.total?.toFixed(2) || '0.00'}
                  </div>
                </div>
                {invoice.status !== 'paid' && invoice.status !== 'cancelled' ? (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/client/invoices/${invoice.id}`);
                    }}
                    className="gap-1"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span className="hidden sm:inline">Pay</span>
                  </Button>
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
