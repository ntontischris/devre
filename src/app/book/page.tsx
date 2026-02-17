import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { PublicBookingForm } from '@/components/shared/public-booking-form';

export default async function PublicBookingPage() {
  const t = await getTranslations('publicBooking');

  return (
    <div className="min-h-screen bg-zinc-900 text-white selection:bg-amber-500/20">
      {/* Minimal nav */}
      <nav className="border-b border-white/5 bg-zinc-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/Logo_Horizontal_Transparent.png"
              alt="Devre Media"
              width={140}
              height={38}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('pageTitle')}
          </h1>
          <p className="mt-3 text-lg text-zinc-400">
            {t('pageDescription')}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-800/20 p-6 sm:p-10">
          <PublicBookingForm />
        </div>
      </main>
    </div>
  );
}
