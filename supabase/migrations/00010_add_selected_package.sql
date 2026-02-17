-- Add selected_package column to filming_requests
-- Stores the service package ID chosen during booking (e.g. social_a, podcast_b)

alter table public.filming_requests
  add column if not exists selected_package text;

comment on column public.filming_requests.selected_package is 'Service package ID selected during booking (e.g. social_a, podcast_b)';
