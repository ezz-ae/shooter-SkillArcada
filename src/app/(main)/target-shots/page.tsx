
"use client";

import { ShotTaker } from "@/components/shot-taker";
import { Product, getProducts } from "@/lib/products";
import { useEffect, useState } from "react";
import { Target } from "lucide-react";
import { SectionHeader } from "@/components/section-header";

export default function TargetShotsPage() {
  const [shooterGunProducts, setShooterGunProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getProducts();
      // This page shows luckshot, brainshot, and skillshot type games
      setShooterGunProducts(allProducts.filter(p => p.category === 'luckshot' || p.category === 'brainshot' || p.category === 'skillshot'));
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="mb-12">
        <SectionHeader 
            icon={Target}
            title="Target Shots & Brainshots"
            description="Timed price windows and puzzle gates. Hit the button at the perfect moment or solve the challenge to unlock the reward."
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

    </div>
  );
}
