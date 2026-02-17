import { z } from 'zod';

export const createLeadActivitySchema = z.object({
  lead_id: z.string().uuid('Invalid lead ID'),
  activity_type: z.enum(['call', 'email', 'meeting', 'note', 'stage_change', 'other']),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(5000).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type CreateLeadActivityInput = z.input<typeof createLeadActivitySchema>;
