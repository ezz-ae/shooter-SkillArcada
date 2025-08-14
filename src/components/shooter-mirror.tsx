
"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Bot, Check, User, Sparkles } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { mockProducts } from "@/lib/products";

const GRID_SIZE = 5;
const PATTERN_LENGTH = 6;

const generatePattern = () => {
  const newPattern = new Set<number>();
  while (newPattern.size < PATTERN_LENGTH) {
    newPattern.add(Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
  }
  return Array.from(newPattern);
};

const Grid = ({
  pattern,
  onNodeClick,
  isPlayer,
  isRevealed,
}: {
  pattern: number[];
  onNodeClick?: (index: number) => void;
  isPlayer?: boolean;
  isRevealed?: boolean;
}) => {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
        const isActive = pattern.includes(i);
        return (
          <div
            key={i}
            onClick={() => onNodeClick?.(i)}
            className={cn(
              "aspect-square rounded-md transition-all duration-300",
              isPlayer
                ? "bg-secondary cursor-pointer hover:bg-secondary/80"
                : "bg-secondary",
              isActive && isRevealed && "bg-primary scale-110",
              isActive && isPlayer && "bg-accent scale-110"
            )}
          />
        );
      })}
    </div>
  );
};

export function ShooterMirror() {
  const [shooterPattern, setShooterPattern] = useState<number[]>([]);
  const [playerPattern, setPlayerPattern] = useState<number[]>([]);
  const [isRevealing, setIsRevealing] = useState(true);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const { addShots, spendShot, addToVault } = useStore();
  const { toast } = useToast();

  const mirrorProduct = mockProducts.find(p => p.game === 'mirror-game');

  const startNewGame = () => {
    if (!spendShot(1)) {
        toast({
            variant: "destructive",
            title: "Not enough Shots!",
            description: "You need 1 Shot to play."
        });
        return;
    }
    setShooterPattern(generatePattern());
    setPlayerPattern([]);
    setIsGameWon(false);
    setIsRevealing(true);
    setIsGameActive(true);

    setTimeout(() => {
      setIsRevealing(false);
    }, 2000); // Reveal for 2 seconds
  };

  const handlePlayerClick = (index: number) => {
    if (isRevealing || isGameWon || !isGameActive) return;

    setPlayerPattern((prev) => {
      const newPattern = new Set(prev);
      if (newPattern.has(index)) {
        newPattern.delete(index);
      } else {
        newPattern.add(index);
      }
      return Array.from(newPattern);
    });
  };

  const handleSubmit = () => {
    const sortedShooter = [...shooterPattern].sort((a, b) => a - b);
    const sortedPlayer = [...playerPattern].sort((a, b) => a - b);

    if (JSON.stringify(sortedShooter) === JSON.stringify(sortedPlayer)) {
      setIsGameWon(true);
      addShots(10); // Win 10 shots prize
      if (mirrorProduct) {
        addToVault({ ...mirrorProduct, pricePaid: 0, purchaseTimestamp: Date.now() });
      }
      toast({
        title: "Perfect Reflection!",
        description: `You won 10 Shots and the ${mirrorProduct?.name}!`,
      });
    } else {
      setIsGameWon(false);
      toast({
        variant: "destructive",
        title: "Not quite a mirror image.",
        description: "The patterns didn't match. Try again!",
      });
    }
    setIsResultOpen(true);
    setIsRevealing(true);
    setIsGameActive(false);
  };
  
  const handleDialogClose = () => {
    setIsResultOpen(false);
    if(isGameWon) {
        setShooterPattern([]);
        setPlayerPattern([]);
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl p-4">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="text-primary" /> Shooter's Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Grid pattern={shooterPattern} isRevealed={isRevealing} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="text-accent" /> Your Reflection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Grid
                pattern={playerPattern}
                onNodeClick={handlePlayerClick}
                isPlayer
                isRevealed
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col items-center justify-center text-center space-y-6">
            <Sparkles className="h-16 w-16 text-primary animate-pulse" />
            <p className="text-muted-foreground">
                When you're ready, start the game. Shooter's pattern will reveal itself for a moment. Recreate the exact same pattern on your grid to win.
            </p>
          {!isGameActive ? (
            <Button size="lg" onClick={startNewGame}>
              Play for 1 Shot <ArrowRight className="ml-2" />
            </Button>
          ) : (
            <Button size="lg" onClick={handleSubmit} disabled={isRevealing || playerPattern.length !== PATTERN_LENGTH}>
                {isRevealing ? "Memorize..." : "Submit Reflection"}
            </Button>
          )}
        </div>
      </div>
      <AlertDialog open={isResultOpen} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              {isGameWon ? "A Perfect Match!" : "Reflection Imperfect"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center pt-2">
                {isGameWon 
                    ? "Your focus is sharp. You've won 10 Shots and a prize has been added to your Vault!"
                    : "The pattern was not an exact match. A true master must have perfect recall. Feel free to try again."
                }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogClose}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
