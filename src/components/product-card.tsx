
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Progress } from "./ui/progress";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [discount, setDiscount] = useState(0);
  const { addToVault } = useStore();
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setDiscount(Math.floor(Math.random() * 99) + 1);
    }, 100 + Math.random() * 200); // Update discount rapidly and randomly

    return () => clearInterval(interval);
  }, []);

  const handleBuy = () => {
    const finalPrice = product.marketPrice * (1 - discount / 100);
    addToVault(
      {
        ...product,
        pricePaid: finalPrice,
        purchaseTimestamp: Date.now(),
      },
      discount
    );
    toast({
      title: `Item Vaulted with a ${discount}% discount!`,
      description: `${product.name} has been added to your vault for $${finalPrice.toFixed(2)}.`,
    });
  };

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:ring-2 hover:ring-primary/50"
      )}
    >
      <Link href={`/product/${product.id}`} className="contents group">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              data-ai-hint={product.dataAiHint}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 space-y-4">
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Market Price</p>
              <div className="flex items-baseline gap-2">
                <div
                  className={cn(
                    "text-3xl font-black transition-colors duration-300"
                  )}
                >
                  {`$${product.marketPrice.toFixed(2)}`}
                </div>
              </div>
            </div>
             <div>
              <p className="text-sm text-muted-foreground text-right">Discount</p>
                <div
                  className={cn(
                    "text-3xl font-black transition-colors duration-300 text-primary"
                  )}
                >
                  {`${discount}%`}
                </div>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full h-12 text-md font-bold relative overflow-hidden"
          onClick={handleBuy}
        >
           <div className="absolute inset-0 w-full h-full">
               <Progress value={discount} className="h-full rounded-md" />
                 <div 
                 className="absolute inset-0 bg-primary/30"
                 style={{
                    clipPath: `polygon(0 0, ${discount}% 0, ${discount}% 100%, 0% 100%)`
                 }}
                />
            </div>
            <span className="z-10 relative flex items-center justify-center">
                Buy &amp; Vault It!
            </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
