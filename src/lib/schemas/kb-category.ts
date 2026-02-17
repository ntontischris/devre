import { z } from 'zod';

export const createKbCategorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional().nullable(),
  slug: z.string().min(1, 'Slug is required').max(255).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  sort_order: z.coerce.number().int().default(0),
  parent_id: z.string().uuid().optional().nullable(),
});

export type CreateKbCategoryInput = z.input<typeof createKbCategorySchema>;

export const updateKbCategorySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
  sort_order: z.coerce.number().int().optional(),
  parent_id: z.string().uuid().optional().nullable(),
});

export type UpdateKbCategoryInput = z.input<typeof updateKbCategorySchema>;
