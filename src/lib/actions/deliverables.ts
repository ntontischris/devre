'use server';

import { createClient } from '@/lib/supabase/server';
import { createDeliverableSchema, createAnnotationSchema } from '@/lib/schemas/deliverable';
import type { ActionResult } from '@/types/index';
import type { DeliverableStatus } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

export async function getDeliverablesByProject(projectId: string): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('project_id', projectId)
      .order('version_number', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch deliverables' };
  }
}

export async function getDeliverable(id: string): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch deliverable' };
  }
}

export async function createDeliverable(input: unknown): Promise<ActionResult<any>> {
  try {
    const validated = createDeliverableSchema.parse(input);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data: maxVersion } = await supabase
      .from('deliverables')
      .select('version_number')
      .eq('project_id', validated.project_id)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const versionNumber = maxVersion ? maxVersion.version_number + 1 : 1;

    const { data, error } = await supabase
      .from('deliverables')
      .insert({
        ...validated,
        uploaded_by: user.id,
        version_number: versionNumber,
        status: 'pending_review',
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    revalidatePath(`/admin/projects/${validated.project_id}`);
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'Failed to create deliverable' };
  }
}

export async function updateDeliverableStatus(
  id: string,
  status: DeliverableStatus
): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('deliverables')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    if (data?.project_id) {
      revalidatePath(`/admin/projects/${data.project_id}`);
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to update deliverable status' };
  }
}

export async function deleteDeliverable(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: deliverable } = await supabase
      .from('deliverables')
      .select('project_id')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('deliverables')
      .delete()
      .eq('id', id);

    if (error) return { data: null, error: error.message };

    if (deliverable?.project_id) {
      revalidatePath(`/admin/projects/${deliverable.project_id}`);
    }
    return { data: undefined, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to delete deliverable' };
  }
}

export async function getAnnotations(deliverableId: string): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('video_annotations')
      .select('*')
      .eq('deliverable_id', deliverableId)
      .order('timestamp_seconds', { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch annotations' };
  }
}

export async function createAnnotation(input: unknown): Promise<ActionResult<any>> {
  try {
    const validated = createAnnotationSchema.parse(input);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('video_annotations')
      .insert({ ...validated, created_by: user.id })
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    revalidatePath(`/admin/deliverables/${validated.deliverable_id}`);
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'Failed to create annotation' };
  }
}

export async function resolveAnnotation(id: string): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();

    const { data: annotation } = await supabase
      .from('video_annotations')
      .select('resolved')
      .eq('id', id)
      .single();

    const { data, error } = await supabase
      .from('video_annotations')
      .update({ resolved: !annotation?.resolved })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    if (data?.deliverable_id) {
      revalidatePath(`/admin/deliverables/${data.deliverable_id}`);
    }
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to resolve annotation' };
  }
}
