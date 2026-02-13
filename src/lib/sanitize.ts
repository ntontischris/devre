import DOMPurify from 'dompurify';

export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: strip all HTML tags as a safe fallback
    return dirty.replace(/<[^>]*>/g, '');
  }
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'span', 'div',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'style', 'target', 'rel'],
  });
}
