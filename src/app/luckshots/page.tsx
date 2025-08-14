
"use client";

import { ShotTaker } from "@/components/shot-taker";
import { Product, getProducts } from "@/lib/products";
import { useEffect, useState } from "react";
import { BrainCircuit, Target } from "lucide-react";
import { SectionHeader } from "@/components/section-header";

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
        <SectionHeader 
            icon={Target}
            title="ShooterGuns"
            description="Your shot at a killer discount! Item prices are constantly changing. Watch the charts, feel the luck, and hit the 'Shot' button at the perfect moment to capture a low price."
        />
        <section
            id="shootergun-products"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8"
        >
            {shooterGunProducts.map((product) => (
            <div key={product.id}>
                <ShotTaker product={product} />
            </div>
            ))}
        </section>
      </div>
      
      <div>
         <SectionHeader 
            icon={BrainCircuit}
            title="Brainshots"
            description="Think you're sharp? Solve puzzles, riddles, and skill-based challenges to unlock incredible, fixed-price deals on amazing items."
        />
        <section
            id="brainshot-products"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8"
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
