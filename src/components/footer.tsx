
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Dices, Heart, LineChart, MessageSquare, Swords } from "lucide-react";
import Link from "next/link";

export function Footer() {
    
    const gameLinks = [
      { href: "/luckshots", label: "Luckshots", icon: Dices },
      { href: "/brainshots", label: "Brainshots", icon: BrainCircuit },
      { href: "/crypto-luck", label: "Crypto Luck", icon: LineChart },
      { href: "/pool-shot", label: "Pool Shot", icon: Swords },
      { href: "/luckgirls", label: "Luckgirls", icon: Heart },
    ];
    
  return (
    <footer className="border-t mt-12 py-8 bg-secondary/50">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
            <h3 className="font-bold text-lg mb-2">Luckshots</h3>
            <p className="text-sm text-muted-foreground">Your shot at unbelievable prices. All safe, all fun.</p>
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
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">FAQ</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
        </div>
        <div className="md:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="text-primary"/>
                        Entry Chat
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">
                        Have 10 minutes to challenge someone? Chat with other players here.
                    </p>
                    <Button className="w-full mt-2" size="sm" variant="outline">Join Chat</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </footer>
  );
}
