
"use client";

import { HitOrMissGame } from "@/components/hit-or-miss-game";
import { Target } from "lucide-react";

export default function HitOrMissPage() {
  return (
    <div className="w-full py-12 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-3">
          <Target className="text-primary" /> Hit or Miss
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          A fast-paced, high-stakes game of chance. Stop the spinning reels on the perfect product and price combination to win big. Will you hit or miss?
        </p>
      </div>
      <HitOrMissGame />
    </div>
  );
}
