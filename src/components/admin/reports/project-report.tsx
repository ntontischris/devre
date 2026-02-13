'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ProjectTypeBreakdown } from '@/lib/queries/reports';
import { PROJECT_TYPE_LABELS, PROJECT_STATUS_LABELS } from '@/lib/constants';
import type { ProjectStatus } from '@/lib/constants';

type ProjectReportProps = {
  projectsByStatus: Record<ProjectStatus, number>;
  projectsByType: ProjectTypeBreakdown[];
  averageDuration: number;
};

const STATUS_COLORS = {
  briefing: 'hsl(210 100% 50%)',
  pre_production: 'hsl(45 100% 50%)',
  filming: 'hsl(25 95% 53%)',
  editing: 'hsl(280 70% 50%)',
  review: 'hsl(142 76% 36%)',
  revisions: 'hsl(350 90% 60%)',
  delivered: 'hsl(142 71% 45%)',
  archived: 'hsl(215 14% 34%)',
};

const TYPE_COLORS = [
  'hsl(var(--primary))',
  'hsl(142 76% 36%)',
  'hsl(25 95% 53%)',
  'hsl(280 70% 50%)',
  'hsl(210 100% 50%)',
  'hsl(45 100% 50%)',
  'hsl(350 90% 60%)',
];

export function ProjectReport({
  projectsByStatus,
  projectsByType,
  averageDuration,
}: ProjectReportProps) {
  const statusChartData = Object.entries(projectsByStatus)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: PROJECT_STATUS_LABELS[status as ProjectStatus],
      value: count,
      color: STATUS_COLORS[status as ProjectStatus],
    }));

  const typeChartData = projectsByType.map((item, index) => ({
    name: PROJECT_TYPE_LABELS[item.type],
    value: item.count,
    color: TYPE_COLORS[index % TYPE_COLORS.length],
  }));

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Projects by Status</CardTitle>
          <CardDescription>Current project distribution</CardDescription>
        </CardHeader>
        <CardContent>
          {statusChartData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No project data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }: { percent?: number }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
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
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects by Type</CardTitle>
          <CardDescription>Distribution by project type</CardDescription>
        </CardHeader>
        <CardContent>
          {typeChartData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No project data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }: { percent?: number }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeChartData.map((entry, index) => (
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
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Duration</CardTitle>
          <CardDescription>Average project completion time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl font-bold text-primary">{averageDuration}</div>
            <p className="text-sm text-muted-foreground mt-2">Days</p>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Based on completed projects
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
