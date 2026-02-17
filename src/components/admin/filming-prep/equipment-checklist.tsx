'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { getEquipmentList, updateEquipmentList } from '@/lib/actions/filming-prep';
import type { EquipmentItem } from '@/lib/schemas/filming-prep';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Plus, GripVertical, Trash2, Edit2, Check, X, Package } from 'lucide-react';
import { toast } from 'sonner';
import {
  EQUIPMENT_CATALOG,
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_CATEGORY_LABELS,
  type CatalogEquipmentItem,
  type EquipmentCategory,
} from '@/lib/constants';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EquipmentItemWithId extends EquipmentItem {
  id: string;
}

interface EquipmentChecklistProps {
  projectId: string;
}

export function EquipmentChecklist({ projectId }: EquipmentChecklistProps) {
  const t = useTranslations('filmingPrep');
  const tc = useTranslations('common');
  const [items, setItems] = useState<EquipmentItemWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [selectedCatalogItems, setSelectedCatalogItems] = useState<Set<string>>(new Set());
  const [customItemName, setCustomItemName] = useState('');
  const [customItemQuantity, setCustomItemQuantity] = useState('1');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadEquipmentList = useCallback(async () => {
    setLoading(true);
    const result = await getEquipmentList(projectId);
    if (result.error) {
      toast.error(t('failedToLoadEquipment'));
      setLoading(false);
      return;
    }

    const itemsWithIds: EquipmentItemWithId[] = (result.data?.items || []).map((item: any, index: number) => ({
      ...item,
      id: `item-${index}-${Date.now()}`,
    }));
    setItems(itemsWithIds);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    loadEquipmentList();
  }, [loadEquipmentList]);

  const saveEquipmentList = async (updatedItems: EquipmentItemWithId[]) => {
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const itemsWithoutIds = updatedItems.map(({ id, ...item }) => item);
    const result = await updateEquipmentList(projectId, { items: itemsWithoutIds });
    setSaving(false);

    if (result.error) {
      toast.error(t('failedToSaveEquipment'));
      return false;
    }

    return true;
  };

  // Open catalog dialog and pre-select items already in the list
  const openCatalog = () => {
    const existingNames = new Set(items.map(i => i.name));
    const preSelected = new Set<string>();
    EQUIPMENT_CATALOG.forEach(catItem => {
      if (existingNames.has(catItem.name)) {
        preSelected.add(catItem.name);
      }
    });
    setSelectedCatalogItems(preSelected);
    setCatalogOpen(true);
  };

  const toggleCatalogItem = (name: string) => {
    setSelectedCatalogItems(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const addFromCatalog = async () => {
    const existingNames = new Set(items.map(i => i.name));
    const toAdd: EquipmentItemWithId[] = [];
    const toRemove = new Set<string>();

    // Items that were in the catalog and are currently in the list but are now deselected → remove
    EQUIPMENT_CATALOG.forEach(catItem => {
      if (existingNames.has(catItem.name) && !selectedCatalogItems.has(catItem.name)) {
        toRemove.add(catItem.name);
      }
    });

    // Items that are selected but not yet in the list → add
    selectedCatalogItems.forEach(name => {
      if (!existingNames.has(name)) {
        const catItem = EQUIPMENT_CATALOG.find(c => c.name === name);
        if (catItem) {
          toAdd.push({
            id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: catItem.name,
            quantity: 1,
            checked: false,
            notes: catItem.description,
          });
        }
      }
    });

    const updatedItems = [
      ...items.filter(i => !toRemove.has(i.name)),
      ...toAdd,
    ];

    setItems(updatedItems);
    setCatalogOpen(false);

    const success = await saveEquipmentList(updatedItems);
    if (success) {
      const added = toAdd.length;
      const removed = toRemove.size;
      if (added > 0 && removed > 0) {
        toast.success(t('itemsAddedAndRemoved', { added, removed }));
      } else if (added > 0) {
        toast.success(t('itemsAdded', { count: added }));
      } else if (removed > 0) {
        toast.success(t('itemsRemoved', { count: removed }));
      }
    }
  };

  const addCustomItem = async () => {
    if (!customItemName.trim()) {
      toast.error(t('enterItemName'));
      return;
    }

    const quantity = parseInt(customItemQuantity);
    if (isNaN(quantity) || quantity < 1) {
      toast.error(t('quantityAtLeastOne'));
      return;
    }

    const newItem: EquipmentItemWithId = {
      id: `item-${Date.now()}`,
      name: customItemName.trim(),
      quantity,
      checked: false,
      notes: '',
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setCustomItemName('');
    setCustomItemQuantity('1');

    const success = await saveEquipmentList(updatedItems);
    if (success) {
      toast.success(t('itemAdded'));
    }
  };

  const deleteItem = async (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);

    const success = await saveEquipmentList(updatedItems);
    if (success) {
      toast.success(t('itemRemoved'));
    }
  };

  const toggleCheck = async (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    await saveEquipmentList(updatedItems);
  };

  const updateItem = async (id: string, updates: Partial<EquipmentItem>) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    setItems(updatedItems);
    await saveEquipmentList(updatedItems);
  };

  const checkAll = async () => {
    const updatedItems = items.map(item => ({ ...item, checked: true }));
    setItems(updatedItems);

    const success = await saveEquipmentList(updatedItems);
    if (success) {
      toast.success(t('allItemsChecked'));
    }
  };

  const uncheckAll = async () => {
    const updatedItems = items.map(item => ({ ...item, checked: false }));
    setItems(updatedItems);

    const success = await saveEquipmentList(updatedItems);
    if (success) {
      toast.success(t('allItemsUnchecked'));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      const updatedItems = arrayMove(items, oldIndex, newIndex);
      setItems(updatedItems);
      await saveEquipmentList(updatedItems);
    }
  };

  const checkedCount = items.filter(item => item.checked).length;
  const totalCount = items.length;

  // Group catalog by category
  const catalogByCategory = EQUIPMENT_CATEGORIES.reduce((acc, category) => {
    acc[category] = EQUIPMENT_CATALOG.filter(item => item.category === category);
    return acc;
  }, {} as Record<EquipmentCategory, CatalogEquipmentItem[]>);

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
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Catalog picker button */}
        <Dialog open={catalogOpen} onOpenChange={setCatalogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" onClick={openCatalog}>
              <Package className="h-4 w-4 mr-2" />
              {t('selectFromEquipmentCatalog')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{t('equipmentCatalogTitle')}</DialogTitle>
              <DialogDescription>
                {t('selectEquipmentForShoot')}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-4">
                {EQUIPMENT_CATEGORIES.map(category => {
                  const categoryItems = catalogByCategory[category];
                  if (categoryItems.length === 0) return null;
                  return (
                    <div key={category}>
                      <h4 className="font-semibold text-sm mb-2">
                        {EQUIPMENT_CATEGORY_LABELS[category]}
                      </h4>
                      <div className="space-y-2">
                        {categoryItems.map(catItem => (
                          <label
                            key={catItem.name}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                          >
                            <Checkbox
                              checked={selectedCatalogItems.has(catItem.name)}
                              onCheckedChange={() => toggleCatalogItem(catItem.name)}
                            />
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-sm">{catItem.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {catItem.description}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                      <Separator className="mt-3" />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCatalogOpen(false)}>
                {tc('cancel')}
              </Button>
              <Button onClick={addFromCatalog}>
                {t('applySelection')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Custom item input (fallback) */}
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="item-name">{t('customItem')}</Label>
            <Input
              id="item-name"
              placeholder={t('addCustomItem')}
              value={customItemName}
              onChange={(e) => setCustomItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addCustomItem();
                }
              }}
            />
          </div>
          <div className="w-24 space-y-2">
            <Label htmlFor="item-quantity">{t('qtyPlaceholder')}</Label>
            <Input
              id="item-quantity"
              type="number"
              min="1"
              value={customItemQuantity}
              onChange={(e) => setCustomItemQuantity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addCustomItem();
                }
              }}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addCustomItem} disabled={saving} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {tc('add')}
            </Button>
          </div>
        </div>

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
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
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

interface EquipmentItemRowProps {
  item: EquipmentItemWithId;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<EquipmentItem>) => void;
  disabled: boolean;
}

function EquipmentItemRow({ item, onToggle, onDelete, onUpdate, disabled }: EquipmentItemRowProps) {
  const t = useTranslations('filmingPrep');
  const tc = useTranslations('common');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity.toString());
  const [editNotes, setEditNotes] = useState(item.notes || '');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (!editName.trim()) {
      toast.error(t('itemNameRequired'));
      return;
    }

    const quantity = parseInt(editQuantity);
    if (isNaN(quantity) || quantity < 1) {
      toast.error(t('quantityAtLeastOne'));
      return;
    }

    onUpdate(item.id, {
      name: editName.trim(),
      quantity,
      notes: editNotes.trim(),
    });
    setIsEditing(false);
    toast.success(t('itemUpdated'));
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditQuantity(item.quantity.toString());
    setEditNotes(item.notes || '');
    setIsEditing(false);
  };

  // Check if this item is from the catalog
  const catalogItem = EQUIPMENT_CATALOG.find(c => c.name === item.name);

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="border rounded-lg p-4 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder={t('itemNamePlaceholder')}
            />
          </div>
          <div className="w-24">
            <Input
              type="number"
              min="1"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              placeholder={t('qtyPlaceholder')}
            />
          </div>
        </div>
        <Textarea
          value={editNotes}
          onChange={(e) => setEditNotes(e.target.value)}
          placeholder={t('notesOptional')}
          rows={2}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            {tc('save')}
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            {tc('cancel')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 border rounded-lg p-3 hover:bg-accent/50 transition-colors"
    >
      <button
        className="cursor-grab active:cursor-grabbing mt-1"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </button>

      <Checkbox
        checked={item.checked}
        onCheckedChange={() => onToggle(item.id)}
        disabled={disabled}
        className="mt-1"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
            {item.name}
          </span>
          <Badge variant="secondary">{item.quantity}x</Badge>
          {catalogItem && (
            <Badge variant="outline" className="text-xs">
              {EQUIPMENT_CATEGORY_LABELS[catalogItem.category]}
            </Badge>
          )}
        </div>
        {item.notes && (
          <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
        )}
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          disabled={disabled}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(item.id)}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
