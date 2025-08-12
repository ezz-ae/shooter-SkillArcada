
"use client";

import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dices, PlayCircle, HelpCircle, Gamepad2, BrainCircuit, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { cn } from '@/lib/utils';

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export function DiceGame() {
    const [rolls, setRolls] = useState<number[]>([]);
    const [isRolling, setIsRolling] = useState(false);
    
    const MAX_ROLLS = 3;
    const rollsLeft = MAX_ROLLS - rolls.length;

    const handleRoll = () => {
        if (rollsLeft <= 0 || isRolling) return;

        setIsRolling(true);
        setTimeout(() => {
            const newRoll = Math.floor(Math.random() * 6) + 1;
            setRolls(prev => [...prev, newRoll]);
            setIsRolling(false);
        }, 800);
    };

    const handleReset = () => {
        setRolls([]);
    };

    const luckScore = useMemo(() => {
        if (rolls.length < MAX_ROLLS) return null;
        const total = rolls.reduce((sum, roll) => sum + roll, 0);
        if (total <= 6) return 'low';
        if (total <= 12) return 'medium';
        return 'high';
    }, [rolls]);

    const renderLuckActions = () => {
        if (!luckScore) return null;
        
        const actions = {
            low: { label: "Need Help?", icon: HelpCircle, variant: 'secondary' as const },
            medium: { label: "Play a Challenge", icon: Gamepad2, variant: 'outline' as const },
            high: { label: "Go to Brainshots!", icon: BrainCircuit, variant: 'default' as const },
        };
        
        const luckyAction = actions[luckScore];

        return (
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <Button size="lg" variant={luckyAction.variant}>
                    <luckyAction.icon className="mr-2" /> {luckyAction.label}
                </Button>
                <Button size="lg" variant="ghost" onClick={handleReset}>Try Again</Button>
            </div>
        )
    }

    return (
        <Card className="shadow-2xl border-primary/20 border-2 overflow-hidden text-center">
            <CardHeader>
                <Dices className="mx-auto h-12 w-12 text-primary animate-pulse"/>
                <CardTitle className="text-3xl font-black">Is it a lucky day?</CardTitle>
                <CardDescription className="text-lg mt-1">
                    Throw the dice 3 times to measure your luck.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center gap-4 h-24">
                    {[...Array(MAX_ROLLS)].map((_, i) => {
                        const rollValue = rolls[i];
                        const isRolled = rollValue !== undefined;
                        const isCurrentlyRolling = i === rolls.length && isRolling;

                        const DieIcon = isRolled ? diceIcons[rollValue - 1] : Dices;

                        return (
                            <div key={i} className={cn(
                                "h-20 w-20 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                                isRolled ? "bg-primary/10 border-primary" : "bg-muted border-dashed",
                                isCurrentlyRolling && "animate-pulse"
                            )}>
                               <DieIcon className={cn(
                                    "transition-all duration-500",
                                    isCurrentlyRolling ? "h-12 w-12 text-primary animate-[spin_0.8s_ease-in-out]" : "h-10 w-10",
                                    isRolled ? "text-primary" : "text-muted-foreground"
                               )} />
                            </div>
                        )
                    })}
                </div>

                {luckScore ? (
                    <div className="mt-4">
                        <p className="text-lg font-semibold">Your luck score is <span className={cn(luckScore === 'high' && 'text-primary', luckScore === 'low' && 'text-destructive')}>{luckScore.toUpperCase()}</span>!</p>
                       {renderLuckActions()}
                    </div>
                ) : (
                    <Button size="lg" onClick={handleRoll} disabled={isRolling}>
                        <Dices className="mr-2" />
                        {isRolling ? 'Rolling...' : `Roll the dice (${rollsLeft} left)`}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
