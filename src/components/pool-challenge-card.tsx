
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { User } from "@/lib/user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Target, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Challenge {
    id: string;
    prize: number;
    fee: number;
    player1: User;
    player2: User | null;
}

interface PoolChallengeCardProps {
  challenge: Challenge;
  onDismiss?: () => void;
}

const CHALLENGE_DURATION_SECONDS = 5 * 60; // 5 minutes

export function PoolChallengeCard({ challenge, onDismiss }: PoolChallengeCardProps) {
  const { id, prize, fee, player1, player2 } = challenge;
  const isWaiting = player2 === null;

  const [timeLeft, setTimeLeft] = useState(CHALLENGE_DURATION_SECONDS);

  useEffect(() => {
    if (!isWaiting) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
            // In a real app, you might fetch a new challenge here
            return CHALLENGE_DURATION_SECONDS;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWaiting]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className="flex flex-col border-2 border-transparent data-[waiting=true]:border-primary/50 relative" data-waiting={isWaiting}>
       {onDismiss && isWaiting && (
         <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-1 right-1 h-6 w-6 z-10"
            onClick={onDismiss}
            aria-label="Dismiss Challenge"
        >
            <X className="h-4 w-4" />
        </Button>
       )}
       <CardHeader>
         <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-2 text-center w-24">
                <Avatar className="h-16 w-16 border-4 border-primary">
                    <AvatarImage src={player1.avatarUrl} alt={player1.name} />
                    <AvatarFallback>{player1.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm truncate w-full">{player1.name}</span>
            </div>
            <div className="text-center">
                <p className="text-muted-foreground text-xs">VS</p>
                <p className="font-black text-2xl text-primary">POOL</p>
                 {isWaiting && (
                    <div className="flex justify-center items-center gap-2 mt-2">
                        <Zap className="h-5 w-5 text-yellow-500 animate-ping" />
                        <p className={cn("font-mono text-xl font-bold", timeLeft < 60 && "text-destructive")}>
                           {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </p>
                    </div>
                )}
            </div>
             <div className="flex flex-col items-center gap-2 text-center w-24">
                <Avatar className="h-16 w-16 border-4 border-secondary data-[waiting=true]:border-dashed" data-waiting={isWaiting}>
                    {player2 ? (
                        <>
                            <AvatarImage src={player2.avatarUrl} alt={player2.name} />
                            <AvatarFallback>{player2.name.substring(0,2)}</AvatarFallback>
                        </>
                    ): (
                        <AvatarFallback>?</AvatarFallback>
                    )}
                </Avatar>
                <span className="font-semibold text-sm truncate w-full">{player2 ? player2.name : 'Waiting...'}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow text-center flex flex-col justify-center">
        <p className="text-4xl font-black text-accent">{prize} $</p>
        <p className="text-muted-foreground text-sm">Prize Pool for the winner</p>
      </CardContent>
      <CardFooter className="flex-col gap-2">
         <Button asChild className="w-full">
            <Link href={`/pool-shot/challenge/${id}`}>
                {isWaiting ? 'Accept Challenge' : 'View Match'}
            </Link>
        </Button>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Target className="h-3 w-3" />
            <p>Entry Fee: {fee} Luckshots</p>
        </div>
      </CardFooter>
    </Card>
  );
}
