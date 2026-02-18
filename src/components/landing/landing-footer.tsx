import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Youtube, Linkedin } from 'lucide-react';
import { TikTokIcon } from './tiktok-icon';
import { SOCIAL_LINKS } from './constants';

function getFooterSocialIcon(platform: string) {
  switch (platform) {
    case 'instagram':
      return <Instagram className="h-4 w-4" aria-hidden="true" />;
    case 'tiktok':
      return <TikTokIcon />;
    case 'linkedin':
      return <Linkedin className="h-4 w-4" aria-hidden="true" />;
    case 'youtube':
      return <Youtube className="h-4 w-4" aria-hidden="true" />;
    default:
      return null;
  }
}

export async function LandingFooter() {
  const t = await getTranslations('landing');

  return (
    <footer className="border-t border-white/[0.04] py-12 sm:py-16" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4" aria-label="Devre Media - Home">
              <Image
                src="/images/LOGO_WhiteLetter.png"
                alt=""
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-white font-bold text-lg tracking-tight">DEVRE MEDIA</span>
            </Link>
            <p className="text-zinc-500 text-sm mb-4 sm:mb-6 max-w-xs leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.platform}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-gold-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm"
                  aria-label={`Devre Media on ${social.label}`}
                >
                  {getFooterSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-sm font-bold mb-3 sm:mb-4">
              {t('footer.servicesLabel')}
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="#services" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm">
                  {t('services.socialTitle')}
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm">
                  {t('services.podcastTitle')}
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm">
                  {t('services.eventTitle')}
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm">
                  {t('services.corporateTitle')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-sm font-bold mb-3 sm:mb-4">
              {t('footer.companyLabel')}
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="#about" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="#team" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm">
                  {t('footer.ourTeam')}
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm">
                  {t('footer.portfolio')}
                </Link>
              </li>
              <li>
                <Link href="#work" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm">
                  {t('footer.caseStudies')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white text-sm font-bold mb-3 sm:mb-4">
              {t('footer.platformLabel')}
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link href="/login" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm">
                  {t('nav.login')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-zinc-500 hover:text-gold-500 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm">
                  {t('footer.createAccount')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-zinc-600 text-xs">
            {t('footer.copyright')} {new Date().getFullYear()} Devre Media. {t('footer.city')}.
          </p>
          <nav aria-label={t('footer.legalNav')}>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-zinc-600 text-xs">
                {t('footer.impressum')}
              </span>
              <span className="text-zinc-600 text-xs">
                {t('footer.privacy')}
              </span>
              <a
                href="mailto:devremedia@gmail.com"
                className="text-zinc-600 hover:text-gold-500 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-sm"
              >
                {t('footer.emailAddress')}
              </a>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
