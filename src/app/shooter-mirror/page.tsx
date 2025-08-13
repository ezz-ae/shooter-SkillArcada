
"use client";

import { ShooterMirror } from "@/components/shooter-mirror";

export default function ShooterMirrorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
          Shooter's Mirror
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Shooter creates a pattern. You mirror it. A simple test of focus and
          precision. Can you match the master?
        </p>
      </div>

      <ShooterMirror />
    </div>
  );
}
