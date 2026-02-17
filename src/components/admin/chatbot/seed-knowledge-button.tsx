'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function SeedKnowledgeButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/chat/knowledge/seed', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to seed');
        return;
      }

      toast.success(`Knowledge base seeded: ${data.results?.length ?? 0} entries`);
      router.refresh();
    } catch {
      toast.error('Failed to seed knowledge base');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSeed} disabled={loading} size="sm">
      <Sparkles className="h-4 w-4 mr-2" />
      {loading ? 'Seeding...' : 'Seed Knowledge Base'}
    </Button>
  );
}
