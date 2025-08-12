
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
import { Dices } from "lucide-react";

interface ShotTakerProps {
  product: Product;
  isPage?: boolean;
}

type DialogState = 'closed' | 'initialShot' | 'doubleSnipe';

const SHOT_COST = 1;
const DOUBLE_SNIPE_COST = 5;

export function ShotTaker({ product, isPage = false }: ShotTakerProps) {
  const [currentPrice, setCurrentPrice] = useState(product.marketPrice);
  const [animationClass, setAnimationClass] = useState("");
  const [dialogState, setDialogState] = useState<DialogState>('closed');
  const [capturedPrice, setCapturedPrice] = useState(0);

  // For double snipe
  const [snipePrice1, setSnipePrice1] = useState(0);
  const [snipePrice2, setSnipePrice2] = useState(0);

  const { addToVault, walletBalance, spendFromWallet } = useStore();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const snipeIntervalRef = useRef<NodeJS.Timeout>();


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
        if (snipeIntervalRef.current) {
            clearInterval(snipeIntervalRef.current);
        }
    };
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
    setDialogState('initialShot');
  };
  
  const handleVault = (priceToPay: number) => {
    if (walletBalance < priceToPay) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You cannot afford to vault this item for $${priceToPay.toFixed(2)}.`,
      });
      setDialogState('closed');
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
    setDialogState('closed');
  };

  const startDoubleSnipe = () => {
    if (walletBalance < DOUBLE_SNIPE_COST) {
        toast({
            variant: "destructive",
            title: "Insufficient Funds",
            description: `You need $${DOUBLE_SNIPE_COST.toFixed(2)} for a Double Snipe.`,
        });
        return;
    }
    spendFromWallet(DOUBLE_SNIPE_COST);
    setDialogState('doubleSnipe');

    const generateNewPrices = () => {
        const volatility = 0.25; // Higher volatility for the snipe
        let newPrice1 = capturedPrice * (1 + (Math.random() - 0.5) * volatility);
        let newPrice2 = capturedPrice * (1 + (Math.random() - 0.5) * volatility);
        newPrice1 = Math.max(1, newPrice1);
        newPrice2 = Math.max(1, newPrice2);
        setSnipePrice1(newPrice1);
        setSnipePrice2(newPrice2);
    };

    generateNewPrices();
    snipeIntervalRef.current = setInterval(generateNewPrices, 100);
  }

  const handleSnipe = (snipedPrice: number) => {
    if (snipeIntervalRef.current) {
      clearInterval(snipeIntervalRef.current);
    }
    handleVault(snipedPrice);
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
            <span className="relative font-black text-lg">Take a Shot! ($1.00)</span>
          </button>
        </CardFooter>
      </CardComponent>

      <AlertDialog open={dialogState !== 'closed'} onOpenChange={(open) => !open && setDialogState('closed')}>
        {dialogState === 'initialShot' && (
             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>You Shot at ${capturedPrice.toFixed(2)}!</AlertDialogTitle>
                    <AlertDialogDescription>
                        You've locked in the price for {product.name}. You can vault it now, or try a Double Snipe for a better price!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <Button variant="secondary" onClick={() => setDialogState('closed')}>Let it go</Button>
                    <Button variant="default" onClick={() => handleVault(capturedPrice)}>Vault It! (${capturedPrice.toFixed(2)})</Button>
                    {product.allowDoubleSnipe && (
                        <Button variant="destructive" onClick={startDoubleSnipe}>
                            <Dices className="mr-2 h-4 w-4" />
                            Double Snipe (${DOUBLE_SNIPE_COST.toFixed(2)})
                        </Button>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        )}
        {dialogState === 'doubleSnipe' && (
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Double Snipe!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Two new prices are available. Click to snipe the one you want! Quick!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-around gap-4 p-4">
                    <Button size="lg" className="h-24 text-2xl" onClick={() => handleSnipe(snipePrice1)}>
                       ${snipePrice1.toFixed(2)}
                    </Button>
                     <Button size="lg" className="h-24 text-2xl" onClick={() => handleSnipe(snipePrice2)}>
                        ${snipePrice2.toFixed(2)}
                    </Button>
                </div>
                 <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => {
                        if (snipeIntervalRef.current) clearInterval(snipeIntervalRef.current);
                        setDialogState('closed');
                    }}>
                        Cancel
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  );
}
