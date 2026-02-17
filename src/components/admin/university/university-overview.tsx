'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/shared/empty-state';
import { CategoryList } from './category-list';
import { CategoryForm } from './category-form';
import { ArticleList } from './article-list';

interface Category {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  sort_order: number;
  parent_id: string | null;
}

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

interface UniversityOverviewProps {
  categories: Category[];
  articles: Article[];
}

export function UniversityOverview({ categories, articles }: UniversityOverviewProps) {
  const router = useRouter();
  const t = useTranslations('university');
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  const handleCategoryFormClose = () => {
    setCategoryFormOpen(false);
    setEditingCategory(null);
  };

  const handleCategorySuccess = () => {
    router.refresh();
  };

  const handleNewArticle = () => {
    router.push('/admin/university/articles/new');
  };

  const handleArticleDelete = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Knowledge Base Articles</h2>
            <Button onClick={handleNewArticle}>
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>

          {articles.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={t('noArticles')}
              description="Create your first knowledge base article to get started"
              action={{
                label: t('addArticle'),
                onClick: handleNewArticle,
              }}
            />
          ) : (
            <ArticleList
              articles={articles}
              categories={categories}
              onDelete={handleArticleDelete}
            />
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button onClick={() => setCategoryFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </div>

          {categories.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title={t('noCategories')}
              description="Create your first category to organize knowledge base articles"
              action={{
                label: t('addCategory'),
                onClick: () => setCategoryFormOpen(true),
              }}
            />
          ) : (
            <CategoryList
              categories={categories}
              onEdit={handleEditCategory}
              onDelete={handleCategorySuccess}
            />
          )}
        </TabsContent>
      </Tabs>

      <CategoryForm
        open={categoryFormOpen}
        onOpenChange={handleCategoryFormClose}
        category={editingCategory}
        categories={categories}
        onSuccess={handleCategorySuccess}
      />
    </div>
  );
}
