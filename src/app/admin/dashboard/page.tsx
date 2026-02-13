import { PageHeader } from '@/components/shared/page-header';
import { KPICards } from '@/components/admin/dashboard/kpi-cards';
import { RevenueChart } from '@/components/admin/dashboard/revenue-chart';
import { ActivityFeed } from '@/components/admin/dashboard/activity-feed';
import { PendingActions } from '@/components/admin/dashboard/pending-actions';
import { ProjectStatusChart } from '@/components/admin/dashboard/project-status-chart';
import {
  getProjectCount,
  getPendingInvoiceCount,
  getRecentActivity,
  getUpcomingDeadlines,
  getProjectsByStatus,
} from '@/lib/queries';
import {
  getMonthlyRevenue,
  getRevenueThisMonth,
  getPendingInvoiceTotal,
} from '@/lib/queries/reports';
import { createClient } from '@/lib/supabase/server';

type PendingAction = {
  type: 'invoice' | 'deliverable' | 'contract';
  id: string;
  title: string;
  subtitle: string;
  daysOverdue?: number;
};

async function getPendingActions(): Promise<PendingAction[]> {
  try {
    const supabase = await createClient();
    const actions: PendingAction[] = [];
    const today = new Date();

    // Pending/overdue invoices
    const { data: invoices } = await supabase
      .from('invoices')
      .select('id, invoice_number, total, due_date, status, client:clients(contact_name)')
      .in('status', ['sent', 'viewed', 'overdue'])
      .order('due_date', { ascending: true })
      .limit(5);

    if (invoices) {
      for (const inv of invoices) {
        const dueDate = new Date(inv.due_date);
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        actions.push({
          type: 'invoice',
          id: inv.id,
          title: `Invoice ${inv.invoice_number}`,
          subtitle: `${(inv.client as any)?.contact_name || 'Unknown'} — €${inv.total?.toFixed(2)}`,
          daysOverdue: daysOverdue > 0 ? daysOverdue : undefined,
        });
      }
    }

    // Unsigned contracts (sent but not signed)
    const { data: contracts } = await supabase
      .from('contracts')
      .select('id, title, client:clients(contact_name)')
      .in('status', ['sent', 'viewed'])
      .order('created_at', { ascending: true })
      .limit(5);

    if (contracts) {
      for (const c of contracts) {
        actions.push({
          type: 'contract',
          id: c.id,
          title: c.title,
          subtitle: `Awaiting signature from ${(c.client as any)?.contact_name || 'client'}`,
        });
      }
    }

    // Deliverables pending review
    const { data: deliverables } = await supabase
      .from('deliverables')
      .select('id, title, project_id, project:projects(title)')
      .eq('status', 'pending_review')
      .order('created_at', { ascending: true })
      .limit(5);

    if (deliverables) {
      for (const d of deliverables) {
        actions.push({
          type: 'deliverable',
          id: d.project_id,
          title: d.title,
          subtitle: `Project: ${(d.project as any)?.title || 'Unknown'}`,
        });
      }
    }

    return actions;
  } catch (error) {
    console.error('Failed to fetch pending actions:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const [
    activeProjects,
    revenueThisMonth,
    pendingInvoicesCount,
    pendingInvoicesTotal,
    upcomingDeadlines,
    recentActivity,
    projectsByStatus,
    monthlyRevenueData,
    pendingActions,
  ] = await Promise.all([
    getProjectCount(),
    getRevenueThisMonth(),
    getPendingInvoiceCount(),
    getPendingInvoiceTotal(),
    getUpcomingDeadlines(30).then((deadlines) => deadlines.length),
    getRecentActivity(10),
    getProjectsByStatus(),
    getMonthlyRevenue().then((data) => data.slice(-6)), // Last 6 months
    getPendingActions(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome to the Devre Media System admin panel"
      />

      <KPICards
        activeProjects={activeProjects}
        revenueThisMonth={revenueThisMonth}
        pendingInvoicesCount={pendingInvoicesCount}
        pendingInvoicesTotal={pendingInvoicesTotal}
        upcomingDeadlines={upcomingDeadlines}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart data={monthlyRevenueData} />
        <ProjectStatusChart data={projectsByStatus} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActivityFeed activities={recentActivity} />
        <PendingActions actions={pendingActions} />
      </div>
    </div>
  );
}
