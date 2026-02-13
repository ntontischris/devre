'use server';

import { createClient } from '@/lib/supabase/server';
import { createMessageSchema } from '@/lib/schemas/message';
import type { ActionResult } from '@/types/index';
import { revalidatePath } from 'next/cache';

export async function getMessagesByProject(projectId: string): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:user_profiles(*)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch messages' };
  }
}

export async function createMessage(input: unknown): Promise<ActionResult<any>> {
  try {
    const validated = createMessageSchema.parse(input);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('messages')
      .insert({
        ...validated,
        sender_id: user.id,
      })
      .select('*, sender:user_profiles(*)')
      .single();

    if (error) return { data: null, error: error.message };

    revalidatePath(`/admin/projects/${validated.project_id}`);
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'Failed to create message' };
  }
}

export async function markMessagesAsRead(projectId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('project_id', projectId)
      .is('read_at', null)
      .neq('sender_id', user.id);

    if (error) return { data: null, error: error.message };

    revalidatePath(`/admin/projects/${projectId}`);
    return { data: undefined, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to mark messages as read' };
  }
}
