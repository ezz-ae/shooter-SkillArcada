
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [priceHistory, setPriceHistory] = useState([
    { time: 0, price: product.marketPrice },
  ]);
  const [priceTrend, setPriceTrend] = useState<"up" | "down" | "stale">(
    "stale"
  );
  const [isPending, startTransition] = useTransition();
  const { addToVault } = useStore();
  const { toast } = useToast();

  const currentPrice = priceHistory.at(-1)?.price ?? product.marketPrice;

  useEffect(() => {
    const updateInterval = 5000 + Math.random() * 2000; // Stagger updates to be between 5-7 seconds

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

          setPriceHistory((prev) => {
            const newHistory = [
              ...prev,
              { time: prev.length, price: newPrice },
            ];
            // Keep only the last 15 data points for the sparkline
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

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <Link href={`/product/${product.id}`} className="contents">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={product.dataAiHint}
            />
            <div className="absolute bottom-0 h-20 w-full bg-gradient-to-t from-black/80 to-transparent">
              <ChartContainer
                config={{}}
                className="h-full w-full [&_.recharts-cartesian-axis-tick_text]:hidden"
              >
                <AreaChart
                  accessibilityLayer
                  data={priceHistory}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-2))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillRed" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--destructive))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--destructive))"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="price"
                    type="natural"
                    fill={
                      priceTrend === "down" ? "url(#fillRed)" : "url(#fillGreen)"
                    }
                    fillOpacity={0.4}
                    stroke={
                      priceTrend === "down"
                        ? "hsl(var(--destructive))"
                        : "hsl(var(--chart-2))"
                    }
                    strokeWidth={2}
                    dot={false}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <CardTitle className="mb-2 text-lg font-bold group-hover:underline">
            {product.name}
          </CardTitle>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "text-2xl font-black transition-colors duration-300",
                    priceColor
                  )}
                >
                  {isPending && priceHistory.length <= 1 ? (
                    <Hourglass className="h-6 w-6 animate-spin" />
                  ) : (
                    `$${currentPrice.toFixed(2)}`
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
