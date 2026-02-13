# Admin User Guide

This guide covers all features available to admin users in the Devre Media System.

---

## Dashboard

**Route:** `/admin/dashboard`

The dashboard is the landing page after login. It provides a high-level overview of business activity.

**KPI Cards:**
- Total clients
- Active projects
- Pending invoices (sent but unpaid)
- Total revenue (sum of paid invoices)

**Charts:**
- Revenue trend (monthly bar/line chart via Recharts)
- Projects by status (pie/donut chart)

**Activity Feed:**
- Recent actions across the system (new clients, project updates, payments received, contracts signed)
- Each entry links to the relevant entity

**Pending Actions:**
- Invoices awaiting payment
- Contracts awaiting signature
- Filming requests awaiting review
- Upcoming project deadlines

---

## Client Management

**Route:** `/admin/clients`

### Client List

A searchable, sortable data table of all clients. Columns include name, company, email, status, and project count. Use the search bar to filter by name or company. Click a row to view the client profile.

### Create Client

**Route:** `/admin/clients/new`

Fill in the client form with:
- Contact name (required)
- Email (required)
- Phone
- Company name
- Company address
- Tax ID (AFM)
- Notes

### Client Profile

**Route:** `/admin/clients/[clientId]`

The client detail page shows tabs for:
- **Overview** -- Contact details, company info, and summary statistics
- **Projects** -- All projects for this client
- **Invoices** -- All invoices for this client
- **Contracts** -- All contracts for this client
- **Activity** -- Activity log filtered to this client

### Invite Client to Portal

From the client profile, click "Invite to Portal" to send an email invitation. The client receives a link to create their account and access the client portal. Once they sign up, their `user_id` is linked to the client record automatically.

### Edit / Delete

Use the edit button on the client profile to update details. Delete is available from the actions menu.

---

## Project Management

**Route:** `/admin/projects`

### Project Views

Two views are available:

- **Kanban Board** -- Projects displayed as cards in columns by status. Drag and drop cards to change status.
- **List View** -- Searchable data table with filtering by status, client, and type.

### Create Project

**Route:** `/admin/projects/new`

Required fields:
- Project name
- Client (select from existing clients)
- Type (wedding, corporate, event, commercial, etc.)
- Status (defaults to "briefing")
- Priority
- Start date and deadline
- Budget
- Description

### Project Detail

**Route:** `/admin/projects/[projectId]`

The project detail page uses a tabbed layout:
- **Overview** -- Project details, status, timeline, and budget
- **Tasks** -- Task Kanban board (see Task Management)
- **Deliverables** -- Video uploads and review workflow (see Video Delivery)
- **Messages** -- Project message thread (see Messaging)
- **Contracts** -- Contracts associated with this project

The project status can be updated from the overview tab using the status dropdown.

---

## Task Management

**Route:** `/admin/projects/[projectId]/tasks`

### Task Kanban Board

Tasks are displayed in three columns:
- **Pending** -- Tasks not yet started
- **In Progress** -- Tasks currently being worked on
- **Completed** -- Finished tasks

Drag and drop tasks between columns to change their status. Tasks can also be reordered within a column.

### Create / Edit Task

Click "New Task" to add a task to the project. Fields include:
- Title (required)
- Description
- Status
- Priority (low, medium, high)
- Due date
- Assigned to (select team member)

Click on a task card to edit its details or delete it.

---

## Filming Preparation

**Route:** `/admin/filming-prep/[projectId]`

Accessed from the project detail page. Three preparation sections are available:

### Equipment Checklist

A checklist of equipment needed for the shoot. Items can be added, removed, and checked off. The checklist is stored as a JSONB array, allowing flexible item management.

### Shot List

A structured list of planned shots. Each entry can include a description, location notes, and technical requirements.

### Concept Notes

A rich text editor (Tiptap) for writing creative direction, mood boards, color palettes, and production notes. Supports images, links, and formatted text.

---

## Video Delivery and Review

**Route:** `/admin/projects/[projectId]/deliverables`

### Upload Deliverables

Click "Upload" to add a video deliverable. The upload uses resumable uploads (tus protocol) for large files up to 5 GB. Supported formats: MP4, QuickTime (MOV), AVI.

Each upload creates a new deliverable record with:
- Title
- Description
- Version number (auto-incremented)
- File metadata

### Review Workflow

Deliverables follow an approval workflow:

1. **Pending** -- Newly uploaded, awaiting client review
2. **In Review** -- Client is actively reviewing
3. **Approved** -- Client has approved the deliverable
4. **Revision Requested** -- Client has requested changes (include notes)

### Annotations

Both admin and client users can add timestamped annotations to videos:
- Play the video to the desired timestamp
- Click "Add Annotation"
- Type the note and save
- Annotations appear as markers on the video timeline and in a list beside the player

---

## Invoicing

**Route:** `/admin/invoices`

### Invoice List

A data table of all invoices with filtering by status (draft, sent, paid, overdue, cancelled). Shows invoice number, client, amount, status, issue date, and due date.

### Create Invoice

**Route:** `/admin/invoices/new`

1. Select a client (required)
2. Optionally link to a project
3. Set issue date and due date
4. Add line items (description, quantity, unit price)
5. Subtotal, VAT (24%), and total are calculated automatically
6. Add notes/payment terms
7. Save as draft

### Send Invoice

From the invoice detail page, click "Send" to:
- Change status from `draft` to `sent`
- Send an email notification to the client with a link to view and pay

### Invoice Detail

**Route:** `/admin/invoices/[invoiceId]`

Shows the full invoice with line items, totals, and payment history. Actions available:
- **Edit** -- Modify draft invoices
- **Send** -- Send to client
- **Record Payment** -- Manually record a payment (bank transfer, cash)
- **Download PDF** -- Generate and download the invoice as a PDF
- **Mark as Cancelled** -- Cancel the invoice

### Expenses

**Route:** `/admin/invoices/expenses`

Track project expenses separately from invoices:
- Add expenses with category, amount, date, and optional receipt upload
- Link expenses to projects
- Categories: equipment, travel, catering, software, other
- View expense totals in reports

---

## Contract Management

**Route:** `/admin/projects/[projectId]/contracts`

### Contract Templates

**Route:** `/admin/settings/contract-templates`

Create reusable templates with the rich text editor. Templates can include placeholder variables that are filled when creating a contract (e.g., client name, project name, dates).

### Create Contract

**Route:** `/admin/projects/[projectId]/contracts/new`

1. Select a template (or start from scratch)
2. Edit the contract content in the rich text editor
3. Set an expiration date
4. Save as draft

### Send for Signature

From the contract detail view, click "Send" to:
- Change status to `sent`
- Notify the client via email with a link to review and sign

### E-Signature Tracking

Once a client signs a contract, the system records:
- Signature image (drawn on a signature pad)
- Signer name
- Signer IP address
- Timestamp

Signed contracts can be downloaded as PDF.

### Reminders

A Supabase Edge Function (`contract-reminders`) automatically sends reminder emails for unsigned contracts approaching their expiration date.

---

## Messaging

**Route:** `/admin/projects/[projectId]/messages`

### Project Threads

Each project has a dedicated message thread. Messages support:
- Text content
- File attachments (uploaded to Supabase Storage)
- Real-time delivery (messages appear instantly via Supabase Realtime)
- Read receipts (see when the client has read messages)

### Notification

New messages trigger:
- A Supabase Edge Function (`notify-message`) that sends an email notification
- An in-app notification badge on the sidebar

---

## Filming Requests

**Route:** `/admin/filming-requests`

### Request List

View all filming requests submitted by clients. Filter by status: pending, approved, rejected.

### Review a Request

**Route:** `/admin/filming-requests/[requestId]`

View the request details (title, description, preferred date/time, location, type) and either:
- **Approve** -- Accept the request (optionally create a project from it)
- **Reject** -- Decline with a reason that is sent to the client

---

## Calendar

**Route:** `/admin/calendar`

A full-page FullCalendar view that aggregates:
- **Project deadlines** -- Shown as colored events based on project status
- **Task due dates** -- Individual task deadlines
- **Invoice due dates** -- Payment deadlines

Switch between month, week, and day views. Click on an event to navigate to the related entity.

---

## Reports and Analytics

**Route:** `/admin/reports`

The reports page provides business intelligence through multiple chart sections:

- **Monthly Revenue** -- Bar chart showing revenue trend over the year
- **Projects by Status** -- Pie chart of current project distribution
- **Projects by Type** -- Breakdown by project category
- **Top Clients** -- Ranked list of clients by total revenue
- **Client Acquisition** -- Monthly trend of new client signups
- **Expenses by Category** -- Pie chart of expense distribution
- **Profit Analysis** -- Revenue vs. expenses with net profit line

All charts are built with Recharts and can be filtered by date range.

---

## Settings

**Route:** `/admin/settings`

### Team Management

Invite team members, assign roles, and remove members. Team members are admin-level users with full system access.

### Company Profile

Update the company details used in invoices, contracts, and the client portal:
- Company name
- Address
- Tax ID
- Contact email and phone

### Branding

Customize the appearance of the client portal:
- Logo upload
- Brand colors
- Portal welcome message

### Contract Templates

**Route:** `/admin/settings/contract-templates`

Manage reusable contract templates (see Contract Management section above).

### Notification Settings

Configure email notification preferences:
- New message notifications
- Invoice payment notifications
- Contract signature notifications
- Filming request notifications
