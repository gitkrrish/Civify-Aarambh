"use client";

import { useData } from "@/contexts/data-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { issueStatuses, type Issue, type IssueStatus } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<IssueStatus, string> = {
  Pending: "bg-yellow-500 hover:bg-yellow-500/90",
  "In-Progress": "bg-blue-500 hover:bg-blue-500/90",
  Resolved: "bg-accent hover:bg-accent/90",
};

function StatusSelector({ issue }: { issue: Issue }) {
  const { updateIssueStatus } = useData();

  return (
    <Select
      defaultValue={issue.status}
      onValueChange={(newStatus: IssueStatus) => updateIssueStatus(issue.id, newStatus)}
    >
      <SelectTrigger className={cn("w-[150px] text-white border-0 focus:ring-0", statusColors[issue.status])}>
        <SelectValue placeholder="Set status" />
      </SelectTrigger>
      <SelectContent>
        {issueStatuses.map(status => (
          <SelectItem key={status} value={status}>{status}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function ManageReportsPage() {
  const { issues } = useData();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Manage Reports</h1>
      <p className="text-muted-foreground mb-8">View all submitted issues and update their status.</p>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map(issue => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium max-w-xs">
                    <div className="font-bold">{issue.title}</div>
                    <div className="text-xs text-muted-foreground">{issue.location}</div>
                </TableCell>
                <TableCell>{issue.reporterName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{issue.category}</Badge>
                </TableCell>
                 <TableCell className="text-muted-foreground text-xs">{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</TableCell>
                <TableCell className="text-right">
                  <StatusSelector issue={issue} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
