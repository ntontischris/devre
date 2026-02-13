import { PageHeader } from '@/components/shared/page-header';
import { DateRangeFilter } from '@/components/admin/reports/date-range-filter';
import { RevenueReport } from '@/components/admin/reports/revenue-report';
import { ProjectReport } from '@/components/admin/reports/project-report';
import { ClientReport } from '@/components/admin/reports/client-report';
import { ExpenseReport } from '@/components/admin/reports/expense-report';
import {
  getMonthlyRevenue,
  getPaymentMethodBreakdown,
  getProjectTypeBreakdown,
  getTopClientsByRevenue,
  getExpensesByCategory,
  getProfitMargin,
  getAverageProjectDuration,
} from '@/lib/queries/reports';
import { getProjectsByStatus } from '@/lib/queries';
import type { DateRange } from '@/lib/queries/reports';

type SearchParams = Promise<{
  from?: string;
  to?: string;
}>;

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const dateRange: DateRange | undefined =
    params.from && params.to
      ? { from: params.from, to: params.to }
      : undefined;

  const [
    monthlyRevenue,
    paymentMethodData,
    projectsByStatus,
    projectsByType,
    topClients,
    expensesByCategory,
    profitData,
    averageDuration,
  ] = await Promise.all([
    getMonthlyRevenue(dateRange),
    getPaymentMethodBreakdown(dateRange),
    getProjectsByStatus(),
    getProjectTypeBreakdown(dateRange),
    getTopClientsByRevenue(10, dateRange),
    getExpensesByCategory(dateRange),
    getProfitMargin(dateRange),
    getAverageProjectDuration(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive business insights and analytics"
      />

      <DateRangeFilter />

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Revenue Analysis</h2>
          <RevenueReport
            monthlyData={monthlyRevenue}
            paymentMethodData={paymentMethodData}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Project Analysis</h2>
          <ProjectReport
            projectsByStatus={projectsByStatus}
            projectsByType={projectsByType}
            averageDuration={averageDuration}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Client Analysis</h2>
          <ClientReport topClients={topClients} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Expense & Profit Analysis</h2>
          <ExpenseReport
            expensesByCategory={expensesByCategory}
            profitData={profitData}
          />
        </div>
      </div>
    </div>
  );
}
