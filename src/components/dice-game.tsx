
"use client";

import { useState, useMemo } from 'react';
import { Button } from './ui/button';
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
        if (total <= 6) return { label: 'low', color: 'text-destructive' };
        if (total <= 12) return { label: 'medium', color: 'text-yellow-500' };
        return { label: 'high', color: 'text-primary' };
    }, [rolls, isGameComplete]);

    const renderLuckActions = () => {
        if (!luckScore) return null;
        
        const actions = {
            low: { label: "Need Help?", icon: HelpCircle, variant: 'secondary' as const, href: '/learning-center' },
            medium: { label: "Play a Challenge", icon: Gamepad2, variant: 'outline' as const, href: '/pool-shot' },
            high: { label: "Go to Brainshots!", icon: BrainCircuit, variant: 'default' as const, href: '/brainshots' },
        };
        
        const luckyAction = actions[luckScore.label as keyof typeof actions];

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
        <div className="text-center">
            <Dices className="mx-auto h-16 w-16 text-primary animate-pulse"/>
            <h1 className="text-4xl font-black tracking-tight lg:text-5xl mt-4">Is it a lucky day?</h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                Throw the dice 3 times to measure your luck and get a personalized suggestion from Shoter.
            </p>

            <div className="flex justify-center items-center gap-4 sm:gap-8 my-12">
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
                    <p className="text-xl font-semibold">Your luck score is <span className={cn("font-extrabold", luckScore?.color)}>{luckScore?.label.toUpperCase()}</span>!</p>
                   {renderLuckActions()}
                </div>
            ) : (
                <Button size="lg" onClick={handleRoll} disabled={isRolling} className="px-12 py-8 text-xl">
                    <Dices className="mr-2 h-6 w-6" />
                    {isRolling ? 'Rolling...' : `Roll the dice (${rollsLeft} left)`}
                </Button>
            )}
        </div>
    );
}
