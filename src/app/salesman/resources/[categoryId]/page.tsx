import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, File } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getSalesResourceCategories, getSalesResources } from '@/lib/actions/sales-resources';
import { ResourceDownloadButton } from '@/components/salesman/resources/resource-download-button';

interface CategoryResourcesPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

async function CategoryResourcesContent({ categoryId }: { categoryId: string }) {
  const [categoriesResult, resourcesResult] = await Promise.all([
    getSalesResourceCategories(),
    getSalesResources(categoryId),
  ]);

  const categories = categoriesResult.data ?? [];
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  const resources = resourcesResult.data ?? [];

  if (resources.length === 0) {
    return (
      <EmptyState
        icon={File}
        title="No resources yet"
        description="This category doesn't have any resources yet. Check back soon!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource: any) => (
        <Card key={resource.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{resource.title}</CardTitle>
                  {resource.description && (
                    <CardDescription className="line-clamp-2">
                      {resource.description}
                    </CardDescription>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <span>{resource.file_name}</span>
                    <span>•</span>
                    <span>
                      {resource.file_size < 1024
                        ? `${resource.file_size} B`
                        : resource.file_size < 1024 * 1024
                        ? `${(resource.file_size / 1024).toFixed(1)} KB`
                        : `${(resource.file_size / (1024 * 1024)).toFixed(1)} MB`}
                    </span>
                  </div>
                </div>
              </div>
              <ResourceDownloadButton
                filePath={resource.file_path}
                fileName={resource.file_name}
              />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default async function CategoryResourcesPage({ params }: CategoryResourcesPageProps) {
  const { categoryId } = await params;

  const categoriesResult = await getSalesResourceCategories();
  const categories = categoriesResult.data ?? [];
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/salesman/resources" className="hover:text-foreground">
          Resources
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{category.title}</span>
      </div>

      <PageHeader
        title={category.title}
        description={category.description ?? undefined}
      />

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        }
      >
        <CategoryResourcesContent categoryId={categoryId} />
      </Suspense>
    </div>
  );
}
