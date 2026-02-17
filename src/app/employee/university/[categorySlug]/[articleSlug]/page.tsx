import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { getKbCategoryBySlug } from '@/lib/actions/kb-categories';
import { getKbArticleBySlug } from '@/lib/actions/kb-articles';
import { sanitizeHtml } from '@/lib/sanitize';

interface ArticlePageProps {
  params: Promise<{
    categorySlug: string;
    articleSlug: string;
  }>;
}

// Helper to extract video ID from YouTube URL
function getYouTubeEmbedUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
}

// Helper to extract video ID from Vimeo URL
function getVimeoEmbedUrl(url: string): string | null {
  const regExp = /vimeo.com\/(\d+)/;
  const match = url.match(regExp);
  if (match) {
    return `https://player.vimeo.com/video/${match[1]}`;
  }
  return null;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { categorySlug, articleSlug } = await params;

  const categoryResult = await getKbCategoryBySlug(categorySlug);
  if (categoryResult.error || !categoryResult.data) {
    notFound();
  }

  const category = categoryResult.data as import('@/types').KbCategory;

  const articleResult = await getKbArticleBySlug(articleSlug);
  if (articleResult.error || !articleResult.data) {
    notFound();
  }

  const article = articleResult.data as import('@/types').KbArticle & { category: { slug: string } };

  // Ensure article belongs to this category
  if (article.category.slug !== categorySlug) {
    notFound();
  }

  // Only show published articles to employees
  if (!article.published) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/employee/university" className="hover:text-foreground">
          DMS University
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/employee/university/${categorySlug}`}
          className="hover:text-foreground"
        >
          {category.title}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{article.title}</span>
      </div>

      <PageHeader title={article.title} description={article.summary ?? undefined} />

      <div className="max-w-4xl">
        {/* Article Content */}
        <div
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
        />

        {/* Video Embeds */}
        {article.video_urls && article.video_urls.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Videos</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {article.video_urls.map((url: string, index: number) => {
                const youtubeUrl = getYouTubeEmbedUrl(url);
                const vimeoUrl = getVimeoEmbedUrl(url);
                const embedUrl = youtubeUrl || vimeoUrl;

                if (!embedUrl) return null;

                return (
                  <div key={index} className="aspect-video">
                    <iframe
                      src={embedUrl}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
