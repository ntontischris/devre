'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { getShotLists, createShotList, updateShotList } from '@/lib/actions/filming-prep';
import type { Shot, ShotList as ShotListData } from '@/types';
import { SHOT_TYPES, SHOT_TYPE_LABELS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Plus, Trash2, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';

interface ShotListProps {
  projectId: string;
}

export function ShotList({ projectId }: ShotListProps) {
  const t = useTranslations('filmingPrep');
  const [shotLists, setShotLists] = useState<ShotListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeShotListId, setActiveShotListId] = useState<string | null>(null);

  const loadShotLists = useCallback(async () => {
    setLoading(true);
    const result = await getShotLists(projectId);
    if (result.error) {
      toast.error(t('failedToLoadShotLists'));
      setLoading(false);
      return;
    }

    setShotLists(result.data ?? []);
    if (result.data && result.data.length > 0) {
      setActiveShotListId(result.data[0].id);
    }
    setLoading(false);
  }, [projectId, t]);

  useEffect(() => {
    void loadShotLists();
  }, [loadShotLists]);

  const handleCreateShotList = async () => {
    setLoading(true);
    const result = await createShotList(projectId);
    setLoading(false);

    if (result.error) {
      toast.error(t('failedToCreateShotList'));
      return;
    }

    toast.success(t('shotListCreated'));
    await loadShotLists();
    setActiveShotListId(result.data!.id);
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
            title={t('noShotList')}
            description={t('createFirstShotList')}
            action={{ label: t('createShotList'), onClick: handleCreateShotList }}
          />
        </CardContent>
      </Card>
    );
  }

  const activeShotList = shotLists.find((list) => list.id === activeShotListId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('shotList')}</CardTitle>
        <CardDescription>{t('planAndTrackShots')}</CardDescription>
      </CardHeader>
      <CardContent>{activeShotList && <ShotListTable shotList={activeShotList} />}</CardContent>
    </Card>
  );
}

interface ShotListTableProps {
  shotList: ShotListData;
}

function ShotListTable({ shotList }: ShotListTableProps) {
  const t = useTranslations('filmingPrep');
  const tc = useTranslations('common');
  const [shots, setShots] = useState<Shot[]>(shotList.shots || []);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateShotList(shotList.id, { shots });
    setSaving(false);

    if (result.error) {
      toast.error(t('failedToSaveShotList'));
    } else {
      setIsDirty(false);
      toast.success(t('shotListSaved'));
    }
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
    setShots((prev) => [...prev, newShot]);
    setIsDirty(true);
  };

  const updateShot = (index: number, updates: Partial<Shot>) => {
    setShots((prev) => prev.map((shot, i) => (i === index ? { ...shot, ...updates } : shot)));
    setIsDirty(true);
  };

  const deleteShot = (index: number) => {
    setShots((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((shot, i) => ({ ...shot, number: i + 1 }));
    });
    setIsDirty(true);
  };

  const toggleCompleted = (index: number) => {
    setShots((prev) =>
      prev.map((shot, i) => (i === index ? { ...shot, completed: !shot.completed } : shot)),
    );
    setIsDirty(true);
  };

  const completedCount = shots.filter((shot) => shot.completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {shots.length > 0 && (
            <span className="font-medium">
              {t('shotsCompleted', { completed: completedCount, total: shots.length })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saving && (
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <LoadingSpinner size="sm" />
              {tc('saving')}
            </span>
          )}
          {isDirty && (
            <Button onClick={handleSave} size="sm" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? tc('saving') : tc('save')}
            </Button>
          )}
          <Button onClick={addShot} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            {t('addShot')}
          </Button>
        </div>
      </div>

      {shots.length === 0 ? (
        <EmptyState icon={Camera} title={t('noShotsYet')} description={t('addFirstShot')} />
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-[200px]">{tc('description')}</TableHead>
                <TableHead className="w-[140px]">{t('shotType')}</TableHead>
                <TableHead className="w-[160px]">{t('locationPlaceholder')}</TableHead>
                <TableHead className="w-[120px]">{t('durationEstimate')}</TableHead>
                <TableHead className="w-[160px]">{tc('notes')}</TableHead>
                <TableHead className="w-[80px]">{t('doneLabel')}</TableHead>
                <TableHead className="w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shots.map((shot, index) => (
                <TableRow key={`shot-${index}`}>
                  <TableCell className="font-medium text-center">{shot.number}</TableCell>
                  <TableCell>
                    <Input
                      value={shot.description}
                      onChange={(e) => updateShot(index, { description: e.target.value })}
                      placeholder={t('shotDescriptionPlaceholder')}
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={shot.shot_type}
                      onValueChange={(value) =>
                        updateShot(index, { shot_type: value as Shot['shot_type'] })
                      }
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
                      placeholder={t('locationPlaceholder')}
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={shot.duration_est || ''}
                      onChange={(e) => updateShot(index, { duration_est: e.target.value })}
                      placeholder={t('durationPlaceholder')}
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={shot.notes || ''}
                      onChange={(e) => updateShot(index, { notes: e.target.value })}
                      placeholder={t('shotNotesPlaceholder')}
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
                    <Button variant="ghost" size="sm" onClick={() => deleteShot(index)}>
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
