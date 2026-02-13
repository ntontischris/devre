import { getFilmingRequests } from '@/lib/actions/filming-requests';
import { PageHeader } from '@/components/shared/page-header';
import { FilmingRequestsList } from '@/components/admin/filming-requests/filming-requests-list';

export default async function AdminFilmingRequestsPage() {
  const requestsResult = await getFilmingRequests();
  const requests = requestsResult.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Filming Requests"
        description="Review and manage incoming filming requests from clients"
      />

      <FilmingRequestsList requests={requests} />
    </div>
  );
}
