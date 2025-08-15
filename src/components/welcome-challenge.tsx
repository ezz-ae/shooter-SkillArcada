
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Award, Loader, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function WelcomeChallenge() {
    const [isLoading, setIsLoading] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const { addShots } = useStore();
    const { toast } = useToast();

    const handleFreeShot = () => {
        setIsLoading(true);
        // Simulate AI "thinking" and processing the win
        setTimeout(() => {
            addShots(10);
            setIsLoading(false);
            setIsWon(true);
            toast({
                title: "You Won!",
                description: "10 Shots have been added to your balance. Good luck!",
            });
        }, 2000);
    }

    return (
        <div className="w-full max-w-2xl text-center flex flex-col items-center p-4">
             <h1 className="text-4xl font-black tracking-tight lg:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60">
                Your First Shot is on Shooter.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Win your first 10 Shots for free. No cost, no catch. Just a gift from our resident gamegang mega to get you started.
            </p>

            <div className="mt-8 relative w-full max-w-sm h-80">
                <div className={cn(
                    "absolute inset-0 bg-secondary rounded-2xl transition-all duration-500",
                    isLoading && "scale-105"
                )}>
                    <div className="w-full h-full p-6 flex flex-col items-center justify-center">
                         <div className="relative w-48 h-32">
                             <Image src="/logos/gift-card.png" alt="$100 Voucher" fill className="object-contain drop-shadow-2xl" data-ai-hint="gift card" />
                         </div>
                        <h2 className="text-2xl font-bold mt-4">$100 Voucher</h2>
                        <p className="text-muted-foreground">The prize for this challenge</p>
                    </div>
                </div>
                 {isWon && (
                    <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-primary-foreground p-8 animate-in fade-in-50">
                        <Award className="h-24 w-24" />
                        <h2 className="text-3xl font-black mt-4">You Won 10 Shots!</h2>
                        <p>Welcome to the game.</p>
                    </div>
                )}
            </div>

            <Button size="lg" className="mt-8 h-14 text-lg" onClick={handleFreeShot} disabled={isLoading || isWon}>
                {isLoading ? (
                    <>
                        <Loader className="mr-2 h-5 w-5 animate-spin"/>
                        Taking your shot...
                    </>
                ) : isWon ? (
                    "Welcome to ShooterGun!"
                ) : (
                     <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Take Your Free Shot
                     </>
                )}
            </Button>
        </div>
    );
}
