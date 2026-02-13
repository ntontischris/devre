'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { FileText, Eye, Send, Trash2, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteContract, sendContract } from '@/lib/actions/contracts';
import { toast } from 'sonner';

interface ContractListProps {
  contracts: any[];
  onDelete: (id: string) => void;
}

export function ContractList({ contracts, onDelete }: ContractListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const result = await deleteContract(deleteId);

    if (result.error) {
      toast.error(result.error);
      setIsDeleting(false);
      return;
    }

    toast.success('Contract deleted successfully');
    onDelete(deleteId);
    setDeleteId(null);
    setIsDeleting(false);
  };

  const handleSendToClient = async (contractId: string) => {
    const result = await sendContract(contractId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Contract sent to client');
    onDelete(contractId); // Trigger refresh from parent
  };

  const handleDownloadPDF = async (contractId: string) => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/pdf`);
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract-${contractId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  if (contracts.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No contracts yet"
        description="Create your first contract for this project"
      />
    );
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.title}</TableCell>
                <TableCell>
                  <StatusBadge status={contract.status} />
                </TableCell>
                <TableCell>
                  {format(new Date(contract.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {contract.expires_at
                    ? format(new Date(contract.expires_at), 'MMM d, yyyy')
                    : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/admin/contracts/${contract.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {contract.status === 'signed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPDF(contract.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {contract.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendToClient(contract.id)}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteId(contract.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Contract"
        description="Are you sure you want to delete this contract? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={isDeleting}
        destructive
      />
    </>
  );
}
