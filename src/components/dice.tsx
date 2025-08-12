
"use client";

import { cn } from "@/lib/utils";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Dices, LucideProps } from "lucide-react";
import { useEffect, useState } from "react";

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

interface DiceProps {
    isRolling: boolean;
    value: number | null;
    onRollComplete: (value: number) => void;
    className?: string;
}

export function Dice({ isRolling, value, onRollComplete, className }: DiceProps) {
    const [displayValue, setDisplayValue] = useState<number>(value || 1);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isRolling) {
            setIsAnimating(true);
            let rollCount = 0;
            const rollInterval = setInterval(() => {
                setDisplayValue(Math.floor(Math.random() * 6) + 1);
                rollCount++;
                if (rollCount > 10) { // Roll for a short duration
                    clearInterval(rollInterval);
                    const finalValue = Math.floor(Math.random() * 6) + 1;
                    onRollComplete(finalValue);
                    setDisplayValue(finalValue);
                    
                    setTimeout(() => setIsAnimating(false), 500); // let settle animation finish
                }
            }, 100);

            return () => clearInterval(rollInterval);
        }
    }, [isRolling, onRollComplete]);
    
    useEffect(() => {
        if(value !== null) {
            setDisplayValue(value);
        }
    }, [value])

    const DieIcon = diceIcons[displayValue - 1] || Dices;
    
    return (
        <div className={cn("flex items-center justify-center", className)}>
             <div className={cn(
                "h-24 w-24 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
                value ? "bg-primary/10 border-primary" : "bg-muted border-dashed",
             )}>
                <DieIcon className={cn(
                    "transition-all duration-300",
                    isAnimating ? "animate-tumble" : "text-primary",
                    "h-16 w-16"
                )} />
            </div>
        </div>
    )
}
