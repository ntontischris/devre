import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Clock, Layers, Handshake } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export async function AboutSection() {
  const t = await getTranslations('landing');

  const highlights = [
    { Icon: Clock, title: t('about.highlight1Title'), desc: t('about.highlight1Desc') },
    { Icon: Layers, title: t('about.highlight2Title'), desc: t('about.highlight2Desc') },
    { Icon: Handshake, title: t('about.highlight3Title'), desc: t('about.highlight3Desc') },
  ];

  return (
    <section id="about" className="relative py-20 sm:py-32 md:py-40" aria-labelledby="about-heading">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_20%,rgba(201,160,51,0.03),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-start">
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-6 sm:mb-8">
                <span className="text-5xl sm:text-7xl font-black text-gold-500/10 leading-none" aria-hidden="true">
                  01
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" aria-hidden="true" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
                {t('about.label')}
              </span>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <h2
                id="about-heading"
                className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]"
              >
                {t('about.title')}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed">
                {t('about.description')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-500 leading-relaxed">
                {t('about.text1')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-500 leading-relaxed">
                {t('about.text2')}
              </p>
            </ScrollReveal>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <ScrollReveal animation="slide-left" delay={300}>
              <div className="relative aspect-[4/5] max-h-[400px] sm:max-h-none rounded-2xl overflow-hidden">
                <Image
                  src="/images/hero/home2.jpg"
                  alt={t('about.imageAlt')}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" aria-hidden="true" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06]" aria-hidden="true" />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {highlights.map((item, i) => (
                <ScrollReveal key={i} delay={500 + i * 100}>
                  <div className="glass-card rounded-xl p-3 sm:p-4 text-center group">
                    <item.Icon
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gold-500 mx-auto mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                    />
                    <h4 className="text-xs font-bold text-white mb-0.5 sm:mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-zinc-500 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
