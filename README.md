# Devre Media System (DMS)

A comprehensive SaaS platform for videography client management, project tracking, financials, video delivery, and communication. Built for Devre Media as an internal tool with a future multi-tenant SaaS roadmap.

DMS provides a full admin back-office for managing clients, projects, tasks, invoicing, contracts, and messaging alongside a dedicated client portal where clients can review deliverables, pay invoices, sign contracts, and communicate with the production team.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.1 |
| Language | TypeScript (strict mode) | 5.x |
| Styling | Tailwind CSS v4 | 4.x |
| Component Library | shadcn/ui (Radix UI primitives) | latest |
| Database & Auth | Supabase (PostgreSQL, Auth, Storage, Realtime) | 2.x |
| Payments | Stripe (Checkout, Webhooks) | 20.x |
| Charts | Recharts | 3.x |
| Calendar | FullCalendar | 6.x |
| Data Tables | TanStack React Table | 8.x |
| Forms | React Hook Form + Zod | 7.x / 4.x |
| Drag & Drop | @dnd-kit | 6.x |
| Rich Text Editor | Tiptap | 3.x |
| Video Player | Video.js | 8.x |
| PDF Generation | @react-pdf/renderer | 4.x |
| E-Signatures | react-signature-canvas | 1.x |
| Email | Resend | - |
| E2E Testing | Playwright | 1.x |
| Deployment | Vercel + GitHub Actions CI | - |

---

## Prerequisites

- **Node.js** 18+ (20.x recommended)
- **npm** 10+
- **Supabase CLI** (`npm install -g supabase`)
- **Git**
- A Stripe account (test keys for development)
- A Resend account (for email features)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd devre
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the required values. See the [Environment Variables](#environment-variables) section below for details.

### 4. Start local Supabase

```bash
npx supabase start
```

This starts a local Supabase instance with PostgreSQL, Auth, Storage, and Realtime. The CLI will print the local API URL and keys -- copy them into `.env.local`.

### 5. Run database migrations

```bash
npx supabase db push
```

This applies all migration files from `supabase/migrations/` to create the schema, RLS policies, indexes, and triggers.

### 6. Seed development data

```bash
npm run dev
```

Once the dev server is running, visit [http://localhost:3000/dev](http://localhost:3000/dev) in your browser. The development helper page provides utilities to seed the database with sample clients, projects, invoices, and other test data.

### 7. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

Default admin credentials are provided on the `/dev` seed page.

---

## Project Structure

```
devre/
├── .env.example                  # Environment variable template
├── .env.local                    # Local environment (gitignored)
├── CLAUDE.md                     # AI development guide
├── DEPLOYMENT.md                 # Deployment runbook
├── development.md                # Phased execution tracker (55 sub-tasks)
├── prd.md                        # Product requirements document
├── package.json
├── next.config.ts
├── tailwind.config.ts / postcss.config.mjs
├── tsconfig.json
├── playwright.config.ts
├── vercel.json
├── components.json               # shadcn/ui configuration
│
├── docs/                         # Project documentation
│   ├── api.md                    # API & server action reference
│   ├── database.md               # Database schema documentation
│   ├── admin-guide.md            # Admin user guide
│   └── client-guide.md           # Client user guide
│
├── e2e/                          # Playwright E2E tests
│   ├── helpers/                  # Test utilities & auth helpers
│   └── *.spec.ts                 # Test specifications
│
├── public/                       # Static assets
│
├── supabase/
│   ├── config.toml               # Local Supabase configuration
│   ├── seed.sql                  # Database seed data
│   ├── migrations/
│   │   ├── 00001_auth_tables.sql
│   │   ├── 00002_core_tables.sql
│   │   ├── 00003_rls_policies.sql
│   │   └── 00004_indexes_triggers.sql
│   └── functions/                # Supabase Edge Functions
│       ├── _shared/
│       ├── notify-message/
│       └── contract-reminders/
│
├── src/
│   ├── middleware.ts              # Route protection & role redirects
│   ├── app/
│   │   ├── layout.tsx            # Root layout (providers, fonts, metadata)
│   │   ├── globals.css           # Tailwind imports & custom CSS
│   │   ├── (auth)/               # Auth pages (login, signup, forgot-password)
│   │   ├── auth/                 # Auth API callbacks
│   │   ├── admin/                # Admin portal (all management pages)
│   │   ├── client/               # Client portal (dashboard, projects, invoices)
│   │   ├── api/                  # API routes (auth, invoices, contracts, webhooks)
│   │   └── dev/page.tsx          # Development seed helper (dev only)
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui base components
│   │   ├── shared/               # Reusable components (data-table, video-player, etc.)
│   │   ├── providers/            # Context providers (auth, theme)
│   │   ├── admin/                # Admin-specific components
│   │   └── client/               # Client-specific components
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-require-auth.ts
│   │   ├── use-require-role.ts
│   │   ├── use-realtime-messages.ts
│   │   └── use-unread-count.ts
│   │
│   ├── lib/
│   │   ├── utils.ts              # cn() helper & general utilities
│   │   ├── constants.ts          # Status enums, role constants, config
│   │   ├── stripe.ts             # Stripe client configuration
│   │   ├── sanitize.ts           # DOMPurify wrapper for HTML sanitization
│   │   ├── supabase/             # Supabase client variants (browser, server, middleware, admin)
│   │   ├── schemas/              # Zod validation schemas (per entity)
│   │   ├── actions/              # Server actions — all data mutations
│   │   ├── queries/              # Read-only data queries (dashboard, calendar, reports)
│   │   └── pdf/                  # PDF templates (invoice, contract)
│   │
│   └── types/
│       ├── database.ts           # Supabase generated types
│       └── index.ts              # Re-exports & custom types
│
└── .github/
    └── workflows/
        ├── ci.yml                # CI pipeline (lint, type-check, build)
        └── deploy.yml            # Deployment workflow
```

---

## Key Features

- **Client Management** -- Create, edit, and track clients with company info, contact details, and activity history. Invite clients to the portal via email.
- **Project Management** -- Kanban board and list views with an 8-stage workflow (briefing, pre-production, filming, editing, review, revisions, delivered, archived).
- **Task Management** -- Per-project Kanban board with drag-and-drop reordering and status tracking (pending, in progress, completed).
- **Filming Preparation** -- Equipment checklists, shot lists, and concept notes per project to prepare for shoots.
- **Video Delivery and Review** -- Upload video deliverables, version tracking, timestamped annotation system, and approval workflow (pending, in review, approved, revision requested).
- **Invoicing and Payments** -- Create and send invoices with auto-numbering (DMS-YYYY-XXX), 24% VAT calculation, PDF generation, and Stripe payment integration.
- **Contract Management** -- Template-based contracts with rich text editing, e-signature capture, PDF generation, and automated reminders.
- **Messaging** -- Per-project message threads with real-time delivery via Supabase Realtime, file attachments, and read receipts.
- **Client Portal** -- Dedicated portal for clients to view projects, review videos, pay invoices, sign contracts, submit filming requests, and message the admin.
- **Admin Dashboard** -- KPI cards, revenue charts, project status breakdown, activity feed, and pending action items.
- **Calendar** -- FullCalendar integration showing project deadlines, task due dates, and invoice dates in a unified view.
- **Reports and Analytics** -- Monthly revenue trends, project breakdown by status and type, top clients, expense tracking, and profit analysis.
- **Filming Requests** -- Client-submitted booking requests with admin review and approval workflow.
- **Settings** -- Team management, company profile, branding configuration, and notification preferences.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with Turbopack |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright tests in UI mode |
| `npm run test:e2e:headed` | Run Playwright tests in headed browser |
| `npm run test:e2e:debug` | Run Playwright tests in debug mode |
| `npm run test:e2e:report` | Show the Playwright test report |

### Supabase Commands

| Command | Description |
|---|---|
| `npx supabase start` | Start local Supabase instance |
| `npx supabase stop` | Stop local Supabase instance |
| `npx supabase db reset` | Reset database, apply migrations, and seed |
| `npx supabase db push` | Apply pending migrations |
| `npx supabase migration new <name>` | Create a new migration file |
| `npx supabase gen types typescript --local > src/types/database.ts` | Regenerate TypeScript types from database |

---

## Environment Variables

All environment variables are documented in `.env.example`. Copy it to `.env.local` and fill in the values.

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (local: `http://127.0.0.1:54321`) | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `RESEND_API_KEY` | Resend API key for email delivery | Yes |
| `NEXT_PUBLIC_APP_URL` | Application base URL (local: `http://localhost:3000`) | Yes |

See `.env.example` for the full template with comments.

---

## Deployment

This application is designed to deploy on **Vercel** with a **Supabase** cloud backend. A full deployment runbook is available in [`DEPLOYMENT.md`](./DEPLOYMENT.md), covering:

- Vercel project setup and environment configuration
- Supabase production project setup
- GitHub Actions CI pipeline
- Deployment checklists (pre-deployment, deployment, post-deployment)
- Rollback procedures
- Monitoring and troubleshooting

---

## Documentation

| Document | Description |
|---|---|
| [`docs/api.md`](./docs/api.md) | API routes, server actions, and query functions reference |
| [`docs/database.md`](./docs/database.md) | Database schema, tables, RLS policies, and storage buckets |
| [`docs/admin-guide.md`](./docs/admin-guide.md) | Admin user guide for all back-office features |
| [`docs/client-guide.md`](./docs/client-guide.md) | Client user guide for the client portal |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Deployment runbook and operational guide |
| [`CLAUDE.md`](./CLAUDE.md) | AI development guide and project reference |
| [`prd.md`](./prd.md) | Product requirements document |
| [`development.md`](./development.md) | Phased execution tracker (55 sub-tasks) |

---

## License

Private. All rights reserved.
