import { getExpenses } from '@/lib/actions/expenses';
import { getProjects } from '@/lib/actions/projects';
import { ExpensesContent } from './expenses-content';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('invoices');
  return {
    title: t('expenses'),
  };
}

export default async function ExpensesPage() {
  const tc = await getTranslations('common');
  const [expensesResult, projectsResult] = await Promise.all([
    getExpenses(),
    getProjects(),
  ]);

  if (expensesResult.error) {
    return (
      <div className="p-8">
        <p className="text-destructive">{tc('errorLoading')} expenses: {expensesResult.error}</p>
      </div>
    );
  }

  if (projectsResult.error) {
    return (
      <div className="p-8">
        <p className="text-destructive">{tc('errorLoading')} {tc('projects').toLowerCase()}: {projectsResult.error}</p>
      </div>
    );
  }

  return <ExpensesContent expenses={expensesResult.data ?? []} projects={projectsResult.data ?? []} />;
}
