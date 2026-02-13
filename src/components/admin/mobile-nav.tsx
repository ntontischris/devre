'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  CalendarDays,
  Film,
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const NAV_ITEMS = [
  {
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/admin/clients',
    icon: Users,
    label: 'Clients',
  },
  {
    href: '/admin/projects',
    icon: FolderKanban,
    label: 'Projects',
  },
  {
    href: '/admin/invoices',
    icon: Receipt,
    label: 'Invoices',
  },
  {
    href: '/admin/calendar',
    icon: CalendarDays,
    label: 'Calendar',
  },
  {
    href: '/admin/filming-prep',
    icon: Film,
    label: 'Filming Prep',
  },
  {
    href: '/admin/contracts',
    icon: FileText,
    label: 'Contracts',
  },
  {
    href: '/admin/reports',
    icon: BarChart3,
    label: 'Reports',
  },
  {
    href: '/admin/messages',
    icon: MessageSquare,
    label: 'Messages',
  },
  {
    href: '/admin/settings',
    icon: Settings,
    label: 'Settings',
  },
];

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="h-16 flex items-center justify-center border-b px-4">
          <SheetTitle className="font-bold text-xl tracking-tight">
            DMS
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-3',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                )}
                onClick={handleNavClick}
              >
                <Link href={item.href}>
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
