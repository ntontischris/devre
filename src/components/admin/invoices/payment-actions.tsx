'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateInvoiceStatus } from '@/lib/actions/invoices';
import { toast } from 'sonner';
import { CreditCard, CheckCircle2, Send } from 'lucide-react';

interface PaymentActionsProps {
  invoice: any;
  onStatusChange: () => void;
}

export function PaymentActions({ invoice, onStatusChange }: PaymentActionsProps) {
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<string>('bank_transfer');
  const [paymentDate, setPaymentDate] = React.useState<string>(new Date().toISOString().split('T')[0]);

  const handleSendPaymentLink = () => {
    toast.info('Stripe integration coming soon');
  };

  const handleMarkAsPaid = async () => {
    setIsUpdating(true);
    const result = await updateInvoiceStatus(invoice.id, 'paid');
    setIsUpdating(false);

    if (result.error) {
      toast.error('Failed to update invoice status', { description: result.error });
    } else {
      toast.success('Invoice marked as paid');
      setPaymentDialogOpen(false);
      onStatusChange();
    }
  };

  const handleRecordPayment = async () => {
    setIsUpdating(true);
    const result = await updateInvoiceStatus(invoice.id, 'paid');
    setIsUpdating(false);

    if (result.error) {
      toast.error('Failed to record payment', { description: result.error });
    } else {
      toast.success(`Payment recorded successfully via ${paymentMethod}`);
      setPaymentDialogOpen(false);
      onStatusChange();
    }
  };

  if (invoice.status === 'paid') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <span>Payment received</span>
      </div>
    );
  }

  return (
    <>
      {(invoice.status === 'sent' || invoice.status === 'viewed') && (
        <>
          <Button variant="outline" onClick={handleSendPaymentLink}>
            <Send className="mr-2 h-4 w-4" />
            Send Payment Link
          </Button>
          <Button onClick={() => setPaymentDialogOpen(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Record Manual Payment
          </Button>
        </>
      )}

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Manual Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-date">Payment Date</Label>
              <Input
                id="payment-date"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} disabled={isUpdating}>
              {isUpdating ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
