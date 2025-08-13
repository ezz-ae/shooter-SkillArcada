
"use client";

import { GameLinkCard } from "@/components/game-link-card";
import { ChallengeAI } from "@/components/challenge-ai";
import { Grid, RectangleHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BoardGamesPage() {
  
  const boardGames = [
    { href: "/siga", label: "Siga", icon: Grid, description: "Classic Filipino strategy game." },
    { href: "/dominoes", label: "Dominoes", icon: RectangleHorizontal, description: "Timeless tile-based fun." },
  ]
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Board Games
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Classic strategy games from around the world.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-4">
          {boardGames.map(game => (
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
