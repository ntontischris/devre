import { getTranslations } from 'next-intl/server';
import { ArrowRight, Play, Youtube } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { PORTFOLIO_VIDEOS } from './constants';

export async function PortfolioSection() {
  const t = await getTranslations('landing');

  return (
    <section id="portfolio" className="relative py-20 sm:py-32 md:py-40 bg-zinc-900/40" aria-labelledby="portfolio-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl sm:text-7xl font-black text-gold-500/10 leading-none" aria-hidden="true">
              03
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" aria-hidden="true" />
          </div>
        </ScrollReveal>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-12 sm:mb-16">
          <ScrollReveal delay={100}>
            <div>
              <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
                {t('portfolio.label')}
              </span>
              <h2
                id="portfolio-heading"
                className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]"
              >
                {t('portfolio.title')}
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <a
              href="https://www.youtube.com/@devremedia"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-semibold text-sm group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm"
              aria-label={`${t('portfolio.watchOnYoutube')} - YouTube`}
            >
              <Youtube className="h-5 w-5" aria-hidden="true" />
              {t('portfolio.watchOnYoutube')}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </a>
          </ScrollReveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {PORTFOLIO_VIDEOS.map((video, i) => (
            <ScrollReveal key={video.id} delay={i * 100}>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="video-card block group aspect-video focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-2xl"
                aria-label={`${t(`portfolio.${video.key}`)} - YouTube`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                  alt=""
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 z-10 flex items-center justify-center" aria-hidden="true">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-[0_0_40px_rgba(201,160,51,0.3)]">
                    <Play className="h-5 w-5 sm:h-6 sm:w-6 text-black ml-0.5" fill="black" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10">
                  <h3 className="text-white font-bold text-sm sm:text-base">{t(`portfolio.${video.key}`)}</h3>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 text-center md:hidden">
          <a
            href="https://www.youtube.com/@devremedia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-semibold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm"
            aria-label={`${t('portfolio.watchOnYoutube')} - YouTube`}
          >
            <Youtube className="h-5 w-5" aria-hidden="true" />
            {t('portfolio.watchOnYoutube')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
