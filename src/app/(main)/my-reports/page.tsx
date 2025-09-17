"use client";

import { useData } from "@/contexts/data-context";
import { useAuth } from "@/contexts/auth-context";
import { IssueCard } from "@/components/issue-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MyReportsPage() {
  const { issues } = useData();
  const { user: currentUser } = useAuth();
  
  const myReports = issues.filter(issue => issue.reporterName === currentUser?.name);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">My Reports</h1>
      <p className="text-muted-foreground mb-8">Track the status of all issues you have reported.</p>
      {myReports.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {myReports.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-lg border-2 border-dashed">
            <h2 className="text-xl font-semibold mb-2">No Reports Found</h2>
            <p className="text-muted-foreground mb-4">You haven't reported any issues yet.</p>
            <Button asChild>
                <Link href="/report-issue">Report an Issue</Link>
            </Button>
        </div>
      )}
    </div>
  );
}
