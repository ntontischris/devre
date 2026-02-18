'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Animation = 'fade-up' | 'fade-in' | 'fade-down' | 'slide-left' | 'slide-right' | 'scale-up';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'span' | 'h1' | 'h2' | 'h3' | 'p';
}

const animationStyles: Record<Animation, { hidden: string; visible: string }> = {
  'fade-up': {
    hidden: 'translate-y-10 opacity-0',
    visible: 'translate-y-0 opacity-100',
  },
  'fade-down': {
    hidden: '-translate-y-10 opacity-0',
    visible: 'translate-y-0 opacity-100',
  },
  'fade-in': {
    hidden: 'opacity-0',
    visible: 'opacity-100',
  },
  'slide-left': {
    hidden: 'translate-x-16 opacity-0',
    visible: 'translate-x-0 opacity-100',
  },
  'slide-right': {
    hidden: '-translate-x-16 opacity-0',
    visible: 'translate-x-0 opacity-100',
  },
  'scale-up': {
    hidden: 'scale-90 opacity-0',
    visible: 'scale-100 opacity-100',
  },
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  className = '',
  threshold = 0.15,
  once = true,
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, prefersReducedMotion]);

  const styles = animationStyles[animation];

  if (prefersReducedMotion) {
    return (
      <Tag ref={ref as any} className={`${styles.visible} ${className}`}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as any}
      className={`transition-all ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isVisible ? styles.visible : styles.hidden} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
