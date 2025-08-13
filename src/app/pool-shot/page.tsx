
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoolChallengeCard } from "@/components/pool-challenge-card";
import { User, getUsers } from "@/lib/user";
import { Trophy, PlusCircle, Swords } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { CreateChallengeDialog } from "@/components/create-challenge-dialog";
import { useAuth } from "@/lib/auth";

interface Challenge {
    id: string;
    prize: number;
    fee: number;
    player1: User;
    player2: User | null;
    type: 'pool' | 'chess';
}

export default function PoolShotPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuth();
  const [poolChallenges, setPoolChallenges] = useState<Challenge[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
      if (fetchedUsers.length > 5) {
        setPoolChallenges([
          { id: 'c1', prize: 40, fee: 5, player1: fetchedUsers[0], player2: fetchedUsers[1], type: 'pool' as const },
          { id: 'c2', prize: 100, fee: 10, player1: fetchedUsers[2], player2: null, type: 'pool' as const },
          { id: 'c3', prize: 500, fee: 25, player1: fetchedUsers[3], player2: null, type: 'pool' as const },
          { id: 'c4', prize: 20, fee: 2, player1: fetchedUsers[4], player2: fetchedUsers[5], type: 'pool' as const },
        ]);
      }
    }
    fetchData();
  }, []);

  const handleCreateChallenge = (prize: number, fee: number) => {
    if (!currentUser || !users.length) return;
    const player1 = users.find(u => u.id === 'user1') ?? users[0]; // mock finding current user
    const newChallenge: Challenge = {
        id: `pool-challenge-${Date.now()}`,
        prize,
        fee,
        player1,
        player2: null,
        type: 'pool'
    }
    setPoolChallenges(prev => [newChallenge, ...prev]);
  }

  const handleDismissChallenge = (id: string) => {
    setPoolChallenges(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-4">
            <Swords size={40} className="text-primary"/> Pool Shot
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Compete in 1-on-1 challenges, join high-stakes leagues, or practice your skills. The felt is waiting.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <Tabs defaultValue="pool-challenges" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pool-challenges">Public Challenges</TabsTrigger>
                <TabsTrigger value="leagues">Leagues</TabsTrigger>
            </TabsList>
            <TabsContent value="pool-challenges" className="mt-6">
                 <div className="flex justify-end mb-4">
                    <CreateChallengeDialog 
                        gameType="pool" 
                        onCreate={handleCreateChallenge} 
                    />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {poolChallenges.filter(c => !c.player2).map(challenge => (
                        <PoolChallengeCard 
                            key={challenge.id} 
                            challenge={challenge} 
                            onDismiss={challenge.player1.id === currentUser?.uid ? () => handleDismissChallenge(challenge.id) : undefined}
                        />
                    ))}
                </div>
                 {poolChallenges.filter(c => !c.player2).length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg mt-6 flex flex-col items-center gap-4">
                        <h3 className="text-xl font-semibold">No More Open Pool Challenges</h3>
                        <p className="text-muted-foreground mt-2">Why not create one yourself?</p>
                    </div>
                )}
            </TabsContent>
            <TabsContent value="leagues" className="mt-6">
                <Card className="shadow-2xl border-accent/50 border-2">
                    <CardHeader className="text-center">
                        <Trophy className="mx-auto h-16 w-16 text-accent animate-pulse"/>
                        <CardTitle className="text-3xl font-black">The Pro League</CardTitle>
                        <CardDescription className="text-lg">Season 1 is now open for registration.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div>
                            <p className="text-5xl font-black text-primary">1 ETH</p>
                            <p className="text-muted-foreground font-semibold">Grand Prize</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground">Players Registered</p>
                            <div className="flex justify-center items-center mt-2 gap-2">
                                <div className="flex -space-x-4 rtl:space-x-reverse">
                                    {users.slice(0, 5).map(user => (
                                        <Avatar key={user.id} className="border-2 border-background">
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback>{user.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                <span className="font-bold text-lg">5 / 32</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button size="lg" className="w-full">Register Now</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
