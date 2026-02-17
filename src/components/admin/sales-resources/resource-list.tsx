'use client';

import { useState } from 'react';
import { Download, Trash2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { deleteSalesResource, getSalesResourceDownloadUrl } from '@/lib/actions/sales-resources';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface Resource {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
  category: {
    title: string;
  };
}

interface Category {
  id: string;
  title: string;
  description: string | null;
}

interface ResourceListProps {
  resources: Resource[];
  categories: Category[];
  onDelete: () => void;
}

export function ResourceList({ resources, categories, onDelete }: ResourceListProps) {
  const t = useTranslations('salesResources');
  const tc = useTranslations('common');
  const tToast = useTranslations('toast');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    const result = await deleteSalesResource(deletingId);
    setIsDeleting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(tToast('deleteSuccess'));
    setDeleteDialogOpen(false);
    setDeletingId(null);
    onDelete();
  };

  const handleDownload = async (filePath: string) => {
    const result = await getSalesResourceDownloadUrl(filePath);
    if (result.error) {
      toast.error(result.error);
      return;
    }

    // Open in new tab for download
    if (result.data) {
      window.open(result.data, '_blank');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Group resources by category
  const resourcesByCategory = categories.map((category) => ({
    category,
    resources: resources.filter((r) => r.category_id === category.id),
  })).filter((group) => group.resources.length > 0);

  if (resources.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-6">
        {resourcesByCategory.map(({ category, resources: categoryResources }) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
              {category.description && (
                <CardDescription>{category.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categoryResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{resource.title}</p>
                        {resource.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {resource.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{resource.file_name}</span>
                          <span>•</span>
                          <span>{formatFileSize(resource.file_size)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(resource.file_path)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(resource.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('deleteResourceTitle')}
        description="Are you sure you want to delete this resource? This action cannot be undone."
        confirmLabel={tc('delete')}
        onConfirm={handleDeleteConfirm}
        destructive
        loading={isDeleting}
      />
    </>
  );
}
