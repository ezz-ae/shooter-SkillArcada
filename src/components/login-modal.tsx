
"use client";

import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "@/lib/auth";

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V9"/>
    </svg>
);

const WhatsAppIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.472 14.382c-.297-.149-.757-.375-1.056-.499-.297-.124-.522-.174-.747.174-.224.349-.86.999-1.041 1.203-.182.203-.364.228-.662.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.468.13-.619.134-.135.297-.349.446-.523.149-.174.198-.298.297-.499.099-.199.05-.374-.025-.523-.075-.149-.662-1.599-.9-2.197-.225-.574-.45-.499-.613-.499-.162 0-.349-.025-.523-.025-.173 0-.447.075-.682.349-.225.274-.865.849-.865 2.059 0 1.21.883 2.39 1.008 2.564.124.174 1.76 2.671 4.278 3.787.599.25 1.08.4 1.44.524.54.174 1.024.149 1.414.099.414-.05.757-.375.882-.724.124-.349.124-.674.075-.824-.05-.149-.225-.224-.473-.374zM12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />
    </svg>
)

export function LoginModal() {
    const { login } = useAuth();
    
    return (
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-12 w-12 text-primary mx-auto mb-4"
                        >
                        <path d="M12 2a10 10 0 1 0 10 10" />
                        <path d="M12 2a10 10 0 1 0 10 10" />
                        <path d="m15 9-6 6" />
                        <path d="M9 9h.01" />
                        <path d="M15 15h.01" />
                    </svg>
                    <CardTitle className="text-3xl">Welcome to Luckshots</CardTitle>
                    <CardDescription>Your shot at unbelievable prices. No lengthy sign-ups. Just play.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-center text-muted-foreground">
                        Connect in seconds to start playing.
                    </p>
                    <Button size="lg" className="w-full" onClick={() => login('wallet')}>
                        <WalletIcon /> Login with Wallet
                    </Button>
                    <Button size="lg" variant="secondary" className="w-full" onClick={() => login('whatsapp')}>
                       <WhatsAppIcon /> Login with WhatsApp
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
