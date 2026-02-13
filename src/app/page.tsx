import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Devre Media System</h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Client management, project tracking, and video delivery platform.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
