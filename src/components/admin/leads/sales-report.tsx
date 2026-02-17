'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LEAD_STAGE_LABELS, LEAD_SOURCE_LABELS } from '@/lib/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type ForecastItem = {
  stage: string;
  total: number;
  weighted: number;
  count: number;
};

type SalesmanPerf = {
  id: string;
  name: string;
  total_leads: number;
  won: number;
  lost: number;
  active: number;
  total_value: number;
};

type SourceData = {
  source: string;
  total: number;
  won: number;
  conversion_rate: number;
};

type SalesReportProps = {
  stageData: Record<string, number>;
  conversionRate: number;
  forecast: ForecastItem[];
  salesmanData: SalesmanPerf[];
  sourceData: SourceData[];
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export function SalesReport({
  stageData,
  conversionRate,
  forecast,
  salesmanData,
  sourceData,
}: SalesReportProps) {
  const pipelineChartData = Object.entries(stageData).map(([stage, count]) => ({
    name: LEAD_STAGE_LABELS[stage as keyof typeof LEAD_STAGE_LABELS] ?? stage,
    count,
  }));

  const sourceChartData = sourceData.map((s) => ({
    name: LEAD_SOURCE_LABELS[s.source as keyof typeof LEAD_SOURCE_LABELS] ?? s.source,
    total: s.total,
    won: s.won,
  }));

  const totalPipeline = forecast.reduce((sum, f) => sum + f.total, 0);
  const totalWeighted = forecast.reduce((sum, f) => sum + f.weighted, 0);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Pipeline Value</p>
            <p className="text-2xl font-bold">&euro;{totalPipeline.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Weighted Pipeline</p>
            <p className="text-2xl font-bold">&euro;{Math.round(totalWeighted).toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-2xl font-bold">{conversionRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active Salesmen</p>
            <p className="text-2xl font-bold">{salesmanData.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pipeline by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceChartData}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {sourceChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pipeline Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Weighted Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forecast.map((f) => (
                <TableRow key={f.stage}>
                  <TableCell>
                    <Badge variant="outline">
                      {LEAD_STAGE_LABELS[f.stage as keyof typeof LEAD_STAGE_LABELS] ?? f.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{f.count}</TableCell>
                  <TableCell className="text-right">&euro;{f.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right">&euro;{Math.round(f.weighted).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {forecast.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                    No active pipeline data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Salesman Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Salesman Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Salesman</TableHead>
                <TableHead className="text-right">Total Leads</TableHead>
                <TableHead className="text-right">Won</TableHead>
                <TableHead className="text-right">Lost</TableHead>
                <TableHead className="text-right">Active</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Win Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesmanData
                .sort((a, b) => b.won - a.won)
                .map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-right">{s.total_leads}</TableCell>
                    <TableCell className="text-right text-green-600">{s.won}</TableCell>
                    <TableCell className="text-right text-red-600">{s.lost}</TableCell>
                    <TableCell className="text-right">{s.active}</TableCell>
                    <TableCell className="text-right">&euro;{s.total_value.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {s.won + s.lost > 0
                        ? `${Math.round((s.won / (s.won + s.lost)) * 100)}%`
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              {salesmanData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                    No salesman data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
