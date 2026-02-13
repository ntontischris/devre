import { PageHeader } from '@/components/shared/page-header';
import { BookingWizard } from '@/components/client/book/booking-wizard';

export default function ClientBookingPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 space-y-6">
      <PageHeader
        title="Book a Filming"
        description="Request a new video production project"
      />

      <BookingWizard />
    </div>
  );
}
