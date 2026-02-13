import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ invoiceId: string }>;
}

export default async function InvoicePaymentCancelPage({ params }: PageProps) {
  const { invoiceId } = await params;

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment was cancelled. No charges were made to your account.
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <Button asChild>
              <Link href={`/client/invoices/${invoiceId}`}>
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/client/invoices">
                Back to Invoices
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
