import { z } from 'zod';
import { CLIENT_STATUSES } from '@/lib/constants';

/**
 * Create client schema validation
 */
export const createClientSchema = z.object({
  contact_name: z.string().min(1, 'Contact name is required').max(255, 'Contact name must be at most 255 characters'),
  email: z.string().email('Invalid email address').max(255, 'Email must be at most 255 characters'),
  company_name: z.string().max(255, 'Company name must be at most 255 characters').optional(),
  phone: z.string().max(50, 'Phone must be at most 50 characters').optional(),
  address: z.string().max(500, 'Address must be at most 500 characters').optional(),
  vat_number: z.string().max(50, 'VAT number must be at most 50 characters').optional(),
  notes: z.string().max(5000, 'Notes must be at most 5000 characters').optional(),
  status: z.enum(CLIENT_STATUSES).default('active'),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

/**
 * Update client schema validation (all fields optional)
 */
export const updateClientSchema = createClientSchema.partial();

export type UpdateClientInput = z.infer<typeof updateClientSchema>;

/**
 * Client response schema (includes database fields)
 */
export const clientResponseSchema = createClientSchema.extend({
  id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type ClientResponse = z.infer<typeof clientResponseSchema>;
