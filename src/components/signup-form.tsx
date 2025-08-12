
"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/lib/auth";
import { useState, useRef } from "react";

export function SignUpForm() {
    const { completeSignup } = useAuth();
    const [luckyNumber, setLuckyNumber] = useState(['', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleLuckyNumberChange = (index: number, value: string) => {
        const newLuckyNumber = [...luckyNumber];
        // Allow only single digits
        newLuckyNumber[index] = value.replace(/\D/g, '').slice(0, 1);
        setLuckyNumber(newLuckyNumber);

        // Move to next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !luckyNumber[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    const finalLuckyNumber = luckyNumber.join('');
    const isFormValid = finalLuckyNumber.length === 4;

    const handleSubmit = () => {
        if (isFormValid) {
            completeSignup(finalLuckyNumber);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">One Last Step!</CardTitle>
                    <CardDescription>Create your simple, secure identity on Luckshots.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="lucky-number-0">Your 4-Digit Lucky Number</Label>
                        <div className="flex justify-center gap-2">
                            {luckyNumber.map((digit, index) => (
                                <Input
                                    key={index}
                                    id={`lucky-number-${index}`}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleLuckyNumberChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-16 h-16 text-center text-2xl font-bold"
                                />
                            ))}
                        </div>
                         <p className="text-xs text-center text-muted-foreground pt-2">This number should mean something to your luck. It must be unique.</p>
                         <p className="text-xs text-center text-muted-foreground">An account requires a wallet or WhatsApp connection to be active.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button size="lg" className="w-full" disabled={!isFormValid} onClick={handleSubmit}>
                        Start Playing
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
