
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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
  const [animationClass, setAnimationClass] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [capturedPrice, setCapturedPrice] = useState(0);
  const [capturedTime, setCapturedTime] = useState<Date | null>(null);

  const { addToVault, walletBalance, spendFromWallet, hasTakenFirstShot, setHasTakenFirstShot } = useStore();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    let isMounted = true;
    const interval = setInterval(() => {
      if (!isMounted) return;
      setCurrentPrice((prevPrice) => {
        const volatility = 0.1;
        const changePercent = (Math.random() - 0.5) * volatility;
        let newPrice = prevPrice * (1 + changePercent);
        newPrice = Math.max(1, newPrice);
        
        if (newPrice > prevPrice) {
            setAnimationClass('flash-green');
        } else if (newPrice < prevPrice) {
            setAnimationClass('flash-red');
        }
        
        setTimeout(() => setAnimationClass(""), 700);

        return newPrice;
      });
    }, 200 + Math.random() * 300);

    return () => {
        isMounted = false;
        clearInterval(interval)
    };
  }, []);

  const handleShot = () => {
    if (hasTakenFirstShot) {
      if (walletBalance < SHOT_COST) {
          toast({
              variant: "destructive",
              title: "Insufficient Funds",
              description: `You need at least $${SHOT_COST.toFixed(2)} to take a shot.`,
          });
          return;
      }
      spendFromWallet(SHOT_COST);
    } else {
      toast({
        title: "Your First Shot is Free!",
        description: "You've captured an item. Now choose whether to vault it!",
      });
      setHasTakenFirstShot();
    }
    
    setCapturedPrice(currentPrice);
    setCapturedTime(new Date());
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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  }

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
        <CardContent className={cn("flex-grow p-4 space-y-2", isPage && "p-0 pt-4")}>
          {!isPage && (
            <Link href={`/product/${product.id}`}>
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                {product.name}
              </CardTitle>
            </Link>
          )}

          {isPage && (
             <div className="text-sm text-muted-foreground">Current Market Price</div>
          )}
           <div className="relative text-3xl font-black">
                ${currentPrice.toFixed(2)}
            </div>

        </CardContent>
        <CardFooter className={cn("p-4 pt-0", isPage && "p-0 pt-4")}>
          <button
            className="w-full h-12 text-md font-bold text-primary-foreground rounded-md relative overflow-hidden bg-secondary flex items-center justify-center"
            onClick={handleShot}
          >
            <div className="absolute inset-0 moving-gradient"></div>
            <span className="relative font-black text-lg">Shot</span>
          </button>
        </CardFooter>
      </CardComponent>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">You Got a Shot!</AlertDialogTitle>
                </AlertDialogHeader>
                
                <div className="relative h-64 w-full my-4 rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        data-ai-hint={product.dataAiHint}
                    />
                     <div className="absolute inset-0 bg-black/20 flex flex-col justify-between p-4">
                        <div className="text-right">
                           <div className="bg-black/50 text-white p-2 rounded-md text-sm font-mono inline-block">
                             {capturedTime?.toLocaleTimeString()}
                           </div>
                        </div>

                        <div className="bg-black/50 p-4 rounded-lg text-center">
                            <div className="text-sm text-muted-foreground">Captured Price</div>
                            <div className="relative text-3xl font-black text-white">
                                ${capturedPrice.toFixed(2)}
                            </div>
                        </div>

                     </div>
                </div>

                <AlertDialogDescription className="text-center">
                    You've captured <span className="font-bold text-foreground">{product.name}</span>! Vault it now for <span className="font-bold text-foreground">${capturedPrice.toFixed(2)}</span> or let it go.
                </AlertDialogDescription>
                
                <AlertDialogFooter className="gap-2 sm:gap-0 sm:flex-row sm:justify-end sm:space-x-2">
                    <AlertDialogCancel onClick={handleCloseDialog}>Let it go</AlertDialogCancel>
                    <AlertDialogAction onClick={handleVault}>Vault It!</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
