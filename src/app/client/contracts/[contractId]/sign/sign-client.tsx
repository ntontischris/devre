'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import { ContractView } from '@/components/shared/contract-view';
import { SignaturePad } from '@/components/shared/signature-pad';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { signContract } from '@/lib/actions/contracts';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

interface SignContractClientProps {
  contract: any;
}

export function SignContractClient({ contract }: SignContractClientProps) {
  const router = useRouter();
  const [isSigning, setIsSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleSign = async (signatureDataUrl: string) => {
    setIsSigning(true);

    const result = await signContract(contract.id, {
      signature_image: signatureDataUrl,
    });

    if (result.error) {
      toast.error(result.error);
      setIsSigning(false);
      return;
    }

    toast.success('Contract signed successfully');
    setSigned(true);

    // Redirect to contract view after 2 seconds
    setTimeout(() => {
      router.push(`/client/contracts/${contract.id}`);
    }, 2000);
  };

  if (signed) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Contract Signed Successfully</h2>
        <p className="text-muted-foreground">Redirecting you to the contract...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Review and Sign Contract</h1>
        <p className="text-muted-foreground">
          Please review the contract carefully before signing
        </p>
      </div>

      <Alert>
        <AlertDescription>
          By signing this contract, you agree to all terms and conditions outlined below.
          Your signature is legally binding.
        </AlertDescription>
      </Alert>

      <ContractView contract={contract} />

      <Card>
        <CardHeader>
          <CardTitle>Sign Contract</CardTitle>
        </CardHeader>
        <CardContent>
          <SignaturePad onSign={handleSign} disabled={isSigning} />
          {isSigning && (
            <div className="flex items-center justify-center mt-4">
              <LoadingSpinner size="md" className="mr-2" />
              <span className="text-sm text-muted-foreground">
                Processing signature...
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
