
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { generateChallenge, GenerateChallengeOutput } from "@/ai/flows/challenge-flow";
import { Bot, Loader, TestTube, Gamepad2, Sparkles, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShooterWhisperProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function ShooterWhisper({ isOpen, onOpenChange }: ShooterWhisperProps) {
  const [conversation, setConversation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateChallengeOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!conversation.trim()) {
      toast({
        variant: "destructive",
        title: "Message is empty",
        description: "Please write a message to Shooter."
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
        description: "Shooter couldn't generate a challenge right now. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-center items-center">
                <MessageSquare className="h-10 w-10 text-primary" />
                <DialogTitle className="text-2xl">Whisper to Shooter</DialogTitle>
                <DialogDescription>
                    Tell Shooter what's on your mind. He'll suggest a personalized challenge for you.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                 <Textarea 
                    placeholder="e.g., I'm feeling bored and want to try a puzzle..."
                    value={conversation}
                    onChange={(e) => setConversation(e.target.value)}
                    rows={4}
                    className="text-base"
                />
                <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="w-full">
                    {isLoading ? <Loader className="animate-spin" /> : "Get Suggestion"}
                </Button>

                {result && (
                    <div className="space-y-4 pt-4 border-t">
                        <div className="p-4 bg-secondary/50 rounded-lg">
                            <h4 className="font-bold flex items-center mb-2 text-md">
                                <TestTube className="mr-2 h-5 w-5 text-primary"/>
                                Shooter's Free Test
                            </h4>
                            <p className="text-muted-foreground text-sm">{result.testDescription}</p>
                        </div>
                        <div className="p-4 bg-secondary/50 rounded-lg">
                            <h4 className="font-bold flex items-center mb-2 text-md">
                                <Gamepad2 className="mr-2 h-5 w-5 text-accent"/>
                                Suggested Challenge
                            </h4>
                            <p className="text-muted-foreground text-sm">{result.suggestedChallenge}</p>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    </Dialog>
  );
}
