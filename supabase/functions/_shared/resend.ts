const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from || 'Devre Media <noreply@devre.media>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return { success: false, error: `Failed to send email: ${error}` };
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
