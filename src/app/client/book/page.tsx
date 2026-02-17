import { PageHeader } from '@/components/shared/page-header';
import { BookingWizard } from '@/components/client/book/booking-wizard';
import { getTranslations } from 'next-intl/server';

export default async function ClientBookingPage() {
  const t = await getTranslations('booking');
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 space-y-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
      />

      <BookingWizard />
    </div>
  );
}
