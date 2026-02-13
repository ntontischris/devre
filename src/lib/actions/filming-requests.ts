'use server';

import { createClient } from '@/lib/supabase/server';
import { createFilmingRequestSchema, reviewFilmingRequestSchema } from '@/lib/schemas/filming-request';
import type { ActionResult } from '@/types/index';
import type { FilmingRequestStatus } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

export async function getFilmingRequests(filters?: {
  status?: FilmingRequestStatus | FilmingRequestStatus[];
}): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('filming_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status);
      } else {
        query = query.eq('status', filters.status);
      }
    }

    const { data, error } = await query;
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch filming requests' };
  }
}

export async function getFilmingRequest(id: string): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('filming_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch filming request' };
  }
}

export async function createFilmingRequest(input: unknown): Promise<ActionResult<any>> {
  try {
    const validated = createFilmingRequestSchema.parse(input);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    // Find the client record linked to this user
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const { data, error } = await supabase
      .from('filming_requests')
      .insert({
        ...validated,
        client_id: client?.id || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    revalidatePath('/admin/filming-requests');
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'Failed to create filming request' };
  }
}

export async function reviewFilmingRequest(id: string, input: unknown): Promise<ActionResult<any>> {
  try {
    const validated = reviewFilmingRequestSchema.parse(input);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('filming_requests')
      .update({
        status: validated.status,
        admin_notes: validated.admin_notes,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    revalidatePath('/admin/filming-requests');
    revalidatePath(`/admin/filming-requests/${id}`);
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'Failed to review filming request' };
  }
}

export async function convertToProject(id: string): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data: request, error: fetchError } = await supabase
      .from('filming_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) return { data: null, error: fetchError.message };
    if (!request) return { data: null, error: 'Filming request not found' };
    if (request.status !== 'accepted') {
      return { data: null, error: 'Only accepted requests can be converted to projects' };
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        client_id: request.client_id,
        title: request.title,
        description: request.description,
        project_type: request.project_type || 'other',
        status: 'briefing',
        priority: 'medium',
        created_by: user.id,
      })
      .select()
      .single();

    if (projectError) return { data: null, error: projectError.message };

    const { error: updateError } = await supabase
      .from('filming_requests')
      .update({
        status: 'converted',
        converted_project_id: project.id,
      })
      .eq('id', id);

    if (updateError) return { data: null, error: updateError.message };

    revalidatePath('/admin/filming-requests');
    revalidatePath('/admin/projects');
    return { data: project, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to convert filming request to project' };
  }
}
