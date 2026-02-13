import { getFilmingRequest } from '@/lib/actions/filming-requests';
import { notFound } from 'next/navigation';
import { FilmingRequestDetail } from '@/components/admin/filming-requests/filming-request-detail';

interface PageProps {
  params: Promise<{ requestId: string }>;
}

export default async function AdminFilmingRequestDetailPage({ params }: PageProps) {
  const { requestId } = await params;

  const requestResult = await getFilmingRequest(requestId);
  if (requestResult.error || !requestResult.data) {
    notFound();
  }

  const request = requestResult.data;

  return (
    <div>
      <FilmingRequestDetail request={request} />
    </div>
  );
}
