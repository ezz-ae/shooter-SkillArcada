
"use client";

import { useState } from "react";
import { Bot, Loader, Send, User, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { askAdminAgent } from "@/ai/flows/admin-agent-flow";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    suggestion?: string;
}

export function AdminAIAgent() {
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
            const response = await askAdminAgent({ question: input });
            const assistantMessage: Message = { role: 'assistant', content: response.response, suggestion: response.suggestedAction };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error("AI admin agent failed:", error);
            const errorMessage: Message = { role: 'assistant', content: "Sorry, I'm having a little trouble fetching platform data right now. Please try again in a moment." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="text-primary"/> Admin AI Assistant</CardTitle>
                <CardDescription>Ask Shooter for insights, data analysis, or to simulate changes.</CardDescription>
            </CardHeader>
            <CardContent className="h-[60vh] flex flex-col">
                <ScrollArea className="flex-grow mb-4 pr-4">
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground p-8">
                                <p>Examples:</p>
                                <ul className="text-sm list-inside list-disc mt-2">
                                    <li>"What's our total revenue and who is the luckiest user?"</li>
                                    <li>"Suggest a way to increase user engagement."</li>
                                    <li>"Simulate the effect of a 2x prize multiplier for one day."</li>
                                </ul>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div key={index} className={cn(
                                "flex items-start gap-3 w-full",
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                            )}>
                                {message.role === 'assistant' && (
                                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                                        <AvatarFallback><Bot size={20}/></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className="max-w-2xl">
                                    <div className={cn(
                                        "p-4 rounded-lg",
                                        message.role === 'user' 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-secondary'
                                    )}>
                                        <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">{message.content}</ReactMarkdown>
                                    </div>
                                    {message.suggestion && (
                                        <div className="mt-2 p-3 bg-accent/10 border-l-4 border-accent rounded-r-lg">
                                            <p className="font-bold text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent"/> Suggested Action</p>
                                            <p className="text-sm text-muted-foreground">{message.suggestion}</p>
                                        </div>
                                    )}
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
                                <div className="p-3 rounded-lg bg-secondary flex items-center">
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
                        placeholder="Ask Shooter anything about the platform..."
                        disabled={isLoading}
                        className="h-11 text-base"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()} size="lg">
                        <Send />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
