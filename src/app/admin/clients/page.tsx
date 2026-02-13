import { Metadata } from 'next';
import { getClients } from '@/lib/actions/clients';
import { Client } from '@/types/index';
import { ClientsContent } from './clients-content';

export const metadata: Metadata = {
  title: 'Clients',
};

export default async function ClientsPage() {
  const result = await getClients();
  const clients = (result.data as Client[]) || [];

  return <ClientsContent clients={clients} />;
}
