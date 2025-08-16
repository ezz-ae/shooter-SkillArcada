
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { generateChallenge, GenerateChallengeOutput } from "@/ai/flows/challenge-flow";
import { Bot, Loader, TestTube, Gamepad2 } from "lucide-react";
import { useNotificationStore } from "@/lib/notification-store";

export function ChallengeAI() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GenerateChallengeOutput | null>(null);
    const { add: toast } = useNotificationStore();

    const handleTestMe = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            // Using a default conversation starter to showcase the feature
            const response = await generateChallenge({ conversation: "I'm feeling adventurous today and looking for a real challenge!" });
            setResult(response);
        } catch (error) {
            console.error("Challenge AI failed:", error);
            toast({
                variant: "destructive",
                title: "Analysis Failed",
                description: "The AI Shooter couldn't generate a challenge right now. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="shadow-2xl border-accent/20 border-2 overflow-hidden">
            <CardHeader>
                <Bot className="mx-auto h-12 w-12 text-accent"/>
                <CardTitle className="text-3xl font-black text-center">AI Coach: Suggest a Challenge</CardTitle>
                <CardDescription className="text-lg text-center mt-1">
                    Let our AI Shooter analyze a conversation and give you a free, personalized test!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Button onClick={handleTestMe} disabled={isLoading} size="lg" className="w-full">
                    {isLoading ? <Loader className="animate-spin" /> : "Test Me!"}
                </Button>

                {result && (
                    <div className="space-y-4 pt-4 border-t">
                        <div className="p-4 bg-secondary/50 rounded-lg">
                            <h4 className="font-bold flex items-center mb-2 text-lg">
                                <TestTube className="mr-2 h-5 w-5 text-primary"/>
                                Your 2-Minute Test (Free)
                            </h4>
                            <p className="text-muted-foreground">{result.testDescription}</p>
                        </div>
                        <div className="p-4 bg-secondary/50 rounded-lg">
                            <h4 className="font-bold flex items-center mb-2 text-lg">
                                <Gamepad2 className="mr-2 h-5 w-5 text-accent"/>
                                Shooter's Suggested Challenge
                            </h4>
                            <p className="text-muted-foreground">{result.suggestedChallenge}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
