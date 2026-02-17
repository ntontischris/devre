'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { deleteKbArticle } from '@/lib/actions/kb-articles';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  sort_order: number;
  category: {
    title: string;
    slug: string;
  };
}

interface Category {
  id: string;
  title: string;
  slug: string;
}

interface ArticleListProps {
  articles: Article[];
  categories: Category[];
  onDelete: () => void;
}

export function ArticleList({ articles, categories, onDelete }: ArticleListProps) {
  const router = useRouter();
  const t = useTranslations('university');
  const tc = useTranslations('common');
  const tToast = useTranslations('toast');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((a) => a.category.slug === selectedCategory);

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    setIsDeleting(true);
    const result = await deleteKbArticle(deletingId);
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

  const handleEdit = (articleId: string) => {
    router.push(`/admin/university/articles/${articleId}/edit`);
  };

  if (articles.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title={t('noArticles')}
        description="Create your first knowledge base article to get started"
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('filterByCategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    {t('noArticlesInCategory')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/university/articles/${article.id}`}
                        className="hover:underline hover:text-primary"
                      >
                        {article.title}
                      </Link>
                    </TableCell>
                    <TableCell>{article.category.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={article.published ? 'default' : 'secondary'}
                        className="gap-1"
                      >
                        {article.published ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Draft
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>{article.sort_order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/university/articles/${article.id}`)}
                          title={t('viewArticle')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(article.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(article.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t('deleteArticleTitle')}
        description="Are you sure you want to delete this article? This action cannot be undone."
        confirmLabel={tc('delete')}
        onConfirm={handleDeleteConfirm}
        destructive
        loading={isDeleting}
      />
    </>
  );
}
