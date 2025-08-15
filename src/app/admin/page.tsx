
"use client";

import { User, getUsers } from "@/lib/user";
import { Bot, Gamepad2, Users, BarChart3, List, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { useGameSettingsStore, Game, GameStatus } from "@/lib/game-settings-store";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { games, initializeGames } = useGameSettingsStore();

  useEffect(() => {
    async function fetchData() {
        initializeGames(); 
        const allUsers = await getUsers();
        setUsers(allUsers);
    }
    fetchData();
  }, [initializeGames]);

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black">Admin Command Center</h1>
                <p className="text-muted-foreground">An overview of the ShooterGun platform.</p>
            </div>
       </div>
       <Card>
            <CardHeader>
                <CardTitle>Platform At a Glance</CardTitle>
                <CardDescription>Key metrics for the entire platform.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Users" value={users.length} icon={Users} />
                <StatCard title="Total Revenue (Mock)" value="$12,450" icon={BarChart3} />
                <StatCard title="Active Games" value={games.filter(g => g.status === 'live').length} icon={Gamepad2} />
                <StatCard title="AI Interactions (24h)" value="1,832" icon={Bot} />
            </CardContent>
        </Card>
        {/* Further overview components can be added here */}
    </div>
  );
}
