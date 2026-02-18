import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingMobileNav } from '@/components/shared/landing-mobile-nav';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { NAV_LINKS } from './constants';

export async function LandingNav() {
  const t = await getTranslations('landing');

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/60 backdrop-blur-2xl border-b border-white/[0.04]"
      aria-label={t('nav.mainNavigation')}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity"
            aria-label="Devre Media - Home"
          >
            <Image
              src="/images/LOGO_WhiteLetter.png"
              alt=""
              width={36}
              height={36}
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
            <span className="hidden sm:block text-white font-bold text-lg tracking-tight">
              DEVRE MEDIA
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-zinc-400 hover:text-white transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-sm"
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-white/5 text-[13px]"
              >
                {t('nav.clientPortal')}
              </Button>
            </Link>
            <Link href="#contact" className="hidden md:block">
              <Button
                size="sm"
                className="bg-gold-500 hover:bg-gold-400 text-black font-semibold text-[13px]"
              >
                {t('nav.bookCall')}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </Link>
            <div className="lg:hidden">
              <LandingMobileNav />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
