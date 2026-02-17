'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ChatConversationWithMessages } from '@/types/index';

type ConversationDetailProps = {
  conversation: ChatConversationWithMessages;
};

export function ConversationDetail({ conversation }: ConversationDetailProps) {
  return (
    <div className="grid lg:grid-cols-[1fr_300px] gap-6">
      {/* Messages */}
      <div className="space-y-3 bg-muted/30 rounded-lg p-4 max-h-[600px] overflow-y-auto">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-card border rounded-bl-sm'
              )}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className="text-[10px] opacity-50 mt-1">
                {format(new Date(msg.created_at), 'HH:mm')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Metadata Panel */}
      <div className="space-y-4">
        <div className="rounded-lg border p-4 space-y-3">
          <h3 className="text-sm font-semibold">Conversation Info</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Session ID:</span>
              <p className="font-mono text-xs mt-0.5">{conversation.session_id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Language:</span>
              <p className="mt-0.5">{conversation.language === 'el' ? 'Greek' : 'English'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Messages:</span>
              <p className="mt-0.5">{conversation.message_count}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Page URL:</span>
              <p className="font-mono text-xs mt-0.5">{conversation.page_url || 'N/A'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Started:</span>
              <p className="mt-0.5">{format(new Date(conversation.created_at), 'PPp')}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Last Active:</span>
              <p className="mt-0.5">{format(new Date(conversation.updated_at), 'PPp')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
