"use client";

import { useData } from "@/contexts/data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ListChecks, AlertCircle, Hourglass, CheckCircle, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

export default function AdminDashboard() {
  const { issues, users } = useData();

  const totalIssues = issues.length;
  const pendingIssues = issues.filter(i => i.status === 'Pending').length;
  const inProgressIssues = issues.filter(i => i.status === 'In-Progress').length;
  const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;

  const sortedUsers = [...users].sort((a, b) => b.points - a.points).slice(0, 5);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard title="Total Issues" value={totalIssues} icon={ListChecks} />
        <StatsCard title="Pending" value={pendingIssues} icon={AlertCircle} />
        <StatsCard title="In Progress" value={inProgressIssues} icon={Hourglass} />
        <StatsCard title="Resolved" value={resolvedIssues} icon={CheckCircle} />
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leaderboard Preview</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/leaderboard"><Trophy className="mr-2 h-4 w-4"/> View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{user.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Recent activity feed coming soon.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
