'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Package, Save } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { EquipmentItemRow } from './sortable-equipment-item';
import { EquipmentCatalogDialog } from './equipment-catalog-dialog';
import { CustomItemForm } from './custom-item-form';
import { useEquipmentList } from './use-equipment-list';

interface EquipmentChecklistProps {
  projectId: string;
}

export function EquipmentChecklist({ projectId }: EquipmentChecklistProps) {
  const t = useTranslations('filmingPrep');
  const tc = useTranslations('common');
  const {
    items,
    loading,
    saving,
    isDirty,
    catalogOpen,
    selectedCatalogItems,
    customItemName,
    customItemQuantity,
    checkedCount,
    totalCount,
    setCustomItemName,
    setCustomItemQuantity,
    setCatalogOpen,
    openCatalog,
    toggleCatalogItem,
    addFromCatalog,
    addCustomItem,
    deleteItem,
    toggleCheck,
    updateItem,
    checkAll,
    uncheckAll,
    handleDragEnd,
    save,
  } = useEquipmentList(projectId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('equipment')}</CardTitle>
            <CardDescription>
              {totalCount > 0 ? (
                <span className="font-medium">
                  {t('itemsChecked', { checked: checkedCount, total: totalCount })}
                </span>
              ) : (
                t('addEquipmentForFilming')
              )}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {items.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={checkAll} disabled={saving}>
                  {t('checkAllItems')}
                </Button>
                <Button variant="outline" size="sm" onClick={uncheckAll} disabled={saving}>
                  {t('uncheckAllItems')}
                </Button>
              </>
            )}
            {isDirty && (
              <Button size="sm" onClick={save} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? tc('saving') : tc('save')}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full" onClick={openCatalog}>
          <Package className="h-4 w-4 mr-2" />
          {t('selectFromEquipmentCatalog')}
        </Button>

        <EquipmentCatalogDialog
          open={catalogOpen}
          onOpenChange={setCatalogOpen}
          selectedItems={selectedCatalogItems}
          onToggleItem={toggleCatalogItem}
          onApply={addFromCatalog}
        />

        <CustomItemForm
          name={customItemName}
          quantity={customItemQuantity}
          disabled={saving}
          onNameChange={setCustomItemName}
          onQuantityChange={setCustomItemQuantity}
          onAdd={addCustomItem}
        />

        {items.length === 0 ? (
          <EmptyState
            icon={Package}
            title={t('noEquipmentSelected')}
            description={t('selectEquipmentOrAddCustom')}
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {items.map((item) => (
                  <EquipmentItemRow
                    key={item.id}
                    item={item}
                    onToggle={toggleCheck}
                    onDelete={deleteItem}
                    onUpdate={updateItem}
                    disabled={saving}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
}
