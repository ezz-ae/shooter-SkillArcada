
"use client";

import { ShotTaker } from "@/components/shot-taker";
import { mockProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

export default function Home() {
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Take Your Best Shot
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Prices fluctuate wildly. Pay $1 to lock a price. Will you get lucky?
        </p>
      </div>

      <section
        id="products"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {mockProducts.map((product, index) => {
            let className = "";
            // Make special games larger, but in a structured way
            if (product.game === 'reel-pause' || product.game === 'multi-shot') {
                className = "lg:col-span-2";
            }

            // Create an interesting masonry layout that is more predictable
            if (!className) {
                switch (index % 7) {
                    case 3:
                    case 6:
                        className = "lg:col-span-2 lg:row-span-1";
                        break;
                }
            }
            
          return (
          <div key={product.id} className={className}>
            <ShotTaker product={product} />
          </div>
        )})}
      </section>
    </div>
  );
}
