import { createClient } from '@/lib/supabase/server';

export async function getMyTasksToday(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('tasks')
    .select('*, project:projects(title)')
    .eq('assigned_to', userId)
    .eq('due_date', today)
    .neq('status', 'done')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function getMyOverdueTasks(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('tasks')
    .select('*, project:projects(title)')
    .eq('assigned_to', userId)
    .lt('due_date', today)
    .neq('status', 'done')
    .order('due_date', { ascending: true });

  if (error) return [];
  return data ?? [];
}

export async function getMyUpcomingTasks(userId: string, days: number = 7) {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  const future = futureDate.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('tasks')
    .select('*, project:projects(title)')
    .eq('assigned_to', userId)
    .gt('due_date', today)
    .lte('due_date', future)
    .neq('status', 'done')
    .order('due_date', { ascending: true });

  if (error) return [];
  return data ?? [];
}

export async function getMyTaskStats(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select('status')
    .eq('assigned_to', userId);

  if (error || !data) return { todo: 0, in_progress: 0, review: 0, done: 0 };

  const stats = { todo: 0, in_progress: 0, review: 0, done: 0 };
  for (const task of data) {
    if (task.status in stats) {
      stats[task.status as keyof typeof stats]++;
    }
  }
  return stats;
}
