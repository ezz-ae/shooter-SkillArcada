
"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

interface LuckCardProps {
    card: {
        title: string;
        icon: LucideIcon;
        description: string;
        advice: string;
    };
    isFlipped: boolean;
    onRestart: () => void;
}

export function LuckCard({ card, isFlipped, onRestart }: LuckCardProps) {
  const { title, icon: Icon, description, advice } = card;

  return (
    <div className="w-full max-w-sm h-96 perspective-1000">
      <div
        className={cn(
          "relative w-full h-full text-center transition-transform duration-700 transform-style-3d",
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        )}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full bg-secondary rounded-2xl border-2 border-primary/20 shadow-2xl flex flex-col items-center justify-center p-8 [backface-visibility:hidden]">
            <h2 className="text-3xl font-black tracking-tight lg:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60">
                Your Luck Awaits...
            </h2>
            <p className="text-muted-foreground mt-2">The dice have spoken. Your card is ready.</p>
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full bg-card rounded-2xl border-2 border-primary/30 shadow-2xl flex flex-col items-center justify-between p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <div className="flex flex-col items-center gap-4">
                <Icon className="h-16 w-16 text-primary" />
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="w-full">
                <blockquote className="border-l-4 border-accent pl-4 text-sm text-left italic mb-6">
                    {advice}
                </blockquote>
                <Button onClick={onRestart} className="w-full">
                    Roll Again
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
