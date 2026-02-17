import { getFilmingRequest } from '@/lib/actions/filming-requests';
import { notFound } from 'next/navigation';
import { FilmingRequestDetail } from '@/components/admin/filming-requests/filming-request-detail';
import type { FilmingRequest } from '@/types';

interface PageProps {
  params: Promise<{ requestId: string }>;
}

export default async function AdminFilmingRequestDetailPage({ params }: PageProps) {
  const { requestId } = await params;

  const requestResult = await getFilmingRequest(requestId);
  if (requestResult.error || !requestResult.data) {
    notFound();
  }

  const request = requestResult.data as FilmingRequest & {
    preferred_dates?: Array<{ date?: string; time_slot?: string }>;
    reference_links?: string[];
  };

  return (
    <div>
      <FilmingRequestDetail request={request} />
    </div>
  );
}
