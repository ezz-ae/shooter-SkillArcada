
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { User, mockUsers } from "@/lib/user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Target } from "lucide-react";

interface Challenge {
    id: string;
    prize: number;
    fee: number;
    player1: User;
    player2: User | null;
}

interface PoolChallengeCardProps {
  challenge: Challenge;
}

export function PoolChallengeCard({ challenge }: PoolChallengeCardProps) {
  const { id, prize, fee, player1, player2 } = challenge;
  const isWaiting = player2 === null;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-around items-center">
            <div className="flex flex-col items-center gap-2">
                <Avatar className="h-16 w-16 border-4 border-primary">
                    <AvatarImage src={player1.avatarUrl} alt={player1.name} />
                    <AvatarFallback>{player1.name.substring(0,2)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">{player1.name}</span>
            </div>
            <div className="text-center">
                <p className="text-muted-foreground text-xs">VS</p>
                <p className="font-black text-2xl text-primary">POOL</p>
            </div>
             <div className="flex flex-col items-center gap-2">
                <Avatar className="h-16 w-16 border-4 border-secondary data-[waiting=true]:border-dashed">
                    {player2 ? (
                        <>
                            <AvatarImage src={player2.avatarUrl} alt={player2.name} />
                            <AvatarFallback>{player2.name.substring(0,2)}</AvatarFallback>
                        </>
                    ): (
                        <AvatarFallback>?</AvatarFallback>
                    )}
                </Avatar>
                <span className="font-semibold text-sm">{player2 ? player2.name : 'Waiting...'}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow text-center">
        <p className="text-muted-foreground text-sm">Prize Pool</p>
        <p className="text-4xl font-black text-accent">{prize} Shots</p>
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
