'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { PaymentActions } from '@/components/admin/invoices/payment-actions';
import { deleteInvoice, updateInvoiceStatus } from '@/lib/actions/invoices';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Pencil, Trash2, Download } from 'lucide-react';

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  issue_date: string;
  due_date: string;
  line_items: LineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  currency: string;
  client: { id: string; contact_name: string; company_name?: string; email: string };
  project?: { id: string; title: string };
}

interface InvoiceDetailProps {
  invoice: Invoice;
}

const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('el-GR', { style: 'currency', currency }).format(amount);
};

export function InvoiceDetail({ invoice: initialInvoice }: InvoiceDetailProps) {
  const router = useRouter();
  const [invoice, setInvoice] = React.useState(initialInvoice);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteInvoice(invoice.id);
    setIsDeleting(false);

    if (result.error) {
      toast.error('Failed to delete invoice', { description: result.error });
    } else {
      toast.success('Invoice deleted successfully');
      router.push('/admin/invoices');
    }
  };

  const handleSendInvoice = async () => {
    if (invoice.status !== 'draft') return;

    setIsUpdatingStatus(true);
    const result = await updateInvoiceStatus(invoice.id, 'sent');
    setIsUpdatingStatus(false);

    if (result.error) {
      toast.error('Failed to send invoice', { description: result.error });
    } else {
      toast.success('Invoice marked as sent');
      setInvoice({ ...invoice, status: 'sent' });
      router.refresh();
    }
  };

  const handleDownloadPDF = () => {
    toast.info('PDF generation coming soon');
  };

  const handleStatusChange = () => {
    router.refresh();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{invoice.invoice_number}</h1>
            <p className="text-muted-foreground mt-2">
              Invoice details and payment information
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Link href={`/admin/invoices/${invoice.id}/edit`}>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                <p className="mt-1 font-medium">{invoice.invoice_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                <p className="mt-1">{format(new Date(invoice.issue_date), 'MMMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                <p className="mt-1">{format(new Date(invoice.due_date), 'MMMM d, yyyy')}</p>
              </div>
              {invoice.project && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Project</p>
                  <Link
                    href={`/admin/projects/${invoice.project.id}`}
                    className="mt-1 text-primary hover:underline"
                  >
                    {invoice.project.title}
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client Name</p>
                <p className="mt-1 font-medium">
                  {invoice.client.company_name || invoice.client.contact_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact</p>
                <p className="mt-1">{invoice.client.contact_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <a
                  href={`mailto:${invoice.client.email}`}
                  className="mt-1 text-primary hover:underline"
                >
                  {invoice.client.email}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.line_items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.unit_price, invoice.currency)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.quantity * item.unit_price, invoice.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ΦΠΑ ({invoice.tax_rate}%)</span>
                <span>{formatCurrency(invoice.tax_amount, invoice.currency)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(invoice.total, invoice.currency)}</span>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-6">
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="mt-2 text-sm whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {invoice.status === 'draft' && (
                <Button onClick={handleSendInvoice} disabled={isUpdatingStatus}>
                  {isUpdatingStatus ? 'Sending...' : 'Mark as Sent'}
                </Button>
              )}
              <PaymentActions invoice={invoice} onStatusChange={handleStatusChange} />
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
        loading={isDeleting}
      />
    </>
  );
}
