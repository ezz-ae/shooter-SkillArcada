
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BrainCircuit, LineChart, Swords, Target } from "lucide-react";

const mockTopGames = [
    { name: 'Pool Shot', winRate: '68%', icon: Swords, color: 'text-green-500' },
    { name: 'Crypto Luck', winRate: '55%', icon: LineChart, color: 'text-yellow-500' },
    { name: 'Brainshots', winRate: '42%', icon: BrainCircuit, color: 'text-blue-500' },
    { name: 'Luckshots', winRate: '25%', icon: Target, color: 'text-purple-500' },
];

export function TopGames() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockTopGames.map(game => (
                        <div key={game.name} className="flex flex-col items-center justify-center p-4 bg-secondary/50 rounded-lg gap-2">
                            <game.icon className={`h-8 w-8 ${game.color}`} />
                            <p className="font-semibold text-center">{game.name}</p>
                            <p className="text-2xl font-black">{game.winRate}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
