'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ProjectWithClient } from '@/types';
import { DataTable } from '@/components/shared/data-table';
import { DataTableColumnHeader } from '@/components/shared/data-table-column-header';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  PROJECT_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
  PRIORITY_LABELS,
} from '@/lib/constants';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteProject } from '@/lib/actions/projects';
import { toast } from 'sonner';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';

interface ProjectListProps {
  projects: ProjectWithClient[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    const result = await deleteProject(projectToDelete);

    if (!result.error) {
      toast.success('Project deleted successfully');
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setIsDeleting(false);
  };

  const columns: ColumnDef<ProjectWithClient>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <Link
          href={`/admin/projects/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: 'client',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Client" />
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.client.company_name || row.original.client.contact_name}
        </div>
      ),
    },
    {
      accessorKey: 'project_type',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {PROJECT_TYPE_LABELS[row.original.project_type]}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.priority} />,
    },
    {
      accessorKey: 'deadline',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Deadline" />
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.deadline
            ? format(new Date(row.original.deadline), 'MMM d, yyyy')
            : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'budget',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Budget" />
      ),
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.budget
            ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(row.original.budget)
            : '-'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/projects/${row.original.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/projects/${row.original.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setProjectToDelete(row.original.id);
                  setDeleteDialogOpen(true);
                }}
                className="text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={projects}
        searchKey="title"
        searchPlaceholder="Search projects..."
        mobileHiddenColumns={['project_type', 'priority', 'deadline', 'budget']}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        destructive
        loading={isDeleting}
      />
    </>
  );
}
