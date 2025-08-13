
"use client";

import { ShooterChat } from "@/components/shooter-chat";

export default function ShooterManPage() {
  return (
    <div className="w-full bg-black text-white py-12 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                <ShooterChat />
            </div>
        </div>
    </div>
  );
}
