import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Issue, IssueStatus } from "@/lib/data";
import { MapPin, User, Calendar, Tag } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

const statusColors: Record<IssueStatus, string> = {
  Pending: "bg-yellow-500",
  "In-Progress": "bg-blue-500",
  Resolved: "bg-accent",
};

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg font-bold font-headline">{issue.title}</CardTitle>
            <Badge
                className={cn(
                    "text-white whitespace-nowrap",
                    statusColors[issue.status]
                )}
            >
                {issue.status}
            </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 pt-2 text-xs">
          <MapPin className="h-3 w-3" /> {issue.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{issue.description}</p>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-muted-foreground border-t pt-4">
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Tag className="h-3 w-3" />
                <span>{issue.category}</span>
            </div>
            <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>Reported by {issue.reporterName}</span>
            </div>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Calendar className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
