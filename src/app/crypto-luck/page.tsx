
"use client";

import { CryptoLuckGame } from "@/components/crypto-luck-game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CryptoLuckPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Crypto Luck
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Guess the price of Bitcoin in 3 minutes. The closest guess with the correct direction (up or down) wins the prize!
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <CryptoLuckGame />
        </div>

        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-96 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                        <p>Chat is coming soon!</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
