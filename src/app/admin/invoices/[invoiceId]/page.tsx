import { getInvoice } from '@/lib/actions/invoices';
import { InvoiceDetail } from './invoice-detail';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface InvoicePageProps {
  params: Promise<{ invoiceId: string }>;
}

export async function generateMetadata({ params }: InvoicePageProps): Promise<Metadata> {
  const { invoiceId } = await params;
  const result = await getInvoice(invoiceId);

  if (result.error || !result.data) {
    return { title: 'Invoice Not Found' };
  }

  return {
    title: `Invoice ${result.data.invoice_number}`,
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { invoiceId } = await params;
  const result = await getInvoice(invoiceId);

  if (result.error || !result.data) {
    notFound();
  }

  return <InvoiceDetail invoice={result.data} />;
}
