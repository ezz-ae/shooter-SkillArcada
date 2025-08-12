
"use client";

import { Button } from "@/components/ui/button";
import { mockUsers } from "@/lib/user";
import { PoolChallengeCard } from "@/components/pool-challenge-card";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Trophy, PlusCircle, Gamepad2 } from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { useAuth } from "@/lib/auth";
import { LoginModal } from "@/components/login-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function Home() {
    const { isAuthenticated, user, isLoggingIn } = useAuth();
    
    // Mock data for challenges
    const challenges = [
        { id: 'c1', prize: 40, fee: 5, player1: mockUsers[0], player2: mockUsers[1] },
        { id: 'c2', prize: 100, fee: 10, player1: mockUsers[2], player2: null },
        { id: 'c3', prize: 500, fee: 25, player1: mockUsers[3], player2: null },
        { id: 'c4', prize: 20, fee: 2, player1: mockUsers[4], player2: mockUsers[5] },
        { id: 'c5', prize: 250, fee: 20, player1: mockUsers[1], player2: null },
    ];
    
    const openChallenges = challenges.filter(c => !c.player2);
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

    const handleDismissChallenge = () => {
        setCurrentChallengeIndex((prevIndex) => (prevIndex + 1) % openChallenges.length);
    };
    
    const recommendedChallenge = openChallenges.length > 0 ? openChallenges[currentChallengeIndex] : null;

    if (!isAuthenticated && !isLoggingIn) {
        return <LoginModal />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Main Content: Challenges and League */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Open Challenges */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Recommended Challenge</h2>
                        </div>
                        {recommendedChallenge ? (
                            <div className="flex justify-center">
                                <div className="w-full max-w-sm">
                                    <PoolChallengeCard 
                                        key={recommendedChallenge.id} 
                                        challenge={recommendedChallenge} 
                                        onDismiss={handleDismissChallenge}
                                    />
                                </div>
                            </div>
                        ) : (
                             <div className="text-center py-16 border-2 border-dashed rounded-lg">
                                <h3 className="text-xl font-semibold">No Open Challenges</h3>
                                <p className="text-muted-foreground mt-2">Why not create one yourself?</p>
                                <Button className="mt-4"><PlusCircle/> Create Challenge</Button>
                            </div>
                        )}
                    </section>

                    {/* Luck League */}
                    <section>
                         <h2 className="text-2xl font-bold mb-4">Join the Luck League</h2>
                         <Card className="shadow-2xl border-accent/50 border-2 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="p-6 flex flex-col justify-center">
                                    <Trophy className="h-12 w-12 text-accent mb-2"/>
                                    <CardTitle className="text-3xl font-black">The Pro League</CardTitle>
                                    <CardDescription className="text-lg mt-1">Season 1 is now open for registration.</CardDescription>
                                    <div className="mt-4 grid grid-cols-2 gap-4 items-center">
                                        <div>
                                            <p className="text-5xl font-black text-primary">1 ETH</p>
                                            <p className="text-muted-foreground font-semibold">Grand Prize</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground text-center">Players Registered</p>
                                            <div className="flex justify-center items-center mt-2 gap-2">
                                                <div className="flex -space-x-3 rtl:space-x-reverse">
                                                    {mockUsers.slice(0, 5).map(user => (
                                                        <Avatar key={user.id} className="border-2 border-secondary h-10 w-10">
                                                            <AvatarImage src={user.avatarUrl} />
                                                            <AvatarFallback>{user.name.substring(0,2)}</AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                </div>
                                                <span className="font-bold text-lg">5 / 23</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-secondary/50 p-6 flex flex-col justify-center gap-4">
                                    <CardTitle className="text-center">Register Now</CardTitle>
                                    <Button size="lg" variant="outline" className="w-full">Register with Crypto (1 ETH)</Button>
                                </div>
                            </div>
                        </Card>
                    </section>
                </div>

                {/* Sidebar: Live Activity */}
                <aside className="space-y-8">
                     <section>
                        <h2 className="text-2xl font-bold mb-4">Live Activity</h2>
                        <ActivityFeed />
                    </section>
                </aside>

            </div>
        </div>
    );
}
