
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Dices, Heart, Sparkles } from "lucide-react";
import { Dice } from "./dice";
import { LuckCard } from "./luck-card";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

type GameState = 'initial' | 'rolling' | 'result';

const luckCards = [
    {
        title: "The Ace of Shots",
        icon: Dices,
        description: "Fortune favors the bold and the swift.",
        advice: "My grandma used to say, 'a keen eye finds the best path.' Your focus is on point. Tackle a puzzle, a riddle. Your reward is waiting for your cleverness.",
    },
    {
        title: "The Queen of Hearts",
        icon: Heart,
        description: "Luck in love, luck in life.",
        advice: "The dice are whispering your name. Today is about timing and intuition. Feel the rhythm, watch the prices, and take your shot. A great prize is near!",
    },
    {
        title: "The Joker's Wild",
        icon: Sparkles,
        description: "Embrace the chaos, for therein lies opportunity.",
        advice: "'A steady hand wins the game,' my grandma always said. Your skill is peaking. It's time to go head-to-head. Find an opponent and claim your victory.",
    }
];

export function LuckSession() {
    const [gameState, setGameState] = useState<GameState>('initial');
    const [diceValues, setDiceValues] = useState([1, 1, 1]);
    const [resultCardIndex, setResultCardIndex] = useState(0);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const { setLastLuckReading } = useStore();

    const rollDice = () => {
        setGameState('rolling');
        setIsCardFlipped(false);

        // First, show a fast rolling animation
        const quickRollInterval = setInterval(() => {
             setDiceValues([
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
            ]);
        }, 100);

        // After a moment, stop the quick roll and show the final result
        setTimeout(() => {
            clearInterval(quickRollInterval);

            const newValues = [
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
            ];
            const total = newValues.reduce((a, b) => a + b, 0);
            
            let cardIndex = 0;
            if (total <= 6) cardIndex = 0;
            else if (total <= 12) cardIndex = 1;
            else cardIndex = 2;

            setDiceValues(newValues);
            setResultCardIndex(cardIndex);
            setLastLuckReading(luckCards[cardIndex]); // Save to store
            setGameState('result');
            
            // Flip the card after the dice settle
            setTimeout(() => {
                setIsCardFlipped(true);
            }, 500);

        }, 1500); // Total roll animation duration
    }

    const resetGame = () => {
        setGameState('initial');
        setIsCardFlipped(false);
    }
    
    return (
        <div className="w-full max-w-4xl text-center py-12 flex flex-col items-center justify-center min-h-[500px]">
            {gameState === 'initial' && (
                <div className="animate-in fade-in-50 duration-1000">
                    <h1 className="text-4xl font-black tracking-tight lg:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60">
                        Let Shooter Read Your Luck.
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                       Our resident gamegang mega wants to give you a personalized luck session. Roll the dice to draw your card.
                    </p>
                    <Button size="lg" className="mt-8 relative overflow-hidden" onClick={rollDice}>
                         <div className="absolute inset-0 moving-gradient opacity-80"></div>
                         <span className="relative">Roll the Dice</span>
                    </Button>
                </div>
            )}

             {(gameState === 'rolling' || gameState === 'result') && (
                <div className="flex flex-col items-center gap-8">
                     <div className={cn(
                        "flex justify-center gap-4 sm:gap-8 transition-all duration-500",
                        gameState === 'result' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                     )}>
                        <Dice value={diceValues[0]} isRolling={gameState === 'rolling'} />
                        <Dice value={diceValues[1]} isRolling={gameState === 'rolling'} delay={100} />
                        <Dice value={diceValues[2]} isRolling={gameState === 'rolling'} delay={200} />
                    </div>

                    <div className={cn(
                        "transition-all duration-500 delay-300",
                         gameState === 'result' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    )}>
                        <LuckCard 
                            card={luckCards[resultCardIndex]} 
                            isFlipped={isCardFlipped}
                            onRestart={resetGame}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
