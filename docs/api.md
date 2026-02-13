# API Reference

This document covers all data access patterns in the Devre Media System: API routes, server actions, and query functions.

---

## Conventions

### ActionResult Pattern

All server actions return a typed result using the `ActionResult<T>` pattern:

```typescript
type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };
```

This ensures consistent error handling across the application. On the client side, consumers check `result.error` before accessing `result.data`.

### Authentication

All server actions and API routes verify authentication via `createServerClient()` from `src/lib/supabase/server.ts`. The authenticated user is retrieved with `supabase.auth.getUser()` and role checks are performed against the `user_profiles` table.

### Validation

All inputs are validated with Zod schemas defined in `src/lib/schemas/`. Invalid input results in an `ActionResult` with an error message rather than an unhandled exception.

---

## API Routes

API routes are located in `src/app/api/` and handle operations that require HTTP endpoints rather than server actions (PDF generation, webhooks, external integrations).

### `POST /api/auth/invite`

Send a client invitation email. Creates a Supabase auth user with the `client` role and sends an email with a signup link.

**File:** `src/app/api/auth/invite/route.ts`

| Field | Type | Description |
|---|---|---|
| `email` | `string` | Client email address |
| `clientId` | `string` | Associated client record ID |

**Response:** `200 OK` on success, `400/500` with error message on failure.

**Auth:** Admin only.

---

### `GET /api/contracts/[contractId]/pdf`

Generate and download a contract as a PDF document.

**File:** `src/app/api/contracts/[contractId]/pdf/route.ts`

| Parameter | Location | Description |
|---|---|---|
| `contractId` | URL path | UUID of the contract |

**Response:** PDF file stream with `Content-Type: application/pdf`.

**Auth:** Admin or the client associated with the contract.

---

## Server Actions

Server actions are located in `src/lib/actions/` and handle all data mutations. They are invoked from client components using React's `useTransition` or directly from server components and form actions.

Each action file uses the `'use server'` directive and exports async functions that return `ActionResult<T>`.

---

### auth.ts

Authentication and user management actions.

**File:** `src/lib/actions/auth.ts`

| Function | Description |
|---|---|
| `signIn(email, password)` | Authenticate a user with email and password |
| `signUp(email, password, metadata)` | Register a new user account |
| `signOut()` | Sign out the current user and clear session |
| `resetPassword(email)` | Send a password reset email |
| `updatePassword(newPassword)` | Update the current user's password |
| `inviteClient(email, clientId)` | Send an invitation email to a client, creating their auth account |

---

### clients.ts

Client record management.

**File:** `src/lib/actions/clients.ts`

| Function | Description |
|---|---|
| `createClient(data)` | Create a new client record with company and contact information |
| `updateClient(clientId, data)` | Update an existing client's details |
| `deleteClient(clientId)` | Soft-delete or remove a client record |

---

### projects.ts

Project lifecycle management.

**File:** `src/lib/actions/projects.ts`

| Function | Description |
|---|---|
| `createProject(data)` | Create a new project linked to a client |
| `updateProject(projectId, data)` | Update project details (name, dates, budget, description) |
| `deleteProject(projectId)` | Delete a project and its associated data |
| `updateProjectStatus(projectId, status)` | Move a project to a new workflow stage |

**Project status workflow:**
`briefing` -> `pre_production` -> `filming` -> `editing` -> `review` -> `revisions` -> `delivered` -> `archived`

---

### tasks.ts

Per-project task management with Kanban support.

**File:** `src/lib/actions/tasks.ts`

| Function | Description |
|---|---|
| `createTask(data)` | Create a task within a project |
| `updateTask(taskId, data)` | Update task details (title, description, due date, assignee) |
| `deleteTask(taskId)` | Remove a task |
| `updateTaskStatus(taskId, status)` | Change task status (pending, in_progress, completed) |
| `reorderTasks(tasks)` | Update task sort order after drag-and-drop reordering |

---

### deliverables.ts

Video deliverable management and review workflow.

**File:** `src/lib/actions/deliverables.ts`

| Function | Description |
|---|---|
| `createDeliverable(data)` | Upload and create a video deliverable for a project |
| `updateDeliverable(deliverableId, data)` | Update deliverable metadata (title, description) |
| `deleteDeliverable(deliverableId)` | Remove a deliverable and its storage file |
| `addAnnotation(deliverableId, data)` | Add a timestamped annotation to a video |
| `updateDeliverableStatus(deliverableId, status)` | Change approval status (pending, in_review, approved, revision_requested) |

---

### invoices.ts

Invoice creation, management, and payment tracking.

**File:** `src/lib/actions/invoices.ts`

| Function | Description |
|---|---|
| `createInvoice(data)` | Create an invoice with line items; auto-generates number (DMS-YYYY-XXX) |
| `updateInvoice(invoiceId, data)` | Update invoice details and line items |
| `deleteInvoice(invoiceId)` | Delete a draft invoice |
| `sendInvoice(invoiceId)` | Mark invoice as sent and notify the client |
| `recordPayment(invoiceId, data)` | Record a manual payment against an invoice |

**Invoice status workflow:**
`draft` -> `sent` -> `paid` (or `overdue` / `cancelled`)

**Notes:** Invoices use 24% VAT and format currency in `el-GR` locale (EUR).

---

### contracts.ts

Contract and template management with e-signature support.

**File:** `src/lib/actions/contracts.ts`

| Function | Description |
|---|---|
| `createContract(data)` | Create a contract from a template for a project/client |
| `updateContract(contractId, data)` | Update contract content and details |
| `deleteContract(contractId)` | Remove a contract |
| `createTemplate(data)` | Create a reusable contract template |
| `updateTemplate(templateId, data)` | Update a contract template |
| `deleteTemplate(templateId)` | Remove a contract template |
| `signContract(contractId, signatureData)` | Record an e-signature on a contract |

---

### messages.ts

Per-project messaging with real-time support.

**File:** `src/lib/actions/messages.ts`

| Function | Description |
|---|---|
| `sendMessage(data)` | Send a message in a project thread (supports attachments) |
| `markAsRead(messageIds)` | Mark messages as read for the current user |
| `getThreadMessages(projectId)` | Retrieve all messages for a project thread |

**Notes:** Real-time delivery is handled via Supabase Realtime subscriptions on the client side (`use-realtime-messages.ts` hook).

---

### filming-requests.ts

Client filming request submission and admin review.

**File:** `src/lib/actions/filming-requests.ts`

| Function | Description |
|---|---|
| `createFilmingRequest(data)` | Submit a new filming request (client action) |
| `updateFilmingRequest(requestId, data)` | Update a filming request's details |
| `approveFilmingRequest(requestId)` | Approve a pending filming request (admin action) |
| `rejectFilmingRequest(requestId, reason)` | Reject a filming request with a reason (admin action) |

---

### filming-prep.ts

Per-project filming preparation materials.

**File:** `src/lib/actions/filming-prep.ts`

| Function | Description |
|---|---|
| `updateEquipmentChecklist(projectId, data)` | Update the equipment checklist (JSONB field) |
| `updateShotList(projectId, data)` | Update the shot list items |
| `updateConceptNotes(projectId, data)` | Update concept notes (rich text content) |

---

### expenses.ts

Project expense tracking.

**File:** `src/lib/actions/expenses.ts`

| Function | Description |
|---|---|
| `createExpense(data)` | Record a new expense with category and optional receipt |
| `updateExpense(expenseId, data)` | Update expense details |
| `deleteExpense(expenseId)` | Remove an expense record |

---

### settings.ts

Application and company settings management.

**File:** `src/lib/actions/settings.ts`

| Function | Description |
|---|---|
| `updateCompanyProfile(data)` | Update company name, address, tax ID, and contact info |
| `updateBranding(data)` | Update logo, brand colors, and portal appearance |
| `updateNotificationSettings(data)` | Configure email notification preferences |

---

### team.ts

Team member management.

**File:** `src/lib/actions/team.ts`

| Function | Description |
|---|---|
| `inviteTeamMember(email, role)` | Invite a new team member via email |
| `updateTeamMemberRole(userId, role)` | Change a team member's role |
| `removeTeamMember(userId)` | Remove a team member from the organization |

---

## Query Functions

Query functions are located in `src/lib/queries/` and handle all read-only data access. They are called from server components to fetch data for page rendering.

---

### index.ts -- Dashboard Queries

Aggregate queries used by the admin dashboard.

**File:** `src/lib/queries/index.ts`

| Function | Returns | Description |
|---|---|---|
| `getClientCount()` | `number` | Total number of active clients |
| `getProjectCount()` | `number` | Total number of active projects |
| `getPendingInvoiceCount()` | `number` | Number of invoices in sent/overdue status |
| `getTotalRevenue()` | `number` | Sum of all paid invoice amounts |
| `getTotalExpenses()` | `number` | Sum of all recorded expenses |
| `getRecentActivity()` | `ActivityItem[]` | Latest activity log entries |
| `getUpcomingDeadlines()` | `Deadline[]` | Projects and tasks with approaching due dates |
| `getProjectsByStatus()` | `StatusCount[]` | Project count grouped by workflow status |

---

### calendar.ts -- Calendar Events

Aggregates multiple data sources into a unified calendar view.

**File:** `src/lib/queries/calendar.ts`

| Function | Returns | Description |
|---|---|---|
| `getCalendarEvents(start, end)` | `CalendarEvent[]` | Combines project deadlines, task due dates, and invoice due dates into FullCalendar-compatible events |

**Event types returned:**
- Project milestones (start date, deadline)
- Task due dates
- Invoice due dates and payment dates

---

### reports.ts -- Reports and Analytics

Data queries for the reports and analytics page.

**File:** `src/lib/queries/reports.ts`

| Function | Returns | Description |
|---|---|---|
| `getMonthlyRevenue(year)` | `MonthlyData[]` | Revenue by month for a given year |
| `getPaymentMethodBreakdown()` | `MethodCount[]` | Payment count by method (Stripe, manual, etc.) |
| `getProjectsByStatusReport()` | `StatusCount[]` | Projects grouped by status for reporting |
| `getProjectsByType()` | `TypeCount[]` | Projects grouped by type/category |
| `getTopClients(limit)` | `ClientRevenue[]` | Top clients ranked by total revenue |
| `getClientAcquisitionTrend()` | `MonthlyData[]` | New clients per month over time |
| `getExpensesByCategory()` | `CategorySum[]` | Expense totals grouped by category |
| `getProfitData(year)` | `MonthlyProfit[]` | Revenue minus expenses by month |

---

## Supabase Edge Functions

Located in `supabase/functions/`, these run on Supabase's Deno runtime.

| Function | Trigger | Description |
|---|---|---|
| `notify-message` | Database webhook (on message insert) | Sends email notification when a new message is received |
| `contract-reminders` | Scheduled (cron) | Sends reminder emails for unsigned contracts approaching deadline |

---

## Data Flow Summary

```
Client Component (form submit)
  -> Server Action (src/lib/actions/*.ts)
    -> Zod validation (src/lib/schemas/*.ts)
    -> Supabase client (src/lib/supabase/server.ts)
    -> PostgreSQL (with RLS enforcement)
    -> Return ActionResult<T>
  -> Client receives { data, error }
  -> Toast notification (sonner)
  -> Router refresh / redirect
```

```
Server Component (page render)
  -> Query function (src/lib/queries/*.ts)
    -> Supabase client (src/lib/supabase/server.ts)
    -> PostgreSQL (with RLS enforcement)
    -> Return typed data
  -> Render page with data
```
