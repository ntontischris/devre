import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { CLIENT_LOGOS } from './constants';

export async function CaseStudiesSection() {
  const t = await getTranslations('landing');

  const studies = [
    {
      name: 'Mavri Thalassa',
      tag: t('work.mavriTag'),
      desc: t('work.mavriDesc'),
      accent: 'bg-blue-500/10 text-blue-400',
    },
    {
      name: 'Technomat',
      tag: t('work.technomatTag'),
      desc: t('work.technomatDesc'),
      accent: 'bg-purple-500/10 text-purple-400',
    },
    {
      name: 'Ophthalmica',
      tag: t('work.ophthalmicaTag'),
      desc: t('work.ophthalmicaDesc'),
      accent: 'bg-emerald-500/10 text-emerald-400',
    },
  ];

  return (
    <section id="work" className="relative py-20 sm:py-32 md:py-40 bg-zinc-900/40" aria-labelledby="work-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
              {t('work.label')}
            </span>
            <h2
              id="work-heading"
              className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]"
            >
              {t('work.title')}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-12 sm:mb-16">
          {studies.map((study, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div className="glass-card rounded-2xl p-6 sm:p-8 h-full">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 sm:mb-4 ${study.accent}`}
                >
                  {study.tag}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">{study.name}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{study.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <p className="text-zinc-500 text-sm mb-4 sm:mb-6">{t('work.alsoWorking')}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {CLIENT_LOGOS.slice(0, 8).map((brand) => (
                <Image
                  key={brand.name}
                  src={brand.src}
                  alt={brand.name}
                  width={80}
                  height={32}
                  className="h-5 sm:h-6 w-auto object-contain brightness-0 invert opacity-15 hover:opacity-50 transition-opacity duration-300"
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
