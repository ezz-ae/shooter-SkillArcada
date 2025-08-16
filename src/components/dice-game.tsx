
"use client";

import { useState } from "react";
import { Dice } from "./dice";
import { Button } from "./ui/button";
import { ArrowRight, BrainCircuit, Dices, Swords, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type GameState = 'initial' | 'rolling' | 'result';
type ResultCategory = 'Target Shots' | 'Brainshots' | 'Challenges';

export function DiceGame() {
    const [gameState, setGameState] = useState<GameState>('initial');
    const [diceValues, setDiceValues] = useState([1, 1, 1]);
    const [result, setResult] = useState<{category: ResultCategory, message: string, advice: string} | null>(null);

    const rollDice = () => {
        setGameState('rolling');

        setTimeout(() => {
            const newValues = [
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
            ];
            setDiceValues(newValues);
            const total = newValues.reduce((a, b) => a + b, 0);

            if (total <= 6) {
                setResult({
                    category: 'Brainshots',
                    message: "Your mind is sharp today!",
                    advice: "My grandma used to say, 'a keen eye finds the best path.' Your focus is on point. Tackle a puzzle, a riddle. Your reward is waiting for your cleverness."
                });
            } else if (total <= 12) {
                setResult({
                    category: 'Target Shots',
                    message: "Your timing is on point!",
                    advice: "The dice are whispering your name. Today is about timing and intuition. Feel the rhythm, watch the prices, and take your shot. Fortune favors the bold!"
                });
            } else {
                 setResult({
                    category: 'Challenges',
                    message: "You're ready for a real challenge!",
                    advice: "'A steady hand wins the game,' my grandma always said. Your skill is peaking. It's time to go head-to-head. Find an opponent and claim your victory."
                });
            }

            setGameState('result');
        }, 1500); // Roll animation duration
    }

    const resetGame = () => {
        setGameState('initial');
        setResult(null);
    }
    
    const getResultContent = () => {
        if (!result) return null;

        const content = {
            'Target Shots': { icon: Dices, href: '/target-shots', buttonText: "Go to Target Shots" },
            'Brainshots': { icon: BrainCircuit, href: '/puzzle-games', buttonText: "Go to Brainshots" },
            'Challenges': { icon: Swords, href: '/pool-shot', buttonText: "Go to Challenges" }
        }
        const { icon: Icon, href, buttonText } = content[result.category];

        return (
            <div className="text-center space-y-4 max-w-lg mx-auto">
                 <Icon className="h-12 w-12 mx-auto text-primary" />
                 <h2 className="text-3xl font-bold">{result.message}</h2>
                 <p className="text-muted-foreground text-lg italic">"{result.advice}"</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" variant="outline" onClick={resetGame}>Try Again</Button>
                     <Button size="lg" asChild className="moving-gradient text-primary-foreground">
                        <Link href={href}>
                           {buttonText} <ArrowRight className="ml-2"/>
                        </Link>
                    </Button>
                 </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl text-center px-4">
            {gameState === 'initial' && (
                <div className="animate-in fade-in-50 duration-1000">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60">
                        Master the Shot. Beat the Challenge.
                    </h1>
                     <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                       Skill-based mini games with real-time timing, puzzles, and strategy. Play solo or in rooms, track leaderboards, and learn from the AI Coach.
                    </p>
                    <Button size="lg" className="mt-8 relative overflow-hidden" onClick={rollDice}>
                         <div className="absolute inset-0 moving-gradient opacity-80"></div>
                         <span className="relative">Start a Skill Challenge</span>
                    </Button>
                </div>
            )}

            {(gameState === 'rolling' || gameState === 'result') && (
                 <div className={cn(
                    "flex justify-center gap-4 sm:gap-8 transition-all duration-500",
                     gameState === 'result' ? 'mb-8' : ''
                 )}>
                    <Dice value={diceValues[0]} isRolling={gameState === 'rolling'} />
                    <Dice value={diceValues[1]} isRolling={gameState === 'rolling'} delay={100} />
                    <Dice value={diceValues[2]} isRolling={gameState === 'rolling'} delay={200} />
                </div>
            )}
            
            {gameState === 'result' && (
                <div className="animate-in fade-in-50 duration-1000">
                    {getResultContent()}
                </div>
            )}
        </div>
    )
}
