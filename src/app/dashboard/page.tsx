
"use client";

import { ActivityFeed } from "@/components/activity-feed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, getUsers } from "@/lib/user";
import { History, Flame, Trophy, Package, BarChart } from "lucide-react";
import { useEffect, useState } from "react";
import { LuckiestUsers } from "@/components/luckiest-users";
import { TopGames } from "@/components/top-games";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { useStore } from "@/lib/store";

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { vault, shots } = useStore();

  useEffect(() => {
    async function fetchData() {
        const allUsers = await getUsers();
        setUsers(allUsers);
    }
    fetchData();
  }, []);

  const totalItemsInVaults = vault.length; // This is just for the current user, would be aggregated in a real backend
  const totalShotsInPlay = shots; // Same as above

  return (
    <div className="container mx-auto px-4 py-8">
       <SectionHeader 
            icon={BarChart}
            title="Platform Dashboard"
            description="Your mission control for ShooterGun. Monitor live activity and key metrics."
       />

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-8">
          <StatCard title="Total Users" value={users.length} icon={User} />
          <StatCard title="Total Items in Vaults" value={totalItemsInVaults} icon={Package} />
          <StatCard title="Total Wins (Mock)" value="1,203" icon={Trophy} />
          <StatCard title="Shots Spent (24h)" value="4,530" icon={Flame} />
       </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><History /> Live Activity</h3>
                <ActivityFeed users={users} />
            </div>
             <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Trophy /> Luckiest Users Today</h3>
                <LuckiestUsers users={users} />
            </div>
        </div>
         <div className="lg:col-span-1 space-y-6">
            <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">Top Games by Win Rate</h3>
                <TopGames />
            </div>
        </div>
      </div>
    </div>
  );
}
