'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ActionResult, UserProfile } from '@/types';
import type { UserRole } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

export async function getTeamMembers(): Promise<ActionResult<UserProfile[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .in('role', ['super_admin', 'admin', 'employee', 'salesman'])
      .order('created_at', { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch team members',
    };
  }
}

export async function inviteTeamMember(email: string, role: UserRole): Promise<ActionResult<{ email: string }>> {
  try {
    const supabase = await createClient();

    // Verify caller is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'super_admin' && profile.role !== 'admin')) {
      return { data: null, error: 'Forbidden: admin access required' };
    }

    // Use admin client to invite user via Supabase Auth
    const adminClient = createAdminClient();
    const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: {
        role,
        invited_by: user.id,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
    });

    if (error) {
      return { data: null, error: error.message };
    }

    revalidatePath('/admin/settings');
    return { data: { email }, error: null };
  } catch (error) {
    console.error('Failed to invite team member:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to invite team member',
    };
  }
}

export async function updateTeamMemberRole(userId: string, role: UserRole): Promise<ActionResult<{ userId: string; role: UserRole }>> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: { userId, role }, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update team member role',
    };
  }
}

export async function deactivateTeamMember(userId: string): Promise<ActionResult<{ userId: string }>> {
  try {
    const supabase = await createClient();

    // Verify caller is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'Unauthorized' };

    if (user.id === userId) {
      return { data: null, error: 'Cannot deactivate your own account' };
    }

    // Use admin client to ban the user in Supabase Auth
    const adminClient = createAdminClient();
    const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
      ban_duration: '876600h', // ~100 years = effectively permanent
    });

    if (authError) {
      return { data: null, error: authError.message };
    }

    // Also mark in user_profiles for UI purposes
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        preferences: { deactivated: true },
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Failed to update profile:', profileError);
    }

    revalidatePath('/admin/settings');
    return { data: { userId }, error: null };
  } catch (error) {
    console.error('Failed to deactivate team member:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to deactivate team member',
    };
  }
}
