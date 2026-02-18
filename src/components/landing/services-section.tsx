import { getTranslations } from 'next-intl/server';
import { Film, Mic, Clapperboard, Target, Layers, PenTool, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export async function ServicesSection() {
  const t = await getTranslations('landing');

  const services = [
    { Icon: Film, title: t('services.socialTitle'), desc: t('services.socialDesc'), tag: t('services.socialTag') },
    { Icon: Mic, title: t('services.podcastTitle'), desc: t('services.podcastDesc'), tag: t('services.podcastTag') },
    { Icon: Clapperboard, title: t('services.eventTitle'), desc: t('services.eventDesc'), tag: t('services.eventTag') },
    { Icon: Target, title: t('services.corporateTitle'), desc: t('services.corporateDesc'), tag: t('services.corporateTag') },
    { Icon: Layers, title: t('services.graphicTitle'), desc: t('services.graphicDesc'), tag: t('services.graphicTag') },
    { Icon: PenTool, title: t('services.copyTitle'), desc: t('services.copyDesc'), tag: t('services.copyTag') },
  ];

  const features = [
    t('services.featureDrone'),
    t('services.featureMusic'),
    t('services.featureSubs'),
    t('services.featureStrategy'),
  ];

  return (
    <section id="services" className="relative py-20 sm:py-32 md:py-40" aria-labelledby="services-heading">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(201,160,51,0.04),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl sm:text-7xl font-black text-gold-500/10 leading-none" aria-hidden="true">
              02
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" aria-hidden="true" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
            {t('services.label')}
          </span>
          <h2
            id="services-heading"
            className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-12 sm:mb-16"
          >
            {t('services.title')}
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {services.map((service, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="bento-card p-6 sm:p-8 h-full relative overflow-hidden group">
                <div
                  className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(201,160,51,0.05),transparent_70%)] group-hover:scale-150 transition-transform duration-700"
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="inline-block px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-[10px] font-bold tracking-wider uppercase mb-4 sm:mb-5">
                    {service.tag}
                  </div>
                  <service.Icon className="h-7 w-7 sm:h-8 sm:w-8 text-gold-500 mb-4 sm:mb-5" aria-hidden="true" />
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{service.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{service.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={500}>
          <ul
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10"
            aria-label={t('services.additionalFeatures')}
          >
            {features.map((feat, i) => (
              <li
                key={i}
                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.03] border border-white/[0.06]"
              >
                <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-500 flex-shrink-0" aria-hidden="true" />
                <span className="text-zinc-400 text-xs sm:text-sm">{feat}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
