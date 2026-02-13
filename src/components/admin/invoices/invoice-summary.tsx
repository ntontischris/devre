import { Separator } from '@/components/ui/separator';

interface InvoiceSummaryProps {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency?: string;
}

const formatCurrency = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('el-GR', { style: 'currency', currency }).format(amount);
};

export function InvoiceSummary({ subtotal, taxRate, taxAmount, total, currency = 'EUR' }: InvoiceSummaryProps) {
  return (
    <div className="ml-auto max-w-xs space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">{formatCurrency(subtotal, currency)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">ΦΠΑ ({taxRate}%)</span>
        <span className="font-medium">{formatCurrency(taxAmount, currency)}</span>
      </div>
      <Separator />
      <div className="flex justify-between text-base font-bold">
        <span>Total</span>
        <span>{formatCurrency(total, currency)}</span>
      </div>
    </div>
  );
}
