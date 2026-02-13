'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  CalendarDays,
  Film,
  FileText,
  BarChart3,
  Video,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SidebarNav } from './sidebar-nav';

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
    href: '/admin/filming-requests',
    icon: Video,
    label: 'Filming Requests',
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
    href: '/admin/settings',
    icon: Settings,
    label: 'Settings',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('admin-sidebar-collapsed');
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem('admin-sidebar-collapsed', String(newValue));
      return newValue;
    });
  };

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b px-4">
        <div className="font-bold text-xl tracking-tight">
          {isCollapsed ? 'D' : 'DMS'}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <SidebarNav
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Toggle Button */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="w-full"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}
