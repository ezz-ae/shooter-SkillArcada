
"use client";

import { Button } from "@/components/ui/button";
import { mockUsers } from "@/lib/user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, PlusCircle, Gamepad2, Star, BrainCircuit, LineChart, Swords, Heart, Dices, ChevronRight, HelpCircle } from "lucide-react";
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

export default function Home() {
    const { isAuthenticated, user, login } = useAuth();
    
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content: Challenges and League */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Test Your Luck */}
                    <section>
                        <DiceGame />
                    </section>
                    
                    {/* Featured Games */}
                    <section>
                         <h2 className="text-2xl font-bold mb-4">Featured Games</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {iphoneProduct && <ShotTaker product={iphoneProduct} />}
                            {btcProduct && <ShotTaker product={btcProduct} />}
                         </div>
                    </section>

                     {/* All Games */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">All Games</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <aside className="space-y-8">
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
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><HelpCircle className="text-primary"/> Support</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Have questions or need help with the app? Our support team is here for you.</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">Contact Support</Button>
                            </CardFooter>
                        </Card>
                    </section>
                </aside>

            </div>
        </div>
    );
}
