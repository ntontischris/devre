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
      className="relative py-24 sm:py-32 md:py-40"
      aria-labelledby="approach-heading"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(201,160,51,0.04),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              <div className="bento-card gold-accent-top p-6 sm:p-8 h-full">
                <div className="bg-gold-500/10 rounded-xl p-3 w-fit mb-4 sm:mb-6">
                  <card.Icon className="h-6 w-6 sm:h-7 sm:w-7 text-gold-500" aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{card.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{card.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="scale-up">
          <blockquote className="relative glass-card rounded-2xl p-6 sm:p-8 md:p-12 lg:p-16 overflow-hidden">
            <div
              className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-gold-500 to-transparent"
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
