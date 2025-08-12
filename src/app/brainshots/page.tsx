
"use client";

import { ShotTaker } from "@/components/shot-taker";
import { Product, getProducts } from "@/lib/products";
import { useEffect, useState } from "react";

export default function BrainshotsPage() {
  const [brainshotProducts, setBrainshotProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getProducts();
      setBrainshotProducts(allProducts.filter(p => p.category === 'brainshot'));
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Brainshots
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Solve puzzles and challenges to unlock incredible prices.
        </p>
      </div>

      <section
        id="products"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {brainshotProducts.map((product) => (
          <div key={product.id}>
            <ShotTaker product={product} />
          </div>
        ))}
      </section>
    </div>
  );
}
