
"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { mockProducts, type Product } from "@/lib/products";
import { fetchUpdatedPrice } from "@/app/actions";
import { TrendingDown, TrendingUp, Hourglass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id);
  const [priceHistory, setPriceHistory] = useState(
    product ? [{ time: 0, price: product.marketPrice }] : []
  );
  const [priceTrend, setPriceTrend] = useState<"up" | "down" | "stale">(
    "stale"
  );
  const [isPending, startTransition] = useTransition();
  const { addToVault } = useStore();
  const { toast } = useToast();

  const currentPrice = priceHistory.at(-1)?.price ?? product?.marketPrice ?? 0;

  useEffect(() => {
    if (!product) return;
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
          setPriceHistory((prev) => {
            const newHistory = [
              ...prev,
              { time: prev.length, price: newPrice },
            ];
            // Keep the last 30 data points for the chart
            if (newHistory.length > 30) {
              return newHistory.slice(newHistory.length - 30);
            }
            return newHistory;
          });
        } catch (error) {
          console.error("Failed to update price for", product.name);
        }
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [currentPrice, product]);

  if (!product) {
    notFound();
  }

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
    <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
            <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all products
            </Link>
        </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative h-96 w-full md:h-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="rounded-lg object-cover shadow-lg"
            data-ai-hint={product.dataAiHint}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="mb-2 text-3xl font-bold lg:text-4xl">{product.name}</h1>
          <p className="mb-6 text-muted-foreground">{product.description}</p>
          
          <Card className="mb-6">
            <CardHeader>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <div className="flex items-baseline gap-2">
                     <div
                        className={cn(
                        "text-4xl font-black transition-colors duration-300",
                        priceColor
                        )}
                    >
                        {isPending && priceHistory.length <= 1 ? (
                        <Hourglass className="h-8 w-8 animate-spin" />
                        ) : (
                        `$${currentPrice.toFixed(2)}`
                        )}
                    </div>
                    <div className="flex items-center transition-opacity duration-500">
                        {priceTrend === "up" && (
                        <TrendingUp className="h-6 w-6 text-green-500" />
                        )}
                        {priceTrend === "down" && (
                        <TrendingDown className="h-6 w-6 text-destructive" />
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={{}} className="h-40 w-full">
                    <AreaChart
                        accessibilityLayer
                        data={priceHistory}
                        margin={{ top: 5, right: 20, left: 0, bottom: 0 }}
                    >
                         <defs>
                            <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="fillRed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                         <YAxis domain={['dataMin - (dataMin * 0.05)', 'dataMax + (dataMax * 0.05)']} hide />
                         <RechartsTooltip 
                            contentStyle={{
                                background: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                            labelFormatter={(label) => `Update #${label}`}
                            formatter={(value:any) => [`$${value.toFixed(2)}`, "Price"]}
                        />
                        <Area
                            dataKey="price"
                            type="natural"
                            fill={priceTrend === "down" ? "url(#fillRed)" : "url(#fillGreen)"}
                            fillOpacity={0.4}
                            stroke={priceTrend === "down" ? "hsl(var(--destructive))" : "hsl(var(--chart-2))"}
                            strokeWidth={2}
                            dot={false}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full"
            onClick={handleBuy}
            disabled={isPending && priceHistory.length <= 1}
          >
            Buy & Vault It!
          </Button>
        </div>
      </div>
    </div>
  );
}

