'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContractList } from '@/components/admin/contracts/contract-list';
import { ContractCreator } from '@/components/admin/contracts/contract-creator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Contract, Project } from '@/types';
import { useTranslations } from 'next-intl';

interface ContractsTabProps {
  project: Project;
  contracts: Contract[];
}

export function ContractsTab({ project, contracts: initialContracts }: ContractsTabProps) {
  const t = useTranslations('contracts');
  const [contracts, setContracts] = useState(initialContracts);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const handleContractCreated = (contract: Contract) => {
    setContracts([contract, ...contracts]);
    setIsCreatorOpen(false);
  };

  const handleContractDeleted = (id: string) => {
    setContracts(contracts.filter(c => c.id !== id));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{t('title')}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('description')}
            </p>
          </div>
          <Button onClick={() => setIsCreatorOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('addContract')}
          </Button>
        </div>

        <ContractList
          contracts={contracts}
          onDelete={handleContractDeleted}
        />
      </div>

      <Dialog open={isCreatorOpen} onOpenChange={setIsCreatorOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('addContract')}</DialogTitle>
          </DialogHeader>
          <ContractCreator
            project={project}
            onSuccess={handleContractCreated}
            onCancel={() => setIsCreatorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
