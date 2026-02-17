'use server';

import { createClient } from '@/lib/supabase/server';
import { createContractSchema, updateContractSchema, signContractSchema } from '@/lib/schemas/contract';
import type { ActionResult, Contract, ContractWithRelations, ContractTemplate } from '@/types/index';
import { revalidatePath } from 'next/cache';

export async function getContractsByProject(projectId: string): Promise<ActionResult<Contract[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch contracts' };
  }
}

export async function getContractsByClient(clientId: string): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contracts')
      .select('*, project:projects(title)')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch contracts' };
  }
}

export async function getContract(id: string): Promise<ActionResult<ContractWithRelations>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contracts')
      .select('*, client:clients(*), project:projects(*)')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch contract' };
  }
}

export async function getAllContracts(): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contracts')
      .select('*, client:clients(contact_name, company_name), project:projects(title)')
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: unknown) {
    console.error('Failed to fetch contracts:', err);
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch contracts' };
  }
}

export async function createContract(input: unknown): Promise<ActionResult<Contract>> {
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

    if (validated.project_id) {
      revalidatePath(`/admin/projects/${validated.project_id}`);
    }
    revalidatePath(`/admin/clients/${validated.client_id}`);
    return { data, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: 'Failed to create contract' };
  }
}

export async function updateContract(id: string, input: unknown): Promise<ActionResult<Contract>> {
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

export async function signContract(id: string, signatureData: unknown): Promise<ActionResult<Contract>> {
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
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to delete contract' };
  }
}

export async function getContractTemplates(): Promise<ActionResult<ContractTemplate[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('contract_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to fetch contract templates' };
  }
}

export async function createContractTemplate(input: {
  title: string;
  content: string;
  placeholders?: Record<string, unknown>;
}): Promise<ActionResult<ContractTemplate>> {
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
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to create contract template' };
  }
}

export async function updateContractTemplate(id: string, input: {
  title?: string;
  content?: string;
  placeholders?: Record<string, unknown>;
}): Promise<ActionResult<ContractTemplate>> {
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
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to update contract template' };
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
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to delete contract template' };
  }
}
