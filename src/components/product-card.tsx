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
  const [discount, setDiscount] = useState(10); // Default discount
  const [price, setPrice] = useState(product.marketPrice * (1 - 10 / 100));
  const [priceTrend, setPriceTrend] = useState<"up" | "down" | "stale">(
    "stale"
  );
  const [isPending, startTransition] = useTransition();
  const { addToVault } = useStore();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch initial price
    startTransition(async () => {
      try {
        const newPriceData = await fetchUpdatedPrice({
          marketPrice: product.marketPrice,
        });
        const newPrice =
          product.marketPrice * (1 - newPriceData.discountPercentage / 100);
        setDiscount(newPriceData.discountPercentage);
        setPrice(newPrice);
      } catch (error) {
        console.error("Failed to fetch initial price for", product.name);
      }
    });

    const updateInterval = 5000 + Math.random() * 2000; // Stagger updates

    const interval = setInterval(() => {
      startTransition(async () => {
        try {
          const newPriceData = await fetchUpdatedPrice({
            marketPrice: product.marketPrice,
          });
          const newPrice =
            product.marketPrice * (1 - newPriceData.discountPercentage / 100);

          if (newPrice > price) setPriceTrend("up");
          else if (newPrice < price) setPriceTrend("down");
          else setPriceTrend("stale");

          setDiscount(newPriceData.discountPercentage);
          setPrice(newPrice);
        } catch (error) {
            console.error("Failed to update price for", product.name);
            // Optional: Show a toast or some indicator that the price couldn't be updated
        }
      });
    }, updateInterval); 

    return () => clearInterval(interval);
  }, [price, product.marketPrice, product.name]);

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
        <p className="text-sm text-muted-foreground">
          Market Price: ${product.marketPrice.toFixed(2)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-black text-primary transition-colors duration-500">
              {isPending && !price ? (
                <Hourglass className="h-6 w-6 animate-spin" />
              ) : (
                `$${price.toFixed(2)}`
              )}
            </div>
            <div className="flex items-center text-sm font-semibold text-accent transition-opacity duration-500">
              <span className="mr-1">{discount.toFixed(0)}% OFF</span>
              {priceTrend === "up" && (
                <TrendingUp className="h-4 w-4 text-destructive" />
              )}
              {priceTrend === "down" && (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleBuy} disabled={isPending && !price}>
          Buy & Vault It!
        </Button>
      </CardFooter>
    </Card>
  );
}
