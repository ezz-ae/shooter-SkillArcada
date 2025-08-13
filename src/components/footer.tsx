
"use client";

import Link from "next/link";
import { BrainCircuit, Dices, Heart, LineChart, Swords, User as UserIcon } from "lucide-react";
import { ActivityFeed } from "./activity-feed";
import { User, getUsers } from "@/lib/user";
import { useEffect, useState } from "react";
import { TopGames } from "./top-games";

export function Footer() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        async function fetchData() {
            const allUsers = await getUsers();
            setUsers(allUsers);
        }
        fetchData();
    }, []);
    
    const gameLinks = [
      { href: "/luckshots", label: "ShooterGuns", icon: Dices },
      { href: "/crypto-luck", label: "Crypto Luck", icon: LineChart },
      { href: "/pool-shot", label: "Pool Shot", icon: Swords },
      { href: "/shooter-man", label: "ShooterMan", icon: UserIcon },
    ];
    
  return (
    <footer className="border-t bg-background mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-3 text-center">Top Games by Win Rate</h3>
          <TopGames />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
              <Link href="/">
                  <span className="font-allura text-4xl text-foreground">ShooterGun</span>
              </Link>
              <p className="text-sm text-muted-foreground">Your shot at unbelievable prices, powered by our resident gamegang mega, Shooter.</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
              <div>
                  <h3 className="font-bold text-base mb-3">Games</h3>
                  <ul className="space-y-2">
                      {gameLinks.map(link => (
                          <li key={link.href}>
                              <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                                  <link.icon className="h-4 w-4 text-primary" />
                                  {link.label}
                              </Link>
                          </li>
                      ))}
                  </ul>
              </div>
              <div>
                  <h3 className="font-bold text-base mb-3">Support</h3>
                  <ul className="space-y-2">
                      <li><Link href="/learning-center" className="text-sm text-muted-foreground hover:text-foreground">Learning Center</Link></li>
                      <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                      <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link></li>
                      <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                  </ul>
              </div>
          </div>
          <div className="space-y-6">
              <div>
                  <h3 className="font-bold text-base mb-3">Live Wins</h3>
                  <ActivityFeed users={users} />
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
