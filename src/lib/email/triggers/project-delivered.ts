import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail, hasEmailBeenSent } from '@/lib/email/send-email';
import { ProjectCompletedEmail } from '@/lib/email/templates/project-completed';
import { getEmailTranslations } from '@/lib/email/translations';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.devremedia.com';

interface ProjectDeliveredData {
  projectId: string;
  projectTitle: string;
  clientId: string;
}

export async function triggerProjectDeliveredEmail({
  projectId,
  projectTitle,
  clientId,
}: ProjectDeliveredData): Promise<void> {
  const supabase = createAdminClient();

  // Deduplication: don't send again if already sent today for this project
  const today = new Date().toISOString().split('T')[0];
  const alreadySent = await hasEmailBeenSent({
    emailType: 'project_delivered',
    clientId,
    dateKey: today,
  });
  if (alreadySent) return;

  const { data: client } = await supabase
    .from('clients')
    .select('email, contact_name, preferred_locale')
    .eq('id', clientId)
    .single();

  if (!client?.email) return;

  // Count deliverables for this project
  const { count } = await supabase
    .from('deliverables')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId);

  const locale = (client.preferred_locale as 'el' | 'en') ?? 'el';
  const t = getEmailTranslations(locale).projectCompleted;

  await sendEmail({
    to: client.email,
    subject: t.subject(projectTitle),
    react: ProjectCompletedEmail({
      clientName: client.contact_name,
      projectTitle,
      deliverableCount: count ?? 0,
      locale,
      ctaUrl: `${APP_URL}/client/projects/${projectId}`,
    }),
    emailType: 'project_delivered',
    clientId,
    metadata: { projectId, projectTitle },
  });
}
