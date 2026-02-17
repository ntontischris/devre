import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Layers,
  Handshake,
  Smartphone,
  Eye,
  Target,
  Film,
  Mic,
  Clapperboard,
  PenTool,
  CheckCircle2,
  Play,
  Youtube,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/shared/scroll-reveal';
import { CountUp } from '@/components/shared/count-up';
import { LandingMobileNav } from '@/components/shared/landing-mobile-nav';
import { LandingContactForm } from '@/components/shared/landing-contact-form';
import { LanguageSwitcher } from '@/components/shared/language-switcher';

const CLIENT_LOGOS = [
  { name: 'UFC', src: '/images/clients/ufc.png' },
  { name: 'AJP', src: '/images/clients/ajp.png' },
  { name: 'ADCC', src: '/images/clients/adcc.png' },
  { name: 'Alpha Jiu-Jitsu', src: '/images/clients/alpha.png' },
  { name: 'Almeco', src: '/images/clients/almeco.png' },
  { name: 'Stammdesign', src: '/images/clients/stammdesign.png' },
  { name: 'Technomat', src: '/images/clients/technomat.webp' },
  { name: 'RE/MAX', src: '/images/clients/remax.png' },
  { name: 'Sunteak', src: '/images/clients/sunteak.png' },
  { name: 'Ariston', src: '/images/clients/ariston.png' },
  { name: '1516 Brewing', src: '/images/clients/1516.png' },
  { name: 'Cincin Catering', src: '/images/clients/cincin.png' },
];

const PORTFOLIO_VIDEOS = [
  { id: 'SU7cHJa24SI', key: 'video1Title' },
  { id: 't7WGvZgAfoM', key: 'video2Title' },
  { id: 'd0LHY3KmAcE', key: 'video3Title' },
  { id: 'Aa8xOabwCz8', key: 'video4Title' },
  { id: '57WcYfFSMFw', key: 'video5Title' },
  { id: 'wDvWXvlwvMM', key: 'video6Title' },
];

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default async function LandingPage() {
  const t = await getTranslations('landing');

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-gold-500/30 selection:text-white">

      {/* ════════════════════════════════════════════════════════════
          NAVIGATION — Frosted glass, minimal, floating
      ════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/60 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image src="/images/LOGO_WhiteLetter.png" alt="Devre Media" width={36} height={36} className="object-contain" />
              <span className="hidden sm:block text-white font-bold text-lg tracking-tight">DEVRE MEDIA</span>
            </Link>

            <div className="hidden lg:flex items-center gap-10">
              {[
                { href: '#about', label: t('nav.about') },
                { href: '#services', label: t('nav.services') },
                { href: '#portfolio', label: t('nav.portfolio') },
                { href: '#team', label: t('nav.team') },
                { href: '#pricing', label: t('nav.pricing') },
                { href: '#contact', label: t('nav.contact') },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-[13px] text-zinc-400 hover:text-white transition-colors font-medium">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link href="/login" className="hidden md:block">
                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/5 text-[13px]">
                  {t('nav.clientPortal')}
                </Button>
              </Link>
              <Link href="#contact" className="hidden md:block">
                <Button size="sm" className="bg-gold-500 hover:bg-gold-400 text-black font-semibold text-[13px]">
                  {t('nav.bookCall')}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
              <div className="lg:hidden">
                <LandingMobileNav />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════
          HERO — Full-screen cinematic immersive
      ════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] overflow-hidden film-grain">
        {/* Background image — full-bleed with Ken Burns zoom */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/home1.jpg"
            alt="Devre Media — Video Production"
            fill
            className="object-cover object-top hero-ken-burns"
            priority
          />
        </div>

        {/* Heavy cinematic overlays — multiple layers for depth */}
        <div className="absolute inset-0 bg-zinc-950/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-zinc-950/60" />

        {/* Ambient amber glow orb — top right */}
        <div className="hero-orb absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-[120px] pointer-events-none" />
        {/* Second subtle orb — bottom left */}
        <div className="hero-orb absolute -bottom-48 -left-48 w-[400px] h-[400px] rounded-full bg-gold-600/5 blur-[100px] pointer-events-none" style={{ animationDelay: '4s' }} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-24 sm:pb-32 lg:justify-center lg:pb-0">
          <div className="mx-auto max-w-7xl w-full px-6">

            {/* Eyebrow badge */}
            <div className="hero-clip-reveal mb-8" style={{ animationDelay: '0.3s' }}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-gold-500/20 bg-gold-500/5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-gold-400/90 text-xs font-medium tracking-[0.15em] uppercase">{t('hero.badge')}</span>
              </div>
            </div>

            {/* Main headline — massive, powerful, golden glow */}
            <h1 className="hero-clip-reveal hero-text-glow-pulse" style={{ animationDelay: '0.6s' }}>
              <span className="block text-[clamp(2.8rem,8vw,7rem)] font-black leading-[0.95] tracking-[-0.03em] text-gold-metallic">
                {t('hero.titleLine1')}
              </span>
              <span className="block text-[clamp(2.8rem,8vw,7rem)] font-black leading-[0.95] tracking-[-0.03em] text-shimmer">
                {t('hero.titleLine2')}
              </span>
            </h1>

            {/* Gold accent line */}
            <div className="hero-line-expand mt-8 h-px w-24 bg-gradient-to-r from-gold-500 to-gold-500/0" />

            {/* Description */}
            <p className="hero-fade-1 mt-6 text-base sm:text-lg text-zinc-300/80 max-w-xl leading-relaxed font-light">
              {t('hero.description')}
            </p>

            {/* CTAs */}
            <div className="hero-fade-2 mt-10 flex flex-col sm:flex-row items-start gap-4">
              <Link href="#contact">
                <Button size="lg" className="bg-gold-500 hover:bg-gold-400 text-black font-bold text-base px-8 py-6 h-auto shadow-[0_0_40px_rgba(201,160,51,0.25)] hover:shadow-[0_0_60px_rgba(201,160,51,0.35)] transition-all duration-300">
                  {t('hero.ctaPrimary')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#portfolio">
                <Button size="lg" variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/5 text-base px-8 py-6 h-auto border border-white/10 hover:border-white/20 transition-all duration-300">
                  <Play className="mr-2 h-4 w-4" />
                  {t('hero.ctaSecondary')}
                </Button>
              </Link>
            </div>

            {/* Bottom social proof — mini stat strip */}
            <div className="hero-fade-3 mt-16 flex items-center gap-8 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-white">200+</span>
                <span className="text-xs text-zinc-500 uppercase tracking-wider leading-tight">{t('stats.projects')}</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-white">50+</span>
                <span className="text-xs text-zinc-500 uppercase tracking-wider leading-tight">{t('stats.brands')}</span>
              </div>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-2xl font-black text-white">7</span>
                <span className="text-xs text-zinc-500 uppercase tracking-wider leading-tight">{t('stats.turnaround')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-scroll-bounce z-10">
          <span className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase">{t('hero.scrollDown')}</span>
          <ChevronDown className="h-4 w-4 text-zinc-600" />
        </div>

        {/* Bottom gradient fade into brands strip */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-[5]" />
      </section>

      {/* ════════════════════════════════════════════════════════════
          BRANDS STRIP — Logo marquee
      ════════════════════════════════════════════════════════════ */}
      <div className="relative border-y border-white/[0.04] py-10">
        <p className="text-center text-zinc-600 text-[10px] tracking-[0.3em] uppercase mb-8">{t('hero.trustedBy')}</p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex items-center gap-20 animate-[marquee_50s_linear_infinite]">
            {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((brand, i) => (
              <Image
                key={i}
                src={brand.src}
                alt={brand.name}
                width={100}
                height={40}
                className="h-8 w-auto object-contain brightness-0 invert opacity-25 hover:opacity-60 transition-opacity duration-300 flex-shrink-0"
                unoptimized
              />
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          ABOUT — Editorial asymmetric layout
      ════════════════════════════════════════════════════════════ */}
      <section id="about" className="relative py-32 md:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_20%,rgba(201,160,51,0.03),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div>
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-7xl font-black text-gold-500/10 leading-none">01</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">{t('about.label')}</span>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
                  {t('about.title')}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <p className="mt-6 text-lg text-zinc-400 leading-relaxed">{t('about.description')}</p>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <p className="mt-4 text-zinc-500 leading-relaxed">{t('about.text1')}</p>
              </ScrollReveal>

              <ScrollReveal delay={500}>
                <p className="mt-4 text-zinc-500 leading-relaxed">{t('about.text2')}</p>
              </ScrollReveal>
            </div>

            <div className="space-y-6">
              <ScrollReveal animation="slide-left" delay={300}>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image src="/images/hero/home2.jpg" alt="Devre Media at work" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.06]" />
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { Icon: Clock, title: t('about.highlight1Title'), desc: t('about.highlight1Desc') },
                  { Icon: Layers, title: t('about.highlight2Title'), desc: t('about.highlight2Desc') },
                  { Icon: Handshake, title: t('about.highlight3Title'), desc: t('about.highlight3Desc') },
                ].map((item, i) => (
                  <ScrollReveal key={i} delay={500 + i * 100}>
                    <div className="glass-card rounded-xl p-4 text-center group">
                      <item.Icon className="h-5 w-5 text-gold-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-[10px] text-zinc-500 leading-snug">{item.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          APPROACH — Cards + dramatic quote
      ════════════════════════════════════════════════════════════ */}
      <section id="approach" className="relative py-32 md:py-40 bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="max-w-3xl mb-16">
              <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">{t('approach.label')}</span>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
                {t('approach.title')}
              </h2>
              <p className="mt-6 text-lg text-zinc-400 leading-relaxed">{t('approach.description')}</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {[
              { Icon: Smartphone, title: t('approach.card1Title'), desc: t('approach.card1Desc') },
              { Icon: Eye, title: t('approach.card2Title'), desc: t('approach.card2Desc') },
              { Icon: Target, title: t('approach.card3Title'), desc: t('approach.card3Desc') },
            ].map((card, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="bento-card p-8 h-full">
                  <card.Icon className="h-8 w-8 text-gold-500 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="scale-up">
            <blockquote className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-12 md:p-16 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold-500 to-transparent" />
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed italic pl-6">
                &ldquo;{t('approach.quote')}&rdquo;
              </p>
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SERVICES — Bento grid with glassmorphism
      ════════════════════════════════════════════════════════════ */}
      <section id="services" className="relative py-32 md:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(201,160,51,0.04),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-7xl font-black text-gold-500/10 leading-none">02</span>
              <div className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">{t('services.label')}</span>
            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-16">
              {t('services.title')}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { Icon: Film, title: t('services.socialTitle'), desc: t('services.socialDesc'), tag: t('services.socialTag') },
              { Icon: Mic, title: t('services.podcastTitle'), desc: t('services.podcastDesc'), tag: t('services.podcastTag') },
              { Icon: Clapperboard, title: t('services.eventTitle'), desc: t('services.eventDesc'), tag: t('services.eventTag') },
              { Icon: Target, title: t('services.corporateTitle'), desc: t('services.corporateDesc'), tag: t('services.corporateTag') },
              { Icon: Layers, title: t('services.graphicTitle'), desc: t('services.graphicDesc'), tag: t('services.graphicTag') },
              { Icon: PenTool, title: t('services.copyTitle'), desc: t('services.copyDesc'), tag: t('services.copyTag') },
            ].map((service, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bento-card p-8 h-full relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(201,160,51,0.05),transparent_70%)] group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative">
                    <div className="inline-block px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-[10px] font-bold tracking-wider uppercase mb-5">
                      {service.tag}
                    </div>
                    <service.Icon className="h-8 w-8 text-gold-500 mb-5" />
                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-zinc-400 leading-relaxed text-sm">{service.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={500}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
              {[t('services.featureDrone'), t('services.featureMusic'), t('services.featureSubs'), t('services.featureStrategy')].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold-500" />
                  <span className="text-zinc-400 text-sm">{feat}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PORTFOLIO — Featured video + grid
      ════════════════════════════════════════════════════════════ */}
      <section id="portfolio" className="relative py-32 md:py-40 bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-7xl font-black text-gold-500/10 leading-none">03</span>
              <div className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" />
            </div>
          </ScrollReveal>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <ScrollReveal delay={100}>
              <div>
                <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">{t('portfolio.label')}</span>
                <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
                  {t('portfolio.title')}
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <a
                href="https://www.youtube.com/@devremedia"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-semibold text-sm group flex-shrink-0"
              >
                <Youtube className="h-5 w-5" />
                {t('portfolio.watchOnYoutube')}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </ScrollReveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTFOLIO_VIDEOS.map((video, i) => (
              <ScrollReveal key={video.id} delay={i * 100}>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-card block group aspect-video"
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt={t(`portfolio.${video.key}`)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gold-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-[0_0_40px_rgba(201,160,51,0.3)]">
                      <Play className="h-6 w-6 text-black ml-0.5" fill="black" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3 className="text-white font-bold">{t(`portfolio.${video.key}`)}</h3>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <a
              href="https://www.youtube.com/@devremedia"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-semibold text-sm"
            >
              <Youtube className="h-5 w-5" />
              {t('portfolio.watchOnYoutube')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PROCESS — Large outline numbers + timeline
      ════════════════════════════════════════════════════════════ */}
      <section id="process" className="relative py-32 md:py-40">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">{t('process.label')}</span>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
                {t('process.title')}
              </h2>
              <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">{t('process.description')}</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-8 md:gap-4">
            {[1, 2, 3, 4].map((step, i) => (
              <ScrollReveal key={step} delay={i * 150}>
                <div className="relative text-center md:text-left">
                  <div className="text-[5rem] md:text-[6rem] font-black leading-none text-transparent mb-4" style={{ WebkitTextStroke: '1.5px rgba(201, 160, 51, 0.25)' }}>
                    0{step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{t(`process.step${step}Title`)}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{t(`process.step${step}Desc`)}</p>
                  {step < 4 && (
                    <div className="hidden md:block absolute top-12 right-0 w-full h-px translate-x-1/2 bg-gradient-to-r from-gold-500/20 to-transparent" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CASE STUDIES — Featured clients
      ════════════════════════════════════════════════════════════ */}
      <section id="work" className="relative py-32 md:py-40 bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">{t('work.label')}</span>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
                {t('work.title')}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {[
              { name: 'Mavri Thalassa', tag: t('work.mavriTag'), desc: t('work.mavriDesc'), accent: 'bg-blue-500/10 text-blue-400' },
              { name: 'Technomat', tag: t('work.technomatTag'), desc: t('work.technomatDesc'), accent: 'bg-purple-500/10 text-purple-400' },
              { name: 'Ophthalmica', tag: t('work.ophthalmicaTag'), desc: t('work.ophthalmicaDesc'), accent: 'bg-emerald-500/10 text-emerald-400' },
            ].map((study, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="glass-card rounded-2xl p-8 h-full">
                  <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-4 ${study.accent}`}>
                    {study.tag}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{study.name}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{study.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center">
              <p className="text-zinc-500 text-sm mb-6">{t('work.alsoWorking')}</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {CLIENT_LOGOS.slice(0, 8).map((brand) => (
                  <Image
                    key={brand.name}
                    src={brand.src}
                    alt={brand.name}
                    width={80}
                    height={32}
                    className="h-6 w-auto object-contain brightness-0 invert opacity-15 hover:opacity-50 transition-opacity duration-300"
                    unoptimized
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          TEAM — Dramatic portrait cards
      ════════════════════════════════════════════════════════════ */}
      <section id="team" className="relative py-32 md:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_0%,rgba(201,160,51,0.04),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-7xl font-black text-gold-500/10 leading-none">04</span>
              <div className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">{t('team.label')}</span>
            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-4">
              {t('team.title')}
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-16">{t('team.description')}</p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Haris */}
            <ScrollReveal delay={200}>
              <div className="group glass-card rounded-2xl overflow-hidden">
                <div className="relative h-[420px] md:h-[500px] overflow-hidden">
                  <Image
                    src="/images/team/haris.jpg"
                    alt="Haris Devrentlis"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-1">{t('team.harisRole')}</p>
                    <h3 className="text-3xl font-black text-white">{t('team.harisName')}</h3>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-zinc-400 leading-relaxed text-sm mb-4">{t('team.harisBio')}</p>
                  <a
                    href="https://www.instagram.com/haris_devre_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-gold-400 transition-colors text-sm"
                  >
                    <Instagram className="h-4 w-4" />
                    @haris_devre_
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Angelos */}
            <ScrollReveal delay={350}>
              <div className="group glass-card rounded-2xl overflow-hidden">
                <div className="relative h-[420px] md:h-[500px] overflow-hidden">
                  <Image
                    src="/images/team/angelos.jpg"
                    alt="Angelos Devrentlis"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mb-1">{t('team.angelosRole')}</p>
                    <h3 className="text-3xl font-black text-white">{t('team.angelosName')}</h3>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-zinc-400 leading-relaxed text-sm mb-4">{t('team.angelosBio')}</p>
                  <div className="flex items-center gap-4">
                    <a href="https://www.instagram.com/a.devre/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-zinc-500 hover:text-gold-400 transition-colors text-sm">
                      <Instagram className="h-4 w-4" /> @a.devre
                    </a>
                    <a href="https://www.tiktok.com/@a.devre" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-gold-400 transition-colors" title="TikTok">
                      <TikTokIcon />
                    </a>
                    <a href="https://www.linkedin.com/in/angelos-devrentlis-28387894" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-gold-400 transition-colors" title="LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATS — Animated counters with glow
      ════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-zinc-900/40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_50%,rgba(201,160,51,0.05),transparent)]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { end: 200, suffix: '+', label: t('stats.projects') },
              { end: 50, suffix: '+', label: t('stats.brands') },
              { end: 24, suffix: 'h', label: t('stats.turnaround') },
              { end: 3, suffix: '+', label: t('stats.years') },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100} className="text-center">
                <div className="text-5xl md:text-7xl font-black text-gold-500 mb-2">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-zinc-500 font-medium text-sm">{stat.label}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          PRICING — Glass cards with glowing featured tier
      ════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="relative py-32 md:py-40">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">{t('pricing.label')}</span>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
                {t('pricing.title')}
              </h2>
              <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">{t('pricing.description')}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <h3 className="text-xl font-bold text-white mb-8 text-center">{t('pricing.socialLabel')}</h3>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto mb-12">
            {/* Starter */}
            <ScrollReveal delay={0}>
              <div className="glass-card rounded-2xl p-8 h-full">
                <h4 className="text-lg font-bold text-white mb-2">{t('pricing.starter')}</h4>
                <div className="mb-6">
                  <span className="text-5xl font-black text-white">4</span>
                  <span className="text-zinc-500 ml-1 text-sm">{t('pricing.videosMonth')}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[t('pricing.feature1filming'), t('pricing.featureEditing'), t('pricing.featureBrief'), t('pricing.featureRevision')].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-400 text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href="#contact">
                  <Button variant="outline" className="w-full border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 h-11">
                    {t('pricing.getQuote')}
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Growth — Featured */}
            <ScrollReveal delay={150}>
              <div className="relative glass-card rounded-2xl p-8 h-full border-gold-500/30 pricing-popular">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gold-500 text-black text-[10px] font-bold tracking-wider uppercase">
                  {t('pricing.mostPopular')}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{t('pricing.growth')}</h4>
                <div className="mb-6">
                  <span className="text-5xl font-black text-gold-500">8</span>
                  <span className="text-zinc-500 ml-1 text-sm">{t('pricing.videosMonth')}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[t('pricing.feature2filming'), t('pricing.featureEditing'), t('pricing.featureBrief'), t('pricing.featureRevision'), t('pricing.featureDrone')].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-400 text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href="#contact">
                  <Button className="w-full bg-gold-500 hover:bg-gold-400 text-black font-bold h-11">
                    {t('pricing.getQuote')}
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Scale */}
            <ScrollReveal delay={300}>
              <div className="glass-card rounded-2xl p-8 h-full">
                <h4 className="text-lg font-bold text-white mb-2">{t('pricing.scale')}</h4>
                <div className="mb-6">
                  <span className="text-5xl font-black text-white">12</span>
                  <span className="text-zinc-500 ml-1 text-sm">{t('pricing.videosMonth')}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[t('pricing.feature2filming'), t('pricing.featureEditing'), t('pricing.featureBrief'), t('pricing.featureRevision'), t('pricing.featureDrone'), t('pricing.sameDayDelivery')].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-gold-500 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-400 text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link href="#contact">
                  <Button variant="outline" className="w-full border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 h-11">
                    {t('pricing.getQuote')}
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Podcast + Events */}
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <ScrollReveal delay={0}>
              <div className="glass-card rounded-2xl p-8">
                <h4 className="text-xl font-bold text-white mb-2">{t('pricing.podcastLabel')}</h4>
                <div className="mb-4">
                  <span className="text-3xl font-black text-white">4-8</span>
                  <span className="text-zinc-500 ml-1 text-sm">{t('pricing.epMonth')}</span>
                </div>
                <p className="text-zinc-400 text-sm mb-6">{t('pricing.podcastDesc')}</p>
                <Link href="#contact">
                  <Button variant="outline" className="w-full border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 h-10">
                    {t('pricing.getQuote')}
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="glass-card rounded-2xl p-8">
                <h4 className="text-xl font-bold text-white mb-2">{t('pricing.eventLabel')}</h4>
                <div className="mb-4">
                  <span className="text-3xl font-black text-white">3-6</span>
                  <span className="text-zinc-500 ml-1 text-sm">{t('pricing.videos')}</span>
                </div>
                <p className="text-zinc-400 text-sm mb-6">{t('pricing.eventDesc')}</p>
                <Link href="#contact">
                  <Button variant="outline" className="w-full border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 h-10">
                    {t('pricing.getQuote')}
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <p className="text-center text-zinc-600 mt-8 text-sm max-w-2xl mx-auto">{t('pricing.customNote')}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          WHY US — Feature grid with amber dots
      ════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">{t('whyUs.label')}</span>
              <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05]">
                {t('whyUs.title')}
              </h2>
              <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto">{t('whyUs.description')}</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: t('whyUs.cinematicTitle'), desc: t('whyUs.cinematicDesc') },
              { title: t('whyUs.speedTitle'), desc: t('whyUs.speedDesc') },
              { title: t('whyUs.partnershipTitle'), desc: t('whyUs.partnershipDesc') },
              { title: t('whyUs.termsTitle'), desc: t('whyUs.termsDesc') },
              { title: t('whyUs.strategyTitle'), desc: t('whyUs.strategyDesc') },
              { title: t('whyUs.droneTitle'), desc: t('whyUs.droneDesc') },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card rounded-xl p-6 h-full">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4">
                    <div className="w-2 h-2 rounded-full bg-gold-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CONTACT — Split layout: form + info
      ════════════════════════════════════════════════════════════ */}
      <section id="contact" className="relative py-32 md:py-40">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-7xl font-black text-gold-500/10 leading-none">05</span>
              <div className="h-px flex-1 bg-gradient-to-r from-gold-500/40 to-transparent" />
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <ScrollReveal delay={100}>
                <span className="text-gold-500 text-xs font-semibold tracking-[0.2em] uppercase">{t('contact.label')}</span>
                <h2 className="mt-4 text-4xl md:text-5xl font-black text-white leading-[1.05] mb-3">
                  {t('contact.title')}
                </h2>
                <p className="text-zinc-400 mb-10">{t('contact.description')}</p>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <LandingContactForm />
              </ScrollReveal>
            </div>

            <div className="space-y-8">
              {/* Offices */}
              {[
                { title: t('contact.viennaOffice'), address: t('contact.viennaAddress') },
                { title: t('contact.thessalonikiOffice'), address: t('contact.thessalonikiAddress') },
              ].map((office, i) => (
                <ScrollReveal key={i} delay={300 + i * 100}>
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold-500" />
                      {office.title}
                    </h3>
                    <p className="text-zinc-400 text-sm pl-6">{office.address}</p>
                  </div>
                </ScrollReveal>
              ))}

              {/* Phone */}
              <ScrollReveal delay={500}>
                <div>
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gold-500" />
                    {t('contact.callUs')}
                  </h3>
                  <div className="text-zinc-400 text-sm pl-6 space-y-1">
                    <p>+43 670 650 2131</p>
                    <p>+30 6984 592 968</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Email */}
              <ScrollReveal delay={600}>
                <div>
                  <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gold-500" />
                    {t('contact.emailUs')}
                  </h3>
                  <a href="mailto:devremedia@gmail.com" className="text-gold-500 hover:text-gold-400 text-sm pl-6">
                    devremedia@gmail.com
                  </a>
                </div>
              </ScrollReveal>

              {/* Social */}
              <ScrollReveal delay={700}>
                <div>
                  <h3 className="text-base font-bold text-white mb-4">{t('contact.followUs')}</h3>
                  <div className="flex items-center gap-3">
                    {[
                      { href: 'https://www.instagram.com/devre.media/', icon: <Instagram className="h-4 w-4" /> },
                      { href: 'https://www.tiktok.com/@devre.media', icon: <TikTokIcon /> },
                      { href: 'https://www.linkedin.com/company/devre-media', icon: <Linkedin className="h-4 w-4" /> },
                      { href: 'https://www.youtube.com/@devremedia', icon: <Youtube className="h-4 w-4" /> },
                    ].map((social, i) => (
                      <a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-gold-500 hover:border-gold-500/30 transition-all"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CTA — Dramatic final call to action
      ════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <Image src="/images/hero/home2.jpg" alt="" fill className="object-cover opacity-[0.06]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(201,160,51,0.08),transparent)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
              {t('cta.title1')}{' '}
              <span className="text-gold-500">{t('cta.title2')}</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">{t('cta.description')}</p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <Link href="#contact">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-400 text-black font-bold text-lg px-10 py-7 h-auto shadow-[0_0_60px_rgba(201,160,51,0.25)] animate-glow-pulse">
                {t('cta.button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={500}>
            <p className="text-zinc-600 mt-8 text-sm">{t('cta.location')}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FOOTER — Minimal, elegant
      ════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.04] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <Image src="/images/LOGO_WhiteLetter.png" alt="Devre Media" width={32} height={32} className="object-contain" />
                <span className="text-white font-bold text-lg tracking-tight">DEVRE MEDIA</span>
              </Link>
              <p className="text-zinc-500 text-sm mb-6 max-w-xs leading-relaxed">{t('footer.tagline')}</p>
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/devre.media/" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-gold-500 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://www.tiktok.com/@devre.media" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-gold-500 transition-colors">
                  <TikTokIcon />
                </a>
                <a href="https://www.linkedin.com/company/devre-media" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-gold-500 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href="https://www.youtube.com/@devremedia" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-gold-500 transition-colors">
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white text-sm font-bold mb-4">{t('footer.servicesLabel')}</h3>
              <ul className="space-y-2.5">
                <li><Link href="#services" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors">{t('services.socialTitle')}</Link></li>
                <li><Link href="#services" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors">{t('services.podcastTitle')}</Link></li>
                <li><Link href="#services" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors">{t('services.eventTitle')}</Link></li>
                <li><Link href="#services" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors">{t('services.corporateTitle')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-bold mb-4">{t('footer.companyLabel')}</h3>
              <ul className="space-y-2.5">
                <li><Link href="#about" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors">{t('footer.aboutUs')}</Link></li>
                <li><Link href="#team" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors">{t('footer.ourTeam')}</Link></li>
                <li><Link href="#portfolio" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors">{t('footer.portfolio')}</Link></li>
                <li><Link href="#work" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors">{t('footer.caseStudies')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-bold mb-4">{t('footer.platformLabel')}</h3>
              <ul className="space-y-2.5">
                <li><Link href="/login" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors">{t('nav.login')}</Link></li>
                <li><Link href="/login" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors">{t('footer.createAccount')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-zinc-600 text-xs">
              {t('footer.copyright')} {new Date().getFullYear()} Devre Media. {t('footer.city')}.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-zinc-600 hover:text-gold-500 text-xs transition-colors">{t('footer.impressum')}</a>
              <a href="#" className="text-zinc-600 hover:text-gold-500 text-xs transition-colors">{t('footer.privacy')}</a>
              <a href="mailto:devremedia@gmail.com" className="text-zinc-600 hover:text-gold-500 text-xs transition-colors">{t('footer.emailAddress')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
