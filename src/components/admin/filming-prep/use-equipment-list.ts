'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { getEquipmentList, updateEquipmentList } from '@/lib/actions/filming-prep';
import type { EquipmentItem } from '@/types';
import { toast } from 'sonner';
import { EQUIPMENT_CATALOG } from '@/lib/constants';
import { type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { EquipmentItemWithId } from './sortable-equipment-item';

export type { DragEndEvent };

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

interface UseEquipmentListReturn {
  items: EquipmentItemWithId[];
  loading: boolean;
  saving: boolean;
  isDirty: boolean;
  catalogOpen: boolean;
  selectedCatalogItems: Set<string>;
  customItemName: string;
  customItemQuantity: string;
  checkedCount: number;
  totalCount: number;
  setCustomItemName: (v: string) => void;
  setCustomItemQuantity: (v: string) => void;
  setCatalogOpen: (v: boolean) => void;
  openCatalog: () => void;
  toggleCatalogItem: (name: string) => void;
  addFromCatalog: () => void;
  addCustomItem: () => void;
  deleteItem: (id: string) => void;
  toggleCheck: (id: string) => void;
  updateItem: (id: string, updates: Partial<EquipmentItem>) => void;
  checkAll: () => void;
  uncheckAll: () => void;
  handleDragEnd: (event: DragEndEvent) => void;
  save: () => Promise<void>;
}

export function useEquipmentList(projectId: string): UseEquipmentListReturn {
  const t = useTranslations('filmingPrep');
  const [items, setItems] = useState<EquipmentItemWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [selectedCatalogItems, setSelectedCatalogItems] = useState<Set<string>>(new Set());
  const [customItemName, setCustomItemName] = useState('');
  const [customItemQuantity, setCustomItemQuantity] = useState('1');

  const loadEquipmentList = useCallback(async () => {
    setLoading(true);
    const result = await getEquipmentList(projectId);
    if (result.error) {
      toast.error(t('failedToLoadEquipment'));
      setLoading(false);
      return;
    }

    const itemsWithIds: EquipmentItemWithId[] = (result.data?.items ?? []).map((item) => ({
      ...item,
      checked: item.checked ?? false,
      id: uid(),
    }));
    setItems(itemsWithIds);
    setIsDirty(false);
    setLoading(false);
  }, [projectId, t]);

  useEffect(() => {
    loadEquipmentList();
  }, [loadEquipmentList]);

  const save = async () => {
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const itemsWithoutIds = items.map(({ id, ...item }) => item);
    const result = await updateEquipmentList(projectId, { items: itemsWithoutIds });
    setSaving(false);

    if (result.error) {
      toast.error(t('failedToSaveEquipment'));
      return;
    }
    setIsDirty(false);
    toast.success(t('equipmentSaved'));
  };

  const openCatalog = () => {
    const existingNames = new Set(items.map((i) => i.name));
    const preSelected = new Set<string>();
    EQUIPMENT_CATALOG.forEach((catItem) => {
      if (existingNames.has(catItem.name)) preSelected.add(catItem.name);
    });
    setSelectedCatalogItems(preSelected);
    setCatalogOpen(true);
  };

  const toggleCatalogItem = (name: string) => {
    setSelectedCatalogItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const addFromCatalog = () => {
    const existingNames = new Set(items.map((i) => i.name));
    const toAdd: EquipmentItemWithId[] = [];
    const toRemove = new Set<string>();

    EQUIPMENT_CATALOG.forEach((catItem) => {
      if (existingNames.has(catItem.name) && !selectedCatalogItems.has(catItem.name)) {
        toRemove.add(catItem.name);
      }
    });

    selectedCatalogItems.forEach((name) => {
      if (!existingNames.has(name)) {
        const catItem = EQUIPMENT_CATALOG.find((c) => c.name === name);
        if (catItem) {
          toAdd.push({
            id: uid(),
            name: catItem.name,
            quantity: 1,
            checked: false,
            notes: catItem.description,
          });
        }
      }
    });

    const updatedItems = [...items.filter((i) => !toRemove.has(i.name)), ...toAdd];
    setItems(updatedItems);
    setCatalogOpen(false);
    if (toAdd.length > 0 || toRemove.size > 0) setIsDirty(true);
  };

  const addCustomItem = () => {
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
      id: uid(),
      name: customItemName.trim(),
      quantity,
      checked: false,
      notes: '',
    };

    setItems((prev) => [...prev, newItem]);
    setCustomItemName('');
    setCustomItemQuantity('1');
    setIsDirty(true);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setIsDirty(true);
  };

  const toggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    );
    setIsDirty(true);
  };

  const updateItem = (id: string, updates: Partial<EquipmentItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    setIsDirty(true);
  };

  const checkAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: true })));
    setIsDirty(true);
  };

  const uncheckAll = () => {
    setItems((prev) => prev.map((item) => ({ ...item, checked: false })));
    setIsDirty(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
      setIsDirty(true);
    }
  };

  return {
    items,
    loading,
    saving,
    isDirty,
    catalogOpen,
    selectedCatalogItems,
    customItemName,
    customItemQuantity,
    checkedCount: items.filter((item) => item.checked).length,
    totalCount: items.length,
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
  };
}
