"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { generateChallenge, GenerateChallengeOutput } from "@/ai/flows/challenge-flow";
import { Bot, Loader, TestTube, Gamepad2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ChallengeAI() {
    const [conversation, setConversation] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<GenerateChallengeOutput | null>(null);
    const { toast } = useToast();

    const handleTestMe = async () => {
        if (!conversation.trim()) {
            toast({
                variant: "destructive",
                title: "Conversation is empty",
                description: "Please paste a conversation to be analyzed."
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await generateChallenge({ conversation });
            setResult(response);
        } catch (error) {
            console.error("Challenge AI failed:", error);
            toast({
                variant: "destructive",
                title: "Analysis Failed",
                description: "The AI Shoter couldn't generate a challenge right now. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="shadow-2xl border-accent/20 border-2 overflow-hidden">
            <CardHeader>
                <Bot className="mx-auto h-12 w-12 text-accent"/>
                <CardTitle className="text-3xl font-black text-center">AI Challenge Suggester</CardTitle>
                <CardDescription className="text-lg text-center mt-1">
                    Let our AI Shoter analyze a conversation and give you a free, personalized test!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea 
                    placeholder="Paste a conversation here..."
                    value={conversation}
                    onChange={(e) => setConversation(e.target.value)}
                    rows={6}
                    className="text-base"
                />
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
                                Shoter's Suggested Challenge
                            </h4>
                            <p className="text-muted-foreground">{result.suggestedChallenge}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
