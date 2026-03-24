import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { fetchChangedEvents } from '@/lib/google-calendar';
import { createNotificationForMany, getAdminUserIds } from '@/lib/actions/notifications';
import { NOTIFICATION_TYPES } from '@/lib/notification-types';
import type { calendar_v3 } from '@googleapis/calendar';

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();

    // 1. Validate channel token
    const channelToken = request.headers.get('x-goog-channel-token');
    const { data: config } = await supabase
      .from('google_calendar_config')
      .select('webhook_channel_token, sync_token')
      .limit(1)
      .single();

    if (!config?.webhook_channel_token || channelToken !== config.webhook_channel_token) {
      return NextResponse.json({ error: 'Invalid channel token' }, { status: 403 });
    }

    // 2. Fetch changed events using syncToken
    const { events, nextSyncToken } = await fetchChangedEvents(config.sync_token);

    // 3. Update syncToken atomically
    if (nextSyncToken) {
      await supabase
        .from('google_calendar_config')
        .update({
          sync_token: nextSyncToken,
          last_sync_at: new Date().toISOString(),
        })
        .not('id', 'is', null);
    }

    // 4. Process each changed event
    const adminIds = await getAdminUserIds();

    for (const event of events) {
      await processGoogleEvent(supabase, event, adminIds);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Google Webhook] Error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function processGoogleEvent(
  supabase: ReturnType<typeof createAdminClient>,
  event: calendar_v3.Schema$Event,
  adminIds: string[],
) {
  if (!event.id) return;

  // Check existing mapping
  const { data: mapping } = await supabase
    .from('google_calendar_sync')
    .select('id, entity_type, entity_id, subtype, sync_status, last_synced_at')
    .eq('google_event_id', event.id)
    .single();

  // Ignored event — skip
  if (mapping?.sync_status === 'ignored') return;

  const isCancelled = event.status === 'cancelled';

  if (!mapping) {
    // New event from Google
    if (isCancelled) return; // Deleted event we never tracked — ignore

    // Atomic insert — action_type and action_data are set in one query (no race condition)
    await createNotificationForMany(adminIds, {
      type: NOTIFICATION_TYPES.GOOGLE_NEW_EVENT,
      title: 'New event from Google Calendar',
      body: `"${event.summary ?? 'Untitled'}" — ${formatEventDate(event)}`,
      actionUrl: '/admin/calendar',
      actionType: 'google_new_event',
      actionData: {
        action_type: 'google_new_event',
        data: {
          google_event_id: event.id,
          title: event.summary ?? 'Untitled',
          start: event.start?.dateTime ?? event.start?.date ?? '',
          end: event.end?.dateTime ?? event.end?.date ?? undefined,
          description: event.description ?? undefined,
        },
      },
    });
    return;
  }

  // Existing mapping
  if (isCancelled) {
    // Event deleted from Google
    const title = event.summary ?? 'Event';
    await createNotificationForMany(adminIds, {
      type: NOTIFICATION_TYPES.GOOGLE_EVENT_DELETED,
      title: 'Synced event deleted from Google',
      body: `"${title}" was removed`,
      actionUrl: '/admin/calendar',
      actionType: 'google_event_deleted',
      actionData: {
        action_type: 'google_event_deleted',
        data: {
          google_event_id: event.id,
          entity_type: mapping.entity_type,
          entity_id: mapping.entity_id ?? '',
          title,
        },
      },
    });
    return;
  }

  // Event modified
  if (mapping.entity_type === 'custom' && mapping.entity_id) {
    // Auto-sync custom events back to Supabase
    const updateData: Record<string, unknown> = {
      title: event.summary ?? undefined,
      description: event.description ?? null,
      start_date: event.start?.dateTime ?? event.start?.date ?? undefined,
      end_date: event.end?.dateTime ?? event.end?.date ?? null,
      all_day: !event.start?.dateTime,
      updated_at: new Date().toISOString(),
    };

    await supabase.from('calendar_events').update(updateData).eq('id', mapping.entity_id);

    await supabase
      .from('google_calendar_sync')
      .update({ last_synced_at: new Date().toISOString(), sync_status: 'synced' })
      .eq('id', mapping.id);
  } else if (mapping.entity_id) {
    // Project/Task/Invoice — notify admin
    const newDate = event.start?.dateTime ?? event.start?.date ?? '';
    await createNotificationForMany(adminIds, {
      type: NOTIFICATION_TYPES.GOOGLE_EVENT_CHANGED,
      title: 'Synced event changed in Google',
      body: `"${event.summary ?? 'Event'}" was modified`,
      actionUrl: '/admin/calendar',
      actionType: 'google_event_changed',
      actionData: {
        action_type: 'google_event_changed',
        data: {
          google_event_id: event.id,
          entity_type: mapping.entity_type,
          entity_id: mapping.entity_id,
          subtype: mapping.subtype ?? undefined,
          changes: { date: { from: 'previous', to: newDate } },
        },
      },
    });
  }
}

function formatEventDate(event: calendar_v3.Schema$Event): string {
  const date = event.start?.dateTime ?? event.start?.date ?? '';
  try {
    return new Date(date).toLocaleDateString('el-GR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return date;
  }
}
