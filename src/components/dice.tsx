
"use client";

import { cn } from "@/lib/utils";

interface DiceProps {
  value: number;
  isRolling: boolean;
  delay?: number;
}

export function Dice({ value, isRolling, delay = 0 }: DiceProps) {
    const dotPatterns: { [key: number]: string } = {
        1: "row-start-2 col-start-2",
        2: "row-start-1 col-start-1;row-start-3 col-start-3",
        3: "row-start-1 col-start-1;row-start-2 col-start-2;row-start-3 col-start-3",
        4: "row-start-1 col-start-1;row-start-1 col-start-3;row-start-3 col-start-1;row-start-3 col-start-3",
        5: "row-start-1 col-start-1;row-start-1 col-start-3;row-start-2 col-start-2;row-start-3 col-start-1;row-start-3 col-start-3",
        6: "row-start-1 col-start-1;row-start-1 col-start-3;row-start-2 col-start-1;row-start-2 col-start-3;row-start-3 col-start-1;row-start-3 col-start-3",
    };

    return (
        <div className={cn(
            "w-20 h-20 md:w-24 md:h-24 bg-card rounded-lg shadow-lg flex items-center justify-center p-2 border-2 border-primary/20",
            isRolling && "animate-spin"
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full">
                {dotPatterns[value]?.split(';').map((style, i) => (
                    <div key={i} className={cn("bg-primary rounded-full", style)}></div>
                ))}
            </div>
        </div>
    );
}
