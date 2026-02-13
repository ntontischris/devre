import { cn } from '@/lib/utils';

interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
}

export function CurrencyDisplay({
  amount,
  currency = 'EUR',
  className,
}: CurrencyDisplayProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return <span className={cn(className)}>{formatted}</span>;
}
