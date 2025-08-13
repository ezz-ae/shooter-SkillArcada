
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { generateChallenge, GenerateChallengeOutput } from "@/ai/flows/challenge-flow";
import { Bot, Loader, TestTube, Gamepad2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function ShooterChat() {
    const [conversation, setConversation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GenerateChallengeOutput | null>(null);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!conversation.trim()) {
            // Pre-populate with a default for demonstration
            setConversation("I'm feeling lucky today and want to try something new!");
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await generateChallenge({ conversation: conversation || "I'm feeling lucky today and want to try something new!" });
            setResult(response);
        } catch (error) {
            console.error("Challenge AI failed:", error);
            toast({
                variant: "destructive",
                title: "Analysis Failed",
                description: "Shooter couldn't generate a challenge right now. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className={cn(
            "w-full bg-black border-2 border-transparent transition-all duration-500",
            isLoading && "border-accent animate-border-pulse"
        )}>
            <CardHeader className="text-center">
                <CardTitle className="text-4xl font-black text-white">SAY HI TO SHOOTER</CardTitle>
                <CardDescription className="text-lg text-white/70 mt-1 max-w-2xl mx-auto">
                    Ask Shooter how to win.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-4 md:px-10">
                 <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="w-full text-lg py-7 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold">
                    {isLoading ? <Loader className="animate-spin" /> : "Ask Shooter"}
                </Button>

                {result && (
                    <div className="space-y-4 pt-6 border-t border-white/20 animate-in fade-in-50 duration-500">
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <h4 className="font-bold flex items-center mb-2 text-lg text-primary">
                                <TestTube className="mr-2 h-5 w-5"/>
                                Your 2-Minute Test (Free)
                            </h4>
                            <p className="text-white/80">{result.testDescription}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <h4 className="font-bold flex items-center mb-2 text-lg text-accent">
                                <Gamepad2 className="mr-2 h-5 w-5"/>
                                Shooter's Suggested Challenge
                            </h4>
                            <p className="text-white/80">{result.suggestedChallenge}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
