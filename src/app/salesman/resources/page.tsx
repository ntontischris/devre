import { Suspense } from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { FolderOpen, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSalesResourceCategories } from '@/lib/actions/sales-resources';

async function ResourcesContent() {
  const t = await getTranslations('salesResources');
  const categoriesResult = await getSalesResourceCategories();
  const categories = categoriesResult.data ?? [];

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title={t('noResources')}
        description={t('description')}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link key={category.id} href={`/salesman/resources/${category.id}`}>
          <Card className="h-full transition-colors hover:bg-accent/50 cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              {category.description && (
                <CardDescription className="line-clamp-3">
                  {category.description}
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default async function SalesmanResourcesPage() {
  const t = await getTranslations('salesman.resources');

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
      />

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        }
      >
        <ResourcesContent />
      </Suspense>
    </div>
  );
}
