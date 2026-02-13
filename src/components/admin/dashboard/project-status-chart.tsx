'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ProjectStatus } from '@/lib/constants';
import { PROJECT_STATUS_LABELS } from '@/lib/constants';

type ProjectStatusChartProps = {
  data: Record<ProjectStatus, number>;
};

const COLORS = {
  briefing: 'hsl(210 100% 50%)',
  pre_production: 'hsl(45 100% 50%)',
  filming: 'hsl(25 95% 53%)',
  editing: 'hsl(280 70% 50%)',
  review: 'hsl(142 76% 36%)',
  revisions: 'hsl(350 90% 60%)',
  delivered: 'hsl(142 71% 45%)',
  archived: 'hsl(215 14% 34%)',
};

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  const chartData = Object.entries(data)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: PROJECT_STATUS_LABELS[status as ProjectStatus],
      value: count,
      color: COLORS[status as ProjectStatus],
    }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projects by Status</CardTitle>
          <CardDescription>Distribution of active projects</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No active projects
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Projects by Status</CardTitle>
          <CardDescription>Distribution of active projects</CardDescription>
        </div>
        <Link
          href="/admin/projects"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View All Projects
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
