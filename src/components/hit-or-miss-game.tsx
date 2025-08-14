
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Product, mockProducts } from "@/lib/products";
import { Button } from "./ui/button";
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
import { Gem, Target, DollarSign } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

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

  const animationTimeoutRef = useRef<NodeJS.Timeout>();

  const { spendShot, addToVault, addShots } = useStore();
  const { toast } = useToast();

  const animateReels = useCallback(() => {
    // Update product and price
    setProductIndex(Math.floor(Math.random() * displayableProducts.length));
    setPrice(Math.floor(Math.random() * 1500) + 1);
    
    // Set a random delay for the next update to create a "stop and go" effect
    const randomDelay = 100 + Math.random() * 400; // between 100ms and 500ms
    animationTimeoutRef.current = setTimeout(animateReels, randomDelay);
  }, []);

  useEffect(() => {
    if (isSpinning) {
      animateReels();
    }
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
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
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
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

  const handleCashOut = () => {
    if (!capturedResult) return;
    const cashOutValue = capturedResult.price * 0.5; // 50% cash out value
    addShots(cashOutValue);
    toast({
        title: "Cashed Out!",
        description: `You received ${cashOutValue.toFixed(2)} Shots!`
    });
    handleCloseDialog();
  }

  const handleCloseDialog = () => {
    setCapturedResult(null);
    setIsSpinning(true);
  }

  const product = displayableProducts[productIndex];

  return (
    <>
      <div className="w-full max-w-md mx-auto bg-card border-2 border-primary/10 rounded-2xl shadow-2xl p-6 space-y-6">
        {/* Product Reel */}
        <div className="h-64 bg-secondary/50 rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center p-4">
            <div className="text-center transition-opacity duration-300">
                <p className="font-black text-4xl lg:text-5xl text-center text-foreground p-4">
                    {product?.name || <Skeleton className="h-12 w-64" />}
                </p>
            </div>
        </div>

        {/* Price Reel */}
        <div className="h-24 w-full bg-secondary/50 rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center">
            <div className="transition-opacity duration-300">
                <p className="text-6xl font-black font-mono shimmer-text">${price.toFixed(2)}</p>
            </div>
        </div>
        
        {/* Action Button */}
        <div>
          <Button size="lg" className="w-full h-14 text-lg" onClick={handleTakeShot} disabled={!isSpinning}>
            <Target className="mr-2 h-6 w-6"/>
            {isSpinning ? 'Take the Shot (1 Shot)' : 'Spinning...'}
          </Button>
        </div>
      </div>

      <AlertDialog open={!!capturedResult} onOpenChange={(open) => !open && handleCloseDialog()}>
             <AlertDialogContent onEscapeKeyDown={handleCloseDialog}>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">You Hit!</AlertDialogTitle>
                </AlertDialogHeader>
                
                <div className="relative h-64 w-full my-4 rounded-lg overflow-hidden shadow-lg bg-secondary flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/10 flex flex-col justify-center items-center text-center p-4">
                        <Gem className="h-16 w-16 text-primary animate-pulse drop-shadow-lg" />
                        <p className="text-2xl font-bold mt-4 text-white drop-shadow-md">{capturedResult?.product.name}</p>
                        <p className="text-4xl font-black shimmer-text drop-shadow-lg">${capturedResult?.price.toFixed(2)}</p>
                    </div>
                </div>

                <AlertDialogDescription className="text-center">
                     You captured <span className="font-bold text-foreground">{capturedResult?.product.name}</span> for <span className="font-bold text-foreground">${capturedResult?.price.toFixed(2)}</span>!
                </AlertDialogDescription>
                
                <AlertDialogFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <AlertDialogCancel onClick={handleCloseDialog} className="w-full">Try Again</AlertDialogCancel>
                     <Button onClick={handleCashOut} variant="outline" className="w-full">
                        <DollarSign className="mr-2 h-4 w-4"/>
                        Cash Out ({(capturedResult?.price ?? 0 * 0.5).toFixed(2)} Shots)
                    </Button>
                    <AlertDialogAction onClick={handleVault} className="w-full">Vault It!</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
