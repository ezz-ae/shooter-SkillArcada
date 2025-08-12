
"use client";

import { PoolShotGame } from "@/components/pool-shot-game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This is a placeholder page for a specific challenge.
// In a real app, you would fetch challenge details based on the `params.id`.
export default function PoolChallengePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
       <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Challenge Match
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          You vs. The World. Sink the 8-ball to win the prize.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <PoolShotGame />
      </div>

       <div className="w-full max-w-4xl mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Live Chat & Audience</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                        <p>Chat is coming soon!</p>
                    </div>
                </CardContent>
            </Card>
       </div>
    </div>
  );
}
