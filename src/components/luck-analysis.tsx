
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { generateLuckAnalysis, LuckAnalysisOutput } from "@/ai/flows/luck-analysis-flow";
import { Brain, Loader, Sparkles, Wand2, Heart, DollarSign, Rocket } from "lucide-react";
import { useNotificationStore } from "@/lib/notification-store";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useTypewriter } from "@/hooks/use-typewriter";

type LuckPreference = 'Money' | 'Love' | 'Adventure';

const skillIcons = {
    'Money': DollarSign,
    'Love': Heart,
    'Adventure': Rocket,
}

const ResultCard = ({ title, text, symbol }: { title: string; text: string; symbol?: string }) => {
    const displayText = useTypewriter(text, 20);
    return (
        <Card className="bg-secondary/50 flex-1">
            <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                    {title}
                    {symbol && (
                         <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                            {symbol.substring(0, 1)}
                         </div>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground min-h-[72px]">{displayText}</p>
            </CardContent>
        </Card>
    );
}

export function SkillAnalysis() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<LuckAnalysisOutput | null>(null);
    const [preference, setPreference] = useState<LuckPreference | null>(null);
    const { add: toast } = useNotificationStore();
    const { setLastSkillReading } = useStore();

    const handleGetReading = async (pref: LuckPreference) => {
        setIsLoading(true);
        setPreference(pref);
        setResult(null);

        try { // Assuming generateSkillAnalysis exists or renaming generateLuckAnalysis
            const response = await generateSkillAnalysis({ preference: pref }); // Changed function name
            setResult(response);
            setLastSkillReading({
                title: `${pref} Reading`,
                description: response.future,
                advice: `Your lucky symbol is the ${response.luckySymbol}.`,
            });
        } catch (error) {
            console.error("Luck Analysis failed:", error);
            toast({
                variant: "destructive",
                title: "Reading Failed",
                description: "Shooter couldn't divine your skill reading right now. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                 <div className="text-center p-8 space-y-4">
                    <Loader className="h-12 w-12 mx-auto animate-spin text-primary"/>
                    <p className="text-muted-foreground">Shooter is consulting the cards for your <span className="font-bold text-accent">{preference}</span> skill reading...</p>
                 </div>
            );
        }

        if (result) {
            return (
                <div className="space-y-6 p-4 md:p-6 animate-in fade-in-50">
                    <div className="flex flex-col md:flex-row gap-4">
                        <ResultCard title="The Past" text={result.past} />
                        <ResultCard title="The Present" text={result.present} />
                        <ResultCard title="The Future" text={result.future} />
                    </div>
                     <p className="text-center text-lg">Your lucky symbol today is the <strong className="text-accent">{result.luckySymbol}</strong>.</p> {/* Keeping lucky symbol for now, could be renamed to skill symbol */}
                     <Button onClick={() => setResult(null)} className="w-full">Get a New Reading</Button>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 md:p-8">
                {(Object.keys(skillIcons) as LuckPreference[]).map(pref => { // Changed luckIcons to skillIcons
                    const Icon = skillIcons[pref];
                    return (
                        <Button 
                            key={pref} 
                            onClick={() => handleGetReading(pref)} 
                            variant="outline"
                            className="h-24 text-xl flex-col gap-2"
                        >
                            <Icon className="h-8 w-8"/>
                            {pref}
                        </Button>
                    )
                })}
            </div>
        );
    }


    return (
        <Card className="shadow-2xl border-primary/20 border-2 overflow-hidden bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <Brain className="mx-auto h-12 w-12 text-primary"/> {/* Changed icon */}
                <CardTitle className="text-3xl font-black text-center">Shooter's Luck Cards</CardTitle>
                <CardDescription className="text-lg text-center mt-1">
                    My grandma used to say, "a little guidance goes a long way." Choose a path, and I'll tell you what the cards see for you today.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
}
