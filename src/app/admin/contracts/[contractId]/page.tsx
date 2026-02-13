import { getContract } from '@/lib/actions/contracts';
import { notFound } from 'next/navigation';
import { ContractViewPage } from './contract-view-page';

interface ContractDetailPageProps {
  params: Promise<{ contractId: string }>;
}

export async function generateMetadata({ params }: ContractDetailPageProps) {
  const { contractId } = await params;
  const result = await getContract(contractId);

  if (result.error) {
    return { title: 'Contract Not Found' };
  }

  return { title: result.data?.title || 'Contract' };
}

export default async function ContractDetailPage({ params }: ContractDetailPageProps) {
  const { contractId } = await params;
  const result = await getContract(contractId);

  if (result.error || !result.data) {
    notFound();
  }

  return <ContractViewPage contract={result.data} />;
}
