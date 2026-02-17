'use client';

import { useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import type { UIMessage } from 'ai';
import { ChatMessageBubble } from './chat-message-bubble';
import { ChatWelcomeScreen } from './chat-welcome-screen';
import { ChatTypingIndicator } from './chat-typing-indicator';

type ChatWindowProps = {
  messages: UIMessage[];
  input: string;
  isLoading: boolean;
  language: string;
  error: Error | undefined;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onQuickAction: (message: string) => void;
  onClose: () => void;
};

function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export function ChatWindow({
  messages,
  input,
  isLoading,
  language,
  error,
  onInputChange,
  onSubmit,
  onQuickAction,
  onClose,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isGreek = language === 'el';
  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gold-500/10 via-gold-500/5 to-transparent border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-gold-500 animate-pulse" />
          <span className="text-sm font-semibold text-white">Devre Media</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {!hasMessages ? (
          <ChatWelcomeScreen language={language} onQuickAction={onQuickAction} />
        ) : (
          <>
            {messages.map((msg) => {
              const text = getMessageText(msg);
              if (!text) return null;
              return (
                <ChatMessageBubble
                  key={msg.id}
                  role={msg.role as 'user' | 'assistant'}
                  content={text}
                />
              );
            })}
            {isLoading && <ChatTypingIndicator />}
            {error && (
              <div className="text-center text-xs text-red-400 py-2">
                {isGreek
                  ? 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.'
                  : 'Something went wrong. Please try again.'}
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 focus-within:border-gold-500/30 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={onInputChange}
            placeholder={isGreek ? 'Γράψε ένα μήνυμα...' : 'Type a message...'}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-1.5 rounded-lg bg-gold-500 text-black hover:bg-gold-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
