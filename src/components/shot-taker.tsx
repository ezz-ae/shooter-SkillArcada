
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
  const [dialogMode, setDialogMode] = useState<'capture' | 'game-reel-pause'>('capture');
  const [capturedPrice, setCapturedPrice] = useState(0);
  const [capturedTime, setCapturedTime] = useState<Date | null>(null);

  // Game State
  const [reel1Value, setReel1Value] = useState(0);
  const [reel2Value, setReel2Value] = useState(0);
  const [isReel1Paused, setIsReel1Paused] = useState(false);
  const [isReel2Paused, setIsReel2Paused] = useState(false);
  const gamePrice = useRef(0);


  const { addToVault, walletBalance, spendFromWallet, hasTakenFirstShot, setHasTakenFirstShot } = useStore();
  const { toast } = useToast();
  
  useEffect(() => {
    let isMounted = true;
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

    let gameInterval: NodeJS.Timeout;
    if (dialogMode === 'game-reel-pause' && !isReel1Paused) {
        gameInterval = setInterval(() => setReel1Value(Math.floor(Math.random() * 10)), 50);
    }
    if (dialogMode === 'game-reel-pause' && isReel1Paused && !isReel2Paused) {
        gameInterval = setInterval(() => setReel2Value(Math.floor(Math.random() * 10)), 50);
    }


    return () => {
        isMounted = false;
        clearInterval(priceInterval);
        clearInterval(gameInterval);
    };
  }, [dialogMode, isReel1Paused, isReel2Paused]);

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

    if (product.game === 'reel-pause') {
        setDialogMode('game-reel-pause');
    } else {
        setDialogMode('capture');
    }
    setIsDialogOpen(true);
  };
  
  const handleVault = () => {
    const priceToPay = dialogMode === 'game-reel-pause' ? gamePrice.current : capturedPrice;

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
    // Reset game state
    setReel1Value(0);
    setReel2Value(0);
    setIsReel1Paused(false);
    setIsReel2Paused(false);
    gamePrice.current = 0;
  }

  const handlePauseReel = () => {
      if (!isReel1Paused) {
          setIsReel1Paused(true);
      } else if (!isReel2Paused) {
          setIsReel2Paused(true);
          const finalPrice = parseFloat(`${reel1Value}${reel2Value}`);
          gamePrice.current = finalPrice;
      }
  }

  const CardComponent = isPage ? 'div' : Card;

  return (
    <>
      <CardComponent
        className={cn(
          "flex flex-col overflow-hidden transition-all duration-300 group",
          !isPage && "shadow-lg"
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
        <CardContent className={cn("flex-grow p-4 pb-0 space-y-2", isPage && "p-0 pt-4")}>
          {!isPage && (
            <Link href={`/product/${product.id}`}>
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                {product.name}
              </CardTitle>
            </Link>
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
                 <div className="absolute right-0 h-full w-28 bg-black/20 flex items-center justify-center">
                     <span className="text-lg font-black tracking-wider shimmer-text" style={{'--trend-color': 'hsl(var(--primary))'} as React.CSSProperties}>${currentPrice.toFixed(2)}</span>
                 </div>
            </div>
          </button>
        </CardFooter>
      </CardComponent>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
             <AlertDialogContent onEscapeKeyDown={handleCloseDialog}>
                {dialogMode === 'capture' && (
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
                                    <div className="relative text-3xl font-black text-white">
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
                {dialogMode === 'game-reel-pause' && (
                    <>
                         <AlertDialogHeader>
                            <AlertDialogTitle className="text-center">Pause The Reels!</AlertDialogTitle>
                             <AlertDialogDescription className="text-center pt-2">
                                Stop both reels to lock in your price. Your timing is everything!
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex justify-center items-center gap-4 text-6xl font-black p-8 my-4 bg-secondary rounded-lg">
                           <div className="w-20 h-24 flex items-center justify-center bg-background rounded-md shadow-inner">
                                <span className={cn(!isReel1Paused && "shimmer-text")}>{reel1Value}</span>
                           </div>
                           <div className="w-20 h-24 flex items-center justify-center bg-background rounded-md shadow-inner">
                               <span className={cn(isReel1Paused && !isReel2Paused && "shimmer-text")}>{reel2Value}</span>
                           </div>
                        </div>
                        {isReel2Paused && (
                            <div className="text-center">
                                <p className="text-muted-foreground">Your Price:</p>
                                <p className="text-3xl font-bold text-primary">${gamePrice.current.toFixed(2)}</p>
                            </div>
                        )}
                         <AlertDialogFooter className="gap-2 sm:gap-0 sm:flex-row sm:justify-center">
                            <AlertDialogCancel onClick={handleCloseDialog}>Let it go</AlertDialogCancel>
                            {isReel2Paused ? (
                                 <AlertDialogAction onClick={handleVault}>Vault It!</AlertDialogAction>
                            ) : (
                                <Button onClick={handlePauseReel}>
                                    Pause {isReel1Paused ? "Reel 2" : "Reel 1"}
                                </Button>
                            )}
                        </AlertDialogFooter>
                    </>
                )}
            </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
