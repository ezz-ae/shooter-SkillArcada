
"use client";

import { PoolShotGame } from "@/components/pool-shot-game";

export default function PoolShotPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Pool Shot
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Sink the 8-ball to win the prize. The higher the level, the bigger the reward.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <PoolShotGame />
      </div>
    </div>
  );
}
