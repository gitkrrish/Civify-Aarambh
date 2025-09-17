"use client";

import { useData } from "@/contexts/data-context";
import { IssueCard } from "@/components/issue-card";

export default function CommunityFeedPage() {
  const { issues } = useData();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Community Feed</h1>
      <p className="text-muted-foreground mb-8">See all issues reported by the community. Newest reports are shown first.</p>
      {issues.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No issues have been reported yet.</p>
        </div>
      )}
    </div>
  );
}
