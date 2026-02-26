'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createFilmingRequestSchema, reviewFilmingRequestSchema, publicBookingSchema } from '@/lib/schemas/filming-request';
import type { ActionResult, FilmingRequest } from '@/types/index';
import type { FilmingRequestStatus } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

export async function getFilmingRequests(filters?: {
  status?: FilmingRequestStatus | FilmingRequestStatus[];
}): Promise<ActionResult<FilmingRequest[]>> {
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
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch filming requests' };
  }
}

export async function getFilmingRequest(id: string): Promise<ActionResult<FilmingRequest>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('filming_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch filming request' };
  }
}

export async function createFilmingRequest(input: unknown): Promise<ActionResult<FilmingRequest>> {
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

export async function reviewFilmingRequest(id: string, input: unknown): Promise<ActionResult<FilmingRequest>> {
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

export async function convertToProject(id: string): Promise<ActionResult<unknown>> {
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

    // Resolve client_id: use existing, or find/create from contact info (public bookings)
    let clientId = request.client_id as string | null;
    if (!clientId && request.contact_email) {
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', request.contact_email)
        .single();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from('clients')
          .insert({
            contact_name: request.contact_name || request.contact_email,
            email: request.contact_email,
            phone: request.contact_phone || null,
            company_name: request.contact_company || null,
            status: 'active',
          })
          .select('id')
          .single();

        if (clientError) return { data: null, error: clientError.message };
        clientId = newClient.id;
      }
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        client_id: clientId,
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
    revalidatePath('/admin/clients');
    return { data: project, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to convert filming request to project' };
  }
}

export async function createPublicFilmingRequest(input: unknown): Promise<ActionResult<FilmingRequest>> {
  try {
    const validated = publicBookingSchema.parse(input);
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('filming_requests')
      .insert({
        client_id: null,
        title: validated.title,
        description: validated.description || null,
        project_type: validated.project_type || null,
        selected_package: validated.selected_package || null,
        budget_range: validated.budget_range || null,
        location: validated.location || null,
        preferred_dates: validated.preferred_dates ?? null,
        contact_name: validated.contact_name,
        contact_email: validated.contact_email,
        contact_phone: validated.contact_phone || null,
        contact_company: validated.contact_company || null,
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
    return { data: null, error: 'Failed to submit booking request' };
  }
}
