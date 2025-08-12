
"use client";

import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dices, PlayCircle, HelpCircle, Gamepad2, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dice } from './dice';
import Link from 'next/link';

export function DiceGame() {
    const [rolls, setRolls] = useState<(number | null)[]>([null, null, null]);
    const [currentRollIndex, setCurrentRollIndex] = useState(0);
    const [isRolling, setIsRolling] = useState(false);
    
    const rollsLeft = rolls.filter(r => r === null).length;
    const isGameComplete = rollsLeft === 0;

    const handleRoll = () => {
        if (isGameComplete || isRolling) return;
        setIsRolling(true);
    };

    const handleRollComplete = (value: number) => {
        setRolls(prev => {
            const newRolls = [...prev];
            newRolls[currentRollIndex] = value;
            return newRolls;
        });
        setCurrentRollIndex(prev => prev + 1);
        setIsRolling(false);
    }

    const handleReset = () => {
        setRolls([null, null, null]);
        setCurrentRollIndex(0);
    };

    const luckScore = useMemo(() => {
        if (!isGameComplete) return null;
        const total = rolls.reduce((sum, roll) => sum + (roll || 0), 0);
        if (total <= 6) return 'low';
        if (total <= 12) return 'medium';
        return 'high';
    }, [rolls, isGameComplete]);

    const renderLuckActions = () => {
        if (!luckScore) return null;
        
        const actions = {
            low: { label: "Need Help?", icon: HelpCircle, variant: 'secondary' as const, href: '/learning-center' },
            medium: { label: "Play a Challenge", icon: Gamepad2, variant: 'outline' as const, href: '/pool-shot' },
            high: { label: "Go to Brainshots!", icon: BrainCircuit, variant: 'default' as const, href: '/brainshots' },
        };
        
        const luckyAction = actions[luckScore];

        return (
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <Button size="lg" variant={luckyAction.variant} asChild>
                    <Link href={luckyAction.href}>
                        <luckyAction.icon className="mr-2" /> {luckyAction.label}
                    </Link>
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
            <CardContent className="flex flex-col items-center justify-center h-full">
                <div className="flex justify-center items-center gap-4 my-6">
                    {rolls.map((rollValue, i) => (
                        <Dice 
                            key={i}
                            isRolling={isRolling && currentRollIndex === i}
                            value={rollValue}
                            onRollComplete={handleRollComplete}
                        />
                    ))}
                </div>

                {isGameComplete ? (
                    <div className="mt-4">
                        <p className="text-lg font-semibold">Your luck score is <span className={cn(luckScore === 'high' && 'text-primary', luckScore === 'low' && 'text-destructive')}>{luckScore?.toUpperCase()}</span>!</p>
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
