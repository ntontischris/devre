import { createClient } from '@/lib/supabase/server';

type LeadsSummary = {
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  negotiation: number;
  won: number;
  lost: number;
};

export async function getMyLeadsSummary(userId: string): Promise<LeadsSummary> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('leads')
      .select('stage')
      .eq('assigned_to', userId);

    if (error || !data) return { new: 0, contacted: 0, qualified: 0, proposal: 0, negotiation: 0, won: 0, lost: 0 };

    const summary = { new: 0, contacted: 0, qualified: 0, proposal: 0, negotiation: 0, won: 0, lost: 0 };
    for (const lead of data) {
      if (lead.stage in summary) {
        summary[lead.stage as keyof typeof summary]++;
      }
    }
    return summary;
  } catch {
    return { new: 0, contacted: 0, qualified: 0, proposal: 0, negotiation: 0, won: 0, lost: 0 };
  }
}

export async function getMyPipelineValue(userId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('leads')
      .select('stage, deal_value')
      .eq('assigned_to', userId)
      .not('stage', 'in', '("lost")');

    if (error || !data) return { total: 0, weighted: 0 };

    let total = 0;
    let weighted = 0;
    for (const lead of data) {
      const val = lead.deal_value ?? 0;
      total += val;
      // Rough probability by stage
      const prob: Record<string, number> = { new: 10, contacted: 20, qualified: 40, proposal: 60, negotiation: 80, won: 100 };
      weighted += val * ((prob[lead.stage] ?? 0) / 100);
    }
    return { total, weighted };
  } catch {
    return { total: 0, weighted: 0 };
  }
}

export async function getMyTodayFollowUps(userId: string) {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('assigned_to', userId)
      .not('stage', 'in', '("won","lost")')
      .or(`last_contacted_at.is.null,last_contacted_at.lt.${today}`)
      .order('last_contacted_at', { ascending: true, nullsFirst: true })
      .limit(10);

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getMyRecentActivity(userId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('lead_activities')
      .select('*, lead:leads(contact_name, company_name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}
