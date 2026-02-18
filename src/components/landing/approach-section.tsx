import { getTranslations } from 'next-intl/server';
import { Smartphone, Eye, Target } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export async function ApproachSection() {
  const t = await getTranslations('landing');

  const cards = [
    { Icon: Smartphone, title: t('approach.card1Title'), desc: t('approach.card1Desc') },
    { Icon: Eye, title: t('approach.card2Title'), desc: t('approach.card2Desc') },
    { Icon: Target, title: t('approach.card3Title'), desc: t('approach.card3Desc') },
  ];

  return (
    <section
      id="approach"
      className="relative py-20 sm:py-32 md:py-40 bg-zinc-900/40"
      aria-labelledby="approach-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
              {t('approach.label')}
            </span>
            <h2
              id="approach-heading"
              className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]"
            >
              {t('approach.title')}
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed">
              {t('approach.description')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {cards.map((card, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div className="bento-card p-6 sm:p-8 h-full">
                <card.Icon className="h-7 w-7 sm:h-8 sm:w-8 text-gold-500 mb-4 sm:mb-6" aria-hidden="true" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{card.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{card.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="scale-up">
          <blockquote className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 sm:p-8 md:p-12 lg:p-16 overflow-hidden">
            <div
              className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold-500 to-transparent"
              aria-hidden="true"
            />
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed italic pl-4 sm:pl-6">
              &ldquo;{t('approach.quote')}&rdquo;
            </p>
          </blockquote>
        </ScrollReveal>
      </div>
    </section>
  );
}
