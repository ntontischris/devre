import { getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/shared/page-header';
import { KPICards } from '@/components/admin/dashboard/kpi-cards';
import { RevenueChart } from '@/components/admin/dashboard/revenue-chart';
import { ActivityFeed } from '@/components/admin/dashboard/activity-feed';
import { PendingActions } from '@/components/admin/dashboard/pending-actions';
import { ProjectStatusChart } from '@/components/admin/dashboard/project-status-chart';
import { TodayTasks } from '@/components/admin/dashboard/today-tasks';
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
import type { ActivityLogWithUser } from '@/types';

type PendingAction = {
  type: 'invoice' | 'deliverable' | 'contract';
  id: string;
  title: string;
  subtitle: string;
  daysOverdue?: number;
};

async function getPendingActions(t: (key: string) => string): Promise<PendingAction[]> {
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
          title: `${t('invoice')} ${inv.invoice_number}`,
          subtitle: `${(inv.client as { contact_name?: string } | null)?.contact_name || t('unknown')} — €${inv.total?.toFixed(2)}`,
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
          subtitle: `${t('awaitingSignature')} ${(c.client as { contact_name?: string } | null)?.contact_name || t('client')}`,
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
          subtitle: `${t('project')}: ${(d.project as { title?: string } | null)?.title || t('unknown')}`,
        });
      }
    }

    return actions;
  } catch (error) {
    console.error('Failed to fetch pending actions:', error);
    return [];
  }
}

async function getTodayTasks() {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, status, priority, due_date, project_id, project:projects!inner(title), assigned_user:user_profiles!tasks_assigned_to_fkey(display_name)')
      .or(`due_date.eq.${today},and(due_date.lt.${today},status.neq.done)`)
      .neq('status', 'done')
      .order('due_date', { ascending: true })
      .limit(10);

    if (error) return [];

    // Transform data to match expected type
    return (data ?? []).map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      project_id: task.project_id,
      project: Array.isArray(task.project) ? task.project[0] : task.project,
      assigned_user: Array.isArray(task.assigned_user) ? task.assigned_user[0] : task.assigned_user,
    }));
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const t = await getTranslations('dashboard');

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
    todayTasks,
  ] = await Promise.all([
    getProjectCount(),
    getRevenueThisMonth(),
    getPendingInvoiceCount(),
    getPendingInvoiceTotal(),
    getUpcomingDeadlines(30).then((deadlines) => deadlines.length),
    getRecentActivity(10),
    getProjectsByStatus(),
    getMonthlyRevenue().then((data) => data.slice(-6)), // Last 6 months
    getPendingActions(t),
    getTodayTasks(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
      />

      <KPICards
        activeProjects={activeProjects}
        revenueThisMonth={revenueThisMonth}
        pendingInvoicesCount={pendingInvoicesCount}
        pendingInvoicesTotal={pendingInvoicesTotal}
        upcomingDeadlines={upcomingDeadlines}
      />

      <TodayTasks tasks={todayTasks} />

      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart data={monthlyRevenueData} />
        <ProjectStatusChart data={projectsByStatus} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ActivityFeed activities={recentActivity as ActivityLogWithUser[]} />
        <PendingActions actions={pendingActions} />
      </div>
    </div>
  );
}
