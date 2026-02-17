-- Add contact fields to filming_requests for public (unauthenticated) bookings
-- These are nullable because authenticated clients already have contact info in the clients table

alter table public.filming_requests
  add column if not exists contact_name text,
  add column if not exists contact_email text,
  add column if not exists contact_phone text,
  add column if not exists contact_company text;

comment on column public.filming_requests.contact_name is 'Contact name for public booking submissions';
comment on column public.filming_requests.contact_email is 'Contact email for public booking submissions';
comment on column public.filming_requests.contact_phone is 'Contact phone for public booking submissions';
comment on column public.filming_requests.contact_company is 'Contact company for public booking submissions';
