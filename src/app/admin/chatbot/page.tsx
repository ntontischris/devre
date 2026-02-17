import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { ChatbotStats } from '@/components/admin/chatbot/chatbot-stats';
import { ConversationsTable } from '@/components/admin/chatbot/conversations-table';
import { getChatConversations, getChatStats } from '@/lib/queries/chatbot';
import type { ChatConversation } from '@/types/index';

export default async function AdminChatbotPage() {
  const [conversations, stats] = await Promise.all([
    getChatConversations(),
    getChatStats(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="AI Chatbot" description="View chatbot conversations and manage knowledge base">
        <Link href="/admin/chatbot/knowledge">
          <Button variant="outline" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Knowledge Base
          </Button>
        </Link>
      </PageHeader>

      <ChatbotStats {...stats} />

      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <ConversationsTable conversations={conversations as ChatConversation[]} />
        </CardContent>
      </Card>
    </div>
  );
}
