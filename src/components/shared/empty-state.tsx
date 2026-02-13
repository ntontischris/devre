import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[200px] sm:min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-4 sm:p-8 text-center',
        className
      )}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <Icon className="h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
        {action && (
          <Button onClick={action.onClick} className="mt-6">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
