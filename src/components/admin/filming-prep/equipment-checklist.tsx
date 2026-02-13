'use client';

import { useEffect, useState } from 'react';
import { getEquipmentList, updateEquipmentList } from '@/lib/actions/filming-prep';
import type { EquipmentItem } from '@/lib/schemas/filming-prep';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Plus, GripVertical, Trash2, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
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
  const [items, setItems] = useState<EquipmentItemWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadEquipmentList();
  }, [projectId]);

  const loadEquipmentList = async () => {
    setLoading(true);
    const result = await getEquipmentList(projectId);
    if (result.error) {
      toast.error('Failed to load equipment list');
      setLoading(false);
      return;
    }

    const itemsWithIds: EquipmentItemWithId[] = (result.data?.items || []).map((item: EquipmentItem, index: number) => ({
      ...item,
      id: `item-${index}-${Date.now()}`,
    }));
    setItems(itemsWithIds);
    setLoading(false);
  };

  const saveEquipmentList = async (updatedItems: EquipmentItemWithId[]) => {
    setSaving(true);
    const itemsWithoutIds = updatedItems.map(({ id, ...item }) => item);
    const result = await updateEquipmentList(projectId, { items: itemsWithoutIds });
    setSaving(false);

    if (result.error) {
      toast.error('Failed to save equipment list');
      return false;
    }

    return true;
  };

  const addItem = async () => {
    if (!newItemName.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    const quantity = parseInt(newItemQuantity);
    if (isNaN(quantity) || quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    const newItem: EquipmentItemWithId = {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      quantity,
      checked: false,
      notes: '',
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setNewItemName('');
    setNewItemQuantity('1');

    const success = await saveEquipmentList(updatedItems);
    if (success) {
      toast.success('Item added');
    }
  };

  const deleteItem = async (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);

    const success = await saveEquipmentList(updatedItems);
    if (success) {
      toast.success('Item removed');
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
      toast.success('All items checked');
    }
  };

  const uncheckAll = async () => {
    const updatedItems = items.map(item => ({ ...item, checked: false }));
    setItems(updatedItems);

    const success = await saveEquipmentList(updatedItems);
    if (success) {
      toast.success('All items unchecked');
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
            <CardTitle>Equipment Checklist</CardTitle>
            <CardDescription>
              {totalCount > 0 ? (
                <span className="font-medium">
                  {checkedCount}/{totalCount} items checked
                </span>
              ) : (
                'Add equipment items for filming'
              )}
            </CardDescription>
          </div>
          {items.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={checkAll} disabled={saving}>
                Check All
              </Button>
              <Button variant="outline" size="sm" onClick={uncheckAll} disabled={saving}>
                Uncheck All
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="item-name">Item Name</Label>
            <Input
              id="item-name"
              placeholder="e.g., Camera body"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem();
                }
              }}
            />
          </div>
          <div className="w-24 space-y-2">
            <Label htmlFor="item-quantity">Qty</Label>
            <Input
              id="item-quantity"
              type="number"
              min="1"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem();
                }
              }}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addItem} disabled={saving}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="No equipment items"
            description="Add your first equipment item to get started"
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
      toast.error('Item name cannot be empty');
      return;
    }

    const quantity = parseInt(editQuantity);
    if (isNaN(quantity) || quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    onUpdate(item.id, {
      name: editName.trim(),
      quantity,
      notes: editNotes.trim(),
    });
    setIsEditing(false);
    toast.success('Item updated');
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditQuantity(item.quantity.toString());
    setEditNotes(item.notes || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="border rounded-lg p-4 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Item name"
            />
          </div>
          <div className="w-24">
            <Input
              type="number"
              min="1"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              placeholder="Qty"
            />
          </div>
        </div>
        <Textarea
          value={editNotes}
          onChange={(e) => setEditNotes(e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
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
