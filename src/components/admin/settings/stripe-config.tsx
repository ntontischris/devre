'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

export function StripeConfig() {
  const isStripeConfigured =
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !== undefined;

  const webhookUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/webhooks/stripe`
      : '';

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stripe Configuration</CardTitle>
        <CardDescription>
          Payment processing and invoice management settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {isStripeConfigured ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="font-medium">Stripe Integration</p>
              <p className="text-sm text-muted-foreground">
                {isStripeConfigured
                  ? 'API keys configured'
                  : 'API keys not configured'}
              </p>
            </div>
          </div>
          <Badge variant={isStripeConfigured ? 'default' : 'destructive'}>
            {isStripeConfigured ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="space-y-2">
          <Label>Webhook URL</Label>
          <div className="flex gap-2">
            <Input value={webhookUrl} readOnly />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyWebhookUrl}
              disabled={!webhookUrl}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure this URL in your Stripe Dashboard under Webhooks
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg space-y-2">
          <p className="text-sm font-medium">Required Environment Variables</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</li>
            <li>• STRIPE_SECRET_KEY</li>
            <li>• STRIPE_WEBHOOK_SECRET</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-2">
            Add these to your .env.local file to enable Stripe integration
          </p>
        </div>

        <Button variant="outline" asChild>
          <a
            href="https://dashboard.stripe.com/apikeys"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Stripe Dashboard
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
