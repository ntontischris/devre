'use server';

import { createClient } from '@/lib/supabase/server';
import { createContractSchema, updateContractSchema, signContractSchema } from '@/lib/schemas/contract';
import type { ActionResult } from '@/types/index';
import { revalidatePath } from 'next/cache';

export async function getContractsByProject(projectId: string): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch contracts' };
  }
}

export async function getContract(id: string): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contracts')
      .select('*, client:clients(*), project:projects(*)')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch contract' };
  }
}

export async function getAllContracts(): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contracts')
      .select('*, client:clients(contact_name, company_name), project:projects(title)')
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    console.error('Failed to fetch contracts:', error);
    return { data: null, error: 'Failed to fetch contracts' };
  }
}

export async function createContract(input: unknown): Promise<ActionResult<any>> {
  try {
    const validated = createContractSchema.parse(input);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('contracts')
      .insert({
        ...validated,
        status: 'draft',
        created_by: user.id,
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
    return { data: null, error: 'Failed to create contract' };
  }
}

export async function updateContract(id: string, input: unknown): Promise<ActionResult<any>> {
  try {
    const validated = updateContractSchema.parse(input);
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('contracts')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    if (data?.project_id) {
      revalidatePath(`/admin/projects/${data.project_id}`);
    }
    revalidatePath(`/admin/contracts/${id}`);
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'Failed to update contract' };
  }
}

export async function signContract(id: string, signatureData: unknown): Promise<ActionResult<any>> {
  try {
    const validated = signContractSchema.parse(signatureData);
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('contracts')
      .update({
        status: 'signed',
        signature_data: {
          signature_image: validated.signature_image,
          signed_at: new Date().toISOString()
        },
        signed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    if (data?.project_id) {
      revalidatePath(`/admin/projects/${data.project_id}`);
    }
    revalidatePath(`/admin/contracts/${id}`);
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'Failed to sign contract' };
  }
}

export async function sendContract(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    // Verify contract is in draft status
    const { data: contract, error: fetchError } = await supabase
      .from('contracts')
      .select('id, status, project_id')
      .eq('id', id)
      .single();

    if (fetchError || !contract) return { data: null, error: 'Contract not found' };
    if (contract.status !== 'draft') return { data: null, error: 'Only draft contracts can be sent' };

    const { data, error } = await supabase
      .from('contracts')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    if (contract.project_id) {
      revalidatePath(`/admin/projects/${contract.project_id}`);
    }
    revalidatePath(`/admin/contracts/${id}`);
    revalidatePath('/admin/contracts');
    return { data: { id: data.id }, error: null };
  } catch (error) {
    console.error('Failed to send contract:', error);
    return { data: null, error: 'Failed to send contract' };
  }
}

export async function deleteContract(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: contract } = await supabase
      .from('contracts')
      .select('project_id')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);

    if (error) return { data: null, error: error.message };

    if (contract?.project_id) {
      revalidatePath(`/admin/projects/${contract.project_id}`);
    }
    return { data: undefined, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to delete contract' };
  }
}

export async function getContractTemplates(): Promise<ActionResult<any[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to fetch contract templates' };
  }
}

export async function createContractTemplate(input: {
  title: string;
  content: string;
  placeholders?: Record<string, unknown>;
}): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await supabase
      .from('contract_templates')
      .insert({
        title: input.title,
        content: input.content,
        placeholders: input.placeholders ?? {},
        created_by: user.id,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    revalidatePath('/admin/settings/contract-templates');
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to create contract template' };
  }
}

export async function updateContractTemplate(id: string, input: {
  title?: string;
  content?: string;
  placeholders?: Record<string, unknown>;
}): Promise<ActionResult<any>> {
  try {
    const supabase = await createClient();

    const updateData: Record<string, unknown> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.placeholders !== undefined) updateData.placeholders = input.placeholders;

    const { data, error } = await supabase
      .from('contract_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    revalidatePath('/admin/settings/contract-templates');
    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to update contract template' };
  }
}

export async function deleteContractTemplate(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('contract_templates')
      .delete()
      .eq('id', id);

    if (error) return { data: null, error: error.message };

    revalidatePath('/admin/settings/contract-templates');
    return { data: undefined, error: null };
  } catch (error) {
    return { data: null, error: 'Failed to delete contract template' };
  }
}
