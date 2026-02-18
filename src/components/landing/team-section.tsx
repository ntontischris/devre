import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Instagram, Linkedin } from 'lucide-react';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { TikTokIcon } from './tiktok-icon';

export async function TeamSection() {
  const t = await getTranslations('landing');

  return (
    <section id="team" className="relative py-24 sm:py-32 md:py-40" aria-labelledby="team-heading">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(201,160,51,0.04),transparent)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">
            {t('team.label')}
          </span>
          <h2
            id="team-heading"
            className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-3 sm:mb-4"
          >
            {t('team.title')}
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed mb-12 sm:mb-16">
            {t('team.description')}
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Haris */}
          <ScrollReveal delay={200}>
            <article className="group glass-card rounded-2xl overflow-hidden">
              <div className="relative h-[300px] sm:h-[420px] md:h-[500px] overflow-hidden">
                <Image
                  src="/images/team/haris.jpg"
                  alt={`${t('team.harisName')} - ${t('team.harisRole')}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-1">
                    {t('team.harisRole')}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{t('team.harisName')}</h3>
                </div>
              </div>
              {/* Gold accent line */}
              <div className="h-px bg-gradient-to-r from-gold-500/30 via-gold-500/10 to-transparent" aria-hidden="true" />
              <div className="p-6 sm:p-8">
                <p className="text-zinc-400 leading-relaxed text-sm mb-4 sm:mb-5">{t('team.harisBio')}</p>
                <a
                  href="https://www.instagram.com/haris_devre_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full glass-card inline-flex items-center justify-center text-zinc-400 hover:text-gold-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                  aria-label="Haris Devrentlis on Instagram"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </article>
          </ScrollReveal>

          {/* Angelos */}
          <ScrollReveal delay={350}>
            <article className="group glass-card rounded-2xl overflow-hidden">
              <div className="relative h-[300px] sm:h-[420px] md:h-[500px] overflow-hidden">
                <Image
                  src="/images/team/angelos.jpg"
                  alt={`${t('team.angelosName')} - ${t('team.angelosRole')}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" aria-hidden="true" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-1">
                    {t('team.angelosRole')}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{t('team.angelosName')}</h3>
                </div>
              </div>
              {/* Gold accent line */}
              <div className="h-px bg-gradient-to-r from-gold-500/30 via-gold-500/10 to-transparent" aria-hidden="true" />
              <div className="p-6 sm:p-8">
                <p className="text-zinc-400 leading-relaxed text-sm mb-4 sm:mb-5">{t('team.angelosBio')}</p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.instagram.com/a.devre/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full glass-card inline-flex items-center justify-center text-zinc-400 hover:text-gold-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                    aria-label="Angelos Devrentlis on Instagram"
                  >
                    <Instagram className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@a.devre"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full glass-card inline-flex items-center justify-center text-zinc-400 hover:text-gold-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                    aria-label="Angelos Devrentlis on TikTok"
                  >
                    <TikTokIcon />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/angelos-devrentlis-28387894"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full glass-card inline-flex items-center justify-center text-zinc-400 hover:text-gold-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                    aria-label="Angelos Devrentlis on LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
