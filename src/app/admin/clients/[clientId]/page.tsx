import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClient } from '@/lib/actions/clients';
import { Client } from '@/types/index';
import { ClientDetail } from './client-detail';

interface ClientDetailPageProps {
  params: Promise<{
    clientId: string;
  }>;
}

export async function generateMetadata({
  params,
}: ClientDetailPageProps): Promise<Metadata> {
  const { clientId } = await params;
  const result = await getClient(clientId);

  if (result.error || !result.data) {
    return {
      title: 'Client Not Found',
    };
  }

  const client = result.data as Client;
  return {
    title: client.contact_name,
  };
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const { clientId } = await params;
  const result = await getClient(clientId);

  if (result.error || !result.data) {
    notFound();
  }

  const client = result.data as Client;

  return <ClientDetail client={client} />;
}
