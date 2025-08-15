
"use client";

import { ShotTaker } from "@/components/shot-taker";
import { Product, getProducts } from "@/lib/products";
import { useEffect, useState } from "react";
import { Target } from "lucide-react";
import { SectionHeader } from "@/components/section-header";

export default function LuckshotsPage() {
  const [shooterGunProducts, setShooterGunProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const allProducts = await getProducts();
      // This page now only shows luckshot and brainshot type games
      setShooterGunProducts(allProducts.filter(p => p.category === 'luckshot' || p.category === 'brainshot'));
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="mb-12">
        <SectionHeader 
            icon={Target}
            title="ShooterGuns & Brainshots"
            description="Your shot at a killer discount! Item prices are constantly changing, or you may need to solve a puzzle. Watch the charts, feel the luck, and hit the 'Shot' button at the perfect moment to capture a low price."
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
