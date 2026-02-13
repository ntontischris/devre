'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { createClient } from '@/lib/supabase/client';
import { loginSchema, forgotPasswordSchema } from '@/lib/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

type LoginInput = z.infer<typeof loginSchema>;
type MagicLinkInput = z.infer<typeof forgotPasswordSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerMagicLink,
    handleSubmit: handleSubmitMagicLink,
    formState: { errors: magicLinkErrors },
  } = useForm<MagicLinkInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const urlError = searchParams.get('error');
  if (urlError) {
    toast.error(
      urlError === 'auth_callback_error'
        ? 'Authentication failed. Please try again.'
        : 'An error occurred',
    );
  }

  const onSubmitPassword = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Successfully logged in!');
      router.refresh();
      router.push('/');
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitMagicLink = async (data: MagicLinkInput) => {
    setIsMagicLinkLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Magic link sent! Check your email to continue.');
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="password" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
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

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="magic-link">
            <form onSubmit={handleSubmitMagicLink(onSubmitMagicLink)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="magic-email">Email</Label>
                <Input
                  id="magic-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...registerMagicLink('email')}
                />
                {magicLinkErrors.email && (
                  <p className="text-sm text-destructive">{magicLinkErrors.email.message}</p>
                )}
              </div>

              <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                {"We'll send you a magic link to sign in without a password."}
              </div>

              <Button type="submit" className="w-full" disabled={isMagicLinkLoading}>
                {isMagicLinkLoading ? 'Sending...' : 'Send Magic Link'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/signup" className="font-medium text-foreground hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

function LoginSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
