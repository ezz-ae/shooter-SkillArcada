
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
import {
  ChartContainer,
} from "@/components/ui/chart";
import { Area, AreaChart } from "recharts";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [priceHistory, setPriceHistory] = useState([
    { time: 0, price: product.marketPrice },
    { time: 1, price: product.marketPrice },
  ]);
  const [priceTrend, setPriceTrend] = useState<"up" | "down" | "stale">(
    "stale"
  );
  const [isPending, startTransition] = useTransition();
  const [flashKey, setFlashKey] = useState(0);
  const { addToVault } = useStore();
  const { toast } = useToast();

  const currentPrice = priceHistory.at(-1)?.price ?? product.marketPrice;

  useEffect(() => {
    const updateInterval = 5000 + Math.random() * 2000; 

    const interval = setInterval(() => {
      startTransition(async () => {
        try {
          const newPriceData = await fetchUpdatedPrice({
            currentPrice: currentPrice,
          });
          const newPrice = newPriceData.newPrice;

          setPriceTrend(
            newPrice > currentPrice
              ? "up"
              : newPrice < currentPrice
              ? "down"
              : "stale"
          );
          setFlashKey(prev => prev + 1);

          setPriceHistory((prev) => {
            const newHistory = [
              ...prev,
              { time: prev.length, price: newPrice },
            ];
            if (newHistory.length > 15) {
              return newHistory.slice(newHistory.length - 15);
            }
            return newHistory;
          });
        } catch (error) {
          console.error("Failed to update price for", product.name);
        }
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [currentPrice, product.name]);

  const handleBuy = () => {
    addToVault({
      ...product,
      pricePaid: currentPrice,
      purchaseTimestamp: Date.now(),
    });
    toast({
      title: "Item Vaulted!",
      description: `${product.name} has been added to your vault.`,
    });
  };

  const priceColor =
    priceTrend === "up"
      ? "text-green-500"
      : priceTrend === "down"
      ? "text-destructive"
      : "text-primary";
  
  const flashClass = priceTrend === 'up' ? 'flash-green' : priceTrend === 'down' ? 'flash-red' : '';

  return (
    <Card 
      key={flashKey}
      className={cn(
        "flex flex-col overflow-hidden shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:ring-2 hover:ring-primary/50",
        flashClass
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
              <p className="text-sm text-muted-foreground">Current Price</p>
               <div className="flex items-baseline gap-2">
                 <div
                  className={cn(
                    "text-3xl font-black transition-colors duration-300",
                    priceColor
                  )}
                >
                  {`$${currentPrice.toFixed(2)}`}
                </div>
                <div className="flex items-center transition-opacity duration-500">
                  {isPending && priceHistory.length > 1 && (
                    <Hourglass className="h-5 w-5 animate-spin" />
                  )}
                  {!isPending && priceTrend === "up" && (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  )}
                  {!isPending && priceTrend === "down" && (
                    <TrendingDown className="h-5 w-5 text-destructive" />
                  )}
                </div>
              </div>
            </div>
            <div className="h-10 w-24">
               <ChartContainer
                config={{}}
                className="h-full w-full"
              >
                <AreaChart
                  accessibilityLayer
                  data={priceHistory}
                  margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillGreenCard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="fillRedCard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="price"
                    type="natural"
                    fill={priceTrend === "down" ? "url(#fillRedCard)" : "url(#fillGreenCard)"}
                    fillOpacity={0.4}
                    stroke={priceTrend === "down" ? "hsl(var(--destructive))" : "hsl(var(--chart-1))"}
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleBuy}
          disabled={isPending && priceHistory.length <= 1}
        >
          Buy & Vault It!
        </Button>
      </CardFooter>
    </Card>
  );
}
