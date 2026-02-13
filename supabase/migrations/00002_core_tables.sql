-- =====================================================================
-- Migration: 00002_core_tables.sql
-- Description: Core business tables for Devre Media System
-- Created: 2026-02-11
-- =====================================================================

-- =====================================================================
-- 1. CLIENTS TABLE
-- =====================================================================
-- Client management with optional link to auth.users for client portal access

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  company_name text,
  contact_name text not null,
  email text not null unique,
  phone text,
  address text,
  vat_number text,
  avatar_url text,
  notes text,
  status text default 'active' check (status in ('active', 'inactive', 'lead')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.clients is 'Client companies and contacts';
comment on column public.clients.user_id is 'Optional link to auth.users for client portal access';
comment on column public.clients.status is 'Client status: active, inactive, or lead';
comment on column public.clients.notes is 'Internal admin notes (not visible to client)';

-- =====================================================================
-- 2. PROJECTS TABLE
-- =====================================================================
-- Core project management with workflow stages

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  title text not null,
  description text,
  project_type text check (project_type in (
    'corporate_video', 'event_coverage', 'social_media_content',
    'commercial', 'documentary', 'music_video', 'other'
  )),
  status text default 'briefing' check (status in (
    'briefing', 'pre_production', 'filming', 'editing',
    'review', 'revisions', 'delivered', 'archived'
  )),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  start_date date,
  deadline date,
  budget numeric(10,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.projects is 'Client projects with workflow tracking';
comment on column public.projects.project_type is 'Type of video production';
comment on column public.projects.status is 'Current workflow stage';
comment on column public.projects.priority is 'Project priority level';

-- =====================================================================
-- 3. TASKS TABLE
-- =====================================================================
-- Task management per project

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  assigned_to uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  status text default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date date,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.tasks is 'Project tasks with assignment and tracking';
comment on column public.tasks.sort_order is 'Display order within project';
comment on column public.tasks.assigned_to is 'Team member assigned to this task';

-- =====================================================================
-- 4. DELIVERABLES TABLE
-- =====================================================================
-- Video files and deliverable tracking with approval workflow

create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  description text,
  file_path text not null,
  file_size bigint,
  file_type text,
  version integer default 1,
  status text default 'pending_review' check (status in (
    'pending_review', 'approved', 'revision_requested', 'final'
  )),
  download_count integer default 0,
  expires_at timestamptz,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

comment on table public.deliverables is 'Video deliverables with approval workflow';
comment on column public.deliverables.file_path is 'Supabase Storage path';
comment on column public.deliverables.version is 'Version number for revision tracking';
comment on column public.deliverables.expires_at is 'Optional expiry for download links';

-- =====================================================================
-- 5. VIDEO ANNOTATIONS TABLE
-- =====================================================================
-- Timestamped comments and notes on video deliverables

create table public.video_annotations (
  id uuid primary key default gen_random_uuid(),
  deliverable_id uuid references public.deliverables(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  timestamp_seconds numeric(10,2) not null,
  content text not null,
  resolved boolean default false,
  created_at timestamptz default now()
);

comment on table public.video_annotations is 'Timestamped comments on video deliverables';
comment on column public.video_annotations.timestamp_seconds is 'Position in video (seconds)';
comment on column public.video_annotations.resolved is 'Whether the annotation has been addressed';

-- =====================================================================
-- 6. INVOICES TABLE
-- =====================================================================
-- Invoice management with payment tracking

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  status text default 'draft' check (status in (
    'draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'
  )),
  issue_date date not null,
  due_date date not null,
  subtotal numeric(10,2) not null,
  tax_rate numeric(5,2) default 24.00,
  tax_amount numeric(10,2),
  total numeric(10,2) not null,
  currency text default 'EUR',
  notes text,
  line_items jsonb not null,
  payment_method text,
  paid_at timestamptz,
  stripe_payment_intent_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.invoices is 'Invoices with payment tracking';
comment on column public.invoices.invoice_number is 'Auto-generated invoice number (e.g., DMS-2026-001)';
comment on column public.invoices.line_items is 'JSON array of invoice line items';
comment on column public.invoices.tax_rate is 'VAT percentage (default 24% for Greece)';

-- =====================================================================
-- 7. EXPENSES TABLE
-- =====================================================================
-- Project expense tracking

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  category text not null,
  description text,
  amount numeric(10,2) not null,
  date date not null,
  receipt_path text,
  created_at timestamptz default now()
);

comment on table public.expenses is 'Project expenses with receipt storage';
comment on column public.expenses.receipt_path is 'Supabase Storage path for receipt';

-- =====================================================================
-- 8. MESSAGES TABLE
-- =====================================================================
-- Project-based messaging system

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  content text not null,
  attachments jsonb default '[]',
  read_by jsonb default '[]',
  created_at timestamptz default now()
);

comment on table public.messages is 'Project messaging with read receipts';
comment on column public.messages.attachments is 'JSON array of attachment metadata';
comment on column public.messages.read_by is 'JSON array of users who read the message';

-- =====================================================================
-- 9. CONTRACT TEMPLATES TABLE
-- =====================================================================
-- Reusable contract templates

create table public.contract_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  placeholders jsonb default '[]',
  created_at timestamptz default now()
);

comment on table public.contract_templates is 'Reusable contract templates';
comment on column public.contract_templates.placeholders is 'JSON array of placeholder definitions';

-- =====================================================================
-- 10. CONTRACTS TABLE
-- =====================================================================
-- Contract management with e-signature support

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  content text not null,
  template_id uuid references public.contract_templates(id) on delete set null,
  status text default 'draft' check (status in (
    'draft', 'sent', 'viewed', 'signed', 'expired', 'cancelled'
  )),
  sent_at timestamptz,
  viewed_at timestamptz,
  signed_at timestamptz,
  signature_data jsonb,
  pdf_path text,
  expires_at timestamptz,
  created_at timestamptz default now()
);

comment on table public.contracts is 'Contracts with e-signature support';
comment on column public.contracts.signature_data is 'JSON with signature, IP, user agent, timestamp';
comment on column public.contracts.pdf_path is 'Supabase Storage path for signed PDF';

-- =====================================================================
-- 11. FILMING REQUESTS TABLE
-- =====================================================================
-- Client-submitted filming requests (leads)

create table public.filming_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  description text,
  preferred_dates jsonb,
  location text,
  project_type text,
  budget_range text,
  reference_links jsonb default '[]',
  status text default 'pending' check (status in (
    'pending', 'reviewed', 'accepted', 'declined', 'converted'
  )),
  admin_notes text,
  converted_project_id uuid references public.projects(id) on delete set null,
  created_at timestamptz default now()
);

comment on table public.filming_requests is 'Client-submitted filming requests';
comment on column public.filming_requests.preferred_dates is 'JSON array of date/time preferences';
comment on column public.filming_requests.converted_project_id is 'Project created from this request';

-- =====================================================================
-- 12. EQUIPMENT LISTS TABLE
-- =====================================================================
-- Filming equipment checklists per project

create table public.equipment_lists (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  items jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.equipment_lists is 'Equipment checklists for filming projects';
comment on column public.equipment_lists.items is 'JSON array of equipment items with quantities and status';

-- =====================================================================
-- 13. SHOT LISTS TABLE
-- =====================================================================
-- Shot lists for pre-production planning

create table public.shot_lists (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  shots jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.shot_lists is 'Shot lists for filming planning';
comment on column public.shot_lists.shots is 'JSON array of shots with details';

-- =====================================================================
-- 14. CONCEPT NOTES TABLE
-- =====================================================================
-- Creative concept notes and planning documents

create table public.concept_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  content text,
  attachments jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

comment on table public.concept_notes is 'Creative concept notes and planning documents';
comment on column public.concept_notes.content is 'Rich text or markdown content';
comment on column public.concept_notes.attachments is 'JSON array of attachment metadata';

-- =====================================================================
-- END OF MIGRATION
-- =====================================================================
