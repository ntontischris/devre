import { getExpenses } from '@/lib/actions/expenses';
import { getProjects } from '@/lib/actions/projects';
import { ExpensesContent } from './expenses-content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expenses',
};

export default async function ExpensesPage() {
  const [expensesResult, projectsResult] = await Promise.all([
    getExpenses(),
    getProjects(),
  ]);

  if (expensesResult.error) {
    return (
      <div className="p-8">
        <p className="text-destructive">Error loading expenses: {expensesResult.error}</p>
      </div>
    );
  }

  if (projectsResult.error) {
    return (
      <div className="p-8">
        <p className="text-destructive">Error loading projects: {projectsResult.error}</p>
      </div>
    );
  }

  return <ExpensesContent expenses={expensesResult.data ?? []} projects={projectsResult.data ?? []} />;
}
