# Phase 9: Messaging System Setup Guide

## Overview
The messaging system provides real-time chat functionality for project communication with email notifications.

## Files Created

### UI Components
1. **C:\Users\ntont\Desktop\devre\src\components\shared\message-thread.tsx** - Main chat interface
2. **C:\Users\ntont\Desktop\devre\src\components\shared\message-bubble.tsx** - Individual message display
3. **C:\Users\ntont\Desktop\devre\src\components\shared\message-input.tsx** - Message composition with file attachments
4. **C:\Users\ntont\Desktop\devre\src\components\shared\message-attachment.tsx** - File attachment display
5. **C:\Users\ntont\Desktop\devre\src\components\shared\read-receipt-indicator.tsx** - Read/delivered status

### Hooks
6. **C:\Users\ntont\Desktop\devre\src\hooks\use-realtime-messages.ts** - Real-time message subscription
7. **C:\Users\ntont\Desktop\devre\src\hooks\use-unread-count.ts** - Unread message counter

### Edge Functions
8. **C:\Users\ntont\Desktop\devre\supabase\functions\notify-message\index.ts** - Email notification handler
9. **C:\Users\ntont\Desktop\devre\supabase\functions\_shared\resend.ts** - Email sending helper
10. **C:\Users\ntont\Desktop\devre\supabase\functions\_shared\email-templates.ts** - Email HTML templates

### Updated Files
11. **C:\Users\ntont\Desktop\devre\src\app\admin\projects\[projectId]\project-detail.tsx** - Integrated MessageThread

## Setup Instructions

### 1. Database Setup (Already completed in previous phases)
The `messages` table should already exist with:
- `id`, `project_id`, `sender_id`, `content`
- `attachments` (JSONB array)
- `read_at` (timestamp)
- `created_at`, `updated_at`

### 2. Storage Bucket Setup
Ensure the `attachments` storage bucket exists in Supabase:

```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Set RLS policies for attachments bucket
CREATE POLICY "Allow authenticated users to upload attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Allow public read access to attachments"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'attachments');
```

### 3. Realtime Setup
Enable Realtime for the messages table in Supabase:

1. Go to Database > Replication in Supabase Dashboard
2. Enable replication for the `messages` table
3. Select all events (INSERT, UPDATE, DELETE)

### 4. Edge Function Setup

Deploy the notify-message function:

```bash
cd C:\Users\ntont\Desktop\devre

# Deploy the function
supabase functions deploy notify-message

# Set environment variables
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
supabase secrets set NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 5. Database Webhook Setup

Create a webhook to trigger the Edge Function on new messages:

1. Go to Database > Webhooks in Supabase Dashboard
2. Create a new webhook:
   - **Name**: notify-message
   - **Table**: messages
   - **Events**: Insert
   - **Type**: HTTP Request
   - **Method**: POST
   - **URL**: `https://[your-project-ref].supabase.co/functions/v1/notify-message`
   - **Headers**:
     - `Authorization`: `Bearer [your-anon-key]`
     - `Content-Type`: `application/json`

### 6. Environment Variables

Add to your `.env.local`:

```bash
# Already set from previous phases
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# New for messaging (optional, for production)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Features

### Real-time Messaging
- Instant message delivery using Supabase Realtime
- Live connection indicator
- Auto-scroll to latest messages
- Message count display

### Rich Messages
- Text messages up to 10,000 characters
- Multi-line support (Shift+Enter for new line)
- File attachments (up to 50MB per file)
- Image preview for image attachments
- File download for all attachment types

### Read Receipts
- Automatic read tracking when thread is opened
- Visual indicators: "Sent" vs "Read"
- Check marks for message status

### Email Notifications
- Automatic email notifications for new messages
- Rate limited: max 1 email per thread per 15 minutes
- Beautiful HTML email template
- Message preview in email
- Direct link to project thread

### File Attachments
- Support for images, documents, videos, etc.
- Image thumbnails in chat
- File size display
- Download functionality
- Organized storage in `messages/{projectId}/` folders

## Usage

### Sending Messages
1. Navigate to a project detail page
2. Click the "Messages" tab
3. Type your message in the input area
4. (Optional) Click paperclip icon to attach files
5. Press Enter to send (or click Send button)
6. Use Shift+Enter for multi-line messages

### Viewing Messages
- Messages appear in chronological order
- Your messages on the right (blue background)
- Other messages on the left (gray background)
- Avatar, name, and timestamp for each message
- Read receipts on your own messages

### Managing Attachments
- Click paperclip icon to open file picker
- Select one or more files
- Preview appears before sending
- Click X to remove a file before sending
- After sending, click download icon to save files

## Rate Limiting

Email notifications are rate-limited to prevent spam:
- Maximum 1 email per project thread per 15 minutes
- Multiple messages within 15 minutes are batched
- Users receive at most 1 email notification every 15 minutes per project

## Testing

### Test Real-time Messaging
1. Open project in two browser windows/tabs
2. Send message from one window
3. Verify it appears instantly in the other window
4. Check connection indicator shows "Live"

### Test File Attachments
1. Click paperclip icon
2. Select an image file
3. Verify preview appears
4. Send message
5. Verify image displays inline
6. Test download functionality

### Test Email Notifications
1. Send a message in a project
2. Check recipient's email inbox
3. Verify email contains:
   - Sender name
   - Message preview
   - Link to project
4. Send another message within 15 minutes
5. Verify no second email is sent (rate limit)

## Troubleshooting

### Messages not appearing in real-time
- Check Supabase Dashboard > Database > Replication
- Verify `messages` table has replication enabled
- Check browser console for connection errors
- Verify user is authenticated

### File upload fails
- Check storage bucket exists and is public
- Verify file size is under 50MB
- Check browser console for errors
- Verify user has upload permissions

### Email notifications not working
- Check `RESEND_API_KEY` is set correctly
- Verify webhook is configured and enabled
- Check Supabase Functions logs
- Verify Edge Function is deployed
- Check email address is valid

### Read receipts not updating
- Messages are marked as read when thread opens
- Only messages from others are marked as read
- Your own messages show read status when others open the thread

## Performance Considerations

### Message Loading
- Messages are fetched once on initial load
- Real-time updates use websockets (very lightweight)
- No polling or repeated API calls

### File Storage
- Files stored in Supabase Storage (CDN-backed)
- Public bucket for fast delivery
- Organized by project for easy cleanup

### Database Queries
- Indexed on `project_id` and `created_at`
- Single query to fetch all messages per project
- Efficient real-time filtering

## Security

### Access Control
- Only authenticated users can send messages
- Users can only access messages for their projects
- RLS policies enforce project membership
- File uploads require authentication

### Input Validation
- Message content limited to 10,000 characters
- File size limits enforced (50MB)
- File type validation on upload
- XSS prevention through proper escaping

## Future Enhancements

Potential improvements for future phases:
- Typing indicators
- Message reactions/emojis
- Message editing/deletion
- @mentions and notifications
- Message search
- Threaded replies
- Voice messages
- Video messages
- Message pinning
- Unread message badges in navigation
