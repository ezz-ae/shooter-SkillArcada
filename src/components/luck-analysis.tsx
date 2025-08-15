
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { generateLuckAnalysis, LuckAnalysisOutput } from "@/ai/flows/luck-analysis-flow";
import { Loader, Sparkles, ArrowLeft, Heart, Wand, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LuckAnalysisProps {
    onBack: () => void;
}

type ReadingState = 'initial' | 'loading' | 'result';
type Preference = 'Love' | 'Money' | 'Adventure';

export function LuckAnalysis({ onBack }: LuckAnalysisProps) {
    const [readingState, setReadingState] = useState<ReadingState>('initial');
    const [result, setResult] = useState<LuckAnalysisOutput | null>(null);
    const { toast } = useToast();

    const handleGetReading = async (preference: Preference) => {
        setReadingState('loading');
        setResult(null);

        try {
            const response = await generateLuckAnalysis({ preference });
            setResult(response);
            setReadingState('result');
        } catch (error) {
            console.error("Luck analysis failed:", error);
            toast({
                variant: "destructive",
                title: "Analysis Failed",
                description: "Shooter couldn't generate a reading right now. Please try again."
            });
            setReadingState('initial');
        }
    }

    const preferences = [
        { name: 'Love', icon: Heart },
        { name: 'Money', icon: DollarSign },
        { name: 'Adventure', icon: Wand },
    ];
    
    if (readingState === 'loading') {
        return (
            <div className="text-center">
                <Loader className="h-12 w-12 animate-spin mx-auto text-primary"/>
                <p className="mt-4 text-muted-foreground">Shooter is consulting the cards...</p>
            </div>
        )
    }

    if (readingState === 'result' && result) {
        return (
            <div className="w-full max-w-lg mx-auto animate-in fade-in-50 duration-1000">
                <Card className="shadow-2xl border-accent/20">
                     <CardHeader className="text-center">
                        <Sparkles className="h-12 w-12 mx-auto text-accent"/>
                        <CardTitle className="text-3xl font-bold">Your Luck Reading</CardTitle>
                        <CardDescription>A message from Shooter, just for you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                             <p className="text-sm text-muted-foreground">Your Lucky Symbol</p>
                            <p className="text-2xl font-bold text-primary">{result.luckySymbol}</p>
                        </div>
                        <div className="space-y-4 text-center border-t pt-4">
                            <div>
                                <h4 className="font-semibold text-lg">The Past</h4>
                                <p className="text-muted-foreground">{result.past}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg">The Present</h4>
                                <p className="text-muted-foreground">{result.present}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg">The Future</h4>
                                <p className="text-muted-foreground">{result.future}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="ghost" onClick={onBack} className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4"/> Back to Dice
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }
    
    return (
        <div className="w-full max-w-lg text-center animate-in fade-in-50 duration-1000">
             <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4"/> Back to Dice
            </Button>
            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                What do you seek?
            </h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                My grandma said, "to find your luck, you must first know what you're looking for." Choose a path, and I'll give you a reading.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {preferences.map(({name, icon: Icon}) => (
                    <Button key={name} size="lg" variant="outline" className="h-24 flex-col gap-2" onClick={() => handleGetReading(name as Preference)}>
                        <Icon className="h-8 w-8 text-primary"/>
                        <span className="text-lg font-semibold">{name}</span>
                    </Button>
                ))}
            </div>
        </div>
    )
}
