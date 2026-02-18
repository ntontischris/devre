import { getTranslations } from 'next-intl/server';
import { ScrollReveal } from '@/components/shared/scroll-reveal';

export async function ProcessSection() {
  const t = await getTranslations('landing');

  const steps = [1, 2, 3, 4] as const;

  return (
    <section id="process" className="relative py-20 sm:py-32 md:py-40" aria-labelledby="process-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-14 sm:mb-20">
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
              {t('process.label')}
            </span>
            <h2
              id="process-heading"
              className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]"
            >
              {t('process.title')}
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
              {t('process.description')}
            </p>
          </div>
        </ScrollReveal>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-4">
          {steps.map((step, i) => (
            <ScrollReveal key={step} delay={i * 150}>
              <li className="relative text-center lg:text-left">
                <div
                  className="text-[2.5rem] sm:text-[4rem] lg:text-[6rem] font-black leading-none text-transparent mb-3 sm:mb-4"
                  style={{ WebkitTextStroke: '1.5px rgba(201, 160, 51, 0.25)' }}
                  aria-hidden="true"
                >
                  0{step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                  {t(`process.step${step}Title`)}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {t(`process.step${step}Desc`)}
                </p>
                {step < 4 && (
                  <div
                    className="hidden lg:block absolute top-12 right-0 w-full h-px translate-x-1/2 bg-gradient-to-r from-gold-500/20 to-transparent"
                    aria-hidden="true"
                  />
                )}
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
