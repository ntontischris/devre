'use server';

import { createClient } from '@/lib/supabase/server';
import { createKbArticleSchema, updateKbArticleSchema } from '@/lib/schemas/kb-article';
import type { ActionResult, KbArticle } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getKbArticles(categoryId?: string): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('kb_articles')
      .select('*, category:kb_categories(title, slug)')
      .order('sort_order', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };
    return { data: data ?? [], error: null };
  } catch {
    return { data: null, error: 'Failed to fetch articles' };
  }
}

export async function getKbArticle(id: string): Promise<ActionResult<unknown>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('kb_articles')
      .select('*, category:kb_categories(title, slug)')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch {
    return { data: null, error: 'Failed to fetch article' };
  }
}

export async function getKbArticleBySlug(slug: string): Promise<ActionResult<unknown>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('kb_articles')
      .select('*, category:kb_categories(title, slug)')
      .eq('slug', slug)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch {
    return { data: null, error: 'Failed to fetch article' };
  }
}

export async function getPublishedArticlesByCategory(categoryId: string): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('kb_articles')
      .select('id, title, slug, summary, published, sort_order, created_at')
      .eq('category_id', categoryId)
      .eq('published', true)
      .order('sort_order', { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data: data ?? [], error: null };
  } catch {
    return { data: null, error: 'Failed to fetch articles' };
  }
}

export async function searchArticles(query: string): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('kb_articles')
      .select('id, title, slug, summary, category:kb_categories(title, slug)')
      .eq('published', true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) return { data: null, error: error.message };
    return { data: data ?? [], error: null };
  } catch {
    return { data: null, error: 'Failed to search articles' };
  }
}

export async function createKbArticle(input: unknown): Promise<ActionResult<KbArticle>> {
  try {
    const validated = createKbArticleSchema.parse(input);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('kb_articles')
      .insert(validated)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    revalidatePath('/admin/university');
    revalidatePath('/employee/university');
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) return { data: null, error: error.message };
    return { data: null, error: 'Failed to create article' };
  }
}

export async function updateKbArticle(id: string, input: unknown): Promise<ActionResult<KbArticle>> {
  try {
    const validated = updateKbArticleSchema.parse(input);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('kb_articles')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    revalidatePath('/admin/university');
    revalidatePath('/employee/university');
    revalidatePath(`/admin/university/articles/${id}/edit`);
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) return { data: null, error: error.message };
    return { data: null, error: 'Failed to update article' };
  }
}

export async function deleteKbArticle(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('kb_articles').delete().eq('id', id);

    if (error) return { data: null, error: error.message };

    revalidatePath('/admin/university');
    revalidatePath('/employee/university');
    return { data: undefined, error: null };
  } catch {
    return { data: null, error: 'Failed to delete article' };
  }
}
