
"use client";

import { ShopHunterGame } from "@/components/shop-hunter-game";
import { ShoppingCart } from "lucide-react";

export default function ShopHunterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-3">
            <ShoppingCart className="text-primary"/> Shop Hunter
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose your target product. Take a shot to let our AI generate a unique, one-time discount price just for you. Will you capture the deal?
        </p>
      </div>

      <ShopHunterGame />

    </div>
  );
}
