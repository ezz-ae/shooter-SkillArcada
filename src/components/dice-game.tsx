
"use client";

import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Dices, BrainCircuit, Target, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { Dice } from './dice';
import { Card, CardContent } from './ui/card';

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

    const luckAnalysis = useMemo(() => {
        if (!isGameComplete) return null;
        const total = rolls.reduce((sum, roll) => sum + (roll || 0), 0);
        
        if (total <= 8) return { 
            message: "My grandma used to say, 'You make your own luck!' Your sharp mind is your greatest asset today.",
            actionLabel: "Go to Brainshots!",
            icon: BrainCircuit,
            href: "/luckshots#brainshot-products",
            variant: "default" as const
        };
        if (total <= 14) return { 
            message: "A solid roll! The energy is balanced. A mix of skill and chance is your best bet right now.",
            actionLabel: "Play a Challenge",
            icon: Gamepad2,
            href: "/pool-shot",
            variant: "outline" as const
        };
        return { 
            message: "Let's gooo! The dice are on fire! Today's the day to take a chance and ride that lucky wave.",
            actionLabel: "Try a Luckshot!",
            icon: Target,
            href: "/luckshots",
            variant: "default" as const
        };
    }, [rolls, isGameComplete]);

    const renderLuckActions = () => {
        if (!luckAnalysis) return null;
        
        return (
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <Button size="lg" variant={luckAnalysis.variant} asChild>
                    <Link href={luckAnalysis.href}>
                        <luckAnalysis.icon className="mr-2" /> {luckAnalysis.actionLabel}
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

            {isGameComplete && luckAnalysis ? (
                <div className="mt-4 animate-in fade-in-50 duration-500">
                    <Card className="max-w-2xl mx-auto bg-secondary/50 border-primary/20">
                      <CardContent className="p-6">
                        <p className="text-xl font-semibold text-center italic">"{luckAnalysis.message}"</p>
                      </CardContent>
                    </Card>
                   <div className="mt-6">{renderLuckActions()}</div>
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
