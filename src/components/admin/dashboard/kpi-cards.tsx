import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, FileText, AlertCircle, Calendar } from 'lucide-react';

type KPICardsProps = {
  activeProjects: number;
  revenueThisMonth: number;
  pendingInvoicesCount: number;
  pendingInvoicesTotal: number;
  upcomingDeadlines: number;
};

export function KPICards({
  activeProjects,
  revenueThisMonth,
  pendingInvoicesCount,
  pendingInvoicesTotal,
  upcomingDeadlines,
}: KPICardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Link href="/admin/projects">
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In progress across all stages
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/admin/reports">
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueThisMonth)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Paid invoices this month
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/admin/invoices">
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoicesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(pendingInvoicesTotal)} outstanding
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/admin/calendar">
        <Card className="hover:bg-accent transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next 30 days
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
