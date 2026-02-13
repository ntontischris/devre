'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { createClient } from '@/lib/supabase/client';
import { forgotPasswordSchema } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsSuccess(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password?</CardTitle>
        <CardDescription>
          {isSuccess
            ? 'Check your email for a password reset link'
            : 'Enter your email address and we\u2019ll send you a reset link'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                We&apos;ve sent a password reset link to your email address. Please check your inbox and
                follow the instructions to reset your password.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link
          href="/login"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to login
        </Link>
      </CardFooter>
    </Card>
  );
}
