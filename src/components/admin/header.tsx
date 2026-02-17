'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from './breadcrumbs';
import { ThemeToggle } from './theme-toggle';
import { NotificationBell } from './notification-bell';
import { UserNav } from './user-nav';
import { MobileNav } from './mobile-nav';
import { LanguageSwitcher } from '@/components/shared/language-switcher';

export function Header() {
  const t = useTranslations('common');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-stone-200 bg-stone-50/80 backdrop-blur-sm dark:bg-zinc-900/80 dark:border-zinc-800 px-4 md:px-6">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileNavOpen(true)}
          aria-label={t('menu')}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumbs */}
        <div className="flex-1">
          <Breadcrumbs />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <NotificationBell />
          <UserNav />
        </div>
      </header>

      {/* Mobile navigation */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
    </>
  );
}
