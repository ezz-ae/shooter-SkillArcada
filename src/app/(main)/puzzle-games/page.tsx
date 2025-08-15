
"use client";

import { GameLinkCard } from "@/components/game-link-card";
import { ChallengeAI } from "@/components/challenge-ai";
import { BrainCircuit, Dices, Grid, RectangleHorizontal, Repeat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PuzzleGamesPage() {
  
  const puzzleGames = [
    { href: "/higher-or-lower", label: "Higher or Lower", icon: Repeat, description: "A multi-step card puzzle." },
    { href: "/shooter-mirror", label: "Shooter's Mirror", icon: BrainCircuit, description: "A test of memory and focus." },
  ]
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Puzzle Games
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Test your wits with these skill-based challenges to win prizes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-4">
          {puzzleGames.map(game => (
            <GameLinkCard
              key={game.href}
              href={game.href}
              icon={game.icon}
              label={game.label}
              description={game.description}
            />
          ))}
        </div>
        <div>
            <ChallengeAI />
        </div>
      </div>
    </div>
  );
}
