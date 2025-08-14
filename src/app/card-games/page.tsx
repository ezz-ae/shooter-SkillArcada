
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";
import { ArrowDown, ArrowUp, Check, Layers, X } from "lucide-react";
import { cn } from "@/lib/utils";

const cardRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const cardSuits = ['♥', '♦', '♣', '♠'];

const CardFace = ({ rank, suit, isFlipped }: { rank: string, suit: string, isFlipped: boolean }) => {
    const suitColor = (suit === '♥' || suit === '♦') ? 'text-red-500' : 'text-foreground';
    return (
        <div className={cn("relative w-32 h-48 rounded-lg border-2 bg-card shadow-lg transition-transform duration-500", isFlipped && "transform-gpu [transform:rotateY(180deg)]")}>
            {/* Card Back */}
            <div className="absolute inset-0 w-full h-full bg-primary rounded-lg p-2 flex items-center justify-center [backface-visibility:hidden]">
                <Layers className="h-16 w-16 text-primary-foreground/50"/>
            </div>
            {/* Card Front */}
            <div className={cn("absolute inset-0 w-full h-full bg-card rounded-lg flex flex-col justify-between p-2 transform-gpu [transform:rotateY(180deg)] [backface-visibility:hidden]", suitColor)}>
                <div className="text-left text-2xl font-bold">{rank}</div>
                <div className="text-center text-5xl font-bold">{suit}</div>
                <div className="text-right text-2xl font-bold transform rotate-180">{rank}</div>
            </div>
        </div>
    );
};

// Puzzle sequence: Card, Correct Guess
const puzzleSequence: [{rank: number, suit: number}, 'higher' | 'lower'][] = [
    [{ rank: 7, suit: 0 }, 'higher'], // 8 of Hearts -> guess higher
    [{ rank: 11, suit: 2 }, 'lower'], // Queen of Clubs -> guess lower
    [{ rank: 3, suit: 1 }, 'higher'], // 4 of Diamonds -> guess higher
    [{ rank: 9, suit: 3 }, 'lower'], // 10 of Spades -> guess lower
];

export default function CardGamesPage() {
    const { toast } = useToast();
    const { addShots } = useStore();

    const [currentStep, setCurrentStep] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isWon, setIsWon] = useState(false);

    const currentCard = puzzleSequence[currentStep][0];

    const handleGuess = (guess: 'higher' | 'lower') => {
        if (feedback || isWon) return; // Don't allow guesses while feedback is showing or game is won

        const correctGuess = puzzleSequence[currentStep][1];
        
        setIsFlipped(true);

        setTimeout(() => {
            if (guess === correctGuess) {
                setFeedback('correct');
                setTimeout(() => {
                    if (currentStep === puzzleSequence.length - 1) {
                        setIsWon(true);
                        addShots(20);
                         toast({
                            title: "Royal Flush of Wit!",
                            description: "You've solved the puzzle! 20 Shots awarded.",
                        });
                    } else {
                        setCurrentStep(prev => prev + 1);
                        setIsFlipped(false);
                    }
                    setFeedback(null);
                }, 1500);
            } else {
                setFeedback('incorrect');
                 toast({
                    variant: "destructive",
                    title: "Wrong Guess!",
                    description: "The sequence has been reset.",
                });
                setTimeout(() => {
                    setCurrentStep(0);
                    setIsFlipped(false);
                    setFeedback(null);
                }, 1500);
            }
        }, 500);
    };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Higher or Lower
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Guess if the next card is higher or lower to complete the sequence and win a prize.
        </p>
      </div>

      <Card className="w-full max-w-sm text-center p-4">
        <CardHeader>
          <CardTitle>Step {currentStep + 1} of {puzzleSequence.length}</CardTitle>
          <CardDescription>Will the next card be higher or lower than the card shown?</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-56 perspective-1000">
             <CardFace 
                rank={cardRanks[currentCard.rank]} 
                suit={cardSuits[currentCard.suit]} 
                isFlipped={!isFlipped}
            />
        </CardContent>
        <CardFooter className="flex-col gap-4">
            {isWon ? (
                <div className="p-4 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 font-bold flex items-center justify-center gap-2 w-full">
                    <Check /> Puzzle Solved! Prize Awarded.
                </div>
            ) : (
                <>
                <div className="flex justify-center gap-4 w-full">
                    <Button size="lg" onClick={() => handleGuess('higher')} disabled={!!feedback}>
                        <ArrowUp className="mr-2"/> Higher
                    </Button>
                    <Button size="lg" onClick={() => handleGuess('lower')} disabled={!!feedback}>
                        <ArrowDown className="mr-2"/> Lower
                    </Button>
                </div>
                 <div className="h-6 mt-2">
                    {feedback === 'correct' && <Check className="text-green-500 animate-in fade-in" />}
                    {feedback === 'incorrect' && <X className="text-destructive animate-in fade-in" />}
                </div>
                </>
            )}
        </CardFooter>
      </Card>
    </div>
  );
}
