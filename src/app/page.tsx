
"use client";

import { ShotTaker } from "@/components/shot-taker";
import { mockProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

export default function Home() {
  const gameProduct = mockProducts.find(p => p.game === 'reel-pause');
  const regularProducts = mockProducts.filter(p => p.game !== 'reel-pause');

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
        {gameProduct && (
          <div className="sm:col-span-2 lg:col-span-2">
             <ShotTaker product={gameProduct} />
          </div>
        )}
        {regularProducts.map((product, index) => {
            let className = "";
            // Let's create a more interesting layout
            switch (index % 6) {
                case 1:
                    className = "lg:col-span-2";
                    break;
                case 3:
                     className = "lg:row-span-2";
                    break;
                case 4:
                    className = "lg:col-span-2";
                    break;
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
