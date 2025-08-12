
"use client";

import { CryptoLuckGame } from "@/components/crypto-luck-game";
import { ActivityFeed } from "@/components/activity-feed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, getUsers } from "@/lib/user";
import { Bitcoin, History } from "lucide-react";
import { useEffect, useState } from "react";
import { LuckiestUsers } from "@/components/luckiest-users";
import { TopGames } from "@/components/top-games";

export default function CryptoLuckPage() {
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
          <Bitcoin className="text-yellow-500"/> Crypto Luck
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          The price of Bitcoin is chaos. Can you predict its next move in 3 minutes? Closest guess to the price and the right direction (up or down) wins the prize!
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <CryptoLuckGame />
        </div>

        <div className="lg:col-span-1 space-y-6">
            <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><History /> Live Activity</h3>
                <ActivityFeed users={users} />
            </div>
             <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">Luckiest Users Today</h3>
                <LuckiestUsers users={users} />
            </div>
             <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">Top Games by Win Rate</h3>
                <TopGames />
            </div>
        </div>
      </div>
    </div>
  );
}
