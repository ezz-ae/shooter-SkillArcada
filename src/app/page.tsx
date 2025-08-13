
"use client";

import { LuckSession } from "@/components/luck-session";

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03]">
           <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <LuckSession />
        </div>
    );
}
