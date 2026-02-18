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
      className="relative py-20 sm:py-28 md:py-36 overflow-hidden"
      aria-label={t('stats.sectionLabel')}
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_50%,rgba(201,160,51,0.06),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 100} className="text-center relative">
              <div className="text-5xl sm:text-6xl md:text-8xl font-black text-gold-500 mb-1 sm:mb-2">
                <CountUp end={stat.end} suffix={stat.suffix} />
              </div>
              <div className="text-zinc-400 text-xs sm:text-sm uppercase tracking-wider">{stat.label}</div>
              {/* Vertical gold divider (desktop only, not after last) */}
              {i < stats.length - 1 && (
                <div
                  className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-0 w-px h-16 bg-gradient-to-b from-transparent via-gold-500/20 to-transparent"
                  aria-hidden="true"
                />
              )}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
