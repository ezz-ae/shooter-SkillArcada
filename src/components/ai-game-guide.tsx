"use client";

import { useState } from "react";
import { Bot, Loader, Send, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { askGameGuide } from "@/ai/flows/game-guide-flow";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface AIGameGuideProps {
    gameName: string;
    gameDescription: string;
    expertSystem: string;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AIGameGuide({ gameName, gameDescription, expertSystem }: AIGameGuideProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await askGameGuide({ 
                question: input,
                gameName,
                gameDescription,
                expertSystem
            });
            const assistantMessage: Message = { role: 'assistant', content: response.response };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error("AI guide failed:", error);
            const errorMessage: Message = { role: 'assistant', content: "Sorry, I'm having a little trouble right now. Please try again in a moment." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-96 bg-secondary/50 rounded-lg p-4">
            <ScrollArea className="flex-grow mb-4 pr-4">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className={cn(
                            "flex items-start gap-3",
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}>
                             {message.role === 'assistant' && (
                                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                    <AvatarFallback><Bot size={20}/></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg",
                                message.role === 'user' 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-background'
                            )}>
                                <p className="text-sm">{message.content}</p>
                            </div>
                             {message.role === 'user' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><User size={20}/></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                     {isLoading && (
                        <div className="flex items-start gap-3 justify-start">
                            <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                <AvatarFallback><Bot size={20}/></AvatarFallback>
                            </Avatar>
                            <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg bg-background flex items-center">
                                <Loader className="animate-spin h-5 w-5" />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask about ${gameName}...`}
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send />
                </Button>
            </form>
        </div>
    );
}
