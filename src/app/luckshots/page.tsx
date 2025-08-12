
"use client";

import { ShotTaker } from "@/components/shot-taker";
import { mockProducts } from "@/lib/products";

export default function LuckshotsPage() {
  
  const luckshotProducts = mockProducts.filter(p => !p.category || p.category === 'luckshot');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Luckshots
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Prices fluctuate wildly. Pay 1 Luckshot to lock a price. Will you get lucky?
        </p>
      </div>

      <section
        id="products"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {luckshotProducts.map((product) => (
          <div key={product.id}>
            <ShotTaker product={product} />
          </div>
        ))}
      </section>
    </div>
  );
}
