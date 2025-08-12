
"use client";

import { ProductCard } from "@/components/product-card";
import { mockProducts } from "@/lib/products";

export default function Home() {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Find Your Fortune
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Snag incredible deals with our lightning-fast discounts. Time it right, lock it in.
        </p>
      </div>

      <section
        id="products"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
