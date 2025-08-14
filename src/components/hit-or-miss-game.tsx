
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Product, mockProducts } from "@/lib/products";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
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
import { cn } from "@/lib/utils";
import { Gem, Target } from "lucide-react";

// Widen the variety of products for this game.
const displayableProducts = mockProducts.filter(p => 
    p.category !== 'luckgirls' &&
    !p.game?.includes('riddle') &&
    !p.game?.includes('chess') &&
    !p.game?.includes('maze') &&
    !p.game?.includes('mirror') &&
    p.id !== 'prod_console_01'
);

export function HitOrMissGame() {
  const [productIndex, setProductIndex] = useState(0);
  const [price, setPrice] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);
  const [capturedResult, setCapturedResult] = useState<{ product: Product, price: number } | null>(null);

  const productReelRef = useRef<HTMLDivElement>(null);
  const priceReelRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  const { spendShot, addToVault } = useStore();
  const { toast } = useToast();

  const animateReels = useCallback(() => {
    // Animate product reel
    const newProductIndex = Math.floor(Math.random() * displayableProducts.length);
    setProductIndex(newProductIndex);

    // Animate price reel
    const newPrice = Math.floor(Math.random() * 1500) + 1; // Prices from $1 to $1500
    setPrice(newPrice);
    
    requestRef.current = requestAnimationFrame(animateReels);
  }, []);

  useEffect(() => {
    if (isSpinning) {
      requestRef.current = requestAnimationFrame(animateReels);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isSpinning, animateReels]);

  const handleTakeShot = () => {
    if (!isSpinning) return;

    if (!spendShot(1)) {
        toast({
            variant: "destructive",
            title: "Not enough Shots!",
            description: "You need 1 Shot to play."
        });
        return;
    }

    setIsSpinning(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    setCapturedResult({ product: displayableProducts[productIndex], price });
  };
  
  const handleVault = () => {
    if (!capturedResult) return;
    
    const success = addToVault({
        ...capturedResult.product,
        pricePaid: capturedResult.price,
        purchaseTimestamp: Date.now(),
    });

    if (success) {
      toast({
        title: "Item Vaulted!",
        description: `${capturedResult.product.name} has been added to your vault for ${capturedResult.price.toFixed(2)} Shots.`,
      });
    } else {
       toast({
        variant: "destructive",
        title: "Insufficient Shots",
        description: `You cannot afford to vault this item for ${capturedResult.price.toFixed(2)} Shots.`,
      });
    }
    handleCloseDialog();
  };


  const handleCloseDialog = () => {
    setCapturedResult(null);
    setIsSpinning(true);
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto shadow-2xl border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">Line Up The Shot</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Product Reel */}
          <div className="h-48 w-full bg-secondary rounded-lg overflow-hidden relative shadow-inner">
             <div ref={productReelRef} className="h-full flex flex-col items-center justify-center transition-transform duration-100 ease-linear">
                <Image 
                    src={displayableProducts[productIndex].imageUrl} 
                    alt={displayableProducts[productIndex].name} 
                    width={200} height={200} 
                    className="object-contain"
                    data-ai-hint={displayableProducts[productIndex].dataAiHint}
                />
                <p className="font-bold text-lg mt-2 text-center">{displayableProducts[productIndex].name}</p>
             </div>
          </div>
          {/* Price Reel */}
          <div className="h-24 w-full bg-secondary rounded-lg overflow-hidden relative shadow-inner flex items-center justify-center">
             <div ref={priceReelRef} className="h-full flex flex-col items-center justify-center transition-transform duration-100 ease-linear">
                <p className="text-5xl font-black font-mono text-primary">${price.toFixed(2)}</p>
             </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full" onClick={handleTakeShot} disabled={!isSpinning}>
            <Target className="mr-2"/>
            {isSpinning ? 'Take the Shot (1 Shot)' : 'Spinning...'}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={!!capturedResult} onOpenChange={(open) => !open && handleCloseDialog()}>
             <AlertDialogContent onEscapeKeyDown={handleCloseDialog}>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">You Hit!</AlertDialogTitle>
                </AlertDialogHeader>
                
                <div className="relative h-64 w-full my-4 rounded-lg overflow-hidden shadow-lg bg-secondary flex items-center justify-center">
                    <Gem className="h-24 w-24 text-primary animate-pulse" />
                     <div className="absolute inset-0 bg-black/10 flex flex-col justify-between p-4">
                        <div className="text-center text-white bg-black/50 p-4 rounded-lg">
                           <p className="text-xl font-bold">{capturedResult?.product.name}</p>
                           <p className="text-3xl font-black shimmer-text">${capturedResult?.price.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <AlertDialogDescription className="text-center">
                     You captured <span className="font-bold text-foreground">{capturedResult?.product.name}</span> for <span className="font-bold text-foreground">${capturedResult?.price.toFixed(2)}</span>!
                </AlertDialogDescription>
                
                <AlertDialogFooter className="gap-2 sm:gap-0 sm:flex-row sm:justify-center">
                    <AlertDialogCancel onClick={handleCloseDialog}>Try Again</AlertDialogCancel>
                    <AlertDialogAction onClick={handleVault}>Vault It!</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
