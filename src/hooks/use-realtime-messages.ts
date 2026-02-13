'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  content: string;
  attachments: any[];
  read_at: string | null;
  created_at: string;
  updated_at: string;
  sender: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface UseRealtimeMessagesResult {
  messages: Message[];
  isConnected: boolean;
}

export function useRealtimeMessages(
  projectId: string,
  initialMessages: Message[]
): UseRealtimeMessagesResult {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Update messages when initialMessages change
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const supabase = createClient();
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      channel = supabase
        .channel(`messages:${projectId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `project_id=eq.${projectId}`,
          },
          async (payload: any) => {
            // Fetch the full message with sender details
            const { data: newMessage } = await supabase
              .from('messages')
              .select('*, sender:user_profiles(*)')
              .eq('id', payload.new.id)
              .single();

            if (newMessage) {
              setMessages((prev) => {
                // Check if message already exists (prevent duplicates)
                if (prev.some(m => m.id === newMessage.id)) {
                  return prev;
                }
                return [...prev, newMessage];
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `project_id=eq.${projectId}`,
          },
          (payload: any) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id
                  ? { ...msg, ...payload.new }
                  : msg
              )
            );
          }
        )
        .subscribe((status: string) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsConnected(false);
          }
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      setIsConnected(false);
    };
  }, [projectId]);

  return { messages, isConnected };
}
