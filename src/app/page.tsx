"use client";

import { LuckSession } from "@/components/luck-session";
import { Sparkles } from "lucide-react";

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center">
           <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--muted-foreground)/0.2)_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <Sparkles className="h-16 w-16 text-primary animate-pulse mb-4" />
            <h1 className="text-4xl font-black tracking-tight lg:text-6xl">
                Welcome to ShooterGun
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
               My grandma used to say, "luck is what happens when preparation meets opportunity." Let's see what kind of luck you're working with today.
            </p>
            
            <div className="mt-12 w-full max-w-4xl">
              <LuckSession />
            </div>
        </div>
    );
}
