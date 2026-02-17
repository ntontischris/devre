'use client';

import { cn } from '@/lib/utils';

type ChatMessageBubbleProps = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatMessageBubble({ role, content }: ChatMessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
          isUser
            ? 'bg-gold-500 text-black rounded-br-sm'
            : 'bg-white/[0.06] text-zinc-200 border border-white/[0.06] rounded-bl-sm'
        )}
      >
        {content}
      </div>
    </div>
  );
}
