
"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface PoolShotGameProps {
}

export function PoolShotGame({}: PoolShotGameProps) {
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'idle' | 'aiming' | 'shot' | 'won' | 'lost'>('idle');

  const prize = level * 10;
  const cost = level;

  const handleTakeShot = () => {
    // In a real implementation, we would subtract the cost here.
    setGameState('aiming');
    
    // Simulate shot outcome
    setTimeout(() => {
        const success = Math.random() > 0.5; // 50% chance of success for now
        setGameState(success ? 'won' : 'lost');
    }, 2000);
  };

  const handleNextLevel = () => {
    setLevel(prev => prev + 1);
    setGameState('idle');
  }

  const handleTryAgain = () => {
    setGameState('idle');
  }

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Level {level}</CardTitle>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Prize</p>
                <p className="text-2xl font-bold text-primary">{prize} Shots</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-[16/9] bg-green-800 border-8 border-[#6b4226] rounded-md overflow-hidden relative flex items-center justify-center p-8">
            {/* Pockets */}
            <div className="absolute top-0 left-0 w-8 h-8 bg-black rounded-bl-full"></div>
            <div className="absolute top-0 right-0 w-8 h-8 bg-black rounded-br-full"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 bg-black rounded-tl-full"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-tr-full"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-black rounded-b-full"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-black rounded-t-full"></div>

            {/* Cue Ball */}
            <div className={cn(
                "absolute w-8 h-8 bg-white rounded-full shadow-md transition-transform duration-1000",
                gameState === 'aiming' || gameState === 'shot' ? "animate-cue-ball-shot" : "left-[20%]"
            )}></div>

             {/* 8-Ball */}
            <div className={cn(
                "absolute w-8 h-8 bg-black rounded-full shadow-md flex items-center justify-center text-white font-bold text-xs",
                "left-[70%]",
            )}>
                8
            </div>

            {/* Cue Stick */}
            <div className={cn(
                "absolute h-2 w-96 bg-gradient-to-r from-yellow-700 to-yellow-900 rounded-full transition-all duration-300 origin-right",
                "right-full",
                "left-[calc(20%-25rem)] top-1/2 -translate-y-1/2",
                "transform-gpu",
                gameState === 'aiming' && "animate-cue-stick-aim",
                gameState === 'shot' && "animate-cue-stick-shot"
            )}></div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {gameState === 'idle' && (
            <Button onClick={handleTakeShot} size="lg" className="w-full">
                Take Shot ({cost} Shot{cost > 1 ? 's' : ''})
            </Button>
        )}
        {gameState === 'aiming' && (
             <Button disabled size="lg" className="w-full">
                Taking shot...
            </Button>
        )}
         {gameState === 'won' && (
            <div className="text-center w-full space-y-2">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-500">
                    <Check size={28} /> You Won {prize} Shots!
                </div>
                <Button onClick={handleNextLevel} size="lg" className="w-full">Next Level</Button>
            </div>
        )}
         {gameState === 'lost' && (
            <div className="text-center w-full space-y-2">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-destructive">
                    <X size={28} /> Missed!
                </div>
                <Button onClick={handleTryAgain} size="lg" className="w-full">Try Again</Button>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
