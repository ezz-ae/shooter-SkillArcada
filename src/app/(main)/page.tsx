
"use client";

import { ActivityFeed } from "@/components/activity-feed";
import { History } from "lucide-react";
import { useEffect, useState } from "react";
import { User, getUsers } from "@/lib/user";
import { SectionHeader } from "@/components/section-header";
import { DiceGame } from "@/components/dice-game";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
        const allUsers = await getUsers();
        setUsers(allUsers);
    }
    fetchData();
  }, []);
  
  return (
    <>
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <DiceGame />
      </div>
      <div className="py-12 container mx-auto px-4">
         <SectionHeader 
            icon={History}
            title="Live Shots"
            description="See what's happening right now on ShooterGun. Real wins from real players."
        />
        <div className="max-w-2xl mx-auto mt-8">
            <ActivityFeed users={users} />
        </div>
      </div>
    </>
  );
}
