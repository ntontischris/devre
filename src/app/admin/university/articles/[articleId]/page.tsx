import { notFound } from 'next/navigation';
import { getKbArticle } from '@/lib/actions/kb-articles';
import type { KbArticle } from '@/types';
import { ArticlePreview } from './article-preview';

interface ArticlePreviewPageProps {
  params: Promise<{
    articleId: string;
  }>;
}

export default async function ArticlePreviewPage({ params }: ArticlePreviewPageProps) {
  const { articleId } = await params;

  const result = await getKbArticle(articleId);
  if (result.error || !result.data) {
    notFound();
  }

  const article = result.data as KbArticle & { category: { title: string; slug: string } };

  return <ArticlePreview article={article} />;
}
