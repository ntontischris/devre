import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import {
  Play,
  Smartphone,
  Clapperboard,
  Mic,
  Zap,
  CalendarCheck,
  Film,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Clock,
  Users,
  Target,
  Eye,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';

const TRUSTED_BRANDS = [
  'Mavri Thalassa',
  'Almeco',
  'Technomat',
  'Ophthalmica',
  'MotoMarket',
  'Sky Venue',
  'UFC',
  'AJP',
  'REMAX Hellas',
];

export default async function Home() {
  const t = await getTranslations('landing');

  return (
    <div className="min-h-screen selection:bg-amber-500/20">
      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/Logo_Horizontal_Transparent.png"
              alt="Devre Media"
              width={160}
              height={44}
              className="h-9 w-auto"
              priority
            />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <Link href="#approach" className="text-[13px] font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:text-white">
              {t('nav.approach')}
            </Link>
            <Link href="#services" className="text-[13px] font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:text-white">
              {t('nav.services')}
            </Link>
            <Link href="#work" className="text-[13px] font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:text-white">
              {t('nav.work')}
            </Link>
            <Link href="#pricing" className="text-[13px] font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:text-white">
              {t('nav.pricing')}
            </Link>
            <Link href="#contact" className="text-[13px] font-medium uppercase tracking-widest text-zinc-400 transition-colors hover:text-white">
              {t('nav.contact')}
            </Link>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10">
                {t('nav.clientPortal')}
              </Button>
            </Link>
            <Link href="/book">
              <Button size="sm" className="bg-amber-500 text-zinc-950 hover:bg-amber-400 font-semibold">
                {t('nav.bookCall')}
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher />
            <Link href="/login" className="text-sm text-zinc-400">{t('nav.login')}</Link>
            <Link href="/book">
              <Button size="sm" className="bg-amber-500 text-zinc-950 hover:bg-amber-400 text-xs font-semibold">
                {t('nav.bookCall')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO (Dark) ─── */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-zinc-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(120,53,15,0.1),transparent)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-5 py-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                {t('hero.badge')}
              </span>
            </div>

            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-tight">
              {t('hero.titleLine1')}
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                {t('hero.titleLine2')}
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
              {t('hero.description')}
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/book">
                <Button size="lg" className="group bg-amber-500 px-8 text-zinc-950 hover:bg-amber-400 font-semibold text-base h-13 shadow-lg shadow-amber-500/20">
                  {t('hero.ctaPrimary')}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#services">
                <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 text-base h-13">
                  {t('hero.ctaSecondary')}
                </Button>
              </Link>
            </div>

            {/* Trusted by */}
            <div className="mt-24 border-t border-white/10 pt-10">
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
                {t('hero.trustedBy')}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {TRUSTED_BRANDS.map((brand) => (
                  <span key={brand} className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to light */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 to-transparent" />
      </section>

      {/* ─── APPROACH (Light) ─── */}
      <section id="approach" className="bg-stone-50 py-28 sm:py-36 text-zinc-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              {t('approach.label')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-zinc-900">
              {t('approach.title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-500">
              {t('approach.description')}
            </p>
          </div>

          <div className="mt-20 grid gap-6 lg:grid-cols-3">
            <div className="group rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-amber-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">{t('approach.card1Title')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                {t('approach.card1Desc')}
              </p>
            </div>

            <div className="group rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-amber-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">{t('approach.card2Title')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                {t('approach.card2Desc')}
              </p>
            </div>

            <div className="group rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-amber-200">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900">{t('approach.card3Title')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                {t('approach.card3Desc')}
              </p>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-16 mx-auto max-w-3xl text-center">
            <blockquote className="relative rounded-2xl bg-zinc-900 px-10 py-10 text-white">
              <div className="absolute -top-3 left-10 text-5xl text-amber-400 font-serif leading-none">&ldquo;</div>
              <p className="text-lg font-medium italic leading-relaxed text-zinc-200 pt-3">
                {t('approach.quote')}
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ─── SERVICES (Dark) ─── */}
      <section id="services" className="relative bg-zinc-900 py-28 sm:py-36 text-white">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-stone-50 to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              {t('services.label')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t('services.title')}
            </h2>
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl bg-white/5 border border-white/10 p-8 transition-all hover:bg-white/10 hover:border-amber-500/30">
              <Film className="mb-5 h-7 w-7 text-amber-400" />
              <h3 className="text-lg font-semibold">{t('services.socialTitle')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {t('services.socialDesc')}
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-amber-400/70">
                {t('services.socialTag')}
              </p>
            </div>

            <div className="group rounded-2xl bg-white/5 border border-white/10 p-8 transition-all hover:bg-white/10 hover:border-amber-500/30">
              <Mic className="mb-5 h-7 w-7 text-amber-400" />
              <h3 className="text-lg font-semibold">{t('services.podcastTitle')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {t('services.podcastDesc')}
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-amber-400/70">
                {t('services.podcastTag')}
              </p>
            </div>

            <div className="group rounded-2xl bg-white/5 border border-white/10 p-8 transition-all hover:bg-white/10 hover:border-amber-500/30">
              <Zap className="mb-5 h-7 w-7 text-amber-400" />
              <h3 className="text-lg font-semibold">{t('services.eventTitle')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {t('services.eventDesc')}
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-amber-400/70">
                {t('services.eventTag')}
              </p>
            </div>

            <div className="group rounded-2xl bg-white/5 border border-white/10 p-8 transition-all hover:bg-white/10 hover:border-amber-500/30">
              <Clapperboard className="mb-5 h-7 w-7 text-amber-400" />
              <h3 className="text-lg font-semibold">{t('services.corporateTitle')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {t('services.corporateDesc')}
              </p>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-amber-400/70">
                {t('services.corporateTag')}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
              {t('services.featureDrone')}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
              {t('services.featureMusic')}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
              {t('services.featureSubs')}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
              {t('services.featureStrategy')}
            </span>
          </div>
        </div>
      </section>

      {/* ─── PROCESS (Light) ─── */}
      <section className="bg-white py-28 sm:py-36 text-zinc-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              {t('process.label')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t('process.title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-500">
              {t('process.description')}
            </p>
          </div>

          <div className="mt-20 grid gap-0 lg:grid-cols-4">
            {[
              { num: '1', title: t('process.step1Title'), desc: t('process.step1Desc') },
              { num: '2', title: t('process.step2Title'), desc: t('process.step2Desc') },
              { num: '3', title: t('process.step3Title'), desc: t('process.step3Desc') },
              { num: '4', title: t('process.step4Title'), desc: t('process.step4Desc') },
            ].map((step, i) => (
              <div key={step.num} className="relative px-6 py-8 lg:px-8">
                {i < 3 && (
                  <div className="hidden lg:block absolute top-12 right-0 w-px h-12 bg-gradient-to-b from-amber-300 to-amber-100" />
                )}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white shadow-md shadow-amber-500/30">
                  {step.num}
                </div>
                <h3 className="text-base font-semibold text-zinc-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CASE STUDIES (Warm Gradient) ─── */}
      <section id="work" className="bg-gradient-to-b from-amber-50 to-stone-50 py-28 sm:py-36 text-zinc-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              {t('work.label')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t('work.title')}
            </h2>
          </div>

          <div className="mt-20 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">Mavri Thalassa</h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">{t('work.mavriTag')}</span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500">
                {t('work.mavriDesc')}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">60 reels/{t('pricing.epMonth').includes('επ') ? 'μήνα' : 'mo'}</span>
                <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">3 vlogs/{t('pricing.epMonth').includes('επ') ? 'μήνα' : 'mo'}</span>
                <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">6 podcasts/{t('pricing.epMonth').includes('επ') ? 'μήνα' : 'mo'}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">Technomat</h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">{t('work.technomatTag')}</span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500">
                {t('work.technomatDesc')}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">4 &rarr; 8 {t('pricing.videosMonth')}</span>
                <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">Scaled up</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">Ophthalmica</h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">{t('work.ophthalmicaTag')}</span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500">
                {t('work.ophthalmicaDesc')}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">8 {t('pricing.videosMonth')}</span>
                <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">Brand image</span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-zinc-500">
              {t('work.alsoWorking')}
            </p>
          </div>
        </div>
      </section>

      {/* ─── PRICING (White) ─── */}
      <section id="pricing" className="bg-white py-28 sm:py-36 text-zinc-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              {t('pricing.label')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t('pricing.title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-500">
              {t('pricing.description')}
            </p>
          </div>

          {/* Social packages */}
          <div className="mt-16">
            <h3 className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.15em] text-zinc-400">
              {t('pricing.socialLabel')}
            </h3>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Starter */}
              <div className="rounded-2xl border border-zinc-200 bg-stone-50 p-8 transition-all hover:border-zinc-300 hover:shadow-sm">
                <div className="text-sm font-medium text-zinc-500">{t('pricing.starter')}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-zinc-900">4</span>
                  <span className="text-zinc-400 font-medium">{t('pricing.videosMonth')}</span>
                </div>
                <ul className="mt-8 space-y-3 text-sm text-zinc-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.feature1filming')}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.featureEditing')}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.featureBrief')}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.featureRevision')}
                  </li>
                </ul>
              </div>

              {/* Growth (Popular) */}
              <div className="relative rounded-2xl border-2 border-amber-400 bg-white p-8 shadow-lg shadow-amber-100">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-bold text-white shadow-md">
                  {t('pricing.mostPopular')}
                </div>
                <div className="text-sm font-medium text-zinc-500">{t('pricing.growth')}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-zinc-900">8</span>
                  <span className="text-zinc-400 font-medium">{t('pricing.videosMonth')}</span>
                </div>
                <ul className="mt-8 space-y-3 text-sm text-zinc-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.feature2filming')}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.featureEditing')}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.featureBrief')}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.featureRevision')}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.featureDrone')}
                  </li>
                </ul>
              </div>

              {/* Scale */}
              <div className="rounded-2xl border border-zinc-200 bg-stone-50 p-8 transition-all hover:border-zinc-300 hover:shadow-sm">
                <div className="text-sm font-medium text-zinc-500">{t('pricing.scale')}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-zinc-900">12</span>
                  <span className="text-zinc-400 font-medium">{t('pricing.videosMonth')}</span>
                </div>
                <ul className="mt-8 space-y-3 text-sm text-zinc-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.feature2filming')}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.featureEditing')}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.featureBrief')}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.featureRevision')}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    {t('pricing.featureDrone')}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Podcast + Events */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-stone-50 p-8">
              <Mic className="mb-4 h-6 w-6 text-amber-500" />
              <h3 className="text-lg font-semibold">{t('pricing.podcastLabel')}</h3>
              <p className="mt-2 text-sm text-zinc-500">
                {t('pricing.podcastDesc')}
              </p>
              <div className="mt-4 flex gap-3 text-sm text-zinc-400 font-medium">
                <span>2 {t('pricing.epMonth')}</span>
                <span className="text-zinc-300">|</span>
                <span>4 {t('pricing.epMonth')}</span>
                <span className="text-zinc-300">|</span>
                <span>6 {t('pricing.epMonth')}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-stone-50 p-8">
              <Zap className="mb-4 h-6 w-6 text-amber-500" />
              <h3 className="text-lg font-semibold">{t('pricing.eventLabel')}</h3>
              <p className="mt-2 text-sm text-zinc-500">
                {t('pricing.eventDesc')}
              </p>
              <div className="mt-4 flex gap-3 text-sm text-zinc-400 font-medium">
                <span>3 {t('pricing.videos')}</span>
                <span className="text-zinc-300">|</span>
                <span>5 {t('pricing.videos')}</span>
                <span className="text-zinc-300">|</span>
                <span>{t('pricing.sameDayDelivery')}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-zinc-500">
              {t('pricing.customNote')}
            </p>
            <Link href="/book" className="mt-3 inline-block">
              <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-medium">
                {t('pricing.getQuote')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHY DEVRE (Light warm) ─── */}
      <section className="bg-stone-50 py-28 sm:py-36 text-zinc-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              {t('whyUs.label')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t('whyUs.title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-500">
              {t('whyUs.description')}
            </p>
          </div>

          <div className="mt-20 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Sparkles, title: t('whyUs.cinematicTitle'), desc: t('whyUs.cinematicDesc') },
              { icon: Clock, title: t('whyUs.speedTitle'), desc: t('whyUs.speedDesc') },
              { icon: Users, title: t('whyUs.partnershipTitle'), desc: t('whyUs.partnershipDesc') },
              { icon: CalendarCheck, title: t('whyUs.termsTitle'), desc: t('whyUs.termsDesc') },
              { icon: MessageSquare, title: t('whyUs.strategyTitle'), desc: t('whyUs.strategyDesc') },
              { icon: Play, title: t('whyUs.droneTitle'), desc: t('whyUs.droneDesc') },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STATS (Dark accent) ─── */}
      <section className="bg-zinc-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { value: '200+', label: t('stats.projects') },
              { value: '50+', label: t('stats.brands') },
              { value: '7', label: t('stats.turnaround') },
              { value: '3+', label: t('stats.years') },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold tracking-tight text-amber-400 sm:text-5xl">{stat.value}</div>
                <div className="mt-2 text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA (Dark) ─── */}
      <section id="contact" className="relative overflow-hidden bg-zinc-900 py-28 sm:py-36 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(245,158,11,0.1),transparent)]" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
          <Image
            src="/images/LOGO_WhiteLetter.png"
            alt="Devre Media"
            width={80}
            height={80}
            className="mx-auto mb-10 h-16 w-auto opacity-30"
          />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t('cta.title1')}
            <br />
            {t('cta.title2')}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300">
            {t('cta.description')}
          </p>
          <div className="mt-10">
            <Link href="/book">
              <Button size="lg" className="group bg-amber-500 px-10 text-zinc-950 hover:bg-amber-400 font-semibold text-base h-13 shadow-lg shadow-amber-500/20">
                {t('cta.button')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            {t('cta.location')}
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 bg-zinc-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xs">
              <Image
                src="/images/Logo_Horizontal_Transparent.png"
                alt="Devre Media"
                width={140}
                height={38}
                className="h-8 w-auto"
              />
              <p className="mt-4 text-sm leading-relaxed text-zinc-500">
                {t('footer.tagline')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">{t('footer.servicesLabel')}</h4>
                <ul className="space-y-2.5 text-sm text-zinc-500">
                  <li><Link href="#services" className="transition-colors hover:text-white">Social Media Video</Link></li>
                  <li><Link href="#services" className="transition-colors hover:text-white">Podcast Production</Link></li>
                  <li><Link href="#services" className="transition-colors hover:text-white">Event Coverage</Link></li>
                  <li><Link href="#services" className="transition-colors hover:text-white">Corporate Films</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">{t('footer.companyLabel')}</h4>
                <ul className="space-y-2.5 text-sm text-zinc-500">
                  <li><Link href="#approach" className="transition-colors hover:text-white">{t('footer.ourApproach')}</Link></li>
                  <li><Link href="#work" className="transition-colors hover:text-white">{t('footer.caseStudies')}</Link></li>
                  <li><Link href="#pricing" className="transition-colors hover:text-white">{t('nav.pricing')}</Link></li>
                  <li><Link href="#contact" className="transition-colors hover:text-white">{t('nav.contact')}</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">{t('footer.platformLabel')}</h4>
                <ul className="space-y-2.5 text-sm text-zinc-500">
                  <li><Link href="/login" className="transition-colors hover:text-white">{t('nav.clientPortal')}</Link></li>
                  <li><Link href="/book" className="transition-colors hover:text-white">{t('nav.bookCall')}</Link></li>
                  <li><Link href="/signup" className="transition-colors hover:text-white">{t('footer.createAccount')}</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
            <p className="text-xs text-zinc-600">&copy; {new Date().getFullYear()} Devre Media. {t('footer.copyright')}</p>
            <p className="text-xs text-zinc-600">{t('footer.city')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
