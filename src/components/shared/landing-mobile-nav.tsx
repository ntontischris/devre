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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Focus trap when overlay is open
  useEffect(() => {
    if (!open || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = overlay.querySelectorAll<HTMLElement>(focusableSelector);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Auto-focus first link
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

  return (
    <>
      {/* Hamburger button — animated lines */}
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

      {/* Full-screen overlay */}
      <div
        ref={overlayRef}
        id="mobile-menu-overlay"
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.mobileMenu')}
        className={`fixed inset-0 z-50 bg-zinc-950/98 backdrop-blur-xl transition-all duration-500 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_30%,rgba(201,160,51,0.08),transparent)]" aria-hidden="true" />

        {/* Scrollable content area — clears nav bar at top, has padding at bottom */}
        <div className="relative h-full flex flex-col items-center justify-between pt-20 pb-6 px-6 sm:px-8 overflow-y-auto">
          {/* Spacer to push nav toward center */}
          <div className="flex-1" />

          {/* Navigation links */}
          <nav aria-label={t('nav.mobileNavigation')}>
            <ul className="flex flex-col items-center gap-1">
              {links.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className={`text-2xl sm:text-3xl font-bold text-white/80 hover:text-gold-400 transition-all py-2 block ${
                      prefersReducedMotion
                        ? 'opacity-100'
                        : `duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`
                    }`}
                    style={prefersReducedMotion ? undefined : {
                      transitionDelay: open ? `${150 + i * 60}ms` : '0ms',
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTAs */}
          <div
            className={`mt-8 flex flex-col items-center gap-3 ${
              prefersReducedMotion
                ? 'opacity-100'
                : `transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`
            }`}
            style={prefersReducedMotion ? undefined : { transitionDelay: open ? '550ms' : '0ms' }}
          >
            <Button asChild variant="ghost" className="text-zinc-400 hover:text-white text-lg h-12">
              <Link href="/login" onClick={close}>
                {t('nav.clientPortal')}
              </Link>
            </Button>
            <Button asChild className="bg-gold-500 hover:bg-gold-400 text-black font-bold text-lg px-8 py-5 h-auto">
              <Link href="#contact" onClick={close}>
                {t('nav.bookCall')}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Spacer + Language switcher at bottom */}
          <div className="flex-1" />
          <div
            className={`${
              prefersReducedMotion
                ? 'opacity-100'
                : `transition-all duration-500 ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`
            }`}
            style={prefersReducedMotion ? undefined : { transitionDelay: open ? '650ms' : '0ms' }}
          >
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}
