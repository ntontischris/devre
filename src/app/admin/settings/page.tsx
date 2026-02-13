import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeamManagement } from '@/components/admin/settings/team-management';
import { CompanyProfile } from '@/components/admin/settings/company-profile';
import { BrandingSettings } from '@/components/admin/settings/branding-settings';
import { StripeConfig } from '@/components/admin/settings/stripe-config';
import { NotificationSettingsComponent } from '@/components/admin/settings/notification-settings';
import { getTeamMembers } from '@/lib/actions/team';
import { getCompanySettings, getNotificationSettings } from '@/lib/actions/settings';
import { createClient } from '@/lib/supabase/server';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [teamMembersResult, companySettingsResult, notificationSettingsResult] =
    await Promise.all([
      getTeamMembers(),
      getCompanySettings(),
      user ? getNotificationSettings(user.id) : null,
    ]);

  const teamMembers = teamMembersResult.data ?? [];
  const companySettings = companySettingsResult.data ?? {
    company_name: 'Devre Media',
    logo_url: null,
    address: null,
    phone: null,
    email: null,
    vat_number: null,
    primary_color: null,
  };
  const notificationSettings = notificationSettingsResult?.data ?? {
    email_new_project: true,
    email_project_deadline: true,
    email_invoice_paid: true,
    email_new_message: true,
    email_deliverable_feedback: true,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account, team, and system configuration"
      />

      <Tabs defaultValue="company" className="space-y-6">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="inline-flex w-auto min-w-full sm:min-w-0">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="company" className="space-y-6">
          <CompanyProfile settings={companySettings} />
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <TeamManagement members={teamMembers} />
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <BrandingSettings settings={companySettings} />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <StripeConfig />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {user && (
            <NotificationSettingsComponent
              userId={user.id}
              settings={notificationSettings}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
