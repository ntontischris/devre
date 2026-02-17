import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getClient } from '@/lib/actions/clients';
import { getContractsByClient } from '@/lib/actions/contracts';
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
  const t = await getTranslations('clients');

  if (result.error || !result.data) {
    return {
      title: t('clientDetails'),
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
  const [clientResult, contractsResult] = await Promise.all([
    getClient(clientId),
    getContractsByClient(clientId),
  ]);

  if (clientResult.error || !clientResult.data) {
    notFound();
  }

  const client = clientResult.data as Client;
  const contracts = (contractsResult.data ?? []) as Array<{
    id: string;
    title: string;
    status: string;
    project: { title: string } | null;
    created_at: string;
    signed_at: string | null;
  }>;

  return <ClientDetail client={client} contracts={contracts} />;
}
