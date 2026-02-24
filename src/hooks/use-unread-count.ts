'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UseUnreadCountResult {
  unreadCount: number;
  isLoading: boolean;
}

export function useUnreadCount(currentUserId: string | null): UseUnreadCountResult {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const fetchUnreadCount = async () => {
      setIsLoading(true);
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .is('read_at', null)
          .neq('sender_id', currentUserId);

        if (!error && count !== null) {
          setUnreadCount(count);
        }
      } catch (err) {
        console.error('Failed to fetch unread count:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchUnreadCount();

    // Subscribe to changes
    const channel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          // Only increment if it's not from the current user
          const newMsg = payload.new as Record<string, unknown>;
          if (newMsg.sender_id !== currentUserId) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const oldMsg = payload.old as Record<string, unknown>;
          const newMsg = payload.new as Record<string, unknown>;
          // If a message was marked as read
          if (oldMsg.read_at === null && newMsg.read_at !== null) {
            // Only decrement if it wasn't sent by the current user
            if (newMsg.sender_id !== currentUserId) {
              setUnreadCount((prev) => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  return { unreadCount, isLoading };
}
