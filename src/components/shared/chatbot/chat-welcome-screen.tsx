'use client';

import Image from 'next/image';

type ChatWelcomeScreenProps = {
  language: string;
  onQuickAction: (message: string) => void;
};

const QUICK_ACTIONS_EN = [
  'What services do you offer?',
  'How much does it cost?',
  'How does the process work?',
  'I want to book a call',
];

const QUICK_ACTIONS_EL = [
  'Τι υπηρεσίες προσφέρετε;',
  'Πόσο κοστίζει;',
  'Πώς λειτουργεί η διαδικασία;',
  'Θέλω να κλείσω ένα ραντεβού',
];

export function ChatWelcomeScreen({ language, onQuickAction }: ChatWelcomeScreenProps) {
  const isGreek = language === 'el';
  const actions = isGreek ? QUICK_ACTIONS_EL : QUICK_ACTIONS_EN;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <Image
        src="/images/LOGO_WhiteLetter.png"
        alt="Devre Media"
        width={48}
        height={48}
        className="mb-4 opacity-80"
      />
      <h3 className="text-lg font-bold text-white mb-1">
        {isGreek ? 'Γεια! 👋' : 'Hey there! 👋'}
      </h3>
      <p className="text-zinc-400 text-sm mb-6 max-w-[240px]">
        {isGreek
          ? 'Είμαι ο βοηθός της Devre Media. Πώς μπορώ να σε βοηθήσω;'
          : "I'm the Devre Media assistant. How can I help you today?"}
      </p>

      <div className="w-full space-y-2">
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => onQuickAction(action)}
            className="w-full text-left px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 text-sm hover:bg-white/[0.08] hover:border-gold-500/20 hover:text-white transition-all duration-200"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
