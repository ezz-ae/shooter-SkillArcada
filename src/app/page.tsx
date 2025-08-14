
"use client";

import { FeaturedContent } from "@/components/featured-content";
import { LuckSession } from "@/components/luck-session";

export default function Home() {
  
  return (
    <>
      <div className="w-full flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <LuckSession />
      </div>
      <div className="py-12">
        <FeaturedContent />
      </div>
    </>
  );
}
