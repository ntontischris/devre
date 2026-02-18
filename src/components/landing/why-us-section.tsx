import { getTranslations } from 'next-intl/server';
import { Diamond } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export async function WhyUsSection() {
  const t = await getTranslations('landing');

  const items = [
    { title: t('whyUs.cinematicTitle'), desc: t('whyUs.cinematicDesc') },
    { title: t('whyUs.speedTitle'), desc: t('whyUs.speedDesc') },
    { title: t('whyUs.partnershipTitle'), desc: t('whyUs.partnershipDesc') },
    { title: t('whyUs.termsTitle'), desc: t('whyUs.termsDesc') },
    { title: t('whyUs.strategyTitle'), desc: t('whyUs.strategyDesc') },
    { title: t('whyUs.droneTitle'), desc: t('whyUs.droneDesc') },
  ];

  return (
    <section
      className="relative py-24 sm:py-32 md:py-40"
      aria-labelledby="whyus-heading"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(201,160,51,0.03),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
              {t('whyUs.label')}
            </span>
            <h2
              id="whyus-heading"
              className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]"
            >
              {t('whyUs.title')}
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
              {t('whyUs.description')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="glass-card gold-accent-left rounded-xl p-5 sm:p-6 h-full hover:border-gold-500/50 transition-colors">
                <Diamond className="h-4 w-4 text-gold-500 mb-3 sm:mb-4" aria-hidden="true" />
                <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
