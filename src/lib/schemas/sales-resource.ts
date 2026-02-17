import { z } from 'zod';

export const createSalesResourceCategorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional().nullable(),
  sort_order: z.coerce.number().int().default(0),
});

export type CreateSalesResourceCategoryInput = z.input<typeof createSalesResourceCategorySchema>;

export const updateSalesResourceCategorySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  sort_order: z.coerce.number().int().optional(),
});

export type UpdateSalesResourceCategoryInput = z.input<typeof updateSalesResourceCategorySchema>;

export const createSalesResourceSchema = z.object({
  category_id: z.string().uuid('Invalid category ID'),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional().nullable(),
  file_path: z.string().min(1, 'File path is required'),
  file_name: z.string().min(1, 'File name is required'),
  file_size: z.coerce.number().int().min(0),
  file_type: z.string().min(1),
});

export type CreateSalesResourceInput = z.input<typeof createSalesResourceSchema>;
