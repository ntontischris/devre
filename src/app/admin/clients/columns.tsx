'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Client } from '@/types/index';
import { UserAvatar } from '@/components/shared/user-avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { DataTableColumnHeader } from '@/components/shared/data-table-column-header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { deleteClient } from '@/lib/actions/clients';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ActionsMenuProps {
  client: Client;
}

function ActionsMenu({ client }: ActionsMenuProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteClient(client.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Client deleted successfully');
        router.refresh();
      }
    } catch (error) {
      toast.error('Failed to delete client');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/clients/${client.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/admin/clients/${client.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteDialogOpen(true);
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Client"
        description={`Are you sure you want to delete ${client.contact_name}? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={isDeleting}
        destructive
      />
    </>
  );
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'avatar',
    header: '',
    cell: ({ row }) => (
      <UserAvatar
        name={row.original.contact_name}
        src={row.original.avatar_url}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'contact_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Name" />
    ),
    cell: ({ row }) => (
      <Link href={`/admin/clients/${row.original.id}`} className="font-medium hover:underline">
        {row.getValue('contact_name')}
      </Link>
    ),
  },
  {
    accessorKey: 'company_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const company = row.getValue('company_name') as string | null;
      return <div>{company || '-'}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue('email')}</div>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | null;
      return <div>{phone || '-'}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <StatusBadge status={row.getValue('status')} />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      return <div>{format(new Date(date), 'MMM d, yyyy')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionsMenu client={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
