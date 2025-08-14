
"use client";

import { ShotTaker } from "@/components/shot-taker";
import { Product, getProducts } from "@/lib/products";
import { useEffect, useState } from "react";
import { BrainCircuit, Target } from "lucide-react";

export default function LuckshotsPage() {
  const [shooterGunProducts, setShooterGunProducts] = useState<Product[]>([]);
  const [brainshotProducts, setBrainshotProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getProducts();
      setShooterGunProducts(allProducts.filter(p => !p.category || p.category === 'luckshot'));
      setBrainshotProducts(allProducts.filter(p => p.category === 'brainshot'));
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="mb-12">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-3">
                <Target className="text-primary"/> ShooterGuns
            </h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your shot at a killer discount! Item prices are constantly changing. Watch the charts, feel the luck, and hit the 'Shot' button at the perfect moment to capture a low price.
            </p>
        </div>
        <section
            id="shootergun-products"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
            {shooterGunProducts.map((product) => (
            <div key={product.id}>
                <ShotTaker product={product} />
            </div>
            ))}
        </section>
      </div>
      
      <div>
         <div className="text-center mb-8">
            <h1 className="text-4xl font-black tracking-tight lg:text-5xl flex items-center justify-center gap-3">
                <BrainCircuit className="text-accent"/> Brainshots
            </h1>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Think you're sharp? Solve puzzles, riddles, and skill-based challenges to unlock incredible, fixed-price deals on amazing items.
            </p>
        </div>
        <section
            id="brainshot-products"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
            {brainshotProducts.map((product) => (
            <div key={product.id}>
                <ShotTaker product={product} />
            </div>
            ))}
        </section>
      </div>

    </div>
  );
}
