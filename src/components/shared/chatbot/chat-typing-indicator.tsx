'use client';

export function ChatTypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-[typing-bounce_1.4s_ease-in-out_infinite]" />
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-[typing-bounce_1.4s_ease-in-out_0.2s_infinite]" />
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-[typing-bounce_1.4s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>
    </div>
  );
}
