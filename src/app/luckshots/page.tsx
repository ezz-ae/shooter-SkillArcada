
"use client";

import { ShotTaker } from "@/components/shot-taker";
import { Product, getProducts } from "@/lib/products";
import { useEffect, useState } from "react";

export default function LuckshotsPage() {
  const [luckshotProducts, setLuckshotProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getProducts();
      setLuckshotProducts(allProducts.filter(p => !p.category || p.category === 'luckshot'));
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Luckshots
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Your shot at a killer discount! Item prices are constantly changing. Watch the charts, feel the luck, and hit the 'Shot' button at the perfect moment to capture a low price.
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
