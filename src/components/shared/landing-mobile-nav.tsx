'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './language-switcher';

export function LandingMobileNav() {
  const t = useTranslations('landing');
  const [open, setOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

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
        onClick={() => setOpen(!open)}
        className="lg:hidden relative z-[60] flex flex-col items-center justify-center w-10 h-10 gap-1.5"
        aria-label="Toggle menu"
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
        className={`fixed inset-0 z-50 bg-zinc-950/98 backdrop-blur-xl transition-all duration-500 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_30%,rgba(201,160,51,0.08),transparent)]" />

        <div className="relative h-full flex flex-col items-center justify-center px-8">
          {/* Navigation links — staggered animation */}
          <nav className="flex flex-col items-center gap-2 mb-12">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-3xl sm:text-4xl font-bold text-white/80 hover:text-gold-400 transition-all duration-500 py-2 ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{
                  transitionDelay: open ? `${150 + i * 60}ms` : '0ms',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div
            className={`flex flex-col items-center gap-4 transition-all duration-500 ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: open ? '550ms' : '0ms' }}
          >
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white text-lg"
              >
                {t('nav.clientPortal')}
              </Button>
            </Link>
            <Link href="#contact" onClick={() => setOpen(false)}>
              <Button className="bg-gold-500 hover:bg-gold-400 text-black font-bold text-lg px-8 py-6 h-auto">
                {t('nav.bookCall')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Language switcher at bottom */}
          <div
            className={`absolute bottom-8 transition-all duration-500 ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: open ? '650ms' : '0ms' }}
          >
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}
