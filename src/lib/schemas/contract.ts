import { z } from 'zod';
import { CONTRACT_STATUSES } from '@/lib/constants';

/**
 * Create contract schema validation
 */
export const createContractSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  client_id: z.string().uuid('Invalid client ID'),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  content: z.string().min(1, 'Content is required').max(50000, 'Content must be at most 50000 characters'),
  template_id: z.string().uuid('Invalid template ID').optional(),
  expires_at: z.string().optional(),
});

export type CreateContractInput = z.infer<typeof createContractSchema>;

/**
 * Update contract schema validation (limited fields)
 */
export const updateContractSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters').optional(),
  content: z.string().min(1, 'Content is required').max(50000, 'Content must be at most 50000 characters').optional(),
  expires_at: z.string().optional(),
});

export type UpdateContractInput = z.infer<typeof updateContractSchema>;

/**
 * Contract response schema (includes database fields)
 */
export const contractResponseSchema = createContractSchema.extend({
  id: z.string().uuid(),
  status: z.enum(CONTRACT_STATUSES),
  signed_at: z.string().datetime().optional(),
  signature_image: z.string().optional(),
  file_path: z.string().optional(),
  created_by: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ContractResponse = z.infer<typeof contractResponseSchema>;

/**
 * Sign contract schema validation
 */
export const signContractSchema = z.object({
  signature_image: z.string().min(1, 'Signature is required').max(500000, 'Signature data is too large'),
});

export type SignContractInput = z.infer<typeof signContractSchema>;
