"use client";

import { useData } from "@/contexts/data-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateMedalsForLeaderboard } from "@/ai/flows/generate-medals-for-leaderboard";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

function Medal({ rank, username }: { rank: number; username: string }) {
  const [medalUrl, setMedalUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErrorState] = useState(false);

  useEffect(() => {
    if (rank > 3) {
      setLoading(false);
      return;
    };

    const generateMedal = async () => {
      setLoading(true);
      setErrorState(false);
      try {
        // We only call the AI for the top user for demonstration to avoid excessive calls
        if(rank === 1) {
          const result = await generateMedalsForLeaderboard({ topUsernames: [username] });
          if (result.medalImages && result.medalImages.length > 0 && result.medalImages[0]) {
            setMedalUrl(result.medalImages[0]);
          } else {
            setErrorState(true);
          }
        }
      } catch (error) {
        console.error("Failed to generate medal:", error);
        setErrorState(true);
      } finally {
        setLoading(false);
      }
    };
    
    generateMedal();
  }, [rank, username]);
  
  const staticMedals: {[key: number]: string} = { 1: '🥇', 2: '🥈', 3: '🥉' };

  if (loading && rank <= 3) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (medalUrl && !error && rank === 1) {
    return <Image src={medalUrl} alt={`Medal for ${username}`} width={32} height={32} className="h-8 w-8" />;
  }

  return <span className="text-2xl">{staticMedals[rank] || rank}</span>;
}

export default function LeaderboardPage() {
  const { users } = useData();
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const topThreeUsers = sortedUsers.slice(0, 3);
  const otherUsers = sortedUsers.slice(3);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 font-headline">Leaderboard</h1>
        <p className="text-lg text-muted-foreground">See who's making the biggest impact in the community!</p>
      </div>
      
      {topThreeUsers.length > 0 && <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-end">
        {/* 2nd place */}
        {topThreeUsers[1] && <Card key={topThreeUsers[1].id} className="relative transition-transform hover:scale-105 border-slate-400 border-2 order-2 md:order-1">
          <CardHeader className="items-center text-center p-4">
            <div className="relative mb-2">
               <Medal rank={2} username={topThreeUsers[1].name} />
            </div>
            <Avatar className="w-20 h-20 mb-2 border-4 border-background ring-2 ring-primary">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${topThreeUsers[1].name}`} />
              <AvatarFallback className="text-2xl">{getInitials(topThreeUsers[1].name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{topThreeUsers[1].name}</CardTitle>
            <CardDescription className="text-lg font-bold text-primary">{topThreeUsers[1].points} Points</CardDescription>
          </CardHeader>
        </Card>}

        {/* 1st place */}
        {topThreeUsers[0] && <Card key={topThreeUsers[0].id} className="relative transition-transform hover:scale-105 border-yellow-400 border-4 order-1 md:order-2">
           <CardHeader className="items-center text-center p-6">
            <div className="relative mb-4">
               <Medal rank={1} username={topThreeUsers[0].name} />
            </div>
            <Avatar className="w-28 h-28 mb-2 border-4 border-background ring-2 ring-yellow-400">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${topThreeUsers[0].name}`} />
              <AvatarFallback className="text-4xl">{getInitials(topThreeUsers[0].name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{topThreeUsers[0].name}</CardTitle>
            <CardDescription className="text-2xl font-bold text-yellow-500">{topThreeUsers[0].points} Points</CardDescription>
          </CardHeader>
        </Card>}

        {/* 3rd place */}
        {topThreeUsers[2] && <Card key={topThreeUsers[2].id} className="relative transition-transform hover:scale-105 border-amber-600 border-2 order-3">
           <CardHeader className="items-center text-center p-4">
            <div className="relative mb-2">
               <Medal rank={3} username={topThreeUsers[2].name} />
            </div>
            <Avatar className="w-20 h-20 mb-2 border-4 border-background ring-2 ring-primary">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${topThreeUsers[2].name}`} />
              <AvatarFallback className="text-2xl">{getInitials(topThreeUsers[2].name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{topThreeUsers[2].name}</CardTitle>
            <CardDescription className="text-lg font-bold text-primary">{topThreeUsers[2].points} Points</CardDescription>
          </CardHeader>
        </Card>}
      </div>}

      {otherUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Full Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{index + 4}</TableCell>
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
      )}
    </div>
  );
}
