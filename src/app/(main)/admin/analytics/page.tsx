"use client";

import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { issueStatuses } from "@/lib/data";

const COLORS = {
  'Pending': '#f59e0b', // amber-500
  'In-Progress': '#3b82f6', // blue-500
  'Resolved': '#228B22', // accent color
};

export default function AnalyticsPage() {
  const { issues } = useData();

  const statusCounts = issueStatuses.map(status => ({
    name: status,
    value: issues.filter(issue => issue.status === status).length,
  })).filter(d => d.value > 0);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Analytics</h1>
      <p className="text-muted-foreground mb-8">Visual breakdown of issues by their current status.</p>
      <Card>
        <CardHeader>
          <CardTitle>Issues by Status</CardTitle>
          <CardDescription>A pie chart showing the distribution of all reported issues.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px]">
            {issues.length > 0 ? (
                <ResponsiveContainer>
                <PieChart>
                    <Pie
                    data={statusCounts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    >
                    {statusCounts.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data to display. Report an issue to see analytics.
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
