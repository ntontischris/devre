import { z } from 'zod';

/**
 * Chat message input from the widget
 */
export const chatInputSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(2000),
  })),
  sessionId: z.string().min(1).max(100),
  language: z.enum(['en', 'el']).default('en'),
  pageUrl: z.string().max(500).optional(),
});

export type ChatInput = z.infer<typeof chatInputSchema>;

/**
 * Knowledge entry for admin CRUD
 */
export const createKnowledgeSchema = z.object({
  category: z.string().min(1).max(100),
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(10000),
  content_en: z.string().max(10000).optional(),
  content_el: z.string().max(10000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateKnowledgeInput = z.infer<typeof createKnowledgeSchema>;

export const updateKnowledgeSchema = createKnowledgeSchema.partial();

export type UpdateKnowledgeInput = z.infer<typeof updateKnowledgeSchema>;
