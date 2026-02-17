import { z } from 'zod';
import { LEAD_STAGES, LEAD_SOURCES } from '@/lib/constants';

export const createLeadSchema = z.object({
  contact_name: z.string().min(1, 'Contact name is required').max(255),
  email: z.string().email('Invalid email'),
  phone: z.string().max(50).optional().nullable(),
  company_name: z.string().max(255).optional().nullable(),
  source: z.enum(LEAD_SOURCES).default('other'),
  stage: z.enum(LEAD_STAGES).default('new'),
  deal_value: z.coerce.number().min(0).optional().nullable(),
  probability: z.coerce.number().int().min(0).max(100).default(0),
  notes: z.string().max(5000).optional().nullable(),
  expected_close_date: z.string().optional().nullable(),
  assigned_to: z.string().uuid('Invalid assignee'),
});

export type CreateLeadInput = z.input<typeof createLeadSchema>;

export const updateLeadSchema = z.object({
  contact_name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional().nullable(),
  company_name: z.string().max(255).optional().nullable(),
  source: z.enum(LEAD_SOURCES).optional(),
  stage: z.enum(LEAD_STAGES).optional(),
  deal_value: z.coerce.number().min(0).optional().nullable(),
  probability: z.coerce.number().int().min(0).max(100).optional(),
  notes: z.string().max(5000).optional().nullable(),
  lost_reason: z.string().max(1000).optional().nullable(),
  expected_close_date: z.string().optional().nullable(),
  assigned_to: z.string().uuid().optional(),
});

export type UpdateLeadInput = z.input<typeof updateLeadSchema>;
