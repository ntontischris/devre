import { createClient } from '@/lib/supabase/server';
import { getProjects } from '@/lib/actions/projects';
import { getInvoices } from '@/lib/actions/invoices';
import { getDeliverablesByProject } from '@/lib/actions/deliverables';
import { redirect } from 'next/navigation';
import { ActiveProjects } from '@/components/client/dashboard/active-projects';
import { PendingActions } from '@/components/client/dashboard/pending-actions';
import { RecentDeliverables } from '@/components/client/dashboard/recent-deliverables';
import { UpcomingFilmings } from '@/components/client/dashboard/upcoming-filmings';
import { getTranslations } from 'next-intl/server';

export default async function ClientDashboardPage() {
  const t = await getTranslations('client.dashboard');
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch client's data
  const projectsResult = await getProjects({ client_id: user.id });
  const projects = projectsResult.data ?? [];

  const invoicesResult = await getInvoices({ client_id: user.id });
  const invoices = (invoicesResult.data ?? []) as import('@/types').InvoiceWithRelations[];

  // Get recent deliverables from all projects
  type DeliverableWithProject = {
    project_id: string;
    created_at: string;
    [key: string]: unknown;
  };

  let allDeliverables: DeliverableWithProject[] = [];
  for (const project of projects.slice(0, 5)) {
    const deliverablesResult = await getDeliverablesByProject(project.id);
    if (deliverablesResult.data) {
      allDeliverables = [...allDeliverables, ...deliverablesResult.data.map((d: any) => ({ ...d, project }))];
    }
  }

  // Sort by created_at and take most recent
  const recentDeliverables = allDeliverables
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Active projects (not archived or delivered)
  const activeProjects = projects.filter((p: any) =>
    p.status !== 'archived' && p.status !== 'delivered'
  );

  // Pending invoices (not paid)
  const pendingInvoices = invoices.filter((i: any) =>
    i.status !== 'paid' && i.status !== 'cancelled'
  );

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('description')}
        </p>
      </div>

      {/* Active Projects */}
      <ActiveProjects projects={activeProjects} />

      {/* Pending Actions */}
      <PendingActions
        invoices={pendingInvoices}
        projects={projects}
      />

      {/* Two Column Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Deliverables */}
        <RecentDeliverables deliverables={recentDeliverables as any} />

        {/* Upcoming Filmings */}
        <UpcomingFilmings projects={activeProjects} />
      </div>
    </div>
  );
}
