
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Heart, DollarSign, Compass, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateLuckAnalysis, LuckAnalysisOutput } from "@/ai/flows/luck-analysis-flow";
import { useToast } from "@/hooks/use-toast";
import { useTypewriter } from "@/hooks/use-typewriter";

type SessionState = 'intro' | 'preferences' | 'analyzing' | 'reading';
const preferences = [
    { label: "Money", icon: DollarSign },
    { label: "Love", icon: Heart },
    { label: "Adventure", icon: Compass },
]

export function LuckSession() {
    const [sessionState, setSessionState] = useState<SessionState>('intro');
    const [analysis, setAnalysis] = useState<LuckAnalysisOutput | null>(null);
    const { toast } = useToast();

    const pastText = useTypewriter(analysis?.past || "", 20);
    const presentText = useTypewriter(analysis?.present || "", 20);
    const futureText = useTypewriter(analysis?.future || "", 20);

    const handleStart = () => {
        setSessionState('preferences');
    }

    const handleSelectPreference = async (preference: string) => {
        setSessionState('analyzing');
        try {
            const result = await generateLuckAnalysis({ preference });
            setAnalysis(result);
            setSessionState('reading');
        } catch (error) {
            console.error("Luck analysis failed:", error);
            toast({
                variant: "destructive",
                title: "Shooter is Resting",
                description: "Couldn't perform the luck analysis right now. Please try again in a moment."
            });
            setSessionState('preferences');
        }
    }

    const renderContent = () => {
        switch(sessionState) {
            case 'intro':
                return (
                    <div className="text-center animate-in fade-in-50 duration-1000">
                        <h1 className="text-4xl font-black tracking-tight lg:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60">
                            Let Shooter read your luck.
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                           Our resident gamegang mega wants to give you a personalized luck session.
                        </p>
                        <Button size="lg" className="mt-8" onClick={handleStart}>
                            HOW LUCKY AM I <ArrowRight className="ml-2"/>
                        </Button>
                    </div>
                )
            case 'preferences':
                return (
                     <div className="text-center animate-in fade-in-50 duration-1000">
                        <h2 className="text-3xl font-bold tracking-tight lg:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60">
                           What matters most to you now?
                        </h2>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-8">
                            {preferences.map(pref => (
                                <button
                                    key={pref.label}
                                    className="text-2xl font-bold text-muted-foreground hover:text-primary hover:scale-110 transition-transform duration-300 flex items-center gap-2"
                                    onClick={() => handleSelectPreference(pref.label)}
                                >
                                    <pref.icon className="h-6 w-6" />
                                    {pref.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            case 'analyzing':
                return (
                    <div className="text-center animate-in fade-in-50 duration-1000 flex flex-col items-center gap-4">
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                        <p className="text-lg text-muted-foreground">Shooter is consulting the cards...</p>
                    </div>
                )
            case 'reading':
                if (!analysis) return null;
                return (
                    <div className="max-w-4xl w-full animate-in fade-in-50 duration-1000 space-y-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight lg:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60">
                                Shooter's Reading
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="p-4 border-t-2 border-foreground/10">
                                <h3 className="font-bold text-sm text-muted-foreground mb-2">THE PAST</h3>
                                <p className="text-foreground/90 min-h-[6em]">{pastText}</p>
                            </div>
                             <div className="p-4 border-t-2 border-primary scale-105 bg-secondary rounded-lg shadow-lg">
                                 <h3 className="font-bold text-sm text-primary mb-2">THE PRESENT</h3>
                                <p className="text-foreground min-h-[6em]">{presentText}</p>
                            </div>
                            <div className="p-4 border-t-2 border-foreground/10">
                                <h3 className="font-bold text-sm text-muted-foreground mb-2">THE FUTURE</h3>
                                <p className="text-foreground/90 min-h-[6em]">{futureText}</p>
                            </div>
                        </div>
                        <div className="text-center space-y-4 pt-8">
                            <p className="text-muted-foreground">Your lucky symbol is the <span className="font-bold text-primary">{analysis.luckySymbol}</span></p>
                             <Button size="lg" onClick={() => setSessionState('intro')}>
                                Start Over
                            </Button>
                        </div>
                    </div>
                )
            default:
                return <div>Something went wrong.</div>
        }
    }

    return (
        <div className="w-full flex items-center justify-center min-h-[400px]">
           {renderContent()}
        </div>
    )
}
