"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface DiceProps {
    value: number;
    isRolling: boolean;
    delay?: number;
}

const dotPositions = [
    [], // 0
    [[50, 50]], // 1
    [[25, 25], [75, 75]], // 2
    [[25, 25], [50, 50], [75, 75]], // 3
    [[25, 25], [25, 75], [75, 25], [75, 75]], // 4
    [[25, 25], [25, 75], [75, 25], [75, 75], [50, 50]], // 5
    [[25, 25], [25, 75], [75, 25], [75, 75], [50, 25], [50, 75]], // 6
];

export function Dice({ value, isRolling, delay = 0 }: DiceProps) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        if (isRolling) {
            const rollInterval = setInterval(() => {
                setDisplayValue(Math.floor(Math.random() * 6) + 1);
            }, 100);

            setTimeout(() => {
                clearInterval(rollInterval);
                setDisplayValue(value);
            }, 1000 + delay);

            return () => clearInterval(rollInterval);
        }
    }, [isRolling, value, delay]);

    return (
        <div className={cn(
            "aspect-square w-20 sm:w-32 rounded-lg bg-card border-2 shadow-lg flex items-center justify-center relative transition-transform duration-500"
        )}>
           {dotPositions[displayValue].map(([top, left], i) => (
                <div 
                    key={i} 
                    className="absolute w-4 h-4 sm:w-6 sm:h-6 bg-primary rounded-full"
                    style={{
                        top: `${top}%`,
                        left: `${left}%`,
                        transform: `translate(-50%, -50%)`
                    }}
                />
           ))}
        </div>
    )
}
