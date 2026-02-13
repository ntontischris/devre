import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function InvoicePaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <Button asChild>
              <Link href="/client/invoices">
                Back to Invoices
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/client/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
