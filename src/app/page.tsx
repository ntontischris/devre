import { getTranslations } from 'next-intl/server';
import {
  LandingNav,
  HeroSection,
  BrandsStrip,
  AboutSection,
  ApproachSection,
  ServicesSection,
  PortfolioSection,
  ProcessSection,
  CaseStudiesSection,
  TeamSection,
  StatsSection,
  PricingSection,
  WhyUsSection,
  ContactSection,
  CtaSection,
  LandingFooter,
} from '@/components/landing';
import { ChatWidget } from '@/components/shared/chatbot/chat-widget';

export default async function LandingPage() {
  const t = await getTranslations('landing');

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-gold-500/30 selection:text-white">
      {/* Skip to content link for keyboard/screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold-500 focus:text-black focus:font-semibold focus:rounded-lg focus:text-sm"
      >
        {t('skipToContent')}
      </a>

      <LandingNav />

      <main id="main-content">
        <HeroSection />
        <BrandsStrip />
        <AboutSection />
        <ApproachSection />
        <ServicesSection />
        <PortfolioSection />
        <ProcessSection />
        <CaseStudiesSection />
        <TeamSection />
        <StatsSection />
        <PricingSection />
        <WhyUsSection />
        <ContactSection />
        <CtaSection />
      </main>

      <LandingFooter />

      <ChatWidget />
    </div>
  );
}
