
"use client";

import { Button } from "@/components/ui/button";
import { User, getUsers } from "@/lib/user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, BrainCircuit, LineChart, Swords, Heart, Dices, Users, DollarSign, FileText, Sparkles, Grid, RectangleHorizontal, Layers } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { DiceGame } from "@/components/dice-game";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoterChat } from "@/components/shoter-chat";

export default function Home() {
    const { initializeAuth, isNewUser, hasAcceptedTerms, acceptTerms, isLoggingIn } = useAuth();
    const [isAgreed, setIsAgreed] = useState(false);
    
    useEffect(() => {
        const unsubscribe = initializeAuth();
        return () => unsubscribe();
    }, [initializeAuth]);

    if (isLoggingIn) {
        return (
             <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <div className="animate-pulse">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-4"></div>
                            <div className="h-8 w-3/4 bg-muted rounded-md mx-auto"></div>
                            <div className="h-4 w-1/2 bg-muted rounded-md mx-auto mt-2"></div>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            <div className="h-4 w-full bg-muted rounded-md"></div>
                            <div className="h-12 w-full bg-muted rounded-md"></div>
                            <div className="h-12 w-full bg-muted rounded-md"></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    
    const showTermsDialog = isNewUser && !hasAcceptedTerms;

    return (
        <div className="container mx-auto px-4 py-8">
            <AlertDialog open={showTermsDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <FileText className="text-primary"/>
                    Please verify the following
                  </AlertDialogTitle>
                  <AlertDialogDescription className="pt-4 text-left">
                    Our games involve real value. Before playing, please confirm the following points. You can review our full terms anytime.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex items-start space-x-3 rounded-md border p-4">
                    <Checkbox id="terms" checked={isAgreed} onCheckedChange={(checked) => setIsAgreed(checked as boolean)} />
                    <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I am over 18, I understand the risks of loss/win, and I assure you this money is my own.
                    </label>
                </div>
                 <div className="text-sm text-muted-foreground">
                    By clicking accept, you also agree to our full{' '}
                    <Link href="/terms" target="_blank" className="underline hover:text-primary">
                        Terms of Service
                    </Link>.
                 </div>

                <AlertDialogFooter>
                  <AlertDialogAction onClick={acceptTerms} disabled={!isAgreed}>I Understand and Accept</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <div className={cn("space-y-16", showTermsDialog && "blur-sm pointer-events-none")}>
                
                <section className="py-12 md:py-24">
                    <DiceGame />
                </section>
                
                <section>
                    <ShoterChat />
                </section>

            </div>
        </div>
    );
}
