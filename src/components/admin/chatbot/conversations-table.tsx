'use client';

import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteChatConversation } from '@/lib/actions/chatbot';
import { toast } from 'sonner';
import type { ChatConversation } from '@/types/index';

type ConversationsTableProps = {
  conversations: ChatConversation[];
};

export function ConversationsTable({ conversations }: ConversationsTableProps) {
  const router = useRouter();

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await deleteChatConversation(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Conversation deleted');
      router.refresh();
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No conversations yet. The chatbot widget on the landing page will create conversations when visitors interact with it.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Session</TableHead>
          <TableHead>Language</TableHead>
          <TableHead>Messages</TableHead>
          <TableHead>Last Active</TableHead>
          <TableHead className="w-[50px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {conversations.map((conv) => (
          <TableRow
            key={conv.id}
            className="cursor-pointer"
            onClick={() => router.push(`/admin/chatbot/${conv.id}`)}
          >
            <TableCell className="font-mono text-xs">
              {conv.session_id.slice(0, 8)}...
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted">
                {conv.language === 'el' ? '🇬🇷 EL' : '🇬🇧 EN'}
              </span>
            </TableCell>
            <TableCell>{conv.message_count}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={(e) => handleDelete(conv.id, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
