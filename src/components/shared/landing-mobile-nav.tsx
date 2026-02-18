'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  const anim = (isOpen: boolean, delay: number) =>
    prefersReducedMotion
      ? 'opacity-100'
      : `transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`;

  const animStyle = (delay: number) =>
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
          className={`block h-0.5 w-6 bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? 'opacity-0 scale-0' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
        className={`fixed inset-0 z-50 bg-zinc-950 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Ambient gold glow */}
        <div
          className={`absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(201,160,51,0.1),transparent)] transition-opacity duration-1000 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative h-full flex flex-col pt-20 pb-8 px-8 sm:px-12 overflow-y-auto">
          {/* Logo area — top left, fades in */}
          <div className={anim(open, 100)} style={animStyle(100)}>
            <Link href="/" onClick={close} className="flex items-center gap-2.5">
              <Image
                src="/images/LOGO_WhiteLetter.png"
                alt=""
                width={28}
                height={28}
                className="w-7 h-7 object-contain"
              />
              <span className="text-white/60 font-bold text-sm tracking-tight">DEVRE MEDIA</span>
            </Link>
          </div>

          {/* Gold accent line */}
          <div
            className={`mt-6 mb-8 h-px bg-gradient-to-r from-gold-500/30 to-transparent transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open ? 'w-16 opacity-100' : 'w-0 opacity-0'
            }`}
            style={prefersReducedMotion ? undefined : { transitionDelay: open ? '200ms' : '0ms' }}
            aria-hidden="true"
          />

          {/* Navigation links — left-aligned, large, staggered */}
          <nav aria-label={t('nav.mobileNavigation')} className="flex-1 flex flex-col justify-center">
            <ul className="flex flex-col gap-1">
              {links.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className={`group flex items-center gap-4 py-3 ${anim(open, 250 + i * 70)}`}
                    style={animStyle(250 + i * 70)}
                  >
                    <span className="text-gold-500/40 text-xs font-mono tabular-nums group-hover:text-gold-500 transition-colors">
                      0{i + 1}
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-white/90 group-hover:text-gold-400 transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom section — CTAs + Language */}
          <div className="mt-auto space-y-5">
            {/* Gold accent line */}
            <div
              className={`h-px bg-gradient-to-r from-gold-500/20 to-transparent transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                open ? 'w-full opacity-100' : 'w-0 opacity-0'
              }`}
              style={prefersReducedMotion ? undefined : { transitionDelay: open ? '700ms' : '0ms' }}
              aria-hidden="true"
            />

            <div className={`flex items-center justify-between ${anim(open, 750)}`} style={animStyle(750)}>
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" className="text-zinc-400 hover:text-white text-sm h-12 px-4">
                  <Link href="/login" onClick={close}>
                    {t('nav.clientPortal')}
                  </Link>
                </Button>
                <Button asChild className="bg-gold-500 hover:bg-gold-400 text-black font-bold text-sm h-12 px-6">
                  <Link href="#contact" onClick={close}>
                    {t('nav.bookCall')}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
