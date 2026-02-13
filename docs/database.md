# Database Schema Documentation

The Devre Media System uses PostgreSQL via Supabase. The schema is defined across four migration files applied in order. Row Level Security (RLS) is enforced on all tables.

---

## Migration Files

All migrations are in `supabase/migrations/`.

| File | Purpose |
|---|---|
| `00001_auth_tables.sql` | User profiles, activity log, and notifications tables |
| `00002_core_tables.sql` | All business entity tables (clients, projects, tasks, deliverables, invoices, contracts, messages, filming, expenses) |
| `00003_rls_policies.sql` | Row Level Security policies for every table |
| `00004_indexes_triggers.sql` | Performance indexes and database triggers (auto-timestamps, activity logging, invoice numbering) |

Additional migrations:

| File | Purpose |
|---|---|
| `20240209_messaging_webhook.sql` | Webhook configuration for real-time message notifications |
| `20260211_contract_reminders.sql` | Scheduled function setup for contract reminder emails |

---

## Table Reference

### user_profiles

Extends Supabase `auth.users` with application-specific data.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK, FK -> auth.users) | User ID from Supabase Auth |
| `role` | `text` | User role: `'admin'` or `'client'` |
| `display_name` | `text` | Full display name |
| `avatar_url` | `text` | URL to avatar in storage |
| `created_at` | `timestamptz` | Account creation timestamp |
| `updated_at` | `timestamptz` | Last profile update |

**Notes:** Created automatically via a database trigger when a new `auth.users` record is inserted. The `role` field is the primary authorization mechanism used throughout RLS policies.

---

### clients

Client company and contact information.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Client record ID |
| `user_id` | `uuid` (FK -> auth.users, nullable) | Linked auth user (set when client accepts invitation) |
| `contact_name` | `text` | Primary contact name |
| `email` | `text` | Contact email address |
| `phone` | `text` | Phone number |
| `company_name` | `text` | Company/organization name |
| `company_address` | `text` | Company address |
| `tax_id` | `text` | Tax identification number (AFM) |
| `notes` | `text` | Internal notes about the client |
| `status` | `text` | Client status: `active`, `inactive` |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |
| `created_by` | `uuid` (FK -> auth.users) | Admin who created the record |

---

### projects

Project records with workflow status tracking.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Project ID |
| `client_id` | `uuid` (FK -> clients) | Owning client |
| `name` | `text` | Project name/title |
| `description` | `text` | Project description |
| `type` | `text` | Project type (e.g., wedding, corporate, event, commercial) |
| `status` | `text` | Workflow status (see below) |
| `priority` | `text` | Priority level: `low`, `medium`, `high`, `urgent` |
| `start_date` | `date` | Project start date |
| `deadline` | `date` | Project deadline |
| `budget` | `numeric` | Project budget in EUR |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |
| `created_by` | `uuid` (FK -> auth.users) | Admin who created the project |

**Status workflow:**

```
briefing -> pre_production -> filming -> editing -> review -> revisions -> delivered -> archived
```

---

### tasks

Per-project tasks with Kanban status.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Task ID |
| `project_id` | `uuid` (FK -> projects) | Parent project |
| `title` | `text` | Task title |
| `description` | `text` | Task details |
| `status` | `text` | Task status: `pending`, `in_progress`, `completed` |
| `priority` | `text` | Priority: `low`, `medium`, `high` |
| `due_date` | `date` | Task due date |
| `assigned_to` | `uuid` (FK -> auth.users, nullable) | Assigned team member |
| `sort_order` | `integer` | Position within status column for drag-and-drop |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### deliverables

Video deliverable files with version tracking.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Deliverable ID |
| `project_id` | `uuid` (FK -> projects) | Parent project |
| `title` | `text` | Deliverable title |
| `description` | `text` | Description/notes |
| `file_url` | `text` | URL to video file in Supabase Storage |
| `file_name` | `text` | Original file name |
| `file_size` | `bigint` | File size in bytes |
| `mime_type` | `text` | MIME type (video/mp4, etc.) |
| `version` | `integer` | Version number (auto-incremented per project) |
| `status` | `text` | Approval status (see below) |
| `created_at` | `timestamptz` | Upload timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |
| `uploaded_by` | `uuid` (FK -> auth.users) | User who uploaded the file |

**Approval status workflow:**

```
pending -> in_review -> approved
                     -> revision_requested (loops back to pending on new upload)
```

---

### deliverable_annotations

Timestamped annotations on video deliverables.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Annotation ID |
| `deliverable_id` | `uuid` (FK -> deliverables) | Parent deliverable |
| `user_id` | `uuid` (FK -> auth.users) | Author of the annotation |
| `timestamp` | `numeric` | Video timestamp in seconds |
| `content` | `text` | Annotation text |
| `created_at` | `timestamptz` | Creation timestamp |

---

### invoices

Invoices with auto-numbering and payment tracking.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Invoice ID |
| `invoice_number` | `text` (unique) | Auto-generated: `DMS-YYYY-XXX` |
| `client_id` | `uuid` (FK -> clients) | Billed client |
| `project_id` | `uuid` (FK -> projects, nullable) | Associated project |
| `status` | `text` | Invoice status (see below) |
| `issue_date` | `date` | Date of issue |
| `due_date` | `date` | Payment due date |
| `subtotal` | `numeric` | Sum of line items before tax |
| `vat_rate` | `numeric` | VAT percentage (default: 24) |
| `vat_amount` | `numeric` | Calculated VAT amount |
| `total` | `numeric` | Grand total (subtotal + VAT) |
| `notes` | `text` | Invoice notes/terms |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |
| `created_by` | `uuid` (FK -> auth.users) | Admin who created the invoice |

**Invoice status workflow:**

```
draft -> sent -> paid
              -> overdue (automatic based on due_date)
              -> cancelled
```

**Notes:** Invoice numbers are auto-generated via a database trigger using the pattern `DMS-YYYY-XXX` where `YYYY` is the year and `XXX` is a zero-padded sequential number. Currency is formatted in `el-GR` locale (EUR).

---

### invoice_items

Line items on an invoice.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Item ID |
| `invoice_id` | `uuid` (FK -> invoices) | Parent invoice |
| `description` | `text` | Item description |
| `quantity` | `numeric` | Quantity |
| `unit_price` | `numeric` | Price per unit in EUR |
| `total` | `numeric` | Calculated total (quantity x unit_price) |
| `sort_order` | `integer` | Display order |

---

### payments

Payment records against invoices.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Payment ID |
| `invoice_id` | `uuid` (FK -> invoices) | Related invoice |
| `amount` | `numeric` | Payment amount in EUR |
| `method` | `text` | Payment method (stripe, bank_transfer, cash) |
| `stripe_payment_id` | `text` | Stripe payment intent ID (if applicable) |
| `paid_at` | `timestamptz` | Payment date/time |
| `created_at` | `timestamptz` | Record creation timestamp |

---

### contracts

Contracts with e-signature support.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Contract ID |
| `project_id` | `uuid` (FK -> projects) | Associated project |
| `client_id` | `uuid` (FK -> clients) | Client party |
| `template_id` | `uuid` (FK -> contract_templates, nullable) | Source template |
| `title` | `text` | Contract title |
| `content` | `text` | Contract body (rich text HTML) |
| `status` | `text` | Status: `draft`, `sent`, `signed`, `expired` |
| `sent_at` | `timestamptz` | When the contract was sent to the client |
| `signed_at` | `timestamptz` | When the client signed |
| `signature_data` | `text` | Base64-encoded signature image |
| `signer_name` | `text` | Name of the signer |
| `signer_ip` | `text` | IP address at time of signing |
| `expires_at` | `timestamptz` | Contract expiration date |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |
| `created_by` | `uuid` (FK -> auth.users) | Admin who created the contract |

---

### contract_templates

Reusable contract templates.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Template ID |
| `name` | `text` | Template name |
| `description` | `text` | Template description |
| `content` | `text` | Template body (rich text HTML with placeholders) |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |
| `created_by` | `uuid` (FK -> auth.users) | Admin who created the template |

---

### messages

Per-project chat messages.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Message ID |
| `project_id` | `uuid` (FK -> projects) | Project thread |
| `sender_id` | `uuid` (FK -> auth.users) | Message author |
| `content` | `text` | Message text content |
| `created_at` | `timestamptz` | Send timestamp |
| `read_at` | `timestamptz` | When the recipient read the message |

**Notes:** Real-time delivery uses Supabase Realtime subscriptions. The client subscribes to `messages` table changes filtered by `project_id`.

---

### message_attachments

File attachments on messages.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Attachment ID |
| `message_id` | `uuid` (FK -> messages) | Parent message |
| `file_url` | `text` | URL to file in Supabase Storage |
| `file_name` | `text` | Original file name |
| `file_size` | `bigint` | File size in bytes |
| `mime_type` | `text` | MIME type |
| `created_at` | `timestamptz` | Upload timestamp |

---

### filming_requests

Client-submitted filming booking requests.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Request ID |
| `client_id` | `uuid` (FK -> clients) | Requesting client |
| `title` | `text` | Request title/subject |
| `description` | `text` | Detailed description of filming needs |
| `preferred_date` | `date` | Preferred filming date |
| `preferred_time` | `text` | Preferred time of day |
| `location` | `text` | Filming location |
| `type` | `text` | Type of filming requested |
| `status` | `text` | Status: `pending`, `approved`, `rejected` |
| `admin_notes` | `text` | Admin notes/response |
| `created_at` | `timestamptz` | Submission timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### equipment_checklists

Per-project equipment preparation checklists.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Record ID |
| `project_id` | `uuid` (FK -> projects, unique) | Associated project (1:1) |
| `items` | `jsonb` | Array of equipment items with checked/unchecked status |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

**JSONB structure:**
```json
[
  { "name": "Camera Body (Sony A7IV)", "checked": true },
  { "name": "35mm Prime Lens", "checked": false },
  { "name": "Tripod", "checked": true }
]
```

---

### shot_lists

Per-project shot planning lists.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Record ID |
| `project_id` | `uuid` (FK -> projects) | Associated project |
| `items` | `jsonb` | Array of shot descriptions with metadata |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### concept_notes

Rich text concept notes for filming preparation.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Record ID |
| `project_id` | `uuid` (FK -> projects) | Associated project |
| `content` | `text` | Rich text HTML content |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### expenses

Project expense tracking with receipt uploads.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Expense ID |
| `project_id` | `uuid` (FK -> projects, nullable) | Associated project |
| `description` | `text` | Expense description |
| `amount` | `numeric` | Amount in EUR |
| `category` | `text` | Expense category (equipment, travel, catering, software, other) |
| `date` | `date` | Expense date |
| `receipt_url` | `text` | URL to receipt file in storage |
| `created_at` | `timestamptz` | Record creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |
| `created_by` | `uuid` (FK -> auth.users) | Admin who recorded the expense |

---

### activity_log

System-wide activity tracking for the dashboard feed.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Log entry ID |
| `user_id` | `uuid` (FK -> auth.users) | User who performed the action |
| `action` | `text` | Action type (created, updated, deleted, etc.) |
| `entity_type` | `text` | Entity type (client, project, invoice, etc.) |
| `entity_id` | `uuid` | ID of the affected entity |
| `metadata` | `jsonb` | Additional context (entity name, old/new values) |
| `created_at` | `timestamptz` | When the action occurred |

---

### notifications

User notifications with read tracking.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` (PK) | Notification ID |
| `user_id` | `uuid` (FK -> auth.users) | Recipient user |
| `title` | `text` | Notification title |
| `message` | `text` | Notification body |
| `type` | `text` | Notification type (info, warning, action) |
| `read` | `boolean` | Whether the notification has been read |
| `link` | `text` | URL to navigate to on click |
| `created_at` | `timestamptz` | Notification timestamp |

---

## Row Level Security (RLS) Strategy

Defined in `00003_rls_policies.sql`. RLS is enabled on every table.

### Policy Pattern

**Admin users** (where `user_profiles.role = 'admin'`):
- Full `SELECT`, `INSERT`, `UPDATE`, `DELETE` access on all tables
- No row-level filtering applied

**Client users** (where `user_profiles.role = 'client'`):
- `SELECT` only on rows where they are the associated client
- Limited `INSERT` on specific tables (messages, filming_requests, annotations)
- Limited `UPDATE` on specific tables (profile settings)
- No `DELETE` access

### Per-Table Access Summary

| Table | Admin | Client |
|---|---|---|
| `user_profiles` | Full CRUD | Read/update own profile only |
| `clients` | Full CRUD | Read own record only |
| `projects` | Full CRUD | Read own projects only (via client_id) |
| `tasks` | Full CRUD | Read tasks on own projects |
| `deliverables` | Full CRUD | Read deliverables on own projects |
| `deliverable_annotations` | Full CRUD | Read/create on own project deliverables |
| `invoices` | Full CRUD | Read own invoices only |
| `invoice_items` | Full CRUD | Read items on own invoices |
| `payments` | Full CRUD | Read own payments |
| `contracts` | Full CRUD | Read/update (sign) own contracts |
| `contract_templates` | Full CRUD | No access |
| `messages` | Full CRUD | Read/create on own project threads |
| `message_attachments` | Full CRUD | Read/create on own message threads |
| `filming_requests` | Full CRUD | Read/create own requests |
| `equipment_checklists` | Full CRUD | No access |
| `shot_lists` | Full CRUD | No access |
| `concept_notes` | Full CRUD | No access |
| `expenses` | Full CRUD | No access |
| `activity_log` | Read only | No access |
| `notifications` | Full CRUD | Read/update own notifications |

### How RLS Identifies Clients

Client access is determined by matching:
1. `auth.uid()` against `clients.user_id` to find the client record
2. Then joining through `client_id` on business tables (projects, invoices, contracts)
3. For nested entities (tasks, deliverables), the join goes through `projects.client_id`

---

## Storage Buckets

Supabase Storage buckets for file uploads.

| Bucket | Access | Max File Size | Allowed Types | Description |
|---|---|---|---|---|
| `videos` | Private (RLS) | 5 GB | `video/mp4`, `video/quicktime`, `video/x-msvideo` | Video deliverable files |
| `documents` | Private (RLS) | 50 MB | Common document types, `application/pdf` | Contracts, receipts, attachments |
| `avatars` | Public | 5 MB | `image/*` | User profile pictures |

**Storage RLS:**
- Admins can read/write all files
- Clients can read files associated with their projects
- Avatar uploads are restricted to own profile

---

## Indexes

Defined in `00004_indexes_triggers.sql`. Key performance indexes include:

| Table | Index | Columns |
|---|---|---|
| `projects` | `idx_projects_client_id` | `client_id` |
| `projects` | `idx_projects_status` | `status` |
| `tasks` | `idx_tasks_project_id` | `project_id` |
| `tasks` | `idx_tasks_status` | `status` |
| `deliverables` | `idx_deliverables_project_id` | `project_id` |
| `invoices` | `idx_invoices_client_id` | `client_id` |
| `invoices` | `idx_invoices_status` | `status` |
| `messages` | `idx_messages_project_id` | `project_id` |
| `messages` | `idx_messages_created_at` | `created_at` |
| `contracts` | `idx_contracts_client_id` | `client_id` |
| `activity_log` | `idx_activity_log_created_at` | `created_at` |
| `notifications` | `idx_notifications_user_id` | `user_id` |

---

## Triggers

Key database triggers:

| Trigger | Table | Description |
|---|---|---|
| `on_auth_user_created` | `auth.users` | Auto-creates a `user_profiles` record when a new auth user registers |
| `set_updated_at` | All tables | Automatically sets `updated_at` to `now()` on row update |
| `generate_invoice_number` | `invoices` | Auto-generates `DMS-YYYY-XXX` invoice numbers on insert |
| `log_activity` | Multiple tables | Records changes to the `activity_log` table for the dashboard feed |

---

## Entity Relationship Overview

```
auth.users (Supabase managed)
  |-- 1:1 --> user_profiles
  |-- 1:1 --> clients (via clients.user_id, nullable)

clients
  |-- 1:N --> projects
  |-- 1:N --> invoices
  |-- 1:N --> contracts
  |-- 1:N --> filming_requests

projects
  |-- 1:N --> tasks
  |-- 1:N --> deliverables
  |-- 1:N --> messages
  |-- 1:N --> contracts
  |-- 1:1 --> equipment_checklists
  |-- 1:N --> shot_lists
  |-- 1:N --> concept_notes
  |-- 1:N --> expenses

deliverables
  |-- 1:N --> deliverable_annotations

invoices
  |-- 1:N --> invoice_items
  |-- 1:N --> payments

messages
  |-- 1:N --> message_attachments

contract_templates (standalone, used to create contracts)
```
