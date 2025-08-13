
"use client";

import Link from "next/link";
import Image from "next/image";
import { BrainCircuit, Dices, Heart, LineChart, Swords } from "lucide-react";
import { ActivityFeed } from "./activity-feed";
import { User, getUsers } from "@/lib/user";
import { useEffect, useState } from "react";

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
      { href: "/luckshots", label: "Luckshots", icon: Dices },
      { href: "/brainshots", label: "Brainshots", icon: BrainCircuit },
      { href: "/crypto-luck", label: "Crypto Luck", icon: LineChart },
      { href: "/pool-shot", label: "Pool Shot", icon: Swords },
      { href: "/shoter-and-girls", label: "Shoter & Girls", icon: Heart },
    ];
    
  return (
    <footer className="border-t mt-12 py-8 bg-secondary/50">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 flex flex-col gap-4">
             <Link href="/">
                <Image src="https://firebasestorage.googleapis.com/v0/b/reodywellness.firebasestorage.app/o/Untitled-4%20(13).png?alt=media&token=a7f36634-d0ab-40d5-9607-76ecbf375346" alt="ShoterShots Logo" width={160} height={40} />
            </Link>
            <p className="text-sm text-muted-foreground">Your shot at unbelievable prices, powered by our resident gamegang mega, Shoter.</p>
        </div>
        <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-2">Games</h3>
            <ul className="space-y-2">
                {gameLinks.map(link => (
                     <li key={link.href}>
                        <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
        <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-2">Support</h3>
             <ul className="space-y-2">
                <li><Link href="/learning-center" className="text-sm text-muted-foreground hover:text-foreground">Learning Center</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
        </div>
        <div className="md:col-span-1">
             <h3 className="font-bold text-lg mb-2">Live Wins</h3>
             <ActivityFeed users={users} />
        </div>
      </div>
    </footer>
  );
}
