
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
        <p className="mt-2 text-lg text-muted-foreground">
          shot your luck price, all items  in this page are in an ongoing price chaging with killer disscounts up to 99% off. Try to press " shot" for more
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
