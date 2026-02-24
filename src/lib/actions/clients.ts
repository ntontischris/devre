'use server';

import { createClient as createSupabase } from '@/lib/supabase/server';
import { createClientSchema, updateClientSchema } from '@/lib/schemas/client';
import type { ActionResult } from '@/types/index';
import { revalidatePath } from 'next/cache';
import { escapePostgrestFilter } from '@/lib/utils';

export async function getClients(filters?: {
  status?: string;
  search?: string;
}): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createSupabase();
    let query = supabase.from('clients').select('*').order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      const s = escapePostgrestFilter(filters.search);
      query = query.or(
        `contact_name.ilike.%${s}%,email.ilike.%${s}%,company_name.ilike.%${s}%`,
      );
    }

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };
    return { data: data ?? [], error: null };
  } catch {
    return { data: null, error: 'Failed to fetch clients' };
  }
}

export async function getClient(id: string): Promise<ActionResult<unknown>> {
  try {
    const supabase = await createSupabase();
    const { data, error } = await supabase.from('clients').select('*').eq('id', id).single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch {
    return { data: null, error: 'Failed to fetch client' };
  }
}

export async function createNewClient(input: unknown): Promise<ActionResult<unknown>> {
  try {
    const validated = createClientSchema.parse(input);
    const supabase = await createSupabase();

    const { data, error } = await supabase.from('clients').insert(validated).select().single();

    if (error) return { data: null, error: error.message };

    revalidatePath('/admin/clients');
    return { data, error: null };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'Failed to create client' };
  }
}

export async function updateClient(id: string, input: unknown): Promise<ActionResult<unknown>> {
  try {
    const validated = updateClientSchema.parse(input);
    const supabase = await createSupabase();

    const { data, error } = await supabase
      .from('clients')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    revalidatePath('/admin/clients');
    revalidatePath(`/admin/clients/${id}`);
    return { data, error: null };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'Failed to update client' };
  }
}

export async function deleteClient(id: string): Promise<ActionResult<null>> {
  try {
    const supabase = await createSupabase();
    const { error } = await supabase.from('clients').delete().eq('id', id);

    if (error) return { data: null, error: error.message };

    revalidatePath('/admin/clients');
    return { data: null, error: null };
  } catch {
    return { data: null, error: 'Failed to delete client' };
  }
}
