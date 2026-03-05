-- Migration: Add structured service fields to contracts table
-- These fields power the new simplified contract creation form

ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS service_type text,
  ADD COLUMN IF NOT EXISTS agreed_amount numeric(12, 2),
  ADD COLUMN IF NOT EXISTS payment_method text CHECK (
    payment_method IS NULL OR payment_method IN ('bank_transfer', 'cash', 'card', 'installments')
  );
