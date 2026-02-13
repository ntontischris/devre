# Devre Media System (DMS) — Claude Code Development Guide

> **Project Status:** All 13 development phases are complete. All 55 sub-tasks in `development.md` are marked complete. This file serves as a completed reference for the project architecture, conventions, and structure.

## Project Overview

**Devre Media System (DMS)** is a comprehensive SaaS platform for videography client management, project tracking, financials, video delivery, and communication. Built for Devre Media (internal use first, future multi-tenant SaaS).

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (email/password + magic link) |
| Storage | Supabase Storage (videos, documents, receipts) |
| Realtime | Supabase Realtime (messaging, notifications) |
| Edge Functions | Supabase Edge Functions (Deno) |
| Payments | Stripe (Checkout, webhooks) |
| State | React Server Components + Zustand (client state) |
| Forms | React Hook Form + Zod |
| Video | Video.js |
| Rich Text | Tiptap |
| Charts | Recharts |
| DnD | @dnd-kit |
| Testing | Playwright (E2E) |

### Key Documents

- **`prd.md`** — Full product requirements document (database schemas, features, API routes, permissions)
- **`development.md`** — Phased execution tracker with 55 sub-tasks and checkboxes

---

## Development Philosophy

### Build Piece by Piece

1. **Read** `development.md` to determine current progress
2. **Find** the next unchecked sub-task `[ ]`
3. **Build** that sub-task completely
4. **Test** using the verification steps listed in the sub-task
5. **Mark** the checkbox as `[x]` only after verification passes
6. **Proceed** to the next sub-task

### Rules

- **Never skip ahead.** Complete sub-tasks in order within each phase.
- **Respect phase dependencies.** Do not start a phase until its prerequisite phases are complete (see dependency graph in `development.md`).
- **Test before marking complete.** Every sub-task has verification steps — all must pass.
- **Stop on failure.** If tests fail, fix the issue before moving on. Do not mark as complete.
- **Parallel phases:** Phases 5–10 can run in parallel after Phase 4, but within each phase, sub-tasks are sequential.

---

## Subagent Strategy

Use the optimal subagent for each type of work:

| Subagent | When to Use |
|----------|-------------|
| `frontend-developer` | UI components, pages, layouts, forms, client-side state |
| `backend-architect` | API routes, Supabase queries, server actions, data access layer, webhooks |
| `sql-pro` | Database migrations, RLS policies, indexes, complex queries, triggers |
| `typescript-pro` | Type definitions, Zod schemas, complex generic types, type utilities |
| `security-auditor` | Auth flows, RLS audit, input validation, security headers, CSP |
| `test-automator` | E2E tests (Playwright), integration tests, test setup |
| `performance-engineer` | Optimization, lazy loading, bundle analysis, caching, query optimization |
| `deployment-engineer` | CI/CD, Vercel config, GitHub Actions, Docker, deployment scripts |

### Multi-Agent Pattern

For complex sub-tasks, use multiple agents:
1. `sql-pro` for the migration → then `backend-architect` for the data layer → then `frontend-developer` for the UI
2. `typescript-pro` for schemas → then `frontend-developer` for forms using those schemas

---

## Directory Structure

```
devre/
├── .env.local                    # Environment variables (gitignored)
├── .env.local.example            # Template for env vars
├── .eslintrc.json
├── .prettierrc
├── CLAUDE.md                     # This file
├── development.md                # Execution tracker
├── prd.md                        # Product requirements
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── components.json               # shadcn/ui config
├── playwright.config.ts
│
├── e2e/                          # Playwright E2E tests
│   ├── helpers/
│   └── *.spec.ts
│
├── public/
│   └── images/                   # Static assets
│
├── supabase/
│   ├── config.toml
│   ├── seed.sql
│   ├── migrations/
│   │   ├── 00001_auth_tables.sql
│   │   ├── 00002_core_tables.sql
│   │   ├── 00003_rls_policies.sql
│   │   └── 00004_indexes_triggers.sql
│   └── functions/
│       ├── _shared/              # Shared Edge Function utilities
│       ├── notify-message/
│       └── contract-reminders/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout (providers, fonts, metadata)
│   │   ├── globals.css           # Tailwind imports + custom CSS
│   │   ├── (auth)/               # Auth pages (login, signup, forgot-password)
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── onboarding/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── update-password/page.tsx
│   │   ├── auth/                 # Auth API callbacks
│   │   │   ├── callback/route.ts
│   │   │   └── confirm/route.ts
│   │   ├── admin/                # Admin layout group
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [clientId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [projectId]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── layout.tsx
│   │   │   │       ├── edit/page.tsx
│   │   │   │       ├── tasks/page.tsx
│   │   │   │       ├── deliverables/page.tsx
│   │   │   │       ├── messages/page.tsx
│   │   │   │       └── contracts/
│   │   │   │           ├── page.tsx
│   │   │   │           └── new/page.tsx
│   │   │   ├── invoices/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   ├── expenses/page.tsx
│   │   │   │   └── [invoiceId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── edit/page.tsx
│   │   │   ├── calendar/page.tsx
│   │   │   ├── filming-prep/
│   │   │   │   └── [projectId]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── layout.tsx
│   │   │   ├── filming-requests/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [requestId]/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       ├── layout.tsx
│   │   │       └── contract-templates/page.tsx
│   │   ├── client/               # Client layout group
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [projectId]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── deliverables/page.tsx
│   │   │   │       ├── messages/page.tsx
│   │   │   │       └── contracts/
│   │   │   │           └── [contractId]/
│   │   │   │               └── sign/page.tsx
│   │   │   ├── invoices/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [invoiceId]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── success/page.tsx
│   │   │   │       └── cancel/page.tsx
│   │   │   ├── book/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── auth/invite/route.ts
│   │   │   ├── invoices/
│   │   │   │   ├── [invoiceId]/
│   │   │   │   │   ├── pay/route.ts
│   │   │   │   │   └── pdf/route.ts
│   │   │   │   └── export/route.ts
│   │   │   ├── contracts/
│   │   │   │   └── [contractId]/
│   │   │   │       ├── sign/route.ts
│   │   │   │       └── pdf/route.ts
│   │   │   └── webhooks/
│   │   │       └── stripe/route.ts
│   │   └── dev/page.tsx          # Development helper (dev only)
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── shared/               # Reusable shared components
│   │   │   ├── data-table.tsx
│   │   │   ├── data-table-pagination.tsx
│   │   │   ├── data-table-toolbar.tsx
│   │   │   ├── data-table-column-header.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── page-header.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── file-upload-dropzone.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── confirm-dialog.tsx
│   │   │   ├── search-input.tsx
│   │   │   ├── date-range-picker.tsx
│   │   │   ├── currency-display.tsx
│   │   │   ├── user-avatar.tsx
│   │   │   ├── video-player.tsx
│   │   │   ├── video-annotations.tsx
│   │   │   ├── annotation-marker.tsx
│   │   │   ├── annotation-list.tsx
│   │   │   ├── add-annotation-dialog.tsx
│   │   │   ├── message-thread.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   ├── message-input.tsx
│   │   │   ├── message-attachment.tsx
│   │   │   ├── read-receipt-indicator.tsx
│   │   │   ├── tiptap-editor.tsx
│   │   │   ├── signature-pad.tsx
│   │   │   └── contract-view.tsx
│   │   ├── providers/            # Context providers
│   │   │   ├── auth-provider.tsx
│   │   │   └── index.tsx
│   │   ├── admin/                # Admin-specific components
│   │   │   ├── sidebar.tsx
│   │   │   ├── sidebar-nav.tsx
│   │   │   ├── header.tsx
│   │   │   ├── breadcrumbs.tsx
│   │   │   ├── user-nav.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── notification-bell.tsx
│   │   │   ├── clients/
│   │   │   ├── projects/
│   │   │   ├── tasks/
│   │   │   ├── deliverables/
│   │   │   ├── invoices/
│   │   │   ├── contracts/
│   │   │   ├── filming-prep/
│   │   │   ├── dashboard/
│   │   │   ├── calendar/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   └── client/               # Client-specific components
│   │       ├── navbar.tsx
│   │       ├── mobile-nav.tsx
│   │       ├── user-nav.tsx
│   │       ├── dashboard/
│   │       ├── invoices/
│   │       ├── book/
│   │       └── settings/
│   │
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-require-auth.ts
│   │   ├── use-require-role.ts
│   │   ├── use-realtime-messages.ts
│   │   └── use-unread-count.ts
│   │
│   ├── lib/
│   │   ├── utils.ts              # cn() helper and general utilities
│   │   ├── constants.ts          # Status enums, role constants, config values
│   │   ├── stripe.ts             # Stripe client configuration
│   │   ├── sanitize.ts           # DOMPurify wrapper for HTML sanitization
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   ├── middleware.ts     # Middleware client
│   │   │   └── admin.ts          # Service role client
│   │   ├── schemas/              # Zod validation schemas
│   │   │   ├── client.ts
│   │   │   ├── project.ts
│   │   │   ├── task.ts
│   │   │   ├── deliverable.ts
│   │   │   ├── invoice.ts
│   │   │   ├── contract.ts
│   │   │   ├── message.ts
│   │   │   ├── filming-request.ts
│   │   │   ├── filming-prep.ts
│   │   │   ├── expense.ts
│   │   │   └── auth.ts
│   │   ├── actions/              # Server actions (mutations)
│   │   │   ├── auth.ts
│   │   │   ├── clients.ts
│   │   │   ├── projects.ts
│   │   │   ├── tasks.ts
│   │   │   ├── deliverables.ts
│   │   │   ├── invoices.ts
│   │   │   ├── contracts.ts
│   │   │   ├── messages.ts
│   │   │   ├── filming-requests.ts
│   │   │   ├── filming-prep.ts
│   │   │   └── expenses.ts
│   │   ├── queries/              # Read-only data queries
│   │   │   ├── index.ts
│   │   │   ├── calendar.ts
│   │   │   └── reports.ts
│   │   └── pdf/                  # PDF templates
│   │       ├── invoice-template.tsx
│   │       └── contract-template.tsx
│   │
│   └── types/
│       ├── database.ts           # Supabase generated types
│       └── index.ts              # Re-exports and custom types
│
├── docs/                         # Documentation (Phase 13)
│   ├── api.md
│   ├── database.md
│   ├── admin-guide.md
│   └── client-guide.md
│
└── .github/
    └── workflows/
        ├── ci.yml
        └── deploy.yml
```

---

## Key Conventions

### 1. Server Components by Default

Use React Server Components for all pages and data-fetching components. Only add `'use client'` for components that need:
- Browser APIs (window, document)
- Event handlers (onClick, onChange)
- React hooks (useState, useEffect)
- Third-party client libraries (Video.js, Tiptap, etc.)

### 2. Zod Validation on All Inputs

Every form submission and API input must be validated with Zod:
```typescript
// In lib/schemas/client.ts
export const createClientSchema = z.object({
  contact_name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  // ...
});

// In server action
const validated = createClientSchema.parse(input);
```

### 3. RLS as Primary Authorization

Row Level Security is the primary access control mechanism. Never bypass RLS unless using the admin client for system operations. Always test RLS policies with each role.

### 4. Feature-Colocation Pattern

Keep feature-specific components close to their routes:
```
admin/clients/       → components/admin/clients/
admin/projects/      → components/admin/projects/
```

### 5. Reusable Shared Components

Components used by both admin and client portals go in `components/shared/`:
- Video player, message thread, signature pad, contract view, etc.

### 6. Server Actions for Mutations

Use Next.js Server Actions (`'use server'`) for all data mutations:
```typescript
'use server';
export async function createClient(input: CreateClientInput) {
  const supabase = await createServerClient();
  const validated = createClientSchema.parse(input);
  // ...
}
```

### 7. Error Handling Pattern

Return typed results from server actions:
```typescript
type ActionResult<T> = { data: T; error: null } | { data: null; error: string };
```

### 8. Toast Notifications

Use Sonner for all user feedback:
```typescript
import { toast } from 'sonner';
toast.success('Client created');
toast.error('Failed to save');
```

---

## Database Reference

### Tables & Relationships

| Table | Description | Key Relations |
|-------|-------------|---------------|
| `user_profiles` | User role, display name, avatar | → `auth.users` (1:1) |
| `clients` | Client contact info, company, status | → `auth.users` (1:1 if registered) |
| `projects` | Project details, status, dates, budget | → `clients` (N:1) |
| `tasks` | Task items with Kanban status | → `projects` (N:1), → `auth.users` (N:1) |
| `deliverables` | Video files with version tracking | → `projects` (N:1) |
| `video_annotations` | Timestamped notes on videos | → `deliverables` (N:1), → `auth.users` (N:1) |
| `invoices` | Invoice with line items, payment status | → `clients` (N:1), → `projects` (N:1) |
| `expenses` | Project expenses with receipt uploads | → `projects` (N:1) |
| `messages` | Per-project chat messages | → `projects` (N:1), → `auth.users` (N:1) |
| `contracts` | Contracts with e-signature data | → `projects` (N:1), → `clients` (N:1) |
| `contract_templates` | Reusable contract templates | Standalone |
| `filming_requests` | Client booking requests | → `clients` (N:1) |
| `equipment_lists` | Per-project equipment checklists (JSONB) | → `projects` (1:1) |
| `shot_lists` | Per-project shot lists (JSONB) | → `projects` (N:1) |
| `concept_notes` | Rich text notes with attachments | → `projects` (N:1) |
| `activity_log` | System-wide activity tracking | → `auth.users` (N:1) |
| `notifications` | User notifications with read status | → `auth.users` (N:1) |

### Storage Buckets

| Bucket | Access | Max Size | Types |
|--------|--------|----------|-------|
| `avatars` | Public | 5 MB | image/* |
| `deliverables` | Private | 5 GB | video/mp4, video/quicktime, video/x-msvideo |
| `attachments` | Private | 50 MB | Common file types |
| `receipts` | Private | 10 MB | image/*, application/pdf |
| `contracts` | Private | 10 MB | application/pdf |

---

## Critical Files Reference

| File | Why It Matters |
|------|----------------|
| `src/middleware.ts` | Route protection, auth checks, role-based redirects |
| `src/lib/supabase/server.ts` | Server-side Supabase client (used in all server actions) |
| `src/lib/supabase/client.ts` | Browser-side Supabase client (used in client components) |
| `src/types/database.ts` | Generated types — source of truth for all entity types |
| `src/lib/constants.ts` | All status values, roles, project types, priorities |
| `supabase/migrations/*.sql` | Database schema — RLS, triggers, indexes |
| `src/components/shared/data-table.tsx` | Reusable table component used across all list pages |
| `src/components/providers/auth-provider.tsx` | Auth context used by entire app |

---

## Testing Protocol

### Per Sub-Task Verification

Each sub-task in `development.md` has specific verification steps. Always run these after completing work:

1. **Build check:** `npm run build` — must pass with no errors
2. **Lint check:** `npm run lint` — must pass
3. **Type check:** `npx tsc --noEmit` — must pass
4. **Functional test:** Manually verify the feature works as described
5. **RLS test (for data features):** Verify data isolation between roles

### Phase-Level Verification

After completing all sub-tasks in a phase:
1. Run the full build
2. Test the complete phase workflow end-to-end
3. Mark the phase checkbox in `development.md`

### Final Verification (Phase 13)

1. All Playwright E2E tests pass
2. Full build succeeds
3. Security audit checklist complete
4. Performance targets met
5. All phase checkboxes marked in `development.md`

---

## Environment Variables

```env
# Supabase (Local)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (Email)
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Quick Reference Commands

```bash
# Development
npm run dev              # Start Next.js dev server
supabase start           # Start local Supabase
supabase db reset        # Reset DB + apply migrations + seed
supabase gen types typescript --local > src/types/database.ts  # Regenerate types

# Quality
npm run build            # Production build
npm run lint             # ESLint
npx tsc --noEmit         # Type check

# Testing
npx playwright test      # Run all E2E tests
npx playwright test --ui # Playwright UI mode

# Database
supabase migration new <name>   # Create new migration
supabase db diff                # Generate migration from schema changes
```

---

## NPM Dependencies (Complete List)

### Core
`next`, `react`, `react-dom`, `typescript`

### UI & Styling
`tailwindcss`, `postcss`, `autoprefixer`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `next-themes`, `sonner`

### Supabase
`@supabase/supabase-js`, `@supabase/ssr`

### Forms & Validation
`react-hook-form`, `@hookform/resolvers`, `zod`

### State Management
`zustand`

### Data Table
`@tanstack/react-table`

### Drag & Drop
`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`

### Rich Text Editor
`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`

### Video Player
`video.js`

### PDF Generation
`@react-pdf/renderer`

### Payments
`stripe`

### File Upload
`tus-js-client`

### Calendar
`@fullcalendar/core`, `@fullcalendar/daygrid`, `@fullcalendar/timegrid`, `@fullcalendar/interaction`, `@fullcalendar/react`

### Charts
`recharts`

### Dates
`date-fns`

### Email
`resend`

### Export
`file-saver`, `jszip`

### Signature
`react-signature-canvas`

### Security
`dompurify`

### Testing
`@playwright/test`

### Dev Dependencies
`eslint`, `eslint-config-next`, `prettier`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/video.js`, `@types/react-signature-canvas`, `@types/dompurify`

---

## Completion Status

**All 13 phases complete.** All 55 sub-tasks in `development.md` have been implemented and verified. The final sub-task (13.5 -- Documentation & Handoff) produced the following documentation:

| Document | Path | Description |
|---|---|---|
| Project README | `README.md` | Setup instructions, tech stack, features, scripts |
| API Reference | `docs/api.md` | Server actions, API routes, query functions |
| Database Schema | `docs/database.md` | Tables, RLS policies, storage, triggers |
| Admin Guide | `docs/admin-guide.md` | Admin portal user guide |
| Client Guide | `docs/client-guide.md` | Client portal user guide |
| Deployment Runbook | `DEPLOYMENT.md` | Vercel deployment, CI/CD, rollback procedures |

This `CLAUDE.md` file is retained as a completed architectural reference for the project.
