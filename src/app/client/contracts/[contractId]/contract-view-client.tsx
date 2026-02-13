'use client';

import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ContractView } from '@/components/shared/contract-view';
import { PageHeader } from '@/components/shared/page-header';

interface ContractViewClientProps {
  contract: any;
}

export function ContractViewClient({ contract }: ContractViewClientProps) {
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/contracts/${contract.id}/pdf`);
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract-${contract.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF downloaded successfully');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  return (
    <>
      <PageHeader title={contract.title}>
        {contract.status === 'signed' && (
          <Button onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        )}
      </PageHeader>

      <div className="mt-6">
        <ContractView contract={contract} showSignature />
      </div>
    </>
  );
}
