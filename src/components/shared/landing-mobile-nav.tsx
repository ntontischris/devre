'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';

export function LandingMobileNav() {
  const t = useTranslations('landing');
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = overlay.querySelectorAll<HTMLElement>(focusableSelector);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const links = [
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#portfolio', label: t('nav.portfolio') },
    { href: '#team', label: t('nav.team') },
    { href: '#pricing', label: t('nav.pricing') },
    { href: '#contact', label: t('nav.contact') },
  ];

  const itemAnim = prefersReducedMotion
    ? 'opacity-100'
    : `transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
      }`;

  const itemStyle = (delay: number) =>
    prefersReducedMotion ? undefined : { transitionDelay: open ? `${delay}ms` : '0ms' };

  return (
    <>
      {/* Hamburger */}
      <button
        ref={hamburgerRef}
        onClick={() => setOpen(!open)}
        className="lg:hidden relative z-[60] flex flex-col items-center justify-center w-12 h-12 gap-1.5"
        aria-expanded={open}
        aria-controls="mobile-menu-overlay"
        aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
      >
        <span
          className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
            open ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
            open ? 'opacity-0 scale-0' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
            open ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Full-screen overlay — z-[55] sits above nav bar (z-50), bg is always opaque */}
      <div
        ref={overlayRef}
        id="mobile-menu-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.mobileMenu')}
        className={`fixed inset-0 z-[55] transition-[visibility] ${
          open ? 'visible' : 'invisible delay-500'
        }`}
      >
        {/* Solid opaque background — no opacity fade, uses transform to reveal */}
        <div
          className={`absolute inset-0 bg-[#09090b] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
            open ? 'scale-y-100' : 'scale-y-0'
          }`}
        />

        {/* Ambient gold glow (on top of solid bg) */}
        <div
          className={`absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(201,160,51,0.1),transparent)] transition-opacity duration-700 delay-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between px-8 sm:px-12 pt-24 pb-8">
          {/* Navigation links */}
          <nav aria-label={t('nav.mobileNavigation')} className="flex-1 flex flex-col justify-center">
            <ul className="flex flex-col">
              {links.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className={`group flex items-center gap-3 py-2.5 ${itemAnim}`}
                    style={itemStyle(200 + i * 50)}
                  >
                    <span className="text-gold-500/40 text-[10px] font-mono tabular-nums group-hover:text-gold-500 transition-colors">
                      0{i + 1}
                    </span>
                    <span className="text-2xl font-black text-white/90 group-hover:text-gold-400 transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom bar */}
          <div className={`flex items-center justify-between gap-2 ${itemAnim}`} style={itemStyle(550)}>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="text-zinc-400 hover:text-white text-sm h-12 px-3">
                <Link href="/login" onClick={close}>
                  {t('nav.clientPortal')}
                </Link>
              </Button>
              <Button asChild className="bg-gold-500 hover:bg-gold-400 text-black font-bold text-sm h-12 px-5">
                <Link href="#contact" onClick={close}>
                  {t('nav.bookCall')}
                  <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}
