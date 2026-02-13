'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LucideIcon } from 'lucide-react';

interface SidebarNavProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

export function SidebarNav({
  href,
  icon: Icon,
  label,
  isActive,
  isCollapsed,
}: SidebarNavProps) {
  const navButton = (
    <Button
      asChild
      variant="ghost"
      className={cn(
        'w-full justify-start gap-3 transition-colors',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground',
        isCollapsed ? 'px-2 justify-center' : 'px-4'
      )}
    >
      <Link href={href}>
        <Icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span className="flex-1 text-left">{label}</span>}
      </Link>
    </Button>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{navButton}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return navButton;
}
