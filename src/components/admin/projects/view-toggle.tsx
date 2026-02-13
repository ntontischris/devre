'use client';

import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'kanban' | 'list';
  onViewChange: (view: 'kanban' | 'list') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 border rounded-lg p-1">
      <Button
        variant={view === 'kanban' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('kanban')}
        className="h-8"
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="h-8"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}
