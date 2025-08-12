
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShotTakerProps {
  product: Product;
  isPage?: boolean;
}

const SHOT_COST = 1;

export function ShotTaker({ product, isPage = false }: ShotTakerProps) {
  const [currentPrice, setCurrentPrice] = useState(product.marketPrice);
  const [priceHistory, setPriceHistory] = useState([{ value: product.marketPrice }]);
  const [animationClass, setAnimationClass] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [capturedPrice, setCapturedPrice] = useState(0);

  const { addToVault, walletBalance, spendFromWallet } = useStore();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice((prevPrice) => {
        const volatility = 0.1;
        const changePercent = (Math.random() - 0.5) * volatility;
        let newPrice = prevPrice * (1 + changePercent);
        newPrice = Math.max(1, newPrice);

        setPriceHistory((prevHistory) => {
          const newHistory = [...prevHistory, { value: newPrice }];
          return newHistory.length > 20 ? newHistory.slice(-20) : newHistory;
        });
        
        if (newPrice > prevPrice) {
            setAnimationClass('flash-green');
        } else if (newPrice < prevPrice) {
            setAnimationClass('flash-red');
        }
        
        setTimeout(() => setAnimationClass(""), 700);

        return newPrice;
      });
    }, 1000 + Math.random() * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleShot = () => {
    if (walletBalance < SHOT_COST) {
        toast({
            variant: "destructive",
            title: "Insufficient Funds",
            description: `You need at least $${SHOT_COST.toFixed(2)} to take a shot.`,
        });
        return;
    }
    spendFromWallet(SHOT_COST);
    setCapturedPrice(currentPrice);
    setIsDialogOpen(true);
  };
  
  const handleVault = () => {
    if (walletBalance < capturedPrice) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You cannot afford to vault this item for $${capturedPrice.toFixed(2)}.`,
      });
      setIsDialogOpen(false);
      return;
    }
    
    addToVault({
        ...product,
        pricePaid: capturedPrice,
        purchaseTimestamp: Date.now(),
      });

    toast({
      title: "Item Vaulted!",
      description: `${product.name} has been added to your vault for $${capturedPrice.toFixed(2)}.`,
    });
    setIsDialogOpen(false);
  };

  const trendColor = priceHistory.length < 2 || priceHistory[priceHistory.length - 1].value >= priceHistory[priceHistory.length - 2].value
    ? 'hsl(var(--chart-1))'
    : 'hsl(var(--destructive))';

  const CardComponent = isPage ? 'div' : Card;

  return (
    <>
      <CardComponent
        ref={cardRef}
        className={cn(
          "flex flex-col overflow-hidden transition-all duration-300 group",
          !isPage && "shadow-lg",
          animationClass
        )}
      >
        {!isPage && (
          <Link href={`/product/${product.id}`} className="contents">
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
          </Link>
        )}
        <CardContent className={cn("flex-grow p-4 space-y-2", isPage && "p-0")}>
          {!isPage && (
            <Link href={`/product/${product.id}`}>
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                {product.name}
              </CardTitle>
            </Link>
          )}

          <div className="flex items-end justify-between">
             <div className="relative text-3xl font-black">
                <span className="shimmer-text" style={{ '--trend-color': trendColor } as React.CSSProperties}>
                    ${currentPrice.toFixed(2)}
                </span>
             </div>
             <div className="w-1/3 h-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceHistory} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`color-${product.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={trendColor} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={trendColor} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke={trendColor} strokeWidth={2} fill={`url(#color-${product.id})`} />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </CardContent>
        <CardFooter className={cn("p-4 pt-0", isPage && "p-0 pt-4")}>
          <Button
            className="w-full h-12 text-md font-bold"
            onClick={handleShot}
          >
            Take a Shot! ($1.00)
          </Button>
        </CardFooter>
      </CardComponent>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>You Shot at ${capturedPrice.toFixed(2)}!</AlertDialogTitle>
              <AlertDialogDescription>
                  You've locked in the price for {product.name}. Do you want to vault it now? This will cost an additional ${capturedPrice.toFixed(2)} from your wallet.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel>Let it go</AlertDialogCancel>
              <AlertDialogAction onClick={handleVault}>Vault It!</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
