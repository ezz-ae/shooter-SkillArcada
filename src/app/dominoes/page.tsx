
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Check, RectangleHorizontal, Dices } from "lucide-react";
import { useState } from "react";

const DominoPiece = ({ top, bottom, rotation = 0, isSelectable, onClick, isSelected, isPlaced, isCorrect }: { top: number, bottom: number, rotation?: number, isSelectable?: boolean, isSelected?: boolean, isPlaced?: boolean, onClick?: () => void, isCorrect?: boolean }) => {
    const dots = (n: number) => Array.from({ length: n }).map((_, i) => <div key={i} className="w-2 h-2 bg-card-foreground rounded-full" />);

    return (
        <div 
            className={cn(
                "w-12 h-24 bg-card rounded-lg border-2 border-card-foreground/50 flex flex-col items-center justify-around p-1 shadow-md transition-all",
                isSelectable && "cursor-pointer hover:border-primary hover:scale-105",
                isSelected && "border-primary ring-2 ring-primary",
                isPlaced && "absolute transition-all duration-500",
                isCorrect && "animate-pulse border-green-500"
            )}
            style={{ transform: `rotate(${rotation}deg)` }}
            onClick={onClick}
        >
            <div className="w-full h-1/2 flex items-center justify-center p-1"><div className="grid grid-cols-3 gap-0.5 w-8 h-8">{dots(top)}</div></div>
            <div className="w-10 h-px bg-card-foreground/50"></div>
            <div className="w-full h-1/2 flex items-center justify-center p-1"><div className="grid grid-cols-3 gap-0.5 w-8 h-8">{dots(bottom)}</div></div>
        </div>
    )
}


export default function DominoesPage() {
    const { toast } = useToast();
    const { addShots } = useStore();
    const [selectedDomino, setSelectedDomino] = useState<number | null>(null);
    const [isWon, setIsWon] = useState(false);
    
    const correctDominoIndex = 2; // The 5|5 domino

    const handleSelectDomino = (index: number) => {
        if (isWon) return;
        setSelectedDomino(index);
    }
    
    const handlePlaceDomino = () => {
        if (selectedDomino === null) return;
        
        if (selectedDomino === correctDominoIndex) {
            setIsWon(true);
            addShots(25);
            toast({
                title: "Chain Reaction!",
                description: "You found the winning piece! 25 Shots awarded.",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Close!",
                description: "That domino doesn't fit here, but you're thinking on the right track.",
            })
        }
    }
  
    const playerHand = [
        { top: 1, bottom: 2 },
        { top: 3, bottom: 4 },
        { top: 5, bottom: 5 },
        { top: 6, bottom: 1 },
    ]

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-2">
            <Dices /> Dominoes Puzzle
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Find the one domino from your hand that can be placed on both ends of the chain.
        </p>
      </div>

      <Card className="w-full max-w-4xl text-center p-4">
        <CardHeader>
          <CardTitle>The Board</CardTitle>
          <CardDescription>Place the winning tile to continue the chain.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-64 bg-secondary/50 rounded-lg flex items-center justify-center relative p-8">
                {/* Placed dominoes */}
                <DominoPiece top={2} bottom={3} rotation={90} isPlaced style={{ left: '25%', top: '50%', transform: 'translate(-50%, -50%) rotate(90deg)' }}/>
                <DominoPiece top={3} bottom={6} rotation={90} isPlaced style={{ left: '35%', top: '50%', transform: 'translate(-50%, -50%) rotate(90deg)' }}/>
                <DominoPiece top={6} bottom={4} rotation={90} isPlaced style={{ left: '45%', top: '50%', transform: 'translate(-50%, -50%) rotate(90deg)' }}/>
                
                {/* Placeholder for the correct domino */}
                <div 
                    onClick={handlePlaceDomino}
                    className={cn(
                        "w-24 h-12 bg-background/50 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer",
                        isWon && "border-primary"
                    )}
                    style={{ position: 'absolute', left: '58%', top: '50%', transform: 'translate(-50%, -50%)' }}
                >
                    {isWon ? (
                        <DominoPiece top={4} bottom={5} rotation={90} isCorrect />
                    ) : (
                        <span>Place Here</span>
                    )}
                </div>

                <DominoPiece top={5} bottom={1} rotation={90} isPlaced style={{ left: '71%', top: '50%', transform: 'translate(-50%, -50%) rotate(90deg)' }} />
            </div>
        </CardContent>
         <CardHeader>
          <CardTitle>Your Hand</CardTitle>
          <CardDescription>Select a domino to place.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center gap-4">
           {playerHand.map((domino, index) => (
                <DominoPiece 
                    key={index} 
                    top={domino.top} 
                    bottom={domino.bottom} 
                    isSelectable 
                    isSelected={selectedDomino === index}
                    onClick={() => handleSelectDomino(index)}
                />
           ))}
        </CardContent>
        {isWon && (
             <div className="mt-4 p-4 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 font-bold flex items-center justify-center gap-2">
                <Check /> Puzzle Solved! Prize Awarded.
            </div>
        )}
      </Card>
    </div>
  );
}
