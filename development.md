# Devre Media System (DMS) — Development Execution Tracker
# Σύστημα Devre Media — Εκτελεστικός Οδηγός Ανάπτυξης

> **How to use / Πώς χρησιμοποιείται:** Each sub-task has a checkbox `[ ]`. Mark as `[x]` only after verification passes. Work top-to-bottom, respecting phase dependencies.

---

## Dependency Graph / Γράφος Εξαρτήσεων

```
Phase 0 → Phase 1 → Phase 2
                       ↓
              Phase 3 (Clients)
                       ↓
              Phase 4 (Projects)
                ↓    ↓    ↓
    Phase 5  Phase 6  Phase 7  Phase 8  Phase 9  Phase 10
    (Tasks)  (Film)   (Video)  (Invoice) (Msg)   (Contract)
                \       |        /       /       /
                 ↘      ↓       ↙      ↙       ↙
                  Phase 11 (Client Portal)
                         ↓
                  Phase 12 (Dashboard/Reports)
                         ↓
                  Phase 13 (Polish/Deploy)
```

---

## Phase 0: Project Foundation / Θεμελίωση Project

**Overview / Επισκόπηση:** Initialize the Next.js project, configure all tooling, set up Supabase clients, define shared types, and build reusable components that every subsequent phase depends on.

**Dependencies / Εξαρτήσεις:** None — this is the starting point.

---

### [x] 0.1 — Init Next.js Project / Αρχικοποίηση Next.js Project

**Description / Περιγραφή:**
Create a new Next.js 14+ project with App Router, TypeScript, Tailwind CSS, ESLint, and Prettier. Configure `tsconfig.json` path aliases, Tailwind theme (Devre brand colors, dark mode), and ESLint rules for consistent code style.

**Key Files / Βασικά Αρχεία:**
- `package.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `.eslintrc.json`
- `.prettierrc`
- `next.config.ts`
- `src/app/layout.tsx` (root layout)
- `src/app/globals.css`

**Dependencies / Πακέτα:**
`next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `eslint`, `eslint-config-next`, `prettier`, `@types/node`, `@types/react`, `@types/react-dom`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- `npm run dev` starts without errors
- `npm run build` completes successfully
- `npm run lint` passes
- Tailwind classes render correctly on a test page
- TypeScript path aliases resolve (`@/` → `src/`)

---

### [x] 0.2 — Install & Configure shadcn/ui / Εγκατάσταση shadcn/ui

**Description / Περιγραφή:**
Initialize shadcn/ui with the CLI. Install 25+ base components: Button, Input, Label, Card, Dialog, Sheet, DropdownMenu, Select, Checkbox, RadioGroup, Switch, Tabs, Table, Badge, Avatar, Separator, Skeleton, Tooltip, Popover, Command, Calendar, Form, Textarea, Alert, AlertDialog, Toast (Sonner), ScrollArea, Accordion, Progress, HoverCard.

**Key Files / Βασικά Αρχεία:**
- `components.json`
- `src/components/ui/*.tsx` (all shadcn components)
- `src/lib/utils.ts` (cn utility)

**Dependencies / Πακέτα:**
`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `next-themes`, `sonner`, `@radix-ui/*` (auto-installed by shadcn)

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- All installed components importable without errors
- `next-themes` ThemeProvider wraps root layout
- Sonner toast provider works
- Dark/light mode toggle renders correctly

---

### [x] 0.3 — Supabase Client Setup / Ρύθμιση Supabase Client

**Description / Περιγραφή:**
Create four Supabase client utilities: browser client (for Client Components), server client (for Server Components/Actions), middleware client (for Next.js middleware), and admin client (service role, for server-only operations). Add environment variables template.

**Key Files / Βασικά Αρχεία:**
- `src/lib/supabase/client.ts` (browser)
- `src/lib/supabase/server.ts` (server)
- `src/lib/supabase/middleware.ts` (middleware)
- `src/lib/supabase/admin.ts` (service role)
- `.env.local.example`
- `.env.local` (gitignored)
- `.gitignore` (ensure .env.local included)

**Dependencies / Πακέτα:**
`@supabase/supabase-js`, `@supabase/ssr`

**Subagent:** `backend-architect`

**Verification / Επαλήθευση:**
- All four client files export correctly typed functions
- Environment variables template has `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- TypeScript compilation succeeds
- `.env.local` is gitignored

---

### [x] 0.4 — Shared Types, Constants & Zod Schemas / Τύποι, Σταθερές & Zod Schemas

**Description / Περιγραφή:**
Define TypeScript types and Zod validation schemas for all database entities (clients, projects, tasks, deliverables, invoices, contracts, messages, filming requests, equipment lists, shot lists, concept notes, expenses, user profiles, notifications, activity log). Define constants for statuses, roles, project types, priorities, etc.

**Key Files / Βασικά Αρχεία:**
- `src/types/database.ts` (Supabase-generated types)
- `src/types/index.ts` (re-exports)
- `src/lib/schemas/client.ts`
- `src/lib/schemas/project.ts`
- `src/lib/schemas/task.ts`
- `src/lib/schemas/deliverable.ts`
- `src/lib/schemas/invoice.ts`
- `src/lib/schemas/contract.ts`
- `src/lib/schemas/message.ts`
- `src/lib/schemas/filming-request.ts`
- `src/lib/schemas/filming-prep.ts`
- `src/lib/schemas/expense.ts`
- `src/lib/schemas/auth.ts`
- `src/lib/constants.ts`

**Dependencies / Πακέτα:**
`zod`

**Subagent:** `typescript-pro`

**Verification / Επαλήθευση:**
- All schema files compile without errors
- Each entity has create, update, and response schemas
- Constants cover all enum values from PRD
- Types align with database schema from PRD

---

### [x] 0.5 — Reusable Shared Components / Επαναχρησιμοποιήσιμα Components

**Description / Περιγραφή:**
Build shared components used across the entire application: `DataTable` (with @tanstack/react-table: sorting, filtering, pagination, column visibility), `EmptyState` (icon + message + CTA), `PageHeader` (title, description, breadcrumbs, actions), `StatusBadge` (color-coded status display), `FileUploadDropzone` (drag-and-drop file upload area), `LoadingSpinner`, `ConfirmDialog`, `SearchInput` (debounced), `DateRangePicker`, `CurrencyDisplay`, `UserAvatar`.

**Key Files / Βασικά Αρχεία:**
- `src/components/shared/data-table.tsx`
- `src/components/shared/data-table-pagination.tsx`
- `src/components/shared/data-table-toolbar.tsx`
- `src/components/shared/data-table-column-header.tsx`
- `src/components/shared/empty-state.tsx`
- `src/components/shared/page-header.tsx`
- `src/components/shared/status-badge.tsx`
- `src/components/shared/file-upload-dropzone.tsx`
- `src/components/shared/loading-spinner.tsx`
- `src/components/shared/confirm-dialog.tsx`
- `src/components/shared/search-input.tsx`
- `src/components/shared/date-range-picker.tsx`
- `src/components/shared/currency-display.tsx`
- `src/components/shared/user-avatar.tsx`

**Dependencies / Πακέτα:**
`@tanstack/react-table`, `date-fns`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- All components render without errors
- DataTable accepts generic column definitions and data arrays
- File upload dropzone shows drag states correctly
- Components are properly typed with TypeScript generics where needed
- Build succeeds with all components imported

---

### [x] 0.6 — Supabase Project Init & Storage Config / Αρχικοποίηση Supabase & Storage

**Description / Περιγραφή:**
Initialize the local Supabase project (`supabase init`). Configure storage buckets: `avatars` (public, 5MB max, image types), `deliverables` (private, 5GB max, video types), `attachments` (private, 50MB max, common types), `receipts` (private, 10MB max, image/PDF), `contracts` (private, 10MB max, PDF). Create the Edge Functions directory structure.

**Key Files / Βασικά Αρχεία:**
- `supabase/config.toml`
- `supabase/seed.sql` (placeholder)
- `supabase/migrations/` (directory)
- `supabase/functions/` (directory)
- `supabase/functions/_shared/` (shared utilities)
- Storage bucket creation migration

**Dependencies / Πακέτα:**
Supabase CLI (installed globally or via npx)

**Subagent:** `backend-architect`

**Verification / Επαλήθευση:**
- `supabase start` runs successfully (Docker required)
- Storage buckets created with correct settings
- Edge Functions directory structure exists
- `supabase/config.toml` has correct local dev configuration

---

### [x] Phase 0 Complete / Ολοκλήρωση Phase 0

**Verification:** All 0.x tasks pass their tests. `npm run build` succeeds. Supabase local runs. All shared components render.

---

## Phase 1: Authentication & Authorization / Αυθεντικοποίηση & Εξουσιοδότηση

**Overview / Επισκόπηση:** Set up the authentication system with Supabase Auth, role-based access control via RLS, user profiles, middleware route protection, and the client invitation flow.

**Dependencies / Εξαρτήσεις:** Phase 0 complete.

---

### [x] 1.1 — Auth Database Tables & RLS / Πίνακες Auth & RLS

**Description / Περιγραφή:**
Create the first database migration with `user_profiles`, `activity_log`, and `notifications` tables. Enable RLS on all tables. Create policies: admins see all profiles, users see their own. Add a trigger that auto-creates a `user_profiles` row on `auth.users` insert (default role: `client`). Add an activity logging function.

**Key Files / Βασικά Αρχεία:**
- `supabase/migrations/00001_auth_tables.sql`

**Dependencies / Πακέτα:** None (SQL migration)

**Subagent:** `sql-pro`

**Verification / Επαλήθευση:**
- Migration applies without errors (`supabase db reset`)
- RLS is enabled on all three tables
- Trigger creates profile on user signup
- Admin policy allows full access
- User policy restricts to own data

---

### [x] 1.2 — Login & Signup Pages / Σελίδες Login & Signup

**Description / Περιγραφή:**
Build the authentication UI: `/login` page with email/password form and magic link option, `/signup` page for client invitation flow (receives token from URL), password reset flow. All forms use React Hook Form + Zod. Include error handling, loading states, and toast notifications.

**Key Files / Βασικά Αρχεία:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/signup/page.tsx`
- `src/app/(auth)/layout.tsx` (centered auth layout)
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/update-password/page.tsx`
- `src/app/auth/callback/route.ts` (Supabase auth callback)
- `src/app/auth/confirm/route.ts` (email confirmation)

**Dependencies / Πακέτα:**
`react-hook-form`, `@hookform/resolvers`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Login page renders with email/password and magic link options
- Form validation shows error messages for invalid input
- Auth callback route handles Supabase redirect correctly
- Build succeeds with all auth pages
- Signup page accepts invitation token from URL params

---

### [x] 1.3 — Middleware Route Protection / Middleware Προστασία Routes

**Description / Περιγραφή:**
Create Next.js middleware that: checks for valid Supabase session on protected routes, redirects unauthenticated users to `/login`, redirects authenticated users away from auth pages, routes users to the correct dashboard based on role (`/admin/dashboard` for admins, `/client/dashboard` for clients), refreshes the Supabase session token.

**Key Files / Βασικά Αρχεία:**
- `src/middleware.ts`
- `src/lib/supabase/middleware.ts` (update with auth logic)

**Subagent:** `backend-architect`

**Verification / Επαλήθευση:**
- Unauthenticated users redirected to `/login`
- Admin users can access `/admin/*` routes
- Client users can access `/client/*` routes
- Client users cannot access `/admin/*` routes (redirect to `/client/dashboard`)
- Auth pages redirect logged-in users to their dashboard
- Session refresh works correctly

---

### [x] 1.4 — Client Invitation System / Σύστημα Πρόσκλησης Πελατών

**Description / Περιγραφή:**
Build the admin-initiated client invitation flow: admin enters client email → system sends magic link invitation → client clicks link → redirected to onboarding/signup page → completes profile (display name, company, phone) → gets `client` role assigned. Create the server action and API route for sending invitations.

**Key Files / Βασικά Αρχεία:**
- `src/app/api/auth/invite/route.ts`
- `src/lib/actions/auth.ts` (server actions)
- `src/app/(auth)/signup/page.tsx` (update for invitation flow)
- `src/app/(auth)/onboarding/page.tsx` (profile completion)

**Subagent:** `backend-architect`

**Verification / Επαλήθευση:**
- API route sends invitation email via Supabase Auth
- Invitation link contains correct redirect URL
- Onboarding page captures required profile fields
- Profile is saved to `user_profiles` table
- Role is correctly set as `client`

---

### [x] 1.5 — Auth Context & Client-Side Hooks / Auth Context & Hooks

**Description / Περιγραφή:**
Create an `AuthProvider` context that wraps the app and provides: current user, user profile (with role), loading state, sign out function. Build custom hooks: `useAuth()` (user + profile + loading), `useRequireAuth()` (redirects if not authenticated), `useRequireRole(role)` (redirects if wrong role).

**Key Files / Βασικά Αρχεία:**
- `src/components/providers/auth-provider.tsx`
- `src/hooks/use-auth.ts`
- `src/hooks/use-require-auth.ts`
- `src/hooks/use-require-role.ts`
- `src/components/providers/index.tsx` (combines all providers)

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- AuthProvider initializes correctly with Supabase session
- `useAuth()` returns user, profile, and loading state
- Auth state updates on login/logout
- Role hooks redirect appropriately
- No hydration mismatches between server and client

---

### [x] Phase 1 Complete / Ολοκλήρωση Phase 1

**Verification:** Users can sign up, log in (email + password), receive magic link invitations, and are routed to the correct dashboard by role. RLS restricts data access correctly.

---

## Phase 2: Core Data & Layouts / Βασικά Δεδομένα & Layouts

**Overview / Επισκόπηση:** Create the complete database schema, generate TypeScript types, build the data access layer, and implement the admin and client layouts with navigation.

**Dependencies / Εξαρτήσεις:** Phase 1 complete.

---

### [x] 2.1 — Complete Database Schema / Πλήρες Schema Βάσης Δεδομένων

**Description / Περιγραφή:**
Create migrations for all remaining tables: `clients`, `projects`, `tasks`, `deliverables`, `video_annotations`, `invoices`, `expenses`, `messages`, `contracts`, `contract_templates`, `filming_requests`, `equipment_lists`, `shot_lists`, `concept_notes`. Enable RLS on every table with appropriate policies (admin full access, clients own-data only). Add indexes for common queries (client_id, project_id, status fields). Add `updated_at` triggers.

**Key Files / Βασικά Αρχεία:**
- `supabase/migrations/00002_core_tables.sql`
- `supabase/migrations/00003_rls_policies.sql`
- `supabase/migrations/00004_indexes_triggers.sql`

**Subagent:** `sql-pro`

**Verification / Επαλήθευση:**
- `supabase db reset` applies all migrations without errors
- All tables exist with correct columns and constraints
- RLS is enabled on every table
- Admin policies grant full access
- Client policies restrict to own data via joins
- Indexes exist on foreign keys and status columns
- `updated_at` triggers fire correctly

---

### [x] 2.2 — TypeScript Types & Data Access Layer / Τύποι TypeScript & Data Layer

**Description / Περιγραφή:**
Generate TypeScript types from Supabase schema (`supabase gen types typescript`). Create a data access layer with server actions and query functions for each entity: `getClients`, `getClient`, `createClient`, `updateClient`, `deleteClient` (and similar for all entities). Use the server Supabase client. Include proper error handling and type safety.

**Key Files / Βασικά Αρχεία:**
- `src/types/database.ts` (generated, update)
- `src/lib/actions/clients.ts`
- `src/lib/actions/projects.ts`
- `src/lib/actions/tasks.ts`
- `src/lib/actions/deliverables.ts`
- `src/lib/actions/invoices.ts`
- `src/lib/actions/contracts.ts`
- `src/lib/actions/messages.ts`
- `src/lib/actions/filming-requests.ts`
- `src/lib/actions/filming-prep.ts`
- `src/lib/actions/expenses.ts`
- `src/lib/queries/index.ts` (read-only query helpers)

**Subagent:** `backend-architect`

**Verification / Επαλήθευση:**
- Types match database schema
- All CRUD actions compile without type errors
- Server actions use `'use server'` directive
- Error handling returns typed results
- Zod schemas validate inputs before database operations

---

### [x] 2.3 — Admin Layout / Διάταξη Admin

**Description / Περιγραφή:**
Build the admin layout with: collapsible sidebar (logo, nav links with icons: Dashboard, Clients, Projects, Invoices, Calendar, Filming Prep, Reports, Settings), header (breadcrumbs, search, notifications bell, user menu with avatar), mobile responsive (sidebar becomes Sheet on mobile), dark/light mode toggle.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/layout.tsx`
- `src/components/admin/sidebar.tsx`
- `src/components/admin/sidebar-nav.tsx`
- `src/components/admin/header.tsx`
- `src/components/admin/breadcrumbs.tsx`
- `src/components/admin/user-nav.tsx`
- `src/components/admin/mobile-nav.tsx`
- `src/components/admin/notification-bell.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Sidebar renders with all navigation links
- Sidebar collapses/expands with smooth animation
- Breadcrumbs update based on current route
- User menu shows profile, settings, logout options
- Mobile layout uses Sheet for navigation
- Dark/light mode toggle works
- Active route is highlighted in sidebar

---

### [x] 2.4 — Client Layout / Διάταξη Client

**Description / Περιγραφή:**
Build the client layout with: simplified top navigation or minimal sidebar (Dashboard, My Projects, Invoices, Book Filming, Settings), mobile-first responsive design, prominent CTAs, notification indicator, user menu with avatar.

**Key Files / Βασικά Αρχεία:**
- `src/app/client/layout.tsx`
- `src/components/client/navbar.tsx`
- `src/components/client/mobile-nav.tsx`
- `src/components/client/user-nav.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Client layout renders with simplified navigation
- Navigation includes: Dashboard, Projects, Invoices, Book, Settings
- Mobile layout is clean and easy to use
- User menu works correctly
- Client cannot see admin-only nav items

---

### [x] 2.5 — Seed Data & Development Helpers / Δεδομένα Seed & Dev Helpers

**Description / Περιγραφή:**
Create seed data for development: 2 admin users, 5 client users with profiles, 8 projects (various statuses), 20 tasks, 5 invoices, 10 messages, sample contracts and templates. Create a dev helper page at `/dev` (only in development) that shows database status and quick actions.

**Key Files / Βασικά Αρχεία:**
- `supabase/seed.sql`
- `src/app/dev/page.tsx` (dev-only)

**Subagent:** `backend-architect`

**Verification / Επαλήθευση:**
- `supabase db reset` loads seed data
- All seeded users can log in
- Projects, tasks, invoices display correctly with seed data
- Dev page shows database statistics
- Seed data covers all entity types

---

### [x] Phase 2 Complete / Ολοκλήρωση Phase 2

**Verification:** Complete database with all tables, RLS, indexes. Both admin and client layouts render. Seed data populates. Data access layer is fully typed.

---

## Phase 3: Client Management / Διαχείριση Πελατών

**Overview / Επισκόπηση:** Build the client CRUD interface for admins: list, create, edit, and detail views.

**Dependencies / Εξαρτήσεις:** Phase 2 complete.

---

### [x] 3.1 — Client List Page / Σελίδα Λίστας Πελατών

**Description / Περιγραφή:**
Build `/admin/clients` page with DataTable showing all clients. Columns: avatar, name, company, email, status, projects count, last activity. Features: search by name/email, filter by status (active/inactive/lead), sort by any column, pagination (10/25/50 per page). Include "Add Client" button in page header.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/clients/page.tsx`
- `src/app/admin/clients/columns.tsx`
- `src/app/admin/clients/client-table-toolbar.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Table renders with all columns from seed data
- Search filters results in real-time
- Status filter works
- Sorting works on all columns
- Pagination controls function correctly
- Clicking a row navigates to client detail

---

### [x] 3.2 — Client Create & Edit Forms / Φόρμες Δημιουργίας & Επεξεργασίας Πελάτη

**Description / Περιγραφή:**
Build client creation form (Dialog or separate page): contact name, company, email, phone, address, VAT number, notes, avatar upload, option to send invitation. Build edit form (pre-populated). Both forms use React Hook Form + Zod validation. Avatar uploads to Supabase Storage `avatars` bucket.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/clients/new/page.tsx` (or Dialog component)
- `src/app/admin/clients/[clientId]/edit/page.tsx`
- `src/components/admin/clients/client-form.tsx`
- `src/lib/actions/clients.ts` (update with create/edit actions)

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Form validates all required fields
- Email uniqueness is checked
- Avatar upload works (preview shown)
- Create action saves to database and redirects
- Edit form pre-populates existing data
- Invitation option triggers magic link email
- Toast notification on success/error

---

### [x] 3.3 — Client Detail / Profile Page / Σελίδα Προφίλ Πελάτη

**Description / Περιγραφή:**
Build `/admin/clients/[clientId]` page with tabbed layout. Tabs: **Overview** (contact info, stats), **Projects** (list of client's projects with status), **Invoices** (client's invoices with payment status), **Activity** (activity log for this client). Include edit button, status toggle, and delete with confirmation.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/clients/[clientId]/page.tsx`
- `src/app/admin/clients/[clientId]/layout.tsx`
- `src/components/admin/clients/client-overview.tsx`
- `src/components/admin/clients/client-projects.tsx`
- `src/components/admin/clients/client-invoices.tsx`
- `src/components/admin/clients/client-activity.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Profile page loads client data correctly
- All tabs render their respective content
- Projects tab shows linked projects with status badges
- Invoices tab shows payment status
- Activity tab shows chronological log
- Edit button navigates to edit form
- Delete shows confirmation dialog and cascades properly

---

### [x] Phase 3 Complete / Ολοκλήρωση Phase 3

**Verification:** Full client CRUD works. List searchable/filterable. Detail page shows all tabs. Avatar upload functional.

---

## Phase 4: Project Management / Διαχείριση Projects

**Overview / Επισκόπηση:** Build the project management interface with Kanban board, list view, create/edit forms, and detailed project page.

**Dependencies / Εξαρτήσεις:** Phase 3 complete.

---

### [x] 4.1 — Project List: Kanban & List Views / Λίστα Projects: Kanban & List

**Description / Περιγραφή:**
Build `/admin/projects` page with toggle between Kanban board and list view. **Kanban:** columns for each status (briefing → pre_production → filming → editing → review → revisions → delivered → archived), drag & drop cards between columns to change status, cards show title, client name, priority badge, deadline. **List view:** DataTable with columns for title, client, status, priority, deadline, budget.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/projects/page.tsx`
- `src/components/admin/projects/project-board.tsx`
- `src/components/admin/projects/project-card.tsx`
- `src/components/admin/projects/project-column.tsx`
- `src/components/admin/projects/project-list.tsx`
- `src/components/admin/projects/project-list-columns.tsx`
- `src/components/admin/projects/view-toggle.tsx`

**Dependencies / Πακέτα:**
`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Kanban board renders all status columns
- Project cards display correctly in their columns
- Drag & drop changes project status
- Status change persists to database
- List view shows all projects with DataTable features
- Toggle between views preserves data
- "New Project" button in page header

---

### [x] 4.2 — Project Create & Edit Forms / Φόρμες Δημιουργίας & Επεξεργασίας Project

**Description / Περιγραφή:**
Build project creation form: title, description, client selector (searchable dropdown), project type, priority, start date, deadline, budget. Build edit form with pre-populated data. Both use React Hook Form + Zod. Client selector queries the clients table.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/projects/new/page.tsx`
- `src/app/admin/projects/[projectId]/edit/page.tsx`
- `src/components/admin/projects/project-form.tsx`
- `src/components/admin/projects/client-selector.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Client selector loads and filters client list
- All fields validate correctly
- Dates enforce start_date ≤ deadline
- Budget accepts decimal values
- Create saves to database and redirects to project detail
- Edit pre-populates all fields

---

### [x] 4.3 — Project Detail Page / Σελίδα Λεπτομερειών Project

**Description / Περιγραφή:**
Build `/admin/projects/[projectId]` page with tabbed layout. Tabs: **Overview** (project info, client link, status, timeline, budget), **Tasks** (placeholder — built in Phase 5), **Deliverables** (placeholder — Phase 7), **Messages** (placeholder — Phase 9), **Contracts** (placeholder — Phase 10). Overview shows key metrics: task completion %, budget spent, days remaining.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/projects/[projectId]/page.tsx`
- `src/app/admin/projects/[projectId]/layout.tsx`
- `src/components/admin/projects/project-overview.tsx`
- `src/components/admin/projects/project-tabs.tsx`
- `src/components/admin/projects/project-header.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Project detail page loads data correctly
- Tab navigation works (active tab highlighted)
- Overview shows all project information
- Status badge and priority badge render correctly
- Client name links to client profile
- Edit/delete buttons work
- Placeholder tabs show empty states with helpful messages

---

### [x] Phase 4 Complete / Ολοκλήρωση Phase 4

**Verification:** Projects CRUD works. Kanban drag-and-drop updates status. List view sorts/filters. Project detail shows overview with tabs.

---

## Phase 5: Task Management / Διαχείριση Εργασιών

**Overview / Επισκόπηση:** Build per-project task management with Kanban board and task detail editing.

**Dependencies / Εξαρτήσεις:** Phase 4 complete.

---

### [x] 5.1 — Task Kanban Board / Kanban Εργασιών

**Description / Περιγραφή:**
Build the Tasks tab content within `/admin/projects/[projectId]/tasks`. Kanban board with columns: To Do, In Progress, Review, Done. Each card shows: title, priority badge, assignee avatar, due date. Drag & drop between columns. Quick-add input at the bottom of each column (just title, creates with defaults). Filter by assignee and priority.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/projects/[projectId]/tasks/page.tsx`
- `src/components/admin/tasks/task-board.tsx`
- `src/components/admin/tasks/task-column.tsx`
- `src/components/admin/tasks/task-card.tsx`
- `src/components/admin/tasks/quick-add-task.tsx`
- `src/components/admin/tasks/task-filters.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Kanban board renders four columns
- Task cards display within correct columns
- Drag & drop changes task status and persists
- Quick-add creates a task at the end of the column
- Filters narrow displayed tasks
- Clicking a card opens task detail (5.2)

---

### [x] 5.2 — Task Detail & Editing / Λεπτομέρειες & Επεξεργασία Εργασίας

**Description / Περιγραφή:**
Build task detail view (Sheet/Dialog): editable title, description (textarea), status selector, priority selector, assignee selector (team members dropdown), due date picker, sub-tasks checklist (add/remove/toggle sub-items). Include delete button with confirmation.

**Key Files / Βασικά Αρχεία:**
- `src/components/admin/tasks/task-detail-sheet.tsx`
- `src/components/admin/tasks/task-form.tsx`
- `src/components/admin/tasks/sub-task-list.tsx`
- `src/lib/actions/tasks.ts` (update with sub-task logic)

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Task detail opens from card click
- All fields are editable and save on change
- Sub-task checklist adds, removes, and toggles items
- Assignee dropdown shows team members
- Due date picker works
- Delete removes task and refreshes board
- Changes reflect immediately in the Kanban board

---

### [x] Phase 5 Complete / Ολοκλήρωση Phase 5

**Verification:** Task Kanban board works per project. Drag & drop updates status. Task detail edits and sub-tasks function.

---

## Phase 6: Filming Preparation / Προετοιμασία Γυρισμάτων

**Overview / Επισκόπηση:** Build the filming preparation tools: equipment checklists, shot lists, and concept notes.

**Dependencies / Εξαρτήσεις:** Phase 4 complete.

---

### [x] 6.1 — Equipment Checklist / Λίστα Εξοπλισμού

**Description / Περιγραφή:**
Build `/admin/filming-prep/[projectId]` page — Equipment tab. Interactive checklist: add items (name, quantity, notes), toggle checked/unchecked, drag to reorder, delete items. Include template system: save current list as template, load from template. Bulk actions: check all, uncheck all.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/filming-prep/[projectId]/page.tsx`
- `src/app/admin/filming-prep/[projectId]/layout.tsx`
- `src/components/admin/filming-prep/equipment-checklist.tsx`
- `src/components/admin/filming-prep/equipment-item.tsx`
- `src/components/admin/filming-prep/equipment-template-dialog.tsx`
- `src/lib/actions/filming-prep.ts`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Items can be added, edited, checked, reordered, deleted
- Data persists to `equipment_lists` table (JSONB items)
- Template save/load works
- Drag reorder updates sort positions
- Empty state shows when no items exist

---

### [x] 6.2 — Shot List Manager / Διαχείριση Shot List

**Description / Περιγραφή:**
Build Shot List tab within filming prep. Table-based interface: shot number (auto-increment), description, shot type (wide/medium/close-up/detail/aerial/etc.), location, estimated duration, notes, completed checkbox. Add rows, delete rows, reorder. Template system similar to equipment.

**Key Files / Βασικά Αρχεία:**
- `src/components/admin/filming-prep/shot-list.tsx`
- `src/components/admin/filming-prep/shot-list-row.tsx`
- `src/components/admin/filming-prep/shot-list-template-dialog.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Table renders with all columns
- Rows can be added, edited, reordered, deleted
- Shot numbers auto-increment
- Completed checkbox toggles correctly
- Data persists to `shot_lists` table
- Templates can be saved and loaded

---

### [x] 6.3 — Concept Notes / Σημειώσεις Concept

**Description / Περιγραφή:**
Build Concept Notes tab within filming prep. Rich text editor using Tiptap: bold, italic, headings, lists, links, images. Support for image attachments (upload to Storage). CRUD: create notes with title, edit content, delete. List of notes in a sidebar/list.

**Key Files / Βασικά Αρχεία:**
- `src/components/admin/filming-prep/concept-notes.tsx`
- `src/components/admin/filming-prep/concept-note-editor.tsx`
- `src/components/admin/filming-prep/concept-note-list.tsx`
- `src/components/shared/tiptap-editor.tsx`

**Dependencies / Πακέτα:**
`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Tiptap editor renders with toolbar (bold, italic, headings, lists, link, image)
- Notes can be created with title + content
- Image upload inserts into editor content
- Notes list shows all notes for the project
- Editing a note preserves content and saves
- Delete removes note with confirmation

---

### [x] Phase 6 Complete / Ολοκλήρωση Phase 6

**Verification:** All three filming prep tools work. Equipment checklists, shot lists, and concept notes with rich text all persist and render.

---

## Phase 7: Video Delivery & Review / Παράδοση & Αξιολόγηση Video

**Overview / Επισκόπηση:** Build the video upload system, video player with timeline annotations, and the approval/versioning workflow.

**Dependencies / Εξαρτήσεις:** Phase 4 complete.

---

### [x] 7.1 — Video Upload System / Σύστημα Ανεβάσματος Video

**Description / Περιγραφή:**
Build video upload within the project Deliverables tab. Features: drag-and-drop upload zone, resumable uploads using TUS protocol (for large files up to 5GB), progress bar with percentage and speed, file metadata extraction (size, type), upload to Supabase Storage `deliverables` bucket with structured path (`/projects/{id}/v{version}/{filename}`). Create deliverable record in database on successful upload.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/projects/[projectId]/deliverables/page.tsx`
- `src/components/admin/deliverables/video-upload.tsx`
- `src/components/admin/deliverables/upload-progress.tsx`
- `src/components/admin/deliverables/deliverable-list.tsx`
- `src/lib/actions/deliverables.ts` (update)

**Dependencies / Πακέτα:**
`tus-js-client`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Drag-and-drop zone accepts video files only
- Upload progress bar shows percentage
- Large file upload can resume after interruption
- Deliverable record created in database
- File stored in Supabase Storage with correct path
- Deliverable list shows uploaded files with metadata

---

### [x] 7.2 — Video Player with Annotations / Video Player με Σημειώσεις

**Description / Περιγραφή:**
Build a custom video player using Video.js: play/pause, seek, volume, fullscreen, playback speed. Add annotation layer: click on timeline to add a timestamped note, markers visible on the timeline, annotation list next to player (sorted by timestamp), click annotation to seek to timestamp. Admin and client can both add annotations. Mark annotations as resolved.

**Key Files / Βασικά Αρχεία:**
- `src/components/shared/video-player.tsx`
- `src/components/shared/video-annotations.tsx`
- `src/components/shared/annotation-marker.tsx`
- `src/components/shared/annotation-list.tsx`
- `src/components/shared/add-annotation-dialog.tsx`
- `src/lib/actions/deliverables.ts` (annotation CRUD)

**Dependencies / Πακέτα:**
`video.js`, `@types/video.js`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Video player loads and plays video from signed URL
- Timeline shows annotation markers at correct positions
- Clicking timeline opens annotation input at that timestamp
- Annotation list shows all notes sorted by time
- Clicking an annotation seeks video to that timestamp
- Annotations persist to `video_annotations` table
- Resolved toggle works

---

### [x] 7.3 — Approval Flow & Version History / Ροή Έγκρισης & Ιστορικό Εκδόσεων

**Description / Περιγραφή:**
Build the deliverable approval workflow: status flow (pending_review → approved / revision_requested → final). Client can approve or request revision (with required comment). Admin can mark as final. Version history: uploading a new file for the same deliverable increments the version number. All versions viewable with comparison. Signed download URLs with optional expiry.

**Key Files / Βασικά Αρχεία:**
- `src/components/admin/deliverables/approval-actions.tsx`
- `src/components/admin/deliverables/version-history.tsx`
- `src/components/admin/deliverables/deliverable-detail.tsx`
- `src/lib/actions/deliverables.ts` (approval + version logic)

**Subagent:** `backend-architect`

**Verification / Επαλήθευση:**
- Status changes work: pending_review → approved or revision_requested
- Revision request requires a comment
- Admin can mark approved deliverable as final
- New upload increments version number
- Version history shows all versions with dates
- Signed download URLs are generated correctly
- Download count increments on access

---

### [x] Phase 7 Complete / Ολοκλήρωση Phase 7

**Verification:** Video upload, playback, annotations, approval workflow, and versioning all work. Signed URLs serve private video files.

---

## Phase 8: Invoices & Payments / Τιμολόγηση & Πληρωμές

**Overview / Επισκόπηση:** Build the invoice system with line items, PDF generation, Stripe payment integration, and expense tracking.

**Dependencies / Εξαρτήσεις:** Phase 3 complete (needs clients).

---

### [x] 8.1 — Invoice Builder & CRUD / Δημιουργός Τιμολογίων & CRUD

**Description / Περιγραφή:**
Build `/admin/invoices` list page and invoice builder. **List:** DataTable with columns: invoice #, client, amount, status, issue date, due date. Filter by status, quarter. **Builder:** dynamic line items (description, quantity, unit price → auto-calculated line total), auto ΦΠΑ 24% calculation, auto-numbering (DMS-YYYY-XXX format), notes field, client + project selectors. **Statuses:** draft, sent, viewed, paid, overdue, cancelled.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/invoices/page.tsx`
- `src/app/admin/invoices/new/page.tsx`
- `src/app/admin/invoices/[invoiceId]/page.tsx`
- `src/app/admin/invoices/[invoiceId]/edit/page.tsx`
- `src/components/admin/invoices/invoice-form.tsx`
- `src/components/admin/invoices/line-items-editor.tsx`
- `src/components/admin/invoices/invoice-summary.tsx`
- `src/components/admin/invoices/invoice-list-columns.tsx`
- `src/lib/actions/invoices.ts`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Invoice list renders with all columns and filters
- Line items add/remove dynamically
- Subtotal, tax (24%), and total calculate automatically
- Invoice number auto-generates in DMS-YYYY-XXX format
- CRUD operations persist to database
- Status badge shows correct colors per status

---

### [x] 8.2 — PDF Generation / Δημιουργία PDF

**Description / Περιγραφή:**
Build PDF invoice generation using @react-pdf/renderer. Branded template with: Devre Media logo, company info, client info, invoice number + dates, line items table, subtotal/tax/total, payment terms, bank details. Generate on demand (view/download) and store in Supabase Storage for sent invoices.

**Key Files / Βασικά Αρχεία:**
- `src/components/admin/invoices/invoice-pdf.tsx`
- `src/app/api/invoices/[invoiceId]/pdf/route.ts`
- `src/lib/pdf/invoice-template.tsx`

**Dependencies / Πακέτα:**
`@react-pdf/renderer`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- PDF renders with all invoice data correctly
- Layout is professional and branded
- Line items table formats properly
- Tax calculation matches invoice data
- PDF can be downloaded or viewed inline
- Stored PDF URL saved to database

---

### [x] 8.3 — Stripe Payment Integration / Ενσωμάτωση Πληρωμών Stripe

**Description / Περιγραφή:**
Integrate Stripe for online payments. Create Checkout Session from invoice → client pays → webhook updates invoice status to "paid". Support: card payments, manual payment marking (bank transfer). Webhook endpoint handles: `checkout.session.completed`, `payment_intent.succeeded`. Store Stripe payment intent ID on invoice.

**Key Files / Βασικά Αρχεία:**
- `src/app/api/invoices/[invoiceId]/pay/route.ts`
- `src/app/api/webhooks/stripe/route.ts`
- `src/lib/stripe.ts` (Stripe client config)
- `src/components/admin/invoices/payment-actions.tsx`
- `src/components/admin/invoices/manual-payment-dialog.tsx`

**Dependencies / Πακέτα:**
`stripe`

**Subagent:** `backend-architect`

**Verification / Επαλήθευση:**
- Stripe Checkout session creates with correct amount and metadata
- Webhook endpoint verifies Stripe signature
- Successful payment updates invoice status to "paid"
- `paid_at` timestamp recorded
- Stripe payment intent ID stored on invoice
- Manual payment marking works
- Error handling for failed payments

---

### [x] 8.4 — Expense Tracking & Export / Παρακολούθηση Εξόδων & Εξαγωγή

**Description / Περιγραφή:**
Build expense tracking: add expenses per project (category, description, amount, date, receipt upload). Expense list with filters. **Quarterly export:** select quarter → generate CSV of invoices + PDF bundle of all invoice PDFs + expense summary. Download as ZIP.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/invoices/expenses/page.tsx`
- `src/components/admin/invoices/expense-form.tsx`
- `src/components/admin/invoices/expense-list.tsx`
- `src/components/admin/invoices/quarterly-export.tsx`
- `src/app/api/invoices/export/route.ts`
- `src/lib/actions/expenses.ts`

**Dependencies / Πακέτα:**
`file-saver`, `jszip`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Expenses can be created, listed, filtered
- Receipt upload stores to Supabase Storage
- Quarterly export generates CSV with correct data
- ZIP file includes CSV + PDF invoices
- Download triggers browser save dialog
- Category filter and date range work

---

### [x] Phase 8 Complete / Ολοκλήρωση Phase 8

**Verification:** Full invoice lifecycle works. PDFs generate correctly. Stripe payments process. Expenses track. Quarterly export downloads.

---

## Phase 9: Messaging System / Σύστημα Μηνυμάτων

**Overview / Επισκόπηση:** Build real-time per-project messaging between admin and client with file attachments and notifications.

**Dependencies / Εξαρτήσεις:** Phase 4 complete.

---

### [x] 9.1 — Message Thread UI / UI Νημάτων Μηνυμάτων

**Description / Περιγραφή:**
Build the Messages tab within project detail. Chat-style interface: message bubbles (own = right, other = left), timestamps, sender avatar + name, file attachment support (images inline, other files as download links), input area with text + file upload button, auto-scroll to latest message, message loading skeleton.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/projects/[projectId]/messages/page.tsx`
- `src/components/shared/message-thread.tsx`
- `src/components/shared/message-bubble.tsx`
- `src/components/shared/message-input.tsx`
- `src/components/shared/message-attachment.tsx`
- `src/lib/actions/messages.ts`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Messages render in chat-style layout
- Own messages appear on the right, others on the left
- File attachments upload and display correctly
- New messages appear at the bottom with auto-scroll
- Loading skeleton shows during data fetch
- Input validates non-empty messages

---

### [x] 9.2 — Real-time Subscriptions & Read Receipts / Real-time & Read Receipts

**Description / Περιγραφή:**
Add Supabase Realtime subscriptions to the message thread: new messages appear instantly without refresh. Implement read receipts: when a user views the thread, mark all messages as read (update `read_by` JSONB array). Show read status indicators. Unread message count badge in sidebar navigation.

**Key Files / Βασικά Αρχεία:**
- `src/hooks/use-realtime-messages.ts`
- `src/hooks/use-unread-count.ts`
- `src/components/shared/message-thread.tsx` (update)
- `src/components/shared/read-receipt-indicator.tsx`
- `src/components/admin/sidebar.tsx` (update with unread badge)

**Subagent:** `backend-architect`

**Verification / Επαλήθευση:**
- New messages from other users appear in real-time
- Read receipts update when thread is viewed
- Unread count badge shows in navigation
- Badge updates when messages are read
- Subscription cleans up on unmount
- Multiple users see real-time updates simultaneously

---

### [x] 9.3 — Email Notifications / Ειδοποιήσεις Email

**Description / Περιγραφή:**
Create a Supabase Edge Function that sends email notifications (via Resend) when a message is received and the recipient is offline (not currently viewing the thread). Trigger: database webhook on `messages` INSERT. Email includes: sender name, message preview, link to the project thread. Rate limit: max 1 email per thread per 15 minutes.

**Key Files / Βασικά Αρχεία:**
- `supabase/functions/notify-message/index.ts`
- `supabase/functions/_shared/resend.ts`
- `supabase/functions/_shared/email-templates.ts`

**Dependencies / Πακέτα:**
`resend` (in Edge Function)

**Subagent:** `backend-architect`

**Verification / Επαλήθευση:**
- Edge Function deploys without errors
- Email sends on new message (test with Resend sandbox)
- Rate limiting prevents email spam
- Email contains correct sender, preview, and link
- No email sent if recipient is currently online

---

### [x] Phase 9 Complete / Ολοκλήρωση Phase 9

**Verification:** Real-time messaging works between admin and client. File attachments upload/display. Read receipts track. Email notifications fire for offline users.

---

## Phase 10: Contract Management / Διαχείριση Συμβολαίων

**Overview / Επισκόπηση:** Build contract templates, creation from templates, e-signature, and PDF generation for signed contracts.

**Dependencies / Εξαρτήσεις:** Phase 4 complete.

---

### [x] 10.1 — Contract Templates CRUD / CRUD Προτύπων Συμβολαίων

**Description / Περιγραφή:**
Build `/admin/settings/contract-templates` page. Template management: create templates with rich text content (Tiptap editor), define placeholders like `{client_name}`, `{project_title}`, `{amount}`, `{date}`. Template list with edit/delete. Placeholder system: define placeholder key, label, and type (text/date/currency).

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/settings/contract-templates/page.tsx`
- `src/components/admin/contracts/template-form.tsx`
- `src/components/admin/contracts/template-list.tsx`
- `src/components/admin/contracts/placeholder-manager.tsx`
- `src/lib/actions/contracts.ts`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Templates can be created with rich text content
- Placeholders are defined and displayed in the template
- Template list shows all templates
- Edit and delete work
- Placeholder system stores correctly in JSONB

---

### [x] 10.2 — Contract Creation & Auto-fill / Δημιουργία Συμβολαίου & Αυτόματη Συμπλήρωση

**Description / Περιγραφή:**
Build contract creation within project detail: select template → auto-fill placeholders from project/client data (client name, project title, dates, amount) → admin can override any field → preview rendered contract → save as draft. Contract status flow: draft → sent → viewed → signed.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/projects/[projectId]/contracts/page.tsx`
- `src/app/admin/projects/[projectId]/contracts/new/page.tsx`
- `src/components/admin/contracts/contract-creator.tsx`
- `src/components/admin/contracts/contract-preview.tsx`
- `src/components/admin/contracts/contract-list.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Template selector loads available templates
- Placeholders auto-fill from project/client data
- Admin can override auto-filled values
- Preview shows the rendered contract
- Contract saves as draft
- Contract list shows all contracts for the project

---

### [x] 10.3 — E-Signature Canvas & PDF / Ηλεκτρονική Υπογραφή & PDF

**Description / Περιγραφή:**
Build the client-facing contract signing page. Display the full contract content. Provide a canvas-based signature pad. On sign: capture signature image, IP address, user agent, timestamp. Generate a signed PDF with the contract content + signature image + audit trail footer. Store PDF in Supabase Storage.

**Key Files / Βασικά Αρχεία:**
- `src/app/client/projects/[projectId]/contracts/[contractId]/sign/page.tsx`
- `src/components/shared/signature-pad.tsx`
- `src/components/shared/contract-view.tsx`
- `src/lib/pdf/contract-template.tsx`
- `src/app/api/contracts/[contractId]/sign/route.ts`
- `src/app/api/contracts/[contractId]/pdf/route.ts`

**Dependencies / Πακέτα:**
`react-signature-canvas`, `@types/react-signature-canvas`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Contract content renders correctly for client
- Signature pad captures drawn signature
- Clear and redo buttons work on signature pad
- Sign action stores signature data (image, IP, UA, timestamp)
- PDF generates with contract content + signature
- PDF stored in Supabase Storage
- Contract status updates to "signed"

---

### [x] 10.4 — Contract Reminders / Υπενθυμίσεις Συμβολαίων

**Description / Περιγραφή:**
Create a Supabase Edge Function (cron-triggered, daily) that checks for unsigned contracts approaching expiry. Sends reminder emails via Resend to clients. Auto-expires contracts past their `expires_at` date (status → expired). Configurable reminder intervals (e.g., 7 days, 3 days, 1 day before expiry).

**Key Files / Βασικά Αρχεία:**
- `supabase/functions/contract-reminders/index.ts`
- `supabase/functions/_shared/email-templates.ts` (update)

**Subagent:** `backend-architect`

**Verification / Επαλήθευση:**
- Edge Function deploys and runs on cron schedule
- Reminder emails sent at correct intervals
- Expired contracts auto-update status
- No duplicate reminders sent
- Signed contracts are excluded from reminders

---

### [x] Phase 10 Complete / Ολοκλήρωση Phase 10

**Verification:** Contract templates work. Auto-fill from project data. E-signature captures and generates PDF. Reminders send and contracts auto-expire.

---

## Phase 11: Client Portal & Filming Requests / Client Portal & Αιτήματα Γυρισμάτων

**Overview / Επισκόπηση:** Build all client-facing pages: dashboard, project view, invoice payments, filming request wizard, and settings.

**Dependencies / Εξαρτήσεις:** Phases 7, 8, 9, 10 complete.

---

### [x] 11.1 — Client Dashboard / Client Dashboard

**Description / Περιγραφή:**
Build `/client/dashboard` page. Widgets: My Active Projects (cards with status), Pending Actions (contracts to sign, videos to review, invoices to pay — with direct action buttons), Recent Deliverables (latest uploads with thumbnails), Unread Messages (count + quick link), Upcoming Filmings (scheduled dates).

**Key Files / Βασικά Αρχεία:**
- `src/app/client/dashboard/page.tsx`
- `src/components/client/dashboard/active-projects.tsx`
- `src/components/client/dashboard/pending-actions.tsx`
- `src/components/client/dashboard/recent-deliverables.tsx`
- `src/components/client/dashboard/upcoming-filmings.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Dashboard loads client-specific data only (RLS enforced)
- Active projects show with correct status
- Pending actions list items requiring attention
- Action buttons navigate to correct pages
- Empty states show when no data
- Mobile layout is clean and usable

---

### [x] 11.2 — Client Project View & Deliverable Review / Προβολή Project & Review Πελάτη

**Description / Περιγραφή:**
Build `/client/projects/[projectId]` page. Read-only project overview. Deliverables tab: reuse video player component (Phase 7), client can add annotations, approve or request revision. Messages tab: reuse message thread (Phase 9). Contracts tab: view and sign contracts (Phase 10).

**Key Files / Βασικά Αρχεία:**
- `src/app/client/projects/page.tsx`
- `src/app/client/projects/[projectId]/page.tsx`
- `src/app/client/projects/[projectId]/deliverables/page.tsx`
- `src/app/client/projects/[projectId]/messages/page.tsx`
- `src/app/client/projects/[projectId]/contracts/page.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Client sees only their own projects (RLS)
- Project overview is read-only
- Video player loads and plays deliverables
- Client can add annotations and approve/request revision
- Message thread works in real-time
- Contract viewing and signing works

---

### [x] 11.3 — Client Invoice View & Payment / Προβολή Τιμολογίου & Πληρωμή Πελάτη

**Description / Περιγραφή:**
Build `/client/invoices` page. List client's invoices with status badges. Invoice detail view shows full invoice data. "Pay Now" button creates Stripe Checkout session and redirects. Payment success/cancel return pages. Invoice PDF download.

**Key Files / Βασικά Αρχεία:**
- `src/app/client/invoices/page.tsx`
- `src/app/client/invoices/[invoiceId]/page.tsx`
- `src/components/client/invoices/invoice-detail.tsx`
- `src/components/client/invoices/pay-button.tsx`
- `src/app/client/invoices/[invoiceId]/success/page.tsx`
- `src/app/client/invoices/[invoiceId]/cancel/page.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Client sees only their own invoices (RLS)
- Invoice detail shows all line items and totals
- "Pay Now" redirects to Stripe Checkout
- Success page confirms payment
- Cancel page allows retry
- PDF download works
- Paid invoices show "Paid" badge

---

### [x] 11.4 — Filming Request Wizard / Οδηγός Αιτήματος Γυρίσματος

**Description / Περιγραφή:**
Build `/client/book` page. Multi-step booking wizard: Step 1 — project type selection (cards), Step 2 — description + reference links/files, Step 3 — preferred dates (calendar picker, multiple dates), Step 4 — location + budget range, Step 5 — review & submit. Admin notification on submission. Admin review page to accept/decline/convert to project.

**Key Files / Βασικά Αρχεία:**
- `src/app/client/book/page.tsx`
- `src/components/client/book/booking-wizard.tsx`
- `src/components/client/book/step-project-type.tsx`
- `src/components/client/book/step-details.tsx`
- `src/components/client/book/step-dates.tsx`
- `src/components/client/book/step-location.tsx`
- `src/components/client/book/step-review.tsx`
- `src/app/admin/filming-requests/page.tsx`
- `src/app/admin/filming-requests/[requestId]/page.tsx`
- `src/lib/actions/filming-requests.ts`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Wizard progresses through all 5 steps
- Back/next navigation works
- File upload for references works
- Date picker allows multiple date selection
- Review step shows all entered data
- Submit creates `filming_requests` record
- Admin sees pending requests in list
- Admin can accept/decline with notes
- Accept → auto-creates project with request data

---

### [x] 11.5 — Client Settings & Profile / Ρυθμίσεις & Προφίλ Πελάτη

**Description / Περιγραφή:**
Build `/client/settings` page. Sections: Profile (display name, avatar, company, phone — editable), Notification Preferences (email notifications on/off per type), Change Password. Avatar upload to Supabase Storage.

**Key Files / Βασικά Αρχεία:**
- `src/app/client/settings/page.tsx`
- `src/components/client/settings/profile-form.tsx`
- `src/components/client/settings/notification-preferences.tsx`
- `src/components/client/settings/change-password.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Profile fields load and save correctly
- Avatar upload shows preview and persists
- Notification preferences toggle and save
- Password change validates and updates
- Toast notifications on save success/error

---

### [x] Phase 11 Complete / Ολοκλήρωση Phase 11

**Verification:** Full client portal works. Dashboard shows relevant data. Projects viewable with deliverable review. Invoices payable. Filming requests submitted and processed. Settings editable.

---

## Phase 12: Admin Dashboard, Calendar & Reports / Admin Dashboard, Ημερολόγιο & Αναφορές

**Overview / Επισκόπηση:** Build the admin dashboard KPIs, calendar view, reports/analytics, and admin settings.

**Dependencies / Εξαρτήσεις:** Phase 11 complete.

---

### [x] 12.1 — Admin Dashboard KPIs & Widgets / Admin Dashboard KPIs & Widgets

**Description / Περιγραφή:**
Build `/admin/dashboard` page. KPI cards: Active Projects (count), Revenue This Month (sum), Pending Invoices (count + total), Upcoming Deadlines (count). Widgets: Revenue chart (bar chart, last 6 months), Recent Activity feed (timeline of actions from activity_log), Pending Actions (items needing attention). All data fetched via server components.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/dashboard/page.tsx`
- `src/components/admin/dashboard/kpi-cards.tsx`
- `src/components/admin/dashboard/revenue-chart.tsx`
- `src/components/admin/dashboard/activity-feed.tsx`
- `src/components/admin/dashboard/pending-actions.tsx`

**Dependencies / Πακέτα:**
`recharts`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- KPI cards show correct numbers from database
- Revenue chart renders with correct data
- Activity feed shows recent actions chronologically
- Pending actions link to relevant pages
- Dashboard is responsive (cards stack on mobile)
- Data updates on refresh

---

### [x] 12.2 — Calendar View / Προβολή Ημερολογίου

**Description / Περιγραφή:**
Build `/admin/calendar` page using FullCalendar. Display: filming dates (from projects), task deadlines, invoice due dates. Color-coded by type. Month/week/day views. Click event to navigate to the relevant entity. Create event dialog for quick task/filming date creation.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/calendar/page.tsx`
- `src/components/admin/calendar/calendar-view.tsx`
- `src/components/admin/calendar/event-dialog.tsx`
- `src/lib/queries/calendar.ts`

**Dependencies / Πακέτα:**
`@fullcalendar/core`, `@fullcalendar/daygrid`, `@fullcalendar/timegrid`, `@fullcalendar/interaction`, `@fullcalendar/react`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- Calendar renders with month/week/day views
- Events show from projects, tasks, and invoices
- Events are color-coded by type
- Clicking an event navigates to the entity
- Quick-create dialog works
- Calendar is responsive

---

### [x] 12.3 — Reports & Analytics / Αναφορές & Analytics

**Description / Περιγραφή:**
Build `/admin/reports` page. Sections: **Revenue** (monthly/quarterly/annual revenue, payment method breakdown), **Projects** (completed vs active, average project duration, projects by type pie chart), **Clients** (top clients by revenue, client acquisition over time), **Expenses** (expense by category, profit margin). Charts use Recharts. Date range filter for all reports.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/reports/page.tsx`
- `src/components/admin/reports/revenue-report.tsx`
- `src/components/admin/reports/project-report.tsx`
- `src/components/admin/reports/client-report.tsx`
- `src/components/admin/reports/expense-report.tsx`
- `src/components/admin/reports/date-range-filter.tsx`
- `src/lib/queries/reports.ts`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- All report sections render with charts
- Date range filter updates all charts
- Revenue numbers match invoice data
- Project statistics are accurate
- Charts are responsive and readable
- Data loads without errors

---

### [x] 12.4 — Admin Settings / Ρυθμίσεις Admin

**Description / Περιγραφή:**
Build `/admin/settings` page. Sections: **Team Management** (invite team members, manage roles, deactivate accounts), **Company Profile** (company name, logo, address — used in invoices/contracts), **Branding** (primary color, logo upload), **Stripe Configuration** (API keys input, webhook URL display), **Notification Settings** (email notification rules). Super admin only.

**Key Files / Βασικά Αρχεία:**
- `src/app/admin/settings/page.tsx`
- `src/app/admin/settings/layout.tsx`
- `src/components/admin/settings/team-management.tsx`
- `src/components/admin/settings/company-profile.tsx`
- `src/components/admin/settings/branding.tsx`
- `src/components/admin/settings/stripe-config.tsx`
- `src/components/admin/settings/notification-settings.tsx`

**Subagent:** `frontend-developer`

**Verification / Επαλήθευση:**
- All settings sections render and save
- Team management shows user list with roles
- Invite team member sends email
- Company profile updates reflect in invoices/contracts
- Logo upload works
- Only super_admin can access this page
- Settings persist across sessions

---

### [x] Phase 12 Complete / Ολοκλήρωση Phase 12

**Verification:** Admin dashboard shows live KPIs. Calendar displays all events. Reports generate with correct data. Settings persist.

---

## Phase 13: Polish, Testing & Deployment / Φινίρισμα, Testing & Deployment

**Overview / Επισκόπηση:** Final polish, comprehensive testing, security audit, deployment, and documentation.

**Dependencies / Εξαρτήσεις:** All previous phases complete (Phase 0–12).

---

### [x] 13.1 — End-to-End Testing / End-to-End Testing

**Description / Περιγραφή:**
Set up Playwright and write E2E tests for all critical user flows: admin login, client invitation + signup, create client → create project → add tasks → upload deliverable → create invoice → send to client. Client: login → view project → review video → add annotation → approve → pay invoice → sign contract → submit filming request. Test auth redirects, RLS enforcement, and error states.

**Key Files / Βασικά Αρχεία:**
- `playwright.config.ts`
- `e2e/auth.spec.ts`
- `e2e/client-management.spec.ts`
- `e2e/project-flow.spec.ts`
- `e2e/invoice-payment.spec.ts`
- `e2e/client-portal.spec.ts`
- `e2e/messaging.spec.ts`
- `e2e/contracts.spec.ts`
- `e2e/filming-requests.spec.ts`
- `e2e/helpers/auth.ts` (test auth utilities)

**Dependencies / Πακέτα:**
`@playwright/test`

**Subagent:** `test-automator`

**Verification / Επαλήθευση:**
- All test files execute without setup errors
- Critical flows pass end-to-end
- Auth tests verify role-based access
- RLS tests confirm data isolation
- Tests can run in CI environment

---

### [x] 13.2 — Performance Optimization / Βελτιστοποίηση Απόδοσης

**Description / Περιγραφή:**
Optimize the application: implement dynamic imports/lazy loading for heavy components (Tiptap, Video.js, FullCalendar, Recharts, signature pad), add `loading.tsx` for every route group, configure Next.js Image optimization, analyze bundle size and eliminate large unused imports, add API response caching where appropriate, optimize database queries (check for N+1 issues).

**Key Files / Βασικά Αρχεία:**
- `src/app/**/loading.tsx` (route loading states)
- `next.config.ts` (update with optimizations)
- Components updated with dynamic imports

**Subagent:** `performance-engineer`

**Verification / Επαλήθευση:**
- Bundle analysis shows no unnecessarily large chunks
- Heavy components load lazily
- Loading states show during page transitions
- LCP < 2s on key pages
- No N+1 query issues in data fetching
- Build size is reasonable

---

### [x] 13.3 — Security Audit & Hardening / Έλεγχος Ασφάλειας & Hardening

**Description / Περιγραφή:**
Comprehensive security review: audit all RLS policies (test with different roles), validate all Zod schemas have max lengths and proper constraints, add rate limiting to API routes (especially auth), implement Content Security Policy headers, sanitize all user-generated HTML (DOMPurify for rich text), verify CSRF protection, check for SQL injection in any raw queries, review Stripe webhook signature verification.

**Key Files / Βασικά Αρχεία:**
- `src/middleware.ts` (update with security headers)
- `next.config.ts` (security headers)
- RLS policy audit document
- `src/lib/sanitize.ts`

**Dependencies / Πακέτα:**
`dompurify`, `@types/dompurify`

**Subagent:** `security-auditor`

**Verification / Επαλήθευση:**
- RLS policies tested with each role (no data leaks)
- All inputs validated with Zod (max lengths enforced)
- Security headers present in responses (CSP, X-Frame-Options, etc.)
- Rich text content sanitized on render
- Rate limiting active on auth routes
- Stripe webhook signature verified
- No raw SQL queries without parameterization

---

### [x] 13.4 — Deployment & CI/CD / Deployment & CI/CD

**Description / Περιγραφή:**
Set up deployment: Vercel project configuration (environment variables, build settings), Supabase production project setup guide, GitHub Actions CI pipeline (lint, type-check, build, test on PR), automatic Vercel deployment on merge to main. Create deployment checklist and environment variable documentation.

**Key Files / Βασικά Αρχεία:**
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `vercel.json` (if needed)
- `DEPLOYMENT.md` (deployment guide)

**Subagent:** `deployment-engineer`

**Verification / Επαλήθευση:**
- GitHub Actions workflow runs on PR
- CI checks pass: lint, type-check, build
- Vercel builds successfully from repo
- Environment variables documented
- Deployment checklist covers all steps

---

### [x] 13.5 — Documentation & Handoff / Τεκμηρίωση & Παράδοση

**Description / Περιγραφή:**
Create comprehensive documentation: `README.md` (project overview, setup instructions, tech stack), API route documentation (all endpoints with request/response examples), database schema documentation (ER diagram, table descriptions), user guides (admin guide, client guide). Update `CLAUDE.md` with final project state.

**Key Files / Βασικά Αρχεία:**
- `README.md`
- `docs/api.md`
- `docs/database.md`
- `docs/admin-guide.md`
- `docs/client-guide.md`
- `CLAUDE.md` (final update)

**Subagent:** `docs-architect`

**Verification / Επαλήθευση:**
- README includes complete setup instructions
- API documentation covers all routes
- Database schema is fully documented
- User guides cover all features
- New developer can set up the project following README

---

### [x] Phase 13 Complete / Ολοκλήρωση Phase 13

**Verification:** All E2E tests pass. Performance meets targets. Security audit complete. CI/CD pipeline works. Documentation comprehensive.

---

## Overall Completion / Συνολική Ολοκλήρωση

- [x] Phase 0: Project Foundation / Θεμελίωση Project
- [x] Phase 1: Authentication / Αυθεντικοποίηση
- [x] Phase 2: Core Data & Layouts / Βασικά Δεδομένα & Layouts
- [x] Phase 3: Client Management / Διαχείριση Πελατών
- [x] Phase 4: Project Management / Διαχείριση Projects
- [x] Phase 5: Task Management / Διαχείριση Εργασιών
- [x] Phase 6: Filming Preparation / Προετοιμασία Γυρισμάτων
- [x] Phase 7: Video Delivery & Review / Παράδοση & Αξιολόγηση Video
- [x] Phase 8: Invoices & Payments / Τιμολόγηση & Πληρωμές
- [x] Phase 9: Messaging System / Σύστημα Μηνυμάτων
- [x] Phase 10: Contract Management / Διαχείριση Συμβολαίων
- [x] Phase 11: Client Portal / Client Portal & Αιτήματα
- [x] Phase 12: Admin Dashboard & Reports / Admin Dashboard & Αναφορές
- [x] Phase 13: Polish, Testing & Deployment / Φινίρισμα & Deployment

**Total Sub-tasks: 55**
