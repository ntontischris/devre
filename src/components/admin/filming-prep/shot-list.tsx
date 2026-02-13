'use client';

import { useEffect, useState } from 'react';
import { getShotLists, createShotList, updateShotList } from '@/lib/actions/filming-prep';
import type { Shot } from '@/lib/schemas/filming-prep';
import { SHOT_TYPES, SHOT_TYPE_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Plus, Trash2, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface ShotListProps {
  projectId: string;
}

export function ShotList({ projectId }: ShotListProps) {
  const [shotLists, setShotLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeShotListId, setActiveShotListId] = useState<string | null>(null);

  useEffect(() => {
    loadShotLists();
  }, [projectId]);

  const loadShotLists = async () => {
    setLoading(true);
    const result = await getShotLists(projectId);
    if (result.error) {
      toast.error('Failed to load shot lists');
      setLoading(false);
      return;
    }

    setShotLists(result.data || []);
    if (result.data && result.data.length > 0) {
      setActiveShotListId(result.data[0].id);
    }
    setLoading(false);
  };

  const handleCreateShotList = async () => {
    setSaving(true);
    const result = await createShotList(projectId);
    setSaving(false);

    if (result.error) {
      toast.error('Failed to create shot list');
      return;
    }

    toast.success('Shot list created');
    await loadShotLists();
    setActiveShotListId(result.data.id);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (shotLists.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={Camera}
            title="No shot list"
            description="Create your first shot list to plan your filming"
            action={{ label: 'Create Shot List', onClick: handleCreateShotList }}
          />
        </CardContent>
      </Card>
    );
  }

  const activeShotList = shotLists.find(list => list.id === activeShotListId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shot List</CardTitle>
        <CardDescription>Plan and track your filming shots</CardDescription>
      </CardHeader>
      <CardContent>
        {activeShotList && (
          <ShotListTable
            shotList={activeShotList}
            onUpdate={loadShotLists}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface ShotListTableProps {
  shotList: any;
  onUpdate: () => void;
}

function ShotListTable({ shotList, onUpdate }: ShotListTableProps) {
  const [shots, setShots] = useState<Shot[]>(shotList.shots || []);
  const [saving, setSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const debouncedSave = (updatedShots: Shot[]) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    const timeout = setTimeout(async () => {
      setSaving(true);
      const result = await updateShotList(shotList.id, { shots: updatedShots });
      setSaving(false);

      if (result.error) {
        toast.error('Failed to save shot list');
      }
    }, 500);

    setSaveTimeout(timeout);
  };

  const addShot = () => {
    const newShot: Shot = {
      number: shots.length + 1,
      description: '',
      shot_type: 'medium',
      location: '',
      duration_est: '',
      notes: '',
      completed: false,
    };

    const updatedShots = [...shots, newShot];
    setShots(updatedShots);
    debouncedSave(updatedShots);
  };

  const updateShot = (index: number, updates: Partial<Shot>) => {
    const updatedShots = shots.map((shot, i) => {
      if (i === index) {
        return { ...shot, ...updates };
      }
      return shot;
    });
    setShots(updatedShots);
    debouncedSave(updatedShots);
  };

  const deleteShot = (index: number) => {
    const updatedShots = shots.filter((_, i) => i !== index);
    const reNumberedShots = updatedShots.map((shot, i) => ({
      ...shot,
      number: i + 1,
    }));
    setShots(reNumberedShots);
    debouncedSave(reNumberedShots);
    toast.success('Shot removed');
  };

  const toggleCompleted = (index: number) => {
    const updatedShots = shots.map((shot, i) => {
      if (i === index) {
        return { ...shot, completed: !shot.completed };
      }
      return shot;
    });
    setShots(updatedShots);
    debouncedSave(updatedShots);
  };

  const completedCount = shots.filter(shot => shot.completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {shots.length > 0 && (
            <span className="font-medium">
              {completedCount}/{shots.length} shots completed
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saving && (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Saving...
            </span>
          )}
          <Button onClick={addShot} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Shot
          </Button>
        </div>
      </div>

      {shots.length === 0 ? (
        <EmptyState
          icon={Camera}
          title="No shots"
          description="Add your first shot to start planning"
        />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-[200px]">Description</TableHead>
                <TableHead className="w-[140px]">Shot Type</TableHead>
                <TableHead className="w-[160px]">Location</TableHead>
                <TableHead className="w-[120px]">Duration Est.</TableHead>
                <TableHead className="w-[160px]">Notes</TableHead>
                <TableHead className="w-[80px]">Done</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shots.map((shot, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-center">
                    {shot.number}
                  </TableCell>
                  <TableCell>
                    <Input
                      value={shot.description}
                      onChange={(e) => updateShot(index, { description: e.target.value })}
                      placeholder="Shot description"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={shot.shot_type}
                      onValueChange={(value) => updateShot(index, { shot_type: value as Shot['shot_type'] })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHOT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {SHOT_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={shot.location || ''}
                      onChange={(e) => updateShot(index, { location: e.target.value })}
                      placeholder="Location"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={shot.duration_est || ''}
                      onChange={(e) => updateShot(index, { duration_est: e.target.value })}
                      placeholder="e.g., 30s"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={shot.notes || ''}
                      onChange={(e) => updateShot(index, { notes: e.target.value })}
                      placeholder="Notes"
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={shot.completed}
                      onCheckedChange={() => toggleCompleted(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteShot(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
