import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getEmbedding } from '@/lib/chatbot/embeddings';
import { KNOWLEDGE_ENTRIES } from '@/lib/chatbot/knowledge-seed';

export async function POST() {
  try {
    // Auth check — admin only
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['super_admin', 'admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const admin = createAdminClient();
    const results: { title: string; status: string }[] = [];

    for (const entry of KNOWLEDGE_ENTRIES) {
      try {
        // Generate embedding from the combined content
        const textToEmbed = `${entry.title}. ${entry.content_en}`;
        const embedding = await getEmbedding(textToEmbed);

        // Upsert based on category + title
        const { data: existing } = await admin
          .from('chat_knowledge')
          .select('id')
          .eq('category', entry.category)
          .eq('title', entry.title)
          .single();

        if (existing) {
          await admin
            .from('chat_knowledge')
            .update({
              content: entry.content,
              content_en: entry.content_en,
              content_el: entry.content_el,
              embedding: JSON.stringify(embedding),
            })
            .eq('id', existing.id);
          results.push({ title: entry.title, status: 'updated' });
        } else {
          await admin.from('chat_knowledge').insert({
            category: entry.category,
            title: entry.title,
            content: entry.content,
            content_en: entry.content_en,
            content_el: entry.content_el,
            embedding: JSON.stringify(embedding),
          });
          results.push({ title: entry.title, status: 'created' });
        }
      } catch (err) {
        results.push({ title: entry.title, status: `error: ${err}` });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Knowledge seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed knowledge base' },
      { status: 500 }
    );
  }
}
