// Placeholder — will be implemented in Phase 10.4
// Cron-triggered function that sends contract expiry reminders
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  return new Response(JSON.stringify({ message: 'Not yet implemented' }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 501,
  });
});
