-- =====================================================================
-- Migration: 00004_indexes_triggers.sql
-- Description: Performance indexes and automated triggers
-- Created: 2026-02-11
-- =====================================================================

-- =====================================================================
-- PART 1: PERFORMANCE INDEXES
-- =====================================================================

-- ---------------------------------------------------------------------
-- CLIENTS INDEXES
-- ---------------------------------------------------------------------

create index idx_clients_user_id on public.clients(user_id);
create index idx_clients_email on public.clients(email);
create index idx_clients_status on public.clients(status);
create index idx_clients_created_at on public.clients(created_at desc);

comment on index idx_clients_user_id is 'Fast lookup for client portal access';
comment on index idx_clients_email is 'Fast email-based client lookup';
comment on index idx_clients_status is 'Filter clients by status';
comment on index idx_clients_created_at is 'Sort clients by creation date';

-- ---------------------------------------------------------------------
-- PROJECTS INDEXES
-- ---------------------------------------------------------------------

create index idx_projects_client_id on public.projects(client_id);
create index idx_projects_status on public.projects(status);
create index idx_projects_priority on public.projects(priority);
create index idx_projects_deadline on public.projects(deadline);
create index idx_projects_created_at on public.projects(created_at desc);

comment on index idx_projects_client_id is 'Fast lookup of client projects';
comment on index idx_projects_status is 'Filter projects by workflow stage';
comment on index idx_projects_priority is 'Filter by priority level';
comment on index idx_projects_deadline is 'Sort and filter by deadline';
comment on index idx_projects_created_at is 'Sort projects by creation date';

-- ---------------------------------------------------------------------
-- TASKS INDEXES
-- ---------------------------------------------------------------------

create index idx_tasks_project_id on public.tasks(project_id);
create index idx_tasks_assigned_to on public.tasks(assigned_to);
create index idx_tasks_status on public.tasks(status);
create index idx_tasks_priority on public.tasks(priority);
create index idx_tasks_due_date on public.tasks(due_date);
create index idx_tasks_sort_order on public.tasks(project_id, sort_order);
create index idx_tasks_created_at on public.tasks(created_at desc);

comment on index idx_tasks_project_id is 'Fast lookup of project tasks';
comment on index idx_tasks_assigned_to is 'Find tasks by assignee';
comment on index idx_tasks_status is 'Filter tasks by status';
comment on index idx_tasks_priority is 'Filter by priority';
comment on index idx_tasks_due_date is 'Sort and filter by due date';
comment on index idx_tasks_sort_order is 'Efficient task ordering within project';
comment on index idx_tasks_created_at is 'Sort tasks by creation date';

-- ---------------------------------------------------------------------
-- DELIVERABLES INDEXES
-- ---------------------------------------------------------------------

create index idx_deliverables_project_id on public.deliverables(project_id);
create index idx_deliverables_uploaded_by on public.deliverables(uploaded_by);
create index idx_deliverables_status on public.deliverables(status);
create index idx_deliverables_created_at on public.deliverables(created_at desc);

comment on index idx_deliverables_project_id is 'Fast lookup of project deliverables';
comment on index idx_deliverables_uploaded_by is 'Find deliverables by uploader';
comment on index idx_deliverables_status is 'Filter by approval status';
comment on index idx_deliverables_created_at is 'Sort by upload date';

-- ---------------------------------------------------------------------
-- VIDEO ANNOTATIONS INDEXES
-- ---------------------------------------------------------------------

create index idx_video_annotations_deliverable_id on public.video_annotations(deliverable_id);
create index idx_video_annotations_user_id on public.video_annotations(user_id);
create index idx_video_annotations_timestamp on public.video_annotations(deliverable_id, timestamp_seconds);
create index idx_video_annotations_resolved on public.video_annotations(deliverable_id, resolved);
create index idx_video_annotations_created_at on public.video_annotations(created_at desc);

comment on index idx_video_annotations_deliverable_id is 'Fast lookup of video annotations';
comment on index idx_video_annotations_user_id is 'Find annotations by user';
comment on index idx_video_annotations_timestamp is 'Sort annotations by timestamp';
comment on index idx_video_annotations_resolved is 'Filter by resolved status';
comment on index idx_video_annotations_created_at is 'Sort by creation date';

-- ---------------------------------------------------------------------
-- INVOICES INDEXES
-- ---------------------------------------------------------------------

create index idx_invoices_invoice_number on public.invoices(invoice_number);
create index idx_invoices_client_id on public.invoices(client_id);
create index idx_invoices_project_id on public.invoices(project_id);
create index idx_invoices_status on public.invoices(status);
create index idx_invoices_issue_date on public.invoices(issue_date desc);
create index idx_invoices_due_date on public.invoices(due_date);
create index idx_invoices_created_at on public.invoices(created_at desc);

comment on index idx_invoices_invoice_number is 'Fast lookup by invoice number';
comment on index idx_invoices_client_id is 'Find invoices by client';
comment on index idx_invoices_project_id is 'Find invoices by project';
comment on index idx_invoices_status is 'Filter by payment status';
comment on index idx_invoices_issue_date is 'Sort by issue date';
comment on index idx_invoices_due_date is 'Find overdue invoices';
comment on index idx_invoices_created_at is 'Sort by creation date';

-- ---------------------------------------------------------------------
-- EXPENSES INDEXES
-- ---------------------------------------------------------------------

create index idx_expenses_project_id on public.expenses(project_id);
create index idx_expenses_category on public.expenses(category);
create index idx_expenses_date on public.expenses(date desc);
create index idx_expenses_created_at on public.expenses(created_at desc);

comment on index idx_expenses_project_id is 'Fast lookup of project expenses';
comment on index idx_expenses_category is 'Filter by expense category';
comment on index idx_expenses_date is 'Sort by expense date';
comment on index idx_expenses_created_at is 'Sort by creation date';

-- ---------------------------------------------------------------------
-- MESSAGES INDEXES
-- ---------------------------------------------------------------------

create index idx_messages_project_id on public.messages(project_id);
create index idx_messages_sender_id on public.messages(sender_id);
create index idx_messages_created_at on public.messages(project_id, created_at desc);

comment on index idx_messages_project_id is 'Fast lookup of project messages';
comment on index idx_messages_sender_id is 'Find messages by sender';
comment on index idx_messages_created_at is 'Sort messages chronologically';

-- ---------------------------------------------------------------------
-- CONTRACT TEMPLATES INDEXES
-- ---------------------------------------------------------------------

create index idx_contract_templates_created_at on public.contract_templates(created_at desc);

comment on index idx_contract_templates_created_at is 'Sort templates by creation date';

-- ---------------------------------------------------------------------
-- CONTRACTS INDEXES
-- ---------------------------------------------------------------------

create index idx_contracts_project_id on public.contracts(project_id);
create index idx_contracts_client_id on public.contracts(client_id);
create index idx_contracts_template_id on public.contracts(template_id);
create index idx_contracts_status on public.contracts(status);
create index idx_contracts_created_at on public.contracts(created_at desc);

comment on index idx_contracts_project_id is 'Fast lookup of project contracts';
comment on index idx_contracts_client_id is 'Find contracts by client';
comment on index idx_contracts_template_id is 'Find contracts by template';
comment on index idx_contracts_status is 'Filter by contract status';
comment on index idx_contracts_created_at is 'Sort by creation date';

-- ---------------------------------------------------------------------
-- FILMING REQUESTS INDEXES
-- ---------------------------------------------------------------------

create index idx_filming_requests_client_id on public.filming_requests(client_id);
create index idx_filming_requests_status on public.filming_requests(status);
create index idx_filming_requests_converted_project_id on public.filming_requests(converted_project_id);
create index idx_filming_requests_created_at on public.filming_requests(created_at desc);

comment on index idx_filming_requests_client_id is 'Fast lookup of client requests';
comment on index idx_filming_requests_status is 'Filter by request status';
comment on index idx_filming_requests_converted_project_id is 'Track converted requests';
comment on index idx_filming_requests_created_at is 'Sort by submission date';

-- ---------------------------------------------------------------------
-- EQUIPMENT LISTS INDEXES
-- ---------------------------------------------------------------------

create index idx_equipment_lists_project_id on public.equipment_lists(project_id);
create index idx_equipment_lists_created_at on public.equipment_lists(created_at desc);

comment on index idx_equipment_lists_project_id is 'Fast lookup of project equipment lists';
comment on index idx_equipment_lists_created_at is 'Sort by creation date';

-- ---------------------------------------------------------------------
-- SHOT LISTS INDEXES
-- ---------------------------------------------------------------------

create index idx_shot_lists_project_id on public.shot_lists(project_id);
create index idx_shot_lists_created_at on public.shot_lists(created_at desc);

comment on index idx_shot_lists_project_id is 'Fast lookup of project shot lists';
comment on index idx_shot_lists_created_at is 'Sort by creation date';

-- ---------------------------------------------------------------------
-- CONCEPT NOTES INDEXES
-- ---------------------------------------------------------------------

create index idx_concept_notes_project_id on public.concept_notes(project_id);
create index idx_concept_notes_created_at on public.concept_notes(created_at desc);

comment on index idx_concept_notes_project_id is 'Fast lookup of project concept notes';
comment on index idx_concept_notes_created_at is 'Sort by creation date';

-- =====================================================================
-- PART 2: AUTOMATED TRIGGERS
-- =====================================================================

-- ---------------------------------------------------------------------
-- TRIGGER FUNCTION: UPDATE TIMESTAMP
-- ---------------------------------------------------------------------
-- Automatically updates updated_at column to current timestamp on row update

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.update_updated_at_column is 'Automatically updates updated_at timestamp on row update';

-- ---------------------------------------------------------------------
-- APPLY UPDATE TRIGGERS TO ALL TABLES WITH updated_at
-- ---------------------------------------------------------------------

-- Clients table
create trigger update_clients_updated_at
  before update on public.clients
  for each row
  execute function public.update_updated_at_column();

-- Projects table
create trigger update_projects_updated_at
  before update on public.projects
  for each row
  execute function public.update_updated_at_column();

-- Tasks table
create trigger update_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.update_updated_at_column();

-- Invoices table
create trigger update_invoices_updated_at
  before update on public.invoices
  for each row
  execute function public.update_updated_at_column();

-- Equipment lists table
create trigger update_equipment_lists_updated_at
  before update on public.equipment_lists
  for each row
  execute function public.update_updated_at_column();

-- Shot lists table
create trigger update_shot_lists_updated_at
  before update on public.shot_lists
  for each row
  execute function public.update_updated_at_column();

-- Concept notes table
create trigger update_concept_notes_updated_at
  before update on public.concept_notes
  for each row
  execute function public.update_updated_at_column();

-- =====================================================================
-- END OF MIGRATION
-- =====================================================================
