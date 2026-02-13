'use client';

import * as React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { INVOICE_STATUSES, INVOICE_STATUS_LABELS } from '@/lib/constants';
import { deleteInvoice } from '@/lib/actions/invoices';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  invoice_number: string;
  client: { id: string; contact_name: string; company_name?: string };
  total: number;
  status: string;
  issue_date: string;
  due_date: string;
}

interface InvoicesContentProps {
  invoices: Invoice[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(amount);
};

export function InvoicesContent({ invoices: initialInvoices }: InvoicesContentProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filteredInvoices = React.useMemo(() => {
    if (statusFilter === 'all') return initialInvoices;
    return initialInvoices.filter(invoice => invoice.status === statusFilter);
  }, [initialInvoices, statusFilter]);

  const handleDelete = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    const result = await deleteInvoice(deletingId);
    setIsDeleting(false);

    if (result.error) {
      toast.error('Failed to delete invoice', { description: result.error });
    } else {
      toast.success('Invoice deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingId(null);
      router.refresh();
    }
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'invoice_number',
      header: 'Invoice #',
      cell: ({ row }) => (
        <Link
          href={`/admin/invoices/${row.original.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.original.invoice_number}
        </Link>
      ),
    },
    {
      accessorKey: 'client',
      header: 'Client',
      cell: ({ row }) => {
        const client = row.original.client;
        return client.company_name || client.contact_name;
      },
    },
    {
      accessorKey: 'total',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.total),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'issue_date',
      header: 'Issue Date',
      cell: ({ row }) => format(new Date(row.original.issue_date), 'MMM d, yyyy'),
    },
    {
      accessorKey: 'due_date',
      header: 'Due Date',
      cell: ({ row }) => format(new Date(row.original.due_date), 'MMM d, yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/invoices/${invoice.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/invoices/${invoice.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  setDeletingId(invoice.id);
                  setDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <PageHeader title="Invoices">
          <Link href="/admin/invoices/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
        </PageHeader>

        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {INVOICE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {INVOICE_STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={filteredInvoices}
          searchKey="invoice_number"
          searchPlaceholder="Search invoices..."
          mobileHiddenColumns={['client', 'issue_date', 'due_date']}
        />
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
