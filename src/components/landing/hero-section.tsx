import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function HeroSection() {
  const t = await getTranslations('landing');

  return (
    <section
      className="relative h-screen min-h-[600px] sm:min-h-[700px] overflow-hidden film-grain"
      aria-label={t('hero.sectionLabel')}
    >
      {/* Background image */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero/home1.jpg"
          alt=""
          fill
          className="object-cover object-top hero-ken-burns"
          priority
        />
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-zinc-950/70" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/30"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-zinc-950/60"
        aria-hidden="true"
      />

      {/* Ambient orbs */}
      <div
        className="hero-orb absolute -top-32 -right-32 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-gold-500/10 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="hero-orb absolute -bottom-48 -left-48 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-gold-600/5 blur-[100px] pointer-events-none"
        aria-hidden="true"
        style={{ animationDelay: '4s' }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 sm:pb-32 lg:justify-center lg:pb-0">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6">
          {/* Eyebrow badge */}
          <div className="hero-clip-reveal mb-6 sm:mb-8" style={{ animationDelay: '0.3s' }}>
            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gold-500/20 bg-gold-500/5 backdrop-blur-sm">
              <span
                className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse"
                aria-hidden="true"
              />
              <span className="text-gold-400/90 text-[10px] sm:text-xs font-medium tracking-[0.15em] uppercase">
                {t('hero.badge')}
              </span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="hero-clip-reveal hero-text-glow-pulse" style={{ animationDelay: '0.6s' }}>
            <span className="block text-[clamp(2.2rem,7vw,7rem)] font-black text-white leading-[0.95] tracking-[-0.03em]">
              {t('hero.titleLine1')}
            </span>
            <span className="block text-[clamp(2.2rem,7vw,7rem)] font-black leading-[0.95] tracking-[-0.03em] text-shimmer">
              {t('hero.titleLine2')}
            </span>
          </h1>

          {/* Gold accent line */}
          <div
            className="hero-line-expand mt-6 sm:mt-8 h-px w-24 bg-gradient-to-r from-gold-500 to-gold-500/0"
            aria-hidden="true"
          />

          {/* Description */}
          <p className="hero-fade-1 mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-zinc-300/80 max-w-xl leading-relaxed font-light">
            {t('hero.description')}
          </p>

          {/* CTAs */}
          <div className="hero-fade-2 mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gold-500 hover:bg-gold-400 text-black font-bold text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 h-auto shadow-[0_0_40px_rgba(201,160,51,0.25)] hover:shadow-[0_0_60px_rgba(201,160,51,0.35)] transition-all duration-300"
            >
              <Link href="#contact">
                {t('hero.ctaPrimary')}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto text-zinc-300 hover:text-white hover:bg-white/5 text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 h-auto border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Link href="#portfolio">
                <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('hero.ctaSecondary')}
              </Link>
            </Button>
          </div>

          {/* Social proof stats */}
          <div className="hero-fade-3 mt-10 sm:mt-16 flex items-center gap-4 sm:gap-8 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-black text-white">200+</span>
              <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider leading-tight">
                {t('stats.projects')}
              </span>
            </div>
            <div className="h-6 sm:h-8 w-px bg-white/10" aria-hidden="true" />
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-black text-white">50+</span>
              <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider leading-tight">
                {t('stats.brands')}
              </span>
            </div>
            <div className="h-6 sm:h-8 w-px bg-white/10 hidden sm:block" aria-hidden="true" />
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl font-black text-white">7</span>
              <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider leading-tight">
                {t('stats.turnaround')}
              </span>
            </div>
            <span className="sr-only sm:hidden">
              7 {t('stats.turnaround')}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3 animate-scroll-bounce z-10"
        aria-hidden="true"
      >
        <span className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase">
          {t('hero.scrollDown')}
        </span>
        <ChevronDown className="h-4 w-4 text-zinc-600" />
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-[5]"
        aria-hidden="true"
      />
    </section>
  );
}
