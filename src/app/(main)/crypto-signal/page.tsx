
"use client";

import { CryptoSignalGame } from "@/components/crypto-signal-game";
import { Bitcoin } from "lucide-react";

export default function CryptoSignalPage() {

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-3">
          <Bitcoin className="text-yellow-500"/> Crypto Signal
        </h1>
        <p className="mt-2 text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          The price of Bitcoin is chaos. Can you predict its next move in 3 minutes? Closest guess to the price and the right direction (up or down) wins the prize!
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <CryptoSignalGame />
      </div>
    </div>
  );
}
