
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoolChallengeCard } from "@/components/pool-challenge-card";
import { User, getUsers } from "@/lib/user";
import { Trophy, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { FaChess } from "react-icons/fa";

export default function ChessPage() {
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    }
    fetchData();
  }, []);

  const chessChallenges = users.length > 3 ? [
    { id: 'chess1', prize: 250, fee: 25, player1: users[1], player2: null, type: 'chess' },
    { id: 'chess2', prize: 1000, fee: 100, player1: users[3], player2: null, type: 'chess' },
    { id: 'chess3', prize: 50, fee: 5, player1: users[0], player2: users[2], type: 'chess' },
  ] : [];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-4">
          <FaChess /> Chess Challenges
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Outsmart your opponent in 1-on-1 puzzle speedruns and join high-stakes leagues.
        </p>
      </div>

      <div className="w-full max-w-5xl">
         <div className="flex justify-end mb-4">
            <Button size="lg">
                <PlusCircle className="mr-2"/>
                Create New Challenge
            </Button>
        </div>
        <Tabs defaultValue="chess-challenges" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chess-challenges">Public Challenges</TabsTrigger>
                <TabsTrigger value="leagues">Leagues</TabsTrigger>
            </TabsList>
            <TabsContent value="chess-challenges" className="mt-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chessChallenges.filter(c => !c.player2).map(challenge => (
                        <PoolChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </div>
                 <div className="text-center py-16 border-2 border-dashed rounded-lg mt-6">
                    <h3 className="text-xl font-semibold">No More Open Chess Challenges</h3>
                    <p className="text-muted-foreground mt-2">Why not create one yourself?</p>
                </div>
            </TabsContent>
            <TabsContent value="leagues" className="mt-6">
                 <Card className="shadow-2xl border-accent/50 border-2">
                    <CardHeader className="text-center">
                        <Trophy className="mx-auto h-16 w-16 text-accent animate-pulse"/>
                        <CardTitle className="text-3xl font-black">The Grandmaster League</CardTitle>
                        <CardDescription className="text-lg">The ultimate test of tactical genius.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div>
                            <p className="text-5xl font-black text-primary">2.5 ETH</p>
                            <p className="text-muted-foreground font-semibold">Grand Prize</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground">Players Registered</p>
                            <div className="flex justify-center items-center mt-2 gap-2">
                                <div className="flex -space-x-4 rtl:space-x-reverse">
                                    {users.slice(0, 3).map(user => (
                                        <Avatar key={user.id} className="border-2 border-background">
                                            <AvatarImage src={user.avatarUrl} />
                                            <AvatarFallback>{user.name.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                <span className="font-bold text-lg">3 / 64</span>
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
