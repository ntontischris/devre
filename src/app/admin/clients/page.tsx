import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getClients } from '@/lib/actions/clients';
import { Client } from '@/types/index';
import { ClientsContent } from './clients-content';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('clients');
  return {
    title: t('title'),
  };
}

export default async function ClientsPage() {
  const result = await getClients();
  const clients = (result.data as Client[]) || [];

  return <ClientsContent clients={clients} />;
}
