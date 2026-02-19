import type { ReactNode, CSSProperties } from 'react';

type Animation = 'fade-up' | 'fade-in' | 'fade-down' | 'slide-left' | 'slide-right' | 'scale-up';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'li';
}

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  className = '',
  // threshold and once are kept for API compatibility but unused in the CSS approach
  threshold: _threshold,
  once: _once,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const style: CSSProperties & { '--reveal-delay'?: string; '--reveal-duration'?: string } = {};

  if (delay !== 0) {
    style['--reveal-delay'] = `${delay}ms`;
  }
  if (duration !== 800) {
    style['--reveal-duration'] = `${duration}ms`;
  }

  return (
    <Tag
      data-reveal=""
      data-animation={animation}
      className={className}
      style={Object.keys(style).length > 0 ? (style as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
