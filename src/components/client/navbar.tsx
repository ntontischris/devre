'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, LayoutDashboard, FolderKanban, Receipt, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserNav } from './user-nav';
import { MobileNav } from './mobile-nav';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

const navLinks = [
  {
    href: '/client/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/client/projects',
    label: 'Projects',
    icon: FolderKanban,
  },
  {
    href: '/client/invoices',
    label: 'Invoices',
    icon: Receipt,
  },
  {
    href: '/client/book',
    label: 'Book Filming',
    icon: Video,
  },
];

export function ClientNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Logo */}
        <Link href="/client/dashboard" className="flex items-center font-bold text-xl mr-6">
          DMS
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        navLinks={navLinks}
      />
    </header>
  );
}
