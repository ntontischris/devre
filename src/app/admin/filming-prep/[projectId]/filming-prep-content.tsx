'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EquipmentChecklist } from '@/components/admin/filming-prep/equipment-checklist';
import { ShotList } from '@/components/admin/filming-prep/shot-list';
import { ConceptNotes } from '@/components/admin/filming-prep/concept-notes';
import { ClipboardList, Camera, FileText } from 'lucide-react';

interface FilmingPrepContentProps {
  projectId: string;
  projectTitle: string;
}

export function FilmingPrepContent({ projectId, projectTitle }: FilmingPrepContentProps) {
  const [activeTab, setActiveTab] = useState('equipment');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Filming Preparation"
        description={`Manage equipment, shot lists, and concept notes for ${projectTitle}`}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Equipment</span>
          </TabsTrigger>
          <TabsTrigger value="shots" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span>Shot List</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Concept Notes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-4">
          <EquipmentChecklist projectId={projectId} />
        </TabsContent>

        <TabsContent value="shots" className="space-y-4">
          <ShotList projectId={projectId} />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <ConceptNotes projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
