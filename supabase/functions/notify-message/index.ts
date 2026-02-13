import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createSupabaseAdmin } from "../_shared/supabase.ts";
import { sendEmail } from "../_shared/resend.ts";
import { newMessageEmailTemplate } from "../_shared/email-templates.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface MessageRecord {
  id: string;
  project_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createSupabaseAdmin();
    const payload = await req.json();
    const message: MessageRecord = payload.record;

    console.log("Processing message notification:", message.id);

    // Get project details and participants
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, title, client_id")
      .eq("id", message.project_id)
      .single();

    if (projectError || !project) {
      console.error("Failed to fetch project:", projectError);
      return new Response(
        JSON.stringify({ error: "Project not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get sender details
    const { data: sender, error: senderError } = await supabase
      .from("user_profiles")
      .select("full_name, email")
      .eq("id", message.sender_id)
      .single();

    if (senderError || !sender) {
      console.error("Failed to fetch sender:", senderError);
      return new Response(
        JSON.stringify({ error: "Sender not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check rate limiting: Only send email if no notification was sent in the last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: recentNotifications, error: notifError } = await supabase
      .from("messages")
      .select("id")
      .eq("project_id", message.project_id)
      .gte("created_at", fifteenMinutesAgo)
      .neq("id", message.id)
      .limit(1);

    if (notifError) {
      console.error("Failed to check rate limit:", notifError);
    } else if (recentNotifications && recentNotifications.length > 0) {
      console.log("Rate limit: Skipping notification (recent message exists)");
      return new Response(
        JSON.stringify({ message: "Notification skipped due to rate limit" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all project participants (excluding the sender)
    // For now, we'll just notify the client
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("email, contact_name")
      .eq("id", project.client_id)
      .single();

    if (clientError || !client) {
      console.error("Failed to fetch client:", clientError);
      return new Response(
        JSON.stringify({ error: "Client not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Don't send email to the sender
    if (client.email === sender.email) {
      console.log("Skipping notification: Sender is the recipient");
      return new Response(
        JSON.stringify({ message: "Notification skipped: Sender is recipient" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare email content
    const senderName = sender.full_name || "A team member";
    const preview = message.content.substring(0, 200);
    const projectUrl = `${Deno.env.get("NEXT_PUBLIC_APP_URL") || "http://localhost:3000"}/admin/projects/${project.id}`;

    const emailHtml = newMessageEmailTemplate(senderName, preview, projectUrl);

    // Send email
    const result = await sendEmail({
      to: client.email,
      subject: `New message from ${senderName} - ${project.title}`,
      html: emailHtml,
    });

    if (!result.success) {
      console.error("Failed to send email:", result.error);
      return new Response(
        JSON.stringify({ error: result.error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Notification email sent successfully to:", client.email);

    return new Response(
      JSON.stringify({ message: "Notification sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in notify-message function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
