
"use client";

import { HitOrMissGame } from "@/components/hit-or-miss-game";

export default function HitOrMissPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl shimmer-text">
          Hit or Miss
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          You Hit, You Get! Both the product and the price are always moving.
          Click "Take the Shot" at the perfect moment to capture an amazing item at an unbeatable price.
        </p>
      </div>

      <HitOrMissGame />

    </div>
  );
}
