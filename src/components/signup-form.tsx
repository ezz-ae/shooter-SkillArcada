
"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

export function SignUpForm() {
    const { completeSignup } = useAuth();
    const [luckyNumber, setLuckyNumber] = useState("");

    const handleLuckyNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        setLuckyNumber(value.slice(0, 4));
    };

    const isFormValid = luckyNumber.length === 4;

    const handleSubmit = () => {
        if (isFormValid) {
            completeSignup(luckyNumber);
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
                        <Label htmlFor="lucky-number">Your 4-Digit Lucky Number</Label>
                        <Input 
                            id="lucky-number" 
                            placeholder="e.g. 1234" 
                            type="text" 
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={luckyNumber}
                            onChange={handleLuckyNumberChange}
                        />
                         <p className="text-xs text-muted-foreground">This will be your unique account number.</p>
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
