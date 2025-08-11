"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/products";
import { fetchUpdatedPrice } from "@/app/actions";
import { TrendingDown, TrendingUp, Hourglass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [price, setPrice] = useState(product.marketPrice);
  const [priceTrend, setPriceTrend] = useState<"up" | "down" | "stale">(
    "stale"
  );
  const [isPending, startTransition] = useTransition();
  const { addToVault } = useStore();
  const { toast } = useToast();

  useEffect(() => {
    const updateInterval = 5000 + Math.random() * 2000; // Stagger updates to be between 5-7 seconds

    const interval = setInterval(() => {
      startTransition(async () => {
        try {
          const newPriceData = await fetchUpdatedPrice({
            currentPrice: price,
          });
          const newPrice = newPriceData.newPrice;

          if (newPrice > price) setPriceTrend("up");
          else if (newPrice < price) setPriceTrend("down");
          else setPriceTrend("stale");

          setPrice(newPrice);
        } catch (error) {
            console.error("Failed to update price for", product.name);
        }
      });
    }, updateInterval); 

    return () => clearInterval(interval);
  }, [price, product.name]);

  const handleBuy = () => {
    addToVault({
      ...product,
      pricePaid: price,
      purchaseTimestamp: Date.now(),
    });
    toast({
      title: "Item Vaulted!",
      description: `${product.name} has been added to your vault.`,
    });
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-lg font-bold">{product.name}</CardTitle>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-primary transition-colors duration-500">
                {isPending && price === product.marketPrice ? (
                  <Hourglass className="h-6 w-6 animate-spin" />
                ) : (
                  `$${price.toFixed(2)}`
                )}
              </div>
              <div className="flex items-center transition-opacity duration-500">
                {priceTrend === "up" && (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                )}
                {priceTrend === "down" && (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </div>
            </div>
             <p className="text-sm text-muted-foreground">Current Price</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleBuy} disabled={isPending && price === product.marketPrice}>
          Buy & Vault It!
        </Button>
      </CardFooter>
    </Card>
  );
}
