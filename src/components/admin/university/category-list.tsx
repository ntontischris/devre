'use client';

import { useState } from 'react';
import { Pencil, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { deleteKbCategory } from '@/lib/actions/kb-categories';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

interface Category {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  sort_order: number;
  parent_id: string | null;
}

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: () => void;
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  const t = useTranslations('university');
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
    const result = await deleteKbCategory(deletingId);
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

  // Count articles per category (you'd get this from the server in a real implementation)
  const getArticleCount = () => {
    // Placeholder - in real implementation, this would come from the server
    return 0;
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
              </div>
              {category.description && (
                <CardDescription className="line-clamp-2">
                  {category.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {getArticleCount()} article{getArticleCount() !== 1 ? 's' : ''}
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(category)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteClick(category.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('deleteCategoryTitle')}
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel={tc('delete')}
        onConfirm={handleDeleteConfirm}
        destructive
        loading={isDeleting}
      />
    </>
  );
}
