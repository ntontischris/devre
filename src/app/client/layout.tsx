import { ClientNavbar } from '@/components/client/navbar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ClientNavbar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
