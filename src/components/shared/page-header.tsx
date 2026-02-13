import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="space-y-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{title}</h1>
        {description && (
          <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">{children}</div>}
    </div>
  );
}
