
"use client";

import { PoolShotGame } from "@/components/pool-shot-game";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers } from "@/lib/user";
import { ArrowLeft, HelpCircle, Shield, Swords, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// This is a placeholder page for a specific challenge.
// In a real app, you would fetch challenge details based on the `params.id`.
export default function PoolChallengePage({ params }: { params: { id: string } }) {
  // Mock prize, would be fetched from backend
  const prizeAmount = 100; 

  const [player1, setPlayer1] = useState(mockUsers[0]);
  const [player2, setPlayer2] = useState(mockUsers[1]);

  useEffect(() => {
    // In a real app, you'd fetch the challenge and player data
    // For now, we'll just use mock data to populate the UI
    // Example: const challengeData = await getChallenge(params.id);
    // setPlayer1(challengeData.player1);
    // setPlayer2(challengeData.player2);
  }, [params.id]);


  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-secondary/50">
        <div className="container mx-auto px-4 py-8">
             <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/pool-shot" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to All Challenges
                    </Link>
                </Button>
            </div>
            <div className="w-full max-w-5xl">
                {/* Player Info Header */}
                <div className="grid grid-cols-3 items-center text-center gap-4 mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-24 w-24 border-4 border-primary">
                            <AvatarImage src={player1.avatarUrl} alt={player1.name} />
                            <AvatarFallback>{player1.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-lg md:text-xl font-bold">{player1.name}</h2>
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="text-sm text-muted-foreground">Prize Pool</p>
                        <p className="text-4xl lg:text-6xl font-black text-primary">{prizeAmount} Shots</p>
                        <Swords className="h-8 w-8 text-accent mt-2"/>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                         <Avatar className="h-24 w-24 border-4 border-background">
                            <AvatarImage src={player2.avatarUrl} alt={player2.name} />
                            <AvatarFallback>{player2.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-lg md:text-xl font-bold">{player2.name}</h2>
                    </div>
                </div>

                {/* Game Board */}
                <div className="w-full">
                    <PoolShotGame />
                </div>

                {/* Chat & Audience */}
                <div className="w-full mt-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2"><Users /> Audience & Chat</CardTitle>
                                <Button variant="outline" size="sm">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Call Admin for Help
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                                    <p>Live chat is coming soon!</p>
                                </div>
                            </CardContent>
                        </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
