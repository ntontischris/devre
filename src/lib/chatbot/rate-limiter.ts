import { createAdminClient } from '@/lib/supabase/admin';

const MAX_MESSAGES_PER_HOUR = 20;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Check if a session has exceeded the rate limit.
 * Returns { allowed: true } or { allowed: false, retryAfterMs }.
 */
export async function checkRateLimit(sessionId: string): Promise<{
  allowed: boolean;
  retryAfterMs?: number;
}> {
  const supabase = createAdminClient();
  const now = new Date();

  const { data } = await supabase
    .from('chat_rate_limits')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (!data) {
    // First message — create entry
    await supabase.from('chat_rate_limits').insert({
      session_id: sessionId,
      message_count: 1,
      window_start: now.toISOString(),
    });
    return { allowed: true };
  }

  const windowStart = new Date(data.window_start);
  const elapsed = now.getTime() - windowStart.getTime();

  if (elapsed > WINDOW_MS) {
    // Window expired — reset
    await supabase
      .from('chat_rate_limits')
      .update({
        message_count: 1,
        window_start: now.toISOString(),
      })
      .eq('session_id', sessionId);
    return { allowed: true };
  }

  if (data.message_count >= MAX_MESSAGES_PER_HOUR) {
    return {
      allowed: false,
      retryAfterMs: WINDOW_MS - elapsed,
    };
  }

  // Increment counter
  await supabase
    .from('chat_rate_limits')
    .update({ message_count: data.message_count + 1 })
    .eq('session_id', sessionId);

  return { allowed: true };
}
