
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoolChallengeCard } from "@/components/pool-challenge-card";
import { User, getUsers } from "@/lib/user";
import { Trophy, PlusCircle, Swords, Check } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { ChessBoard } from "@/components/chess-board";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const CHESS_MATE_MOVE = { from: [1, 5], to: [0, 5] };
const CHESS_PRIZE_SHOTS = 500;

const initialChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));
initialChessBoard[7][4] = { type: 'King', color: 'black' };
initialChessBoard[0][4] = { type: 'King', color: 'white' };
initialChessBoard[1][5] = { type: 'Rook', color: 'white' };
initialChessBoard[1][7] = { type: 'Rook', color: 'white' };

export default function ChessPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { addShots, spendShot } = useStore();
  const { toast } = useToast();
  const [isChessWon, setIsChessWon] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    }
    fetchData();
  }, []);

  const chessChallenges = users.length > 3 ? [
    { id: 'chess1', prize: 250, fee: 25, player1: users[1], player2: null, type: 'chess' as const },
    { id: 'chess2', prize: 1000, fee: 100, player1: users[3], player2: null, type: 'chess' as const },
    { id: 'chess3', prize: 50, fee: 5, player1: users[0], player2: users[2], type: 'chess' as const },
  ] : [];

  const handleChessMove = (from: [number, number], to: [number, number]) => {
      if (isChessWon) return;

      const isCorrectMove = from[0] === CHESS_MATE_MOVE.from[0] &&
                            from[1] === CHESS_MATE_MOVE.from[1] &&
                            to[0] === CHESS_MATE_MOVE.to[0] &&
                            to[1] === CHESS_MATE_MOVE.to[1];
      if (isCorrectMove) {
          setIsChessWon(true);
          addShots(CHESS_PRIZE_SHOTS);
          toast({
            title: "Checkmate!",
            description: `You won ${CHESS_PRIZE_SHOTS} Shots!`,
          });
      } else {
          toast({
            variant: "destructive",
            title: "Not Quite",
            description: "That wasn't the winning move. Try again!",
          });
      }
  }

  const handlePlayPuzzle = () => {
    if (spendShot(50)) {
        setIsChessWon(false);
        toast({
            title: "Good Luck!",
            description: "The puzzle is now active. Find the checkmate."
        })
    } else {
        toast({
            variant: "destructive",
            title: "Not enough Shots!",
            description: "You need 50 Shots to play this puzzle."
        })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-4">
          <Swords size={40} className="text-primary"/> Chess Challenges
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Outsmart your opponent in 1-on-1 puzzle speedruns and join high-stakes leagues.
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <Tabs defaultValue="puzzle" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="puzzle">Daily Puzzle</TabsTrigger>
                <TabsTrigger value="challenges">Public Challenges</TabsTrigger>
                <TabsTrigger value="leagues">Leagues</TabsTrigger>
            </TabsList>
            <TabsContent value="puzzle" className="mt-6">
                <Card className="shadow-2xl">
                    <CardHeader>
                        <CardTitle>Checkmate in One</CardTitle>
                        <CardDescription>White to move and win the game. Solve it to win a massive prize!</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-96">
                            <ChessBoard 
                                initialBoard={initialChessBoard}
                                onMove={handleChessMove}
                            />
                        </div>
                        <div className="text-center space-y-4">
                            <div>
                                <p className="text-5xl font-black text-primary">{CHESS_PRIZE_SHOTS} Shots</p>
                                <p className="text-muted-foreground font-semibold">Prize</p>
                            </div>
                            {isChessWon ? (
                                <div className="p-4 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 font-bold flex items-center justify-center gap-2">
                                    <Check /> Puzzle Solved! Prize Awarded.
                                </div>
                            ) : (
                                <Button onClick={handlePlayPuzzle} size="lg">Play Puzzle (50 Shots)</Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="challenges" className="mt-6">
                <div className="flex justify-end mb-4">
                    <Button size="lg">
                        <PlusCircle className="mr-2"/>
                        Create New Challenge
                    </Button>
                </div>
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
