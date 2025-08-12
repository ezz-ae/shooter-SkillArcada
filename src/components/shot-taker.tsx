
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [capturedPrice, setCapturedPrice] = useState(0);
  const [capturedTime, setCapturedTime] = useState<Date | null>(null);

  // For digit-pause game
  const [digits, setDigits] = useState([0, 0, 0]);
  const [lockedDigits, setLockedDigits] = useState<number[]>([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const digitIntervals = useRef<NodeJS.Timeout[]>([]);

  const { addToVault, walletBalance, spendFromWallet, hasTakenFirstShot, setHasTakenFirstShot } = useStore();
  const { toast } = useToast();
  
  useEffect(() => {
    let isMounted = true;
    if (product.game !== 'digit-pause') {
      const priceInterval = setInterval(() => {
        if (!isMounted) return;
        setCurrentPrice((prevPrice) => {
          const volatility = 0.1;
          const changePercent = (Math.random() - 0.5) * volatility;
          let newPrice = prevPrice * (1 + changePercent);
          newPrice = Math.max(1, newPrice);
          return newPrice;
        });
      }, 1000 + Math.random() * 1000);

      return () => {
          isMounted = false;
          clearInterval(priceInterval);
      };
    }
  }, [product.game]);

  const startDigitGame = () => {
    setLockedDigits([]);
    setIsGameActive(true);
    digitIntervals.current = [0, 1, 2].map(index => {
      return setInterval(() => {
        setDigits(prev => {
          const newDigits = [...prev];
          newDigits[index] = Math.floor(Math.random() * 10);
          return newDigits;
        });
      }, 75);
    });
  };

  const stopDigitGame = () => {
    setIsGameActive(false);
    digitIntervals.current.forEach(clearInterval);
    digitIntervals.current = [];
  };

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
    
    if (product.game === 'digit-pause') {
      startDigitGame();
    } else {
      setCapturedPrice(currentPrice);
    }
    setCapturedTime(new Date());
    setIsDialogOpen(true);
  };
  
  const handleVault = () => {
    let priceToPay = capturedPrice;
    if (product.game === 'digit-pause') {
      priceToPay = Number(lockedDigits.join(''));
    }

    if (walletBalance < priceToPay) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You cannot afford to vault this item for $${priceToPay.toFixed(2)}.`,
      });
      handleCloseDialog();
      return;
    }
    
    addToVault({
        ...product,
        pricePaid: priceToPay,
        purchaseTimestamp: Date.now(),
      });

    toast({
      title: "Item Vaulted!",
      description: `${product.name} has been added to your vault for $${priceToPay.toFixed(2)}.`,
    });
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    if(product.game === 'digit-pause') {
      stopDigitGame();
    }
  }

  const handleDigitClick = (index: number) => {
    if (lockedDigits.length === index) {
      const newLockedDigits = [...lockedDigits, digits[index]];
      setLockedDigits(newLockedDigits);
      clearInterval(digitIntervals.current[index]);

      if (newLockedDigits.length === 3) {
        setCapturedPrice(Number(newLockedDigits.join('')));
        stopDigitGame();
      }
    }
  };

  const CardComponent = isPage ? 'div' : Card;
  const isGameCard = product.game === 'digit-pause';

  const discountPercent = ((product.marketPrice - currentPrice) / product.marketPrice) * 100;
  const discountColor = discountPercent > 0 ? "text-accent" : "text-[hsl(var(--chart-4))]";

  return (
    <>
      <CardComponent
        className={cn(
          "flex flex-col overflow-hidden transition-all duration-300 group",
          !isPage && "shadow-lg",
          isGameCard && "border-primary/50 border-2"
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
        <CardContent className={cn("flex-grow p-4 pb-2 space-y-2", isPage && "p-0 pt-4")}>
          {!isPage && (
            <div className="space-y-2">
               <Link href={`/product/${product.id}`} className="flex-grow">
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                  {product.name}
                </CardTitle>
              </Link>
              {!isGameCard && (
                 <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black tracking-wider text-white shimmer-text" style={{'--trend-color': 'hsl(var(--primary))'} as React.CSSProperties}>${currentPrice.toFixed(2)}</span>
                    <span className={cn("font-bold", discountColor)}>
                        {Math.abs(discountPercent).toFixed(1)}%
                    </span>
                 </div>
              )}
            </div>
          )}
           {isGameCard && <p className="text-sm text-primary">Special timed event! Click fast to set your price!</p>}
           {isPage && !isGameCard && (
             <div className="mt-4">
              <span className="text-3xl font-black tracking-wider text-white shimmer-text" style={{'--trend-color': 'hsl(var(--primary))'} as React.CSSProperties}>${currentPrice.toFixed(2)}</span>
               <span className={cn("ml-2 font-bold", discountColor)}>
                    {Math.abs(discountPercent).toFixed(1)}%
                </span>
            </div>
           )}
        </CardContent>
        <CardFooter className={cn("p-4", isPage && "p-0 pt-4")}>
          <button
            className="w-full h-12 text-md font-bold text-primary-foreground rounded-md relative overflow-hidden bg-secondary flex items-center justify-center"
            onClick={handleShot}
          >
            <div className="absolute inset-0 moving-gradient"></div>
            <div className="relative flex items-baseline w-full justify-center">
                 <span className="font-black text-lg">Shot</span>
            </div>
          </button>
        </CardFooter>
      </CardComponent>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
             <AlertDialogContent onEscapeKeyDown={handleCloseDialog}>
                {product.game === 'digit-pause' ? (
                  <>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-center">Digit-Pause Challenge!</AlertDialogTitle>
                      <AlertDialogDescription className="text-center">
                        Click each box to lock in a digit. Your price is in your hands!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex justify-center items-center gap-4 py-8">
                      {[0, 1, 2].map(index => (
                        <button
                          key={index}
                          onClick={() => handleDigitClick(index)}
                          disabled={lockedDigits.length !== index}
                          className="h-24 w-20 bg-secondary rounded-lg flex items-center justify-center text-5xl font-black text-primary-foreground tabular-nums disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {lockedDigits.length > index || !isGameActive ? lockedDigits[index] : digits[index]}
                        </button>
                      ))}
                    </div>
                    <div className="text-center">
                        Final Price: <span className="font-bold text-2xl text-primary">${lockedDigits.length === 3 ? Number(lockedDigits.join('')) : '?.??'}</span>
                    </div>
                    <AlertDialogFooter className="gap-2 sm:gap-0 sm:flex-row sm:justify-center">
                        <AlertDialogCancel onClick={handleCloseDialog}>Let it go</AlertDialogCancel>
                        <AlertDialogAction onClick={handleVault} disabled={lockedDigits.length !== 3}>
                           Vault It!
                        </AlertDialogAction>
                    </AlertDialogFooter>
                  </>
                ) : (
                  <>
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
                                <div className="relative text-3xl font-black text-white shimmer-text" style={{'--trend-color': 'hsl(var(--primary))'} as React.CSSProperties}>
                                    ${capturedPrice.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <AlertDialogDescription className="text-center">
                        You've captured <span className="font-bold text-foreground">{product.name}</span>! Vault it now for <span className="font-bold text-foreground">${capturedPrice.toFixed(2)}</span> or let it go.
                    </AlertDialogDescription>
                    
                    <AlertDialogFooter className="gap-2 sm:gap-0 sm:flex-row sm:justify-center">
                        <AlertDialogCancel onClick={handleCloseDialog}>Let it go</AlertDialogCancel>
                        <AlertDialogAction onClick={handleVault}>Vault It!</AlertDialogAction>
                    </AlertDialogFooter>
                  </>
                )}
            </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
