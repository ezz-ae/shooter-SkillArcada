
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PoolChallengeCard } from "@/components/pool-challenge-card";
import { User, getUsers } from "@/lib/user";
import { Trophy, PlusCircle, Swords, Check, MousePointerClick } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { ChessBoard } from "@/components/chess-board";
import { useStore } from "@/lib/store";
import { useNotificationStore } from "@/lib/notification-store";
import { CreateChallengeDialog } from "@/components/create-challenge-dialog";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const CHESS_MATE_MOVE = { from: [1, 5], to: [0, 5] };
const CHESS_PRIZE_SHOTS = 500;
const PUZZLE_COST = 50;

const initialChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));
initialChessBoard[7][4] = { type: 'King', color: 'black' };
initialChessBoard[0][4] = { type: 'King', color: 'white' };
initialChessBoard[1][5] = { type: 'Rook', color: 'white' };
initialChessBoard[1][7] = { type: 'Rook', color: 'white' };

interface Challenge {
    id: string;
    prize: number;
    fee: number;
    player1: User;
    player2: User | null;
    type: 'pool' | 'chess';
}

type PuzzleState = 'idle' | 'playing' | 'piece_selected' | 'solved';

export default function ChessPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuth();
  const { addShots, spendShot } = useStore();
  const { add: toast } = useNotificationStore();
  const [puzzleState, setPuzzleState] = useState<PuzzleState>('idle');
  const [chessChallenges, setChessChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    async function fetchData() {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
       if (fetchedUsers.length > 3) {
            setChessChallenges([
                { id: 'chess1', prize: 250, fee: 25, player1: fetchedUsers[1], player2: null, type: 'chess' as const },
                { id: 'chess2', prize: 1000, fee: 100, player1: fetchedUsers[3], player2: null, type: 'chess' as const },
                { id: 'chess3', prize: 50, fee: 5, player1: fetchedUsers[0], player2: fetchedUsers[2], type: 'chess' as const },
            ]);
        }
    }
    fetchData();
  }, []);

  const handleCreateChallenge = (prize: number, fee: number) => {
    if (!currentUser || !users.length) return;
    const player1 = users.find(u => u.id === 'user1') ?? users[0]; // mock finding current user
    const newChallenge: Challenge = {
        id: `chess-challenge-${Date.now()}`,
        prize,
        fee,
        player1,
        player2: null,
        type: 'chess'
    }
    setChessChallenges(prev => [newChallenge, ...prev]);
  }

  const handleChessMove = (from: [number, number], to: [number, number] | null) => {
      if (puzzleState !== 'playing' && puzzleState !== 'piece_selected') return;

      if (to === null) { // This means a piece was just selected
        if(from[0] === CHESS_MATE_MOVE.from[0] && from[1] === CHESS_MATE_MOVE.from[1]) {
            setPuzzleState('piece_selected');
        } else {
             toast({ variant: "destructive", title: "Incorrect Piece", description: "That's not the piece that delivers checkmate." });
        }
        return;
      }
      
      const isCorrectMove = from[0] === CHESS_MATE_MOVE.from[0] &&
                            from[1] === CHESS_MATE_MOVE.from[1] &&
                            to[0] === CHESS_MATE_MOVE.to[0] &&
                            to[1] === CHESS_MATE_MOVE.to[1];

      if (isCorrectMove) {
          setPuzzleState('solved');
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
    if (spendShot(PUZZLE_COST)) {
        setPuzzleState('playing');
        toast({
            title: "Good Luck!",
            description: "The puzzle is now active. Find the checkmate."
        })
    } else {
        toast({
            variant: "destructive",
            title: "Not enough Shots!",
            description: `You need ${PUZZLE_COST} Shots to play this puzzle.`
        })
    }
  }
  
  const renderTutorialOverlay = () => {
    if (puzzleState === 'idle' || puzzleState === 'solved') return null;

    let text = "Click the piece to move.";
    if (puzzleState === 'piece_selected') {
        text = "Now click the square to deliver checkmate.";
    }

    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 animate-in fade-in-50">
            <div className="text-center text-white p-4 rounded-lg">
                <MousePointerClick className="mx-auto h-12 w-12 mb-4" />
                <p className="text-xl font-bold">{text}</p>
            </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-4">
          <Swords size={40} className="text-primary"/> Chess Challenges
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Solve tactical puzzles against the clock. Server-verified solutions.
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
                        <CardDescription>White to move and deliver checkmate. Click the correct piece, then the correct square to solve the puzzle and win a massive prize!</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-96 relative">
                            {renderTutorialOverlay()}
                            <ChessBoard 
                                key={puzzleState} // Force re-render on state change to clear selection
                                initialBoard={initialChessBoard}
                                onMove={handleChessMove}
                                isSelectable={puzzleState === 'playing' || puzzleState === 'piece_selected'}
                            />
                        </div>
                        <div className="text-center space-y-4">
                            <div>
                                <p className="text-3xl md:text-5xl font-black text-primary">{CHESS_PRIZE_SHOTS} Shots</p>
                                <p className="text-muted-foreground font-semibold">Prize</p>
                            </div>
                            {puzzleState === 'solved' ? (
                                <div className="p-4 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 font-bold flex items-center justify-center gap-2">
                                    <Check /> Puzzle Solved! Prize Awarded.
                                </div>
                            ) : (
                                <Button onClick={handlePlayPuzzle} size="lg" disabled={puzzleState !== 'idle'}>
                                    {puzzleState === 'idle' ? `Play Puzzle (${PUZZLE_COST} Shots)` : 'Puzzle Active'}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="challenges" className="mt-6">
                <div className="flex justify-end mb-4">
                    <CreateChallengeDialog 
                        gameType="chess" 
                        onCreate={handleCreateChallenge} 
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chessChallenges.filter(c => !c.player2).map(challenge => (
                        <PoolChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                </div>
                 {chessChallenges.filter(c => !c.player2).length === 0 && (
                     <div className="text-center py-16 border-2 border-dashed rounded-lg mt-6">
                        <h3 className="text-xl font-semibold">No More Open Chess Challenges</h3>
                        <p className="text-muted-foreground mt-2">Why not create one yourself?</p>
                    </div>
                )}
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
