-- =====================================================================
-- Migration: 00003_rls_policies.sql
-- Description: Row Level Security policies for all core tables
-- Created: 2026-02-11
-- =====================================================================

-- =====================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================================

alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.deliverables enable row level security;
alter table public.video_annotations enable row level security;
alter table public.invoices enable row level security;
alter table public.expenses enable row level security;
alter table public.messages enable row level security;
alter table public.contract_templates enable row level security;
alter table public.contracts enable row level security;
alter table public.filming_requests enable row level security;
alter table public.equipment_lists enable row level security;
alter table public.shot_lists enable row level security;
alter table public.concept_notes enable row level security;

-- =====================================================================
-- CLIENTS POLICIES
-- =====================================================================

-- Admins: full access to all clients
create policy "Admins full access to clients"
  on public.clients for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Clients: can view their own record
create policy "Clients can view own record"
  on public.clients for select
  using (user_id = auth.uid());

-- =====================================================================
-- PROJECTS POLICIES
-- =====================================================================

-- Admins: full access to all projects
create policy "Admins full access to projects"
  on public.projects for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Clients: can view projects associated with their client record
create policy "Clients can view own projects"
  on public.projects for select
  using (
    exists (
      select 1 from public.clients
      where clients.id = projects.client_id
      and clients.user_id = auth.uid()
    )
  );

-- =====================================================================
-- TASKS POLICIES
-- =====================================================================

-- Admins: full access to all tasks
create policy "Admins full access to tasks"
  on public.tasks for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Note: Clients have no access to tasks (admin-only)

-- =====================================================================
-- DELIVERABLES POLICIES
-- =====================================================================

-- Admins: full access to all deliverables
create policy "Admins full access to deliverables"
  on public.deliverables for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Clients: can view deliverables for their projects
create policy "Clients can view own deliverables"
  on public.deliverables for select
  using (
    exists (
      select 1 from public.projects p
      join public.clients c on c.id = p.client_id
      where p.id = deliverables.project_id
      and c.user_id = auth.uid()
    )
  );

-- =====================================================================
-- VIDEO ANNOTATIONS POLICIES
-- =====================================================================

-- Admins: full access to all video annotations
create policy "Admins full access to video annotations"
  on public.video_annotations for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Clients: can view annotations for their project deliverables
create policy "Clients can view own video annotations"
  on public.video_annotations for select
  using (
    exists (
      select 1 from public.deliverables d
      join public.projects p on p.id = d.project_id
      join public.clients c on c.id = p.client_id
      where d.id = video_annotations.deliverable_id
      and c.user_id = auth.uid()
    )
  );

-- Clients: can create annotations on their project deliverables
create policy "Clients can create video annotations"
  on public.video_annotations for insert
  with check (
    exists (
      select 1 from public.deliverables d
      join public.projects p on p.id = d.project_id
      join public.clients c on c.id = p.client_id
      where d.id = video_annotations.deliverable_id
      and c.user_id = auth.uid()
    )
    and user_id = auth.uid()
  );

-- =====================================================================
-- INVOICES POLICIES
-- =====================================================================

-- Admins: full access to all invoices
create policy "Admins full access to invoices"
  on public.invoices for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Clients: can view their own invoices
create policy "Clients can view own invoices"
  on public.invoices for select
  using (
    exists (
      select 1 from public.clients
      where clients.id = invoices.client_id
      and clients.user_id = auth.uid()
    )
  );

-- =====================================================================
-- EXPENSES POLICIES
-- =====================================================================

-- Admins: full access to all expenses
create policy "Admins full access to expenses"
  on public.expenses for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Note: Clients have no access to expenses (admin-only)

-- =====================================================================
-- MESSAGES POLICIES
-- =====================================================================

-- Admins: full access to all messages
create policy "Admins full access to messages"
  on public.messages for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Clients: can view messages for their projects
create policy "Clients can view project messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.projects p
      join public.clients c on c.id = p.client_id
      where p.id = messages.project_id
      and c.user_id = auth.uid()
    )
  );

-- Clients: can create messages for their projects
create policy "Clients can create project messages"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.projects p
      join public.clients c on c.id = p.client_id
      where p.id = messages.project_id
      and c.user_id = auth.uid()
    )
    and sender_id = auth.uid()
  );

-- =====================================================================
-- CONTRACT TEMPLATES POLICIES
-- =====================================================================

-- Admins: full access to contract templates
create policy "Admins full access to contract templates"
  on public.contract_templates for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Note: Clients have no access to contract templates (admin-only)

-- =====================================================================
-- CONTRACTS POLICIES
-- =====================================================================

-- Admins: full access to all contracts
create policy "Admins full access to contracts"
  on public.contracts for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Clients: can view their own contracts
create policy "Clients can view own contracts"
  on public.contracts for select
  using (
    exists (
      select 1 from public.clients
      where clients.id = contracts.client_id
      and clients.user_id = auth.uid()
    )
  );

-- Clients: can update their own contracts (for signing)
create policy "Clients can update own contracts"
  on public.contracts for update
  using (
    exists (
      select 1 from public.clients
      where clients.id = contracts.client_id
      and clients.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.clients
      where clients.id = contracts.client_id
      and clients.user_id = auth.uid()
    )
  );

-- =====================================================================
-- FILMING REQUESTS POLICIES
-- =====================================================================

-- Admins: full access to all filming requests
create policy "Admins full access to filming requests"
  on public.filming_requests for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Clients: can view their own filming requests
create policy "Clients can view own filming requests"
  on public.filming_requests for select
  using (
    exists (
      select 1 from public.clients
      where clients.id = filming_requests.client_id
      and clients.user_id = auth.uid()
    )
  );

-- Clients: can create new filming requests
create policy "Clients can create filming requests"
  on public.filming_requests for insert
  with check (
    exists (
      select 1 from public.clients
      where clients.id = filming_requests.client_id
      and clients.user_id = auth.uid()
    )
  );

-- =====================================================================
-- EQUIPMENT LISTS POLICIES
-- =====================================================================

-- Admins: full access to equipment lists
create policy "Admins full access to equipment lists"
  on public.equipment_lists for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Note: Clients have no access to equipment lists (admin-only)

-- =====================================================================
-- SHOT LISTS POLICIES
-- =====================================================================

-- Admins: full access to shot lists
create policy "Admins full access to shot lists"
  on public.shot_lists for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Note: Clients have no access to shot lists (admin-only)

-- =====================================================================
-- CONCEPT NOTES POLICIES
-- =====================================================================

-- Admins: full access to concept notes
create policy "Admins full access to concept notes"
  on public.concept_notes for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Note: Clients have no access to concept notes (admin-only)

-- =====================================================================
-- END OF MIGRATION
-- =====================================================================
