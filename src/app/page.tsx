"use client";

import { LuckSession } from "@/components/luck-session";

export default function Home() {
  
  return (
    <div className="w-full flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background bg-[radial-gradient(hsl(var(--muted-foreground)/0.1)_1px,transparent_1px)] [background-size:16px_16px]">
        <LuckSession />
    </div>
  );
}
