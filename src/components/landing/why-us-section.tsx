import { getTranslations } from 'next-intl/server';
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
      className="relative py-20 sm:py-32 md:py-40 bg-zinc-900/40"
      aria-labelledby="whyus-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
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
              <div className="glass-card rounded-xl p-5 sm:p-6 h-full">
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center mb-3 sm:mb-4" aria-hidden="true">
                  <div className="w-2 h-2 rounded-full bg-gold-500" />
                </div>
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
