
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoolChallengeCard } from "@/components/pool-challenge-card";
import { mockUsers } from "@/lib/user";
import { Bot, Trophy, PlusCircle, Gamepad2 } from "lucide-react";
import Link from "next/link";

export default function PoolShotPage() {

  const challenges = [
    { id: 'c1', prize: 40, fee: 5, player1: mockUsers[0], player2: mockUsers[1] },
    { id: 'c2', prize: 100, fee: 10, player1: mockUsers[2], player2: null },
    { id: 'c3', prize: 500, fee: 25, player1: mockUsers[3], player2: null },
    { id: 'c4', prize: 20, fee: 2, player1: mockUsers[4], player2: mockUsers[5] },
  ]
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Pool Game Center
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Compete in 1-on-1 challenges, join high-stakes leagues, or practice your skills. The felt is waiting.
        </p>
      </div>

      <div className="w-full max-w-5xl">
         <div className="flex justify-end mb-4">
            <Button size="lg">
                <PlusCircle className="mr-2"/>
                Create New Challenge
            </Button>
        </div>
        <Tabs defaultValue="challenges" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="challenges">Public Challenges</TabsTrigger>
                <TabsTrigger value="leagues">Leagues</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>
            <TabsContent value="challenges" className="mt-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.filter(c => !c.player2).map(challenge => (
                        <PoolChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </div>
                 <div className="text-center py-16 border-2 border-dashed rounded-lg mt-6">
                    <h3 className="text-xl font-semibold">No More Open Challenges</h3>
                    <p className="text-muted-foreground mt-2">Why not create one yourself?</p>
                </div>
            </TabsContent>
            <TabsContent value="leagues" className="mt-6">
                <Card className="shadow-2xl border-accent/50 border-2">
                    <CardHeader className="text-center">
                        <Trophy className="mx-auto h-16 w-16 text-accent animate-pulse"/>
                        <CardTitle className="text-3xl font-black">The Pro League</CardTitle>
                        <CardDescription className="text-lg">Season 1 is now open for registration.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-5xl font-black text-primary">1 ETH</p>
                        <p className="text-muted-foreground font-semibold">Grand Prize</p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button size="lg" className="w-full">Register with 200 Luckshots</Button>
                        <Button size="lg" variant="outline" className="w-full">Register with Crypto (1 ETH)</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="practice" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gamepad2/> Practice Mode</CardTitle>
                        <CardDescription>Hone your skills in a solo session. No pressure, just practice.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-12">
                       <h3 className="text-4xl font-black">Free Play</h3>
                       <p className="text-muted-foreground">Practice your aim and power.</p>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" className="w-full" asChild>
                            <Link href="/pool-shot/challenge/practice">Start Practice Session for 1 Luckshot</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
