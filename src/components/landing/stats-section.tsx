import { getTranslations } from 'next-intl/server';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { CountUp } from '@/components/shared/count-up';

export async function StatsSection() {
  const t = await getTranslations('landing');

  const stats = [
    { end: 200, suffix: '+', label: t('stats.projects') },
    { end: 50, suffix: '+', label: t('stats.brands') },
    { end: 24, suffix: 'h', label: t('stats.turnaround') },
    { end: 3, suffix: '+', label: t('stats.years') },
  ];

  return (
    <section
      className="relative py-16 sm:py-24 md:py-32 bg-zinc-900/40 overflow-hidden"
      aria-label={t('stats.sectionLabel')}
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_50%,rgba(201,160,51,0.05),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 100} className="text-center">
              <div className="text-4xl sm:text-5xl md:text-7xl font-black text-gold-500 mb-1 sm:mb-2">
                <CountUp end={stat.end} suffix={stat.suffix} />
              </div>
              <div className="text-zinc-500 font-medium text-xs sm:text-sm">{stat.label}</div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
