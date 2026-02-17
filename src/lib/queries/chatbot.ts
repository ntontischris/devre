import { createClient } from '@/lib/supabase/server';

export async function getChatConversations() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function getChatConversation(conversationId: string) {
  const supabase = await createClient();
  const { data: conversation, error: convError } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (convError || !conversation) return null;

  const { data: messages } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  return {
    ...conversation,
    messages: messages ?? [],
  };
}

export async function getChatStats() {
  const supabase = await createClient();

  const { count: totalConversations } = await supabase
    .from('chat_conversations')
    .select('*', { count: 'exact', head: true });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayConversations } = await supabase
    .from('chat_conversations')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  const { count: totalMessages } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true });

  const avgMsgsPerConv =
    totalConversations && totalMessages
      ? Math.round(totalMessages / totalConversations)
      : 0;

  return {
    totalConversations: totalConversations ?? 0,
    todayConversations: todayConversations ?? 0,
    totalMessages: totalMessages ?? 0,
    avgMsgsPerConv,
  };
}

export async function getChatKnowledgeEntries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('chat_knowledge')
    .select('id, category, title, content, content_en, content_el, metadata, created_at, updated_at')
    .order('category')
    .order('title');

  if (error) return [];
  return data ?? [];
}
