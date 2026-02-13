# Devre Media System (DMS) — Product Requirements Document

## 1. Executive Summary

**Product Name:** Devre Media System (DMS)
**Version:** 1.0 (MVP)
**Tech Stack:** Next.js 14+ (App Router) · Supabase (Auth, Database, Storage, Realtime, Edge Functions)
**Target Users:** Devre Media (internal), μελλοντικά εξωτερικοί videographers & agencies
**Goal:** Κεντρικοποίηση client management, project tracking, financials, video delivery και communication σε μία ενιαία πλατφόρμα SaaS.

---

## 2. Problem Statement

Η Devre Media χρησιμοποιεί σήμερα πολλαπλά εργαλεία (email, spreadsheets, WeTransfer, manual invoicing κ.λπ.) για τη διαχείριση πελατών, projects και οικονομικών. Αυτό δημιουργεί:

- Αποσπασματική επικοινωνία με πελάτες
- Χαμένες deadlines και ασαφή project status
- Χρονοβόρα manual invoicing & payment tracking
- Ανασφαλή παράδοση video αρχείων
- Έλλειψη reporting & analytics

---

## 3. User Roles & Permissions

### 3.1 Roles

| Role | Περιγραφή |
|------|-----------|
| **Super Admin** | Devre Media owner — πλήρης πρόσβαση σε όλα |
| **Admin / Team Member** | Εσωτερικό μέλος ομάδας — διαχείριση projects, clients, invoices |
| **Client** | Εξωτερικός πελάτης — βλέπει τα δικά του projects, κάνει review, πληρώνει |

### 3.2 Permissions Matrix

| Feature | Super Admin | Admin | Client |
|---------|:-----------:|:-----:|:------:|
| Dashboard (Admin) | ✅ | ✅ | ❌ |
| Dashboard (Client) | ❌ | ❌ | ✅ |
| Client Management (CRUD) | ✅ | ✅ | ❌ |
| Project Management (CRUD) | ✅ | ✅ | 👁️ Read-only |
| Task Management | ✅ | ✅ | ❌ |
| Video Upload / Delivery | ✅ | ✅ | 📥 Download only |
| Invoices — Create/Edit | ✅ | ✅ | ❌ |
| Invoices — View/Pay | ✅ | ✅ | ✅ |
| Messaging | ✅ | ✅ | ✅ (own threads) |
| Video Review & Notes | ✅ | ✅ | ✅ (own projects) |
| Contract Signing | ✅ | ✅ | ✅ (own contracts) |
| Filming Requests | ❌ | ❌ | ✅ (create) |
| Reports & Analytics | ✅ | ✅ | ❌ |
| Settings & Billing | ✅ | ❌ | ❌ |

---

## 4. Information Architecture

```
DMS App
├── / (Landing / Marketing page)
├── /login
├── /signup (client invitation link)
│
├── /admin (Admin Layout)
│   ├── /dashboard .............. Overview, KPIs, recent activity
│   ├── /clients ................ Client list, search, filters
│   │   └── /[clientId] ........ Client profile, projects, history
│   ├── /projects ............... All projects board/list
│   │   └── /[projectId] ....... Project detail
│   │       ├── /tasks ......... Task board (Kanban/list)
│   │       ├── /deliverables .. Video files & review
│   │       ├── /messages ...... Project messaging thread
│   │       └── /contracts ..... Project contracts
│   ├── /invoices ............... Invoice list, filters by quarter
│   │   └── /[invoiceId] ....... Invoice detail / PDF
│   ├── /calendar ............... Filming schedule & deadlines
│   ├── /filming-prep ........... Equipment lists, concept notes, shot lists
│   │   └── /[projectId] ....... Per-project prep
│   ├── /reports ................ Analytics & reporting
│   └── /settings ............... Account, team, integrations
│
├── /client (Client Layout)
│   ├── /dashboard .............. My projects overview
│   ├── /projects
│   │   └── /[projectId]
│   │       ├── /deliverables .. View & download videos, leave timestamped notes
│   │       ├── /messages ...... Chat with Devre Media
│   │       └── /contracts ..... View & sign contracts
│   ├── /invoices ............... My invoices & payments
│   ├── /book ................... New filming request form
│   └── /settings ............... Profile settings
```

---

## 5. Feature Specifications — MVP (Phase 1)

### 5.1 Authentication & Onboarding

**Supabase Auth** με email/password + magic link

| Requirement | Detail |
|-------------|--------|
| Admin login | Email + password |
| Client login | Magic link invitation (admin στέλνει invite) |
| Session management | Supabase JWT + Next.js middleware |
| Role assignment | Custom `user_roles` table, checked via RLS |
| Onboarding | Client completes profile on first login |

**Tech Notes:**
- `supabase.auth.signUp()` / `signInWithOtp()`
- Next.js middleware (`middleware.ts`) redirects based on role
- Row Level Security (RLS) policies σε κάθε table

---

### 5.2 Admin Dashboard

**Route:** `/admin/dashboard`

| Widget | Data Source | Περιγραφή |
|--------|------------|-----------|
| Active Projects | `projects` table | Count + list τρεχόντων projects |
| Upcoming Deadlines | `tasks` table | Tasks due στις επόμενες 7 ημέρες |
| Revenue Overview | `invoices` table | Μηνιαία/τριμηνιαία έσοδα chart |
| Pending Payments | `invoices` WHERE status = 'pending' | Invoices που περιμένουν πληρωμή |
| Recent Messages | `messages` table | Τελευταία μηνύματα πελατών |
| Recent Activity | `activity_log` table | Timeline ενεργειών |

---

### 5.3 Client Management

**Route:** `/admin/clients`, `/admin/clients/[clientId]`

#### Data Model — `clients` Table

```sql
create table clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
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
```

#### Features

- **Client List:** Searchable, filterable (status, date), sortable
- **Client Profile:** Contact info, project history, invoices, communication log
- **Client Creation:** Admin form → αυτόματο invite email στον πελάτη
- **Client Notes:** Internal notes (δεν φαίνονται στον πελάτη)

---

### 5.4 Project Management

**Route:** `/admin/projects`, `/admin/projects/[projectId]`

#### Data Model — `projects` Table

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
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
```

#### Features

- **Project Board:** Kanban view (by status) + List view toggle
- **Project Detail:** Overview, tasks, deliverables, messages, contracts σε tabs
- **Status Workflow:** Drag & drop μεταξύ status columns
- **Project Timeline:** Visual timeline με milestones

---

### 5.5 Task Management

**Route:** `/admin/projects/[projectId]/tasks`

#### Data Model — `tasks` Table

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  assigned_to uuid references auth.users(id),
  title text not null,
  description text,
  status text default 'todo' check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  due_date date,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### Features

- Kanban board per project
- Drag & drop reordering
- Due date alerts (visual indicators)
- Task assignment σε team members
- Checklist items μέσα σε tasks (sub-tasks)

---

### 5.6 Filming Preparation Tools

**Route:** `/admin/filming-prep/[projectId]`

#### Data Models

```sql
-- Equipment checklist
create table equipment_lists (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  items jsonb not null default '[]',
  -- items: [{ name, quantity, checked, notes }]
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Shot lists
create table shot_lists (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  shots jsonb not null default '[]',
  -- shots: [{ number, description, shot_type, location, duration_est, notes, completed }]
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Concept notes
create table concept_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  content text, -- Rich text / markdown
  attachments jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### Features

- **Equipment Checklist:** Interactive checklist, reusable templates, export to PDF
- **Shot List:** Table-based shot list (shot #, description, type, location, duration)
- **Concept Notes:** Rich text editor με image attachments
- **Templates:** Save & reuse equipment/shot list templates

---

### 5.7 Video Delivery & Review

**Route:** `/admin/projects/[projectId]/deliverables` + `/client/projects/[projectId]/deliverables`

#### Data Models

```sql
create table deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  description text,
  file_path text not null, -- Supabase Storage path
  file_size bigint,
  file_type text,
  version integer default 1,
  status text default 'pending_review' check (status in (
    'pending_review', 'approved', 'revision_requested', 'final'
  )),
  download_count integer default 0,
  expires_at timestamptz, -- Optional expiry for download links
  uploaded_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Timestamped video notes/annotations
create table video_annotations (
  id uuid primary key default gen_random_uuid(),
  deliverable_id uuid references deliverables(id) on delete cascade,
  user_id uuid references auth.users(id),
  timestamp_seconds numeric(10,2) not null, -- Position in video
  content text not null,
  resolved boolean default false,
  created_at timestamptz default now()
);
```

#### Features

- **Video Upload:** Admin uploads video → Supabase Storage (private bucket)
- **Secure Download:** Signed URLs με optional expiry
- **Video Player:** Embedded player (HTML5 video / Video.js)
- **Timestamped Annotations:** Πελάτης & admin μπορούν να αφήσουν notes σε συγκεκριμένο timestamp
  - Click στο video timeline → popup note input
  - Annotations εμφανίζονται ως markers στο timeline
  - Mark as resolved
- **Version History:** Κάθε revision αποθηκεύεται ως νέα version
- **Approval Flow:** Client approves → status γίνεται "approved" → admin σημειώνει ως "final"

**Supabase Storage Config:**
```
Bucket: "deliverables" (private)
Max file size: 5GB (configurable)
Allowed MIME types: video/mp4, video/quicktime, video/x-msvideo
RLS: Μόνο ο client του project ή admin μπορεί να κάνει access
```

---

### 5.8 Invoice & Payment System

**Route:** `/admin/invoices`, `/client/invoices`

#### Data Model

```sql
create table invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null, -- e.g., DMS-2025-001
  client_id uuid references clients(id),
  project_id uuid references projects(id),
  status text default 'draft' check (status in (
    'draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'
  )),
  issue_date date not null,
  due_date date not null,
  subtotal numeric(10,2) not null,
  tax_rate numeric(5,2) default 24.00, -- Greek VAT
  tax_amount numeric(10,2),
  total numeric(10,2) not null,
  currency text default 'EUR',
  notes text,
  line_items jsonb not null,
  -- [{ description, quantity, unit_price, total }]
  payment_method text,
  paid_at timestamptz,
  stripe_payment_intent_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Expenses tracking
create table expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id),
  category text not null,
  description text,
  amount numeric(10,2) not null,
  date date not null,
  receipt_path text, -- Supabase Storage
  created_at timestamptz default now()
);
```

#### Features

- **Invoice Builder:** Line items, auto-calculate tax (ΦΠΑ 24%), totals
- **Invoice Numbering:** Auto-generated sequential (DMS-YYYY-XXX)
- **PDF Generation:** Server-side PDF creation (via Edge Function + library like `@react-pdf/renderer`)
- **Payment Integration:**
  - Stripe Checkout / Payment Links
  - Apple Pay (μέσω Stripe)
  - Mark as paid manually (bank transfer)
- **Invoice Status Tracking:** Draft → Sent → Viewed → Paid/Overdue
- **Quarterly Export:** Filter invoices by quarter, export ως CSV/PDF bundle για λογιστή
- **Expense Tracking:** Καταχώρηση εξόδων ανά project + upload αποδείξεων
- **Revenue Dashboard:** Charts (monthly/quarterly revenue, outstanding payments)

**Stripe Integration:**
```
- Stripe SDK (server-side via Edge Functions)
- Webhook endpoint: /api/webhooks/stripe
- Events: payment_intent.succeeded, invoice.paid
- Update invoice status on successful payment
```

---

### 5.9 Messaging System

**Route:** `/admin/projects/[projectId]/messages` + `/client/projects/[projectId]/messages`

#### Data Model

```sql
create table messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  sender_id uuid references auth.users(id),
  content text not null,
  attachments jsonb default '[]',
  -- [{ file_path, file_name, file_type, file_size }]
  read_by jsonb default '[]',
  -- [{ user_id, read_at }]
  created_at timestamptz default now()
);
```

#### Features

- **Real-time messaging:** Supabase Realtime subscriptions
- **Per-project threads:** Κάθε project έχει το δικό του chat
- **File attachments:** Upload εικόνες, PDFs κ.λπ.
- **Read receipts:** Ποιος έχει δει τα μηνύματα
- **Email notifications:** Supabase Edge Function → email on new message (αν ο χρήστης offline)
- **Unread counter:** Badge στο sidebar

---

### 5.10 Contract Management

**Route:** `/admin/projects/[projectId]/contracts` + `/client/projects/[projectId]/contracts`

#### Data Model

```sql
create table contracts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id),
  client_id uuid references clients(id),
  title text not null,
  content text not null, -- HTML/Markdown contract body
  template_id uuid references contract_templates(id),
  status text default 'draft' check (status in (
    'draft', 'sent', 'viewed', 'signed', 'expired', 'cancelled'
  )),
  sent_at timestamptz,
  viewed_at timestamptz,
  signed_at timestamptz,
  signature_data jsonb, -- { ip, user_agent, timestamp, signature_image }
  pdf_path text, -- Signed PDF stored in Supabase Storage
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table contract_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  placeholders jsonb default '[]',
  -- [{ key, label, type }] e.g., {client_name}, {project_title}, {amount}
  created_at timestamptz default now()
);
```

#### Features

- **Contract Builder:** Template-based, auto-fill placeholders (client name, project, amount)
- **E-Signature:** Canvas-based signature capture
- **Audit Trail:** IP, user agent, timestamp αποθηκεύονται
- **PDF Generation:** Signed contract → PDF stored στο Storage
- **Status Tracking:** Draft → Sent → Viewed → Signed
- **Reminders:** Auto-email αν δεν υπογράψει εντός X ημερών

---

### 5.11 New Filming Requests (Client-side)

**Route:** `/client/book`

#### Data Model

```sql
create table filming_requests (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id),
  title text not null,
  description text,
  preferred_dates jsonb, -- [{ date, time_slot }]
  location text,
  project_type text,
  budget_range text,
  reference_links jsonb default '[]',
  status text default 'pending' check (status in (
    'pending', 'reviewed', 'accepted', 'declined', 'converted'
  )),
  admin_notes text,
  converted_project_id uuid references projects(id),
  created_at timestamptz default now()
);
```

#### Features

- Multi-step booking form
- Preferred dates selection (calendar picker)
- Reference links/files upload
- Admin receives notification → reviews → accepts/declines
- Accepted request → auto-creates project

---

### 5.12 Client Dashboard

**Route:** `/client/dashboard`

| Widget | Περιγραφή |
|--------|-----------|
| My Projects | Active projects + status |
| Pending Actions | Contracts to sign, videos to review, invoices to pay |
| Recent Deliverables | Latest video uploads |
| Messages | Unread messages indicator |
| Upcoming Filmings | Scheduled filming dates |

---

## 6. Database Schema Overview (Supabase / PostgreSQL)

### Entity Relationship Diagram

```
auth.users
    │
    ├── 1:1 ── user_profiles (role, avatar, preferences)
    │
    ├── 1:1 ── clients (if role = 'client')
    │               │
    │               ├── 1:N ── projects
    │               │              │
    │               │              ├── 1:N ── tasks
    │               │              ├── 1:N ── deliverables
    │               │              │              └── 1:N ── video_annotations
    │               │              ├── 1:N ── messages
    │               │              ├── 1:N ── contracts
    │               │              ├── 1:1 ── equipment_lists
    │               │              ├── 1:N ── shot_lists
    │               │              ├── 1:N ── concept_notes
    │               │              └── 1:N ── expenses
    │               │
    │               ├── 1:N ── invoices
    │               └── 1:N ── filming_requests
    │
    └── 1:N ── activity_log
```

### Additional Tables

```sql
create table user_profiles (
  id uuid primary key references auth.users(id),
  role text not null check (role in ('super_admin', 'admin', 'client')),
  display_name text,
  avatar_url text,
  preferences jsonb default '{}',
  created_at timestamptz default now()
);

create table activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null, -- 'project.created', 'invoice.paid', etc.
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text not null,
  title text not null,
  body text,
  read boolean default false,
  action_url text,
  created_at timestamptz default now()
);
```

---

## 7. Row Level Security (RLS) Policies

Κρίσιμο για ασφάλεια. Κάθε table πρέπει να έχει RLS enabled.

```sql
-- Example: clients table
alter table clients enable row level security;

-- Admins: full access
create policy "Admins full access on clients"
  on clients for all
  using (
    exists (
      select 1 from user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role in ('super_admin', 'admin')
    )
  );

-- Clients: can only see their own record
create policy "Clients see own record"
  on clients for select
  using (user_id = auth.uid());

-- Example: deliverables — clients see only their project's deliverables
create policy "Clients see own deliverables"
  on deliverables for select
  using (
    exists (
      select 1 from projects p
      join clients c on c.id = p.client_id
      where p.id = deliverables.project_id
      and c.user_id = auth.uid()
    )
  );
```

---

## 8. Tech Stack & Architecture

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| State Management | React Server Components + Zustand (client state) |
| Forms | React Hook Form + Zod validation |
| Video Player | Video.js ή React Player |
| Rich Text Editor | Tiptap |
| Charts | Recharts |
| PDF Generation | @react-pdf/renderer |
| Date Handling | date-fns |
| Drag & Drop | @dnd-kit/core |

### Backend (Supabase)

| Layer | Technology |
|-------|-----------|
| Database | PostgreSQL (Supabase managed) |
| Auth | Supabase Auth (email, magic link) |
| Storage | Supabase Storage (video files, documents, receipts) |
| Realtime | Supabase Realtime (messaging, notifications) |
| Edge Functions | Supabase Edge Functions (Deno) |
| File Processing | Edge Functions for PDF generation, email sending |

### Third-Party Integrations

| Service | Purpose |
|---------|---------|
| Stripe | Payments (checkout, webhooks) |
| Resend / Postmark | Transactional emails |
| Vercel | Hosting & deployment |

### Architecture Diagram

```
┌─────────────────────────────────┐
│         Vercel (Hosting)        │
│  ┌───────────────────────────┐  │
│  │   Next.js App (App Router)│  │
│  │   - Server Components     │  │
│  │   - API Routes            │  │
│  │   - Middleware (Auth)      │  │
│  └────────────┬──────────────┘  │
└───────────────┼─────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│         Supabase Cloud          │
│  ┌──────────┐  ┌─────────────┐  │
│  │   Auth   │  │  Realtime   │  │
│  └──────────┘  └─────────────┘  │
│  ┌──────────┐  ┌─────────────┐  │
│  │ Postgres │  │   Storage   │  │
│  │  + RLS   │  │  (Videos)   │  │
│  └──────────┘  └─────────────┘  │
│  ┌──────────────────────────┐   │
│  │    Edge Functions        │   │
│  │  - Stripe webhooks       │   │
│  │  - Email notifications   │   │
│  │  - PDF generation        │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────┐
│       External Services         │
│  Stripe · Resend · (future AI)  │
└─────────────────────────────────┘
```

---

## 9. API Routes (Next.js)

```
/api
├── /auth
│   ├── /callback .............. Supabase auth callback
│   └── /invite ................ Send client invitation
│
├── /clients
│   ├── GET / .................. List clients
│   ├── POST / ................. Create client
│   ├── GET /[id] .............. Get client
│   ├── PATCH /[id] ............ Update client
│   └── DELETE /[id] ........... Delete client
│
├── /projects
│   ├── GET / .................. List projects
│   ├── POST / ................. Create project
│   ├── GET /[id] .............. Get project detail
│   ├── PATCH /[id] ............ Update project
│   └── /[id]/tasks ............ CRUD tasks
│
├── /deliverables
│   ├── POST /upload ........... Upload video (signed URL)
│   ├── GET /[id]/download ..... Generate signed download URL
│   └── /[id]/annotations ...... CRUD annotations
│
├── /invoices
│   ├── GET / .................. List invoices
│   ├── POST / ................. Create invoice
│   ├── GET /[id]/pdf .......... Generate PDF
│   ├── POST /[id]/send ........ Send to client
│   └── /export ................ Export by quarter (CSV/PDF)
│
├── /contracts
│   ├── POST / ................. Create from template
│   ├── POST /[id]/sign ........ Submit signature
│   └── GET /[id]/pdf .......... Download signed PDF
│
├── /messages
│   ├── GET /[projectId] ....... Get messages for project
│   └── POST /[projectId] ...... Send message
│
├── /filming-requests
│   ├── POST / ................. Client submits request
│   ├── PATCH /[id] ............ Admin reviews
│   └── POST /[id]/convert ..... Convert to project
│
├── /webhooks
│   └── /stripe ................ Stripe payment webhooks
│
└── /reports
    ├── /revenue ............... Revenue data
    └── /projects .............. Project analytics
```

---

## 10. UI/UX Requirements

### Design System

- **Primary Color:** Brand color Devre Media (dark/professional palette)
- **Typography:** Inter (headings) + system fonts
- **Layout:** Sidebar navigation (collapsible) + main content area
- **Responsive:** Mobile-first, fully responsive
- **Dark Mode:** Υποστήριξη dark/light mode

### Key UX Principles

1. **Minimal clicks:** Κάθε action max 3 clicks
2. **Real-time feedback:** Loading states, optimistic updates, toast notifications
3. **Progressive disclosure:** Δείχνει πρώτα τα σημαντικά, details on demand
4. **Consistency:** Ίδια patterns σε όλο το app
5. **Empty states:** Helpful messages + CTAs όταν δεν υπάρχουν δεδομένα

### Client Portal UX

- Minimal, clean interface — ο πελάτης δεν πρέπει να μπερδευτεί
- Prominent CTAs: "Review Video", "Pay Invoice", "Sign Contract"
- Mobile-optimized — πολλοί πελάτες θα μπουν από κινητό

---

## 11. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Page Load Time | < 2s (LCP) |
| Video Upload | Support files up to 5GB |
| Uptime | 99.9% |
| Data Backup | Supabase automatic daily backups |
| Security | HTTPS, RLS, input sanitization, CSRF protection |
| GDPR | Data export, deletion capability |
| Browser Support | Chrome, Safari, Firefox, Edge (latest 2 versions) |
| Mobile | Responsive design, PWA-ready |
| i18n | Greek + English (future) |

---

## 12. Development Phases & Timeline

### Phase 1 — MVP (3-6 months)

| Month | Deliverable |
|-------|-------------|
| **Month 1** | Project setup, auth, DB schema, RLS, basic layouts, client management |
| **Month 2** | Project management, task board, filming prep tools |
| **Month 3** | Video delivery + review system (upload, player, annotations) |
| **Month 4** | Invoice system + Stripe integration, contract management |
| **Month 5** | Messaging (realtime), notifications, client portal |
| **Month 6** | Polish, testing, bug fixes, beta launch with Devre Media |

### Phase 2 — Expansion (6-12 months)

| Feature | Περιγραφή |
|---------|-----------|
| AI Content Suggestions | OpenAI/Claude API → recommendations βάσει trends |
| Advanced Reporting | Monthly automated reports, export |
| Social Media Integration | Direct posting σε Instagram, TikTok, YouTube |
| Multi-User / Teams | Multiple team members per account |
| Additional Payment Gateways | PayPal, bank transfer automation |
| White-label SaaS | Multi-tenant architecture for external videographers |

---

## 13. Success Metrics

| Metric | Target (6 months post-launch) |
|--------|-------------------------------|
| Active clients on platform | 100% of Devre Media clients |
| Invoice payment time | -50% reduction vs current |
| Client response time (reviews) | < 48 hours average |
| Project delivery on-time rate | > 90% |
| Client satisfaction (NPS) | > 8/10 |
| Manual admin hours saved | > 10 hours/week |

---

## 14. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large video upload failures | High | Resumable uploads (tus protocol), chunked upload via Storage |
| Supabase Storage limits | Medium | Monitor usage, upgrade plan, consider CDN for delivery |
| Client adoption resistance | Medium | Simple onboarding, training materials, gradual migration |
| Scope creep | High | Strict MVP scope, feature freeze after Month 1 planning |
| Stripe webhook failures | Medium | Idempotent handlers, retry logic, manual fallback |
| Data security breach | Critical | RLS policies, security audit, penetration testing |

---

## 15. Next Steps

1. **Finalize wireframes** — Figma designs για κάθε screen
2. **Setup repositories** — Next.js project + Supabase project
3. **Database migration scripts** — Supabase migrations για όλα τα tables
4. **Implement auth flow** — Login, roles, middleware
5. **Build core modules** — Client management → Projects → Tasks (iteratively)
6. **Internal beta** — Test με Devre Media workflow
7. **Iterate** — Feedback → refinements → production launch

---

*Document Version: 1.0*
*Last Updated: February 2026*
*Author: Devre Media*