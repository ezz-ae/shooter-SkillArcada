
"use client";

import { ActivityFeed } from "@/components/activity-feed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, getUsers } from "@/lib/user";
import { History, MessageSquare, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { LuckiestUsers } from "@/components/luckiest-users";
import { TopGames } from "@/components/top-games";

export default function ShotsHubPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
        const allUsers = await getUsers();
        setUsers(allUsers);
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-3">
          <Flame className="text-accent"/> Shots Hub
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          The heart of the community. See live wins, top players, and join the conversation.
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><History /> Live Activity</h3>
                <ActivityFeed users={users} />
            </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
             <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">Luckiest Users Today</h3>
                <LuckiestUsers users={users} />
            </div>
             <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">Top Games by Win Rate</h3>
                <TopGames />
            </div>
        </div>
         <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MessageSquare /> Community Chat</CardTitle>
                    <CardDescription>Join the conversation with other players.</CardDescription>
                </CardHeader>
                <CardContent className="h-96 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    <p>Chat rooms coming soon!</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
