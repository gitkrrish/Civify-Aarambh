"use client";

import { useData } from "@/contexts/data-context";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Trophy, List } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IssueCard } from "@/components/issue-card";

function StatsCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

export default function UserDashboard() {
  const { issues, users } = useData();
  const { user: currentUser } = useAuth();

  const myReports = issues.filter(issue => issue.reporterName === currentUser?.name);
  const resolvedReports = myReports.filter(issue => issue.status === 'Resolved').length;
  const userPoints = users.find(u => u.name === currentUser?.name)?.points || 0;
  const recentReports = myReports.slice(0, 3);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">My Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatsCard title="Total Reports" value={myReports.length} icon={FileText} />
        <StatsCard title="Resolved Reports" value={resolvedReports} icon={CheckCircle} />
        <StatsCard title="My Points" value={userPoints} icon={Trophy} />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold font-headline">Recent Reports</h2>
          <Button asChild variant="outline">
            <Link href="/my-reports">
              <List className="mr-2 h-4 w-4" /> View All
            </Link>
          </Button>
        </div>
        {recentReports.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {recentReports.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-10 border-2 border-dashed">
            <p className="text-muted-foreground mb-4">You haven't reported any issues yet.</p>
            <Button asChild>
                <Link href="/report-issue">Report Your First Issue</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
