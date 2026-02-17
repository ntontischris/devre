'use client';

import { sanitizeHtml } from '@/lib/sanitize';

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

interface ArticleContentProps {
  content: string;
  videoUrls?: string[];
}

export function ArticleContent({ content, videoUrls }: ArticleContentProps) {
  return (
    <>
      <div
        className="prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />

      {videoUrls && videoUrls.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Videos</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {videoUrls.map((url, index) => {
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
    </>
  );
}
