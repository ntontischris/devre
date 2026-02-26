'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { format } from 'date-fns';
import { ArrowLeft, Download, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { toast } from 'sonner';
import type { InvoiceWithRelations } from '@/types';

interface InvoiceDetailProps {
  invoice: InvoiceWithRelations;
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const router = useRouter();
  const t = useTranslations('invoices');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    // Placeholder for Stripe integration
    // In production, this would redirect to Stripe Checkout
    toast.info(t('paymentComingSoon'));

    // Simulated redirect to success page after delay
    setTimeout(() => {
      router.push(`/client/invoices/${invoice.id}/success`);
    }, 2000);
  };

  const handleDownloadPDF = () => {
    window.open(`/api/invoices/${invoice.id}/pdf`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Invoice {invoice.invoice_number}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={invoice.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="gap-2"
            >
              <CreditCard className="h-4 w-4" />
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-sm mb-2">Bill To</h3>
              <div className="text-sm text-muted-foreground">
                {invoice.client?.company_name && (
                  <div className="font-medium">{invoice.client.company_name}</div>
                )}
                <div>{invoice.client?.contact_name}</div>
                <div>{invoice.client?.email}</div>
                {invoice.client?.phone && <div>{invoice.client.phone}</div>}
                {invoice.client?.address && <div>{invoice.client.address}</div>}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm mb-2">Invoice Information</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoice Number:</span>
                  <span className="font-medium">{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span>{format(new Date(invoice.issue_date), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{format(new Date(invoice.due_date), 'MMM d, yyyy')}</span>
                </div>
                {invoice.project && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project:</span>
                    <span>{invoice.project.title}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Line Items */}
          <div>
            <h3 className="font-medium text-sm mb-3">Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.line_items?.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{item.description}</div>
                      {item.details && (
                        <div className="text-xs text-muted-foreground">
                          {item.details}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      €{item.unit_price?.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      €{(item.quantity * item.unit_price)?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>€{invoice.subtotal?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Tax ({invoice.tax_rate || 24}%):
                </span>
                <span>€{invoice.tax_amount?.toFixed(2) || '0.00'}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>€{invoice.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-sm mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {invoice.notes}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
