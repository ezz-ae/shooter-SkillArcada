
"use client";

import { DiceGame } from "@/components/dice-game";

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
            <DiceGame />
        </div>
    );
}
