
"use client";

import { Button } from "@/components/ui/button";
import { mockUsers } from "@/lib/user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, PlusCircle, Gamepad2, Star, BrainCircuit, LineChart, Swords, Heart, Dices, ChevronRight, HelpCircle, Users } from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { LuckiestUsers } from "@/components/luckiest-users";
import { DiceGame } from "@/components/dice-game";
import { ShotTaker } from "@/components/shot-taker";
import { mockProducts } from "@/lib/products";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PoolChallengeCard } from "@/components/pool-challenge-card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function Home() {
    const { isAuthenticated, user, login } = useAuth();
    const [openChallenges, setOpenChallenges] = useState([
      { id: 'c1', prize: 40, fee: 5, player1: mockUsers[0], player2: null },
      { id: 'c2', prize: 100, fee: 10, player1: mockUsers[2], player2: null },
      { id: 'c3', prize: 500, fee: 25, player1: mockUsers[3], player2: null },
    ]);
    
    // Auto-login for guest users
    useEffect(() => {
        if (!isAuthenticated) {
            login('wallet'); // Or 'whatsapp', doesn't matter for guest flow
        }
    }, [isAuthenticated, login]);

    const iphoneProduct = mockProducts.find(p => p.id === 'prod_phone_01');
    const btcProduct = mockProducts.find(p => p.id === 'prod_crypto_01');
    
    const gameLinks = [
      { href: "/luckshots", label: "Luckshots", icon: Dices, description: "Classic price drop action." },
      { href: "/brainshots", label: "Brainshots", icon: BrainCircuit, description: "Puzzles and skill challenges." },
      { href: "/crypto-luck", label: "Crypto Luck", icon: LineChart, description: "Predict the market to win." },
      { href: "/pool-shot", label: "Pool Shot", icon: Swords, description: "1-on-1 skill-based pool." },
      { href: "/luckgirls", label: "Luckgirls", icon: Heart, description: "Fun, social, and exciting games." },
    ];

    const handleDismissChallenge = (id: string) => {
        setOpenChallenges(prev => {
            const dismissedChallenge = prev.find(c => c.id === id);
            if (!dismissedChallenge) return prev;
            // Move the dismissed challenge to the end of the array
            return [...prev.filter(c => c.id !== id), dismissedChallenge];
        });
    };

    if (!isAuthenticated || !user) {
        return (
             <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <div className="animate-pulse">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-4"></div>
                            <div className="h-8 w-3/4 bg-muted rounded-md mx-auto"></div>
                            <div className="h-4 w-1/2 bg-muted rounded-md mx-auto mt-2"></div>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            <div className="h-4 w-full bg-muted rounded-md"></div>
                            <div className="h-12 w-full bg-muted rounded-md"></div>
                            <div className="h-12 w-full bg-muted rounded-md"></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-12">
                
                {/* Main Content: Challenges and League */}
                <div className="space-y-8">
                    {/* Test Your Luck & Skill */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <DiceGame />
                       {openChallenges.length > 0 && (
                            <PoolChallengeCard 
                                challenge={openChallenges[0]}
                                onDismiss={() => handleDismissChallenge(openChallenges[0].id)}
                            />
                       )}
                    </section>
                    
                    {/* Featured Games */}
                    <section>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                            {iphoneProduct && 
                                <div className="relative">
                                    <Badge variant="secondary" className="absolute top-2 left-2 z-10">Brainshot</Badge>
                                    <ShotTaker product={iphoneProduct} />
                                </div>
                            }
                            {btcProduct && 
                                <div className="relative">
                                     <Badge variant="secondary" className="absolute top-2 left-2 z-10">Brainshot</Badge>
                                     <ShotTaker product={btcProduct} />
                                </div>
                            }
                            <Card className="shadow-2xl border-accent/50 border-2 flex flex-col justify-between overflow-hidden relative">
                                <Image src="https://placehold.co/600x400/166534/FFFFFF/png" alt="Pool table" fill className="object-cover z-0" data-ai-hint="pool table top view" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 z-10" />
                                <div className="relative z-20 flex flex-col flex-grow text-white p-6">
                                    <CardHeader className="text-center p-0">
                                        <Trophy className="mx-auto h-16 w-16 text-accent animate-pulse"/>
                                        <CardTitle className="text-3xl font-black text-white">Pool Luck Pros</CardTitle>
                                        <CardDescription className="text-lg text-white/80">Season 1 is now open for registration.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center flex-grow flex flex-col justify-center p-0 pt-6">
                                        <p className="text-5xl font-black text-primary">1 ETH</p>
                                        <p className="text-white/80 font-semibold">Grand Prize</p>
                                        <div className="flex items-center justify-center gap-2 mt-4 text-white/80">
                                            <Users className="h-5 w-5" />
                                            <span className="font-bold">23 Players</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-0 pt-6">
                                        <Button size="lg" className="w-full" variant="secondary" asChild>
                                            <Link href="/pool-shot">View League</Link>
                                        </Button>
                                    </CardFooter>
                                </div>
                            </Card>
                         </div>
                    </section>

                     {/* All Games */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">All Games</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {gameLinks.map(game => (
                                <Link href={game.href} key={game.href}>
                                    <Card className="hover:bg-secondary/50 transition-colors h-full">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <game.icon className="h-8 w-8 text-primary"/>
                                                <CardTitle className="text-xl">{game.label}</CardTitle>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">{game.description}</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Sidebar: Live Activity */}
                <aside className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <section>
                        <h2 className="text-2xl font-bold mb-4">Live Activity</h2>
                        <ActivityFeed />
                    </section>
                     <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                           <Star className="text-yellow-400" />
                           Luckiest Users
                        </h2>
                        <LuckiestUsers />
                    </section>
                </aside>

            </div>
        </div>
    );
}
