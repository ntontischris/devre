import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getLeadsByAssignee } from '@/lib/actions/leads'
import { PageHeader } from '@/components/shared/page-header'
import { LeadPipeline } from '@/components/salesman/leads/lead-pipeline'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function SalesmanLeadsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const t = await getTranslations('salesman.leads')

  const result = await getLeadsByAssignee(user.id)
  const leads = result.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
      >
        <Button asChild>
          <Link href="/salesman/leads/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('addLead')}
          </Link>
        </Button>
      </PageHeader>

      <LeadPipeline leads={leads} />
    </div>
  )
}
