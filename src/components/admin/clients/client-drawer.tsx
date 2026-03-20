'use client';

import { useTranslations } from 'next-intl';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ProjectForm } from '@/components/admin/projects/project-form';
import { InvoiceForm } from '@/components/admin/invoices/invoice-form';
import type { ClientDrawerMode } from '@/types/relations';
import type { Client } from '@/types/index';

interface ClientDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ClientDrawerMode | null;
  client: Client;
  onSuccess: () => void;
}

const DRAWER_TITLES: Record<ClientDrawerMode['type'], string> = {
  'create-project': 'drawer.createProject',
  'create-invoice': 'drawer.createInvoice',
};

export function ClientDrawer({ open, onOpenChange, mode, client, onSuccess }: ClientDrawerProps) {
  const t = useTranslations('clients');

  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{mode ? t(DRAWER_TITLES[mode.type]) : ''}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {mode?.type === 'create-project' && (
            <ProjectForm clients={[client]} onSuccess={handleSuccess} />
          )}
          {mode?.type === 'create-invoice' && (
            <InvoiceForm
              clients={[
                {
                  id: client.id,
                  company_name: client.company_name,
                  contact_name: client.contact_name,
                },
              ]}
              projects={mode.projects}
              nextInvoiceNumber={mode.nextInvoiceNumber}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
