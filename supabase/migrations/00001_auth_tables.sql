-- =====================================================================
-- Migration: 00001_auth_tables.sql
-- Description: Initial authentication and user management tables for Devre Media System
-- Created: 2026-02-11
-- =====================================================================

-- =====================================================================
-- 1. USER PROFILES TABLE
-- =====================================================================
-- Extends auth.users with role-based access and user preferences
-- Linked 1:1 with auth.users via CASCADE delete

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('super_admin', 'admin', 'client')),
  display_name text,
  avatar_url text,
  preferences jsonb default '{}',
  created_at timestamptz default now()
);

comment on table public.user_profiles is 'User profile extensions with role-based access control';
comment on column public.user_profiles.role is 'User role: super_admin, admin, or client';
comment on column public.user_profiles.preferences is 'User-specific UI/UX preferences stored as JSON';

-- =====================================================================
-- 2. ACTIVITY LOG TABLE
-- =====================================================================
-- Audit trail for all significant system actions

create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

comment on table public.activity_log is 'Audit trail for user actions and system events';
comment on column public.activity_log.action is 'Action performed (e.g., created, updated, deleted)';
comment on column public.activity_log.entity_type is 'Type of entity affected (e.g., project, media, review)';
comment on column public.activity_log.entity_id is 'UUID of the affected entity';
comment on column public.activity_log.metadata is 'Additional context about the action';

-- =====================================================================
-- 3. NOTIFICATIONS TABLE
-- =====================================================================
-- User notifications for system events and updates

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read boolean default false,
  action_url text,
  created_at timestamptz default now()
);

comment on table public.notifications is 'User notifications for events and updates';
comment on column public.notifications.type is 'Notification category (e.g., review_request, comment, approval)';
comment on column public.notifications.action_url is 'Optional URL for notification action';

-- =====================================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =====================================================================

alter table public.user_profiles enable row level security;
alter table public.activity_log enable row level security;
alter table public.notifications enable row level security;

-- =====================================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =====================================================================

-- ---------------------------------------------------------------------
-- USER_PROFILES POLICIES
-- ---------------------------------------------------------------------

-- Policy: Admins can read all profiles
create policy "Admins can read all user profiles"
  on public.user_profiles
  for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Policy: Users can read their own profile
create policy "Users can read their own profile"
  on public.user_profiles
  for select
  using (auth.uid() = id);

-- Policy: Users can update their own profile (limited fields)
create policy "Users can update their own profile"
  on public.user_profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Ensure users cannot escalate their own role
    and role = (select role from public.user_profiles where id = auth.uid())
  );

-- Note: INSERT is handled by trigger only (no user insert policy)

-- ---------------------------------------------------------------------
-- ACTIVITY_LOG POLICIES
-- ---------------------------------------------------------------------

-- Policy: Admins can read all activity logs
create policy "Admins can read all activity logs"
  on public.activity_log
  for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid()
      and role in ('super_admin', 'admin')
    )
  );

-- Policy: Users can read their own activity
create policy "Users can read their own activity"
  on public.activity_log
  for select
  using (auth.uid() = user_id);

-- Note: Inserts are done via service role or security definer functions

-- ---------------------------------------------------------------------
-- NOTIFICATIONS POLICIES
-- ---------------------------------------------------------------------

-- Policy: Users can read their own notifications
create policy "Users can read their own notifications"
  on public.notifications
  for select
  using (auth.uid() = user_id);

-- Policy: Users can update their own notifications (e.g., mark as read)
create policy "Users can update their own notifications"
  on public.notifications
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Note: Inserts are done via service role or security definer functions

-- =====================================================================
-- 6. TRIGGER: AUTO-CREATE USER PROFILE
-- =====================================================================
-- Automatically create a user_profile row when a new user signs up

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_profiles (id, role, display_name)
  values (
    new.id,
    'client',
    coalesce(new.raw_user_meta_data ->> 'display_name', new.email)
  );
  return new;
end;
$$;

comment on function public.handle_new_user is 'Trigger function to auto-create user profile on signup';

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================================================================
-- 7. HELPER FUNCTION: LOG ACTIVITY
-- =====================================================================
-- Convenience function for logging user actions from application code

create or replace function public.log_activity(
  p_user_id uuid,
  p_action text,
  p_entity_type text,
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.activity_log (user_id, action, entity_type, entity_id, metadata)
  values (p_user_id, p_action, p_entity_type, p_entity_id, p_metadata);
end;
$$;

comment on function public.log_activity is 'Helper function to log user activity with metadata';

-- =====================================================================
-- 8. INDEXES FOR PERFORMANCE
-- =====================================================================

-- Activity log indexes for common queries
create index idx_activity_log_user_id on public.activity_log(user_id);
create index idx_activity_log_created_at on public.activity_log(created_at desc);
create index idx_activity_log_entity on public.activity_log(entity_type, entity_id);

-- Notifications indexes for efficient queries
create index idx_notifications_user_id on public.notifications(user_id);
create index idx_notifications_user_unread on public.notifications(user_id, read) where read = false;
create index idx_notifications_created_at on public.notifications(created_at desc);

-- User profiles index for role-based queries
create index idx_user_profiles_role on public.user_profiles(role);

comment on index idx_activity_log_user_id is 'Fast lookup of user activity';
comment on index idx_activity_log_created_at is 'Efficient ordering by timestamp';
comment on index idx_activity_log_entity is 'Quick entity-specific activity lookup';
comment on index idx_notifications_user_id is 'Fast user notification lookup';
comment on index idx_notifications_user_unread is 'Optimized for unread notification counts';
comment on index idx_notifications_created_at is 'Efficient timestamp ordering';
comment on index idx_user_profiles_role is 'Fast role-based filtering';

-- =====================================================================
-- END OF MIGRATION
-- =====================================================================
