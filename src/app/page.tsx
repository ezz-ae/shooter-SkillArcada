
"use client";

import { GameLinkCard } from "@/components/game-link-card";
import { BrainCircuit, Dices, Swords, Sparkles } from "lucide-react";

export default function Home() {
  const gameCategories = [
    {
      href: "/luckshots",
      label: "ShooterGuns & Brainshots",
      icon: Dices,
      description: "Test your luck with dynamic pricing or solve puzzles for fixed deals.",
    },
    {
      href: "/pool-shot",
      label: "1-on-1 Pool",
      icon: Swords,
      description: "Challenge other players in head-to-head matches of skill and strategy.",
    },
    {
      href: "/chess",
      label: "1-on-1 Chess",
      icon: BrainCircuit,
      description: "Outsmart your opponent in the ultimate game of wits.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--muted-foreground)/0.2)_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <Sparkles className="h-16 w-16 text-primary animate-pulse mb-4 mx-auto" />
        <h1 className="text-4xl font-black tracking-tight lg:text-6xl">
          Your Shot at Unbelievable Prices
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Welcome to ShooterGun, where timing, luck, and skill can land you
          amazing products. Choose your game and take your shot.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-1 gap-6">
          {gameCategories.map((game) => (
            <GameLinkCard
              key={game.href}
              href={game.href}
              icon={game.icon}
              label={game.label}
              description={game.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
