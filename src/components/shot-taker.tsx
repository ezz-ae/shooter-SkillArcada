
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
import { Dices, Star } from "lucide-react";

interface ShotTakerProps {
  product: Product;
  isPage?: boolean;
}

type DialogState = 'closed' | 'initialShot' | 'doubleSnipe' | 'reelPause' | 'reelPaused1' | 'reelResult';

const SHOT_COST = 1;
const GAME_COST = 5; // Cost for Double Snipe or Reel Pause

export function ShotTaker({ product, isPage = false }: ShotTakerProps) {
  const [currentPrice, setCurrentPrice] = useState(product.marketPrice);
  const [animationClass, setAnimationClass] = useState("");
  const [dialogState, setDialogState] = useState<DialogState>('closed');
  const [capturedPrice, setCapturedPrice] = useState(0);

  // For double snipe
  const [snipePrice1, setSnipePrice1] = useState(0);
  const [snipePrice2, setSnipePrice2] = useState(0);

  // For reel pause
  const [reel1, setReel1] = useState(0);
  const [reel2, setReel2] = useState(0);
  const [pausedReel1, setPausedReel1] = useState<number | null>(null);
  const [finalReelPrice, setFinalReelPrice] = useState(0);


  const { addToVault, walletBalance, spendFromWallet, hasTakenFirstShot, setHasTakenFirstShot } = useStore();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const gameIntervalRef = useRef<NodeJS.Timeout>();


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
        if (gameIntervalRef.current) {
            clearInterval(gameIntervalRef.current);
        }
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
        description: "You've locked in a price. Now choose what to do with it!",
      });
      setHasTakenFirstShot();
    }
    
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

  const handleCloseDialog = () => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    setDialogState('closed');
    setPausedReel1(null);
  }

  const startGame = (mode: Product['gameMode']) => {
    if (walletBalance < GAME_COST) {
        toast({
            variant: "destructive",
            title: "Insufficient Funds",
            description: `You need $${GAME_COST.toFixed(2)} to play.`,
        });
        return;
    }
    spendFromWallet(GAME_COST);

    if (mode === 'doubleSnipe') {
        setDialogState('doubleSnipe');
        const generateNewPrices = () => {
            const volatility = 0.25;
            let newPrice1 = capturedPrice * (1 + (Math.random() - 0.5) * volatility);
            let newPrice2 = capturedPrice * (1 + (Math.random() - 0.5) * volatility);
            setSnipePrice1(Math.max(1, newPrice1));
            setSnipePrice2(Math.max(1, newPrice2));
        };
        generateNewPrices();
        gameIntervalRef.current = setInterval(generateNewPrices, 100);
    } else if (mode === 'reelPause') {
        setDialogState('reelPause');
        setPausedReel1(null);
        const generateNewReels = () => {
            setReel1(Math.floor(Math.random() * 10));
            setReel2(Math.floor(Math.random() * 10));
        }
        generateNewReels();
        gameIntervalRef.current = setInterval(generateNewReels, 75);
    }
  }

  const handleSnipe = (snipedPrice: number) => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    handleVault(snipedPrice);
  }

  const handlePauseReel1 = () => {
    setPausedReel1(reel1);
    setDialogState('reelPaused1');
  }

  const handlePauseReel2 = () => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    
    const discountPercentage = parseFloat(`${pausedReel1}${reel2}`);
    const discount = (discountPercentage / 100);
    const finalPrice = product.marketPrice * (1 - discount);
    
    setFinalReelPrice(finalPrice);
    setDialogState('reelResult');
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
          
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold text-muted-foreground">Value:</p>
            <div className="flex items-center">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < product.value
                      ? "text-accent fill-accent"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </div>

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

      <AlertDialog open={dialogState !== 'closed'} onOpenChange={(open) => !open && handleCloseDialog()}>
        {dialogState === 'initialShot' && (
             <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>You've Locked a Price!</AlertDialogTitle>
                    <AlertDialogDescription>
                        You've captured a price for {product.name} at <span className="font-bold text-foreground">${capturedPrice.toFixed(2)}</span>. You can vault it now, or play a game for a chance at a better deal!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0 sm:flex-row sm:justify-end sm:space-x-2">
                    <Button variant="secondary" onClick={handleCloseDialog}>Let it go</Button>
                    <Button variant="default" onClick={() => handleVault(capturedPrice)}>Vault It!</Button>
                    {product.gameMode && (
                        <Button variant="destructive" onClick={() => startGame(product.gameMode)}>
                            <Dices className="mr-2 h-4 w-4" />
                            Play Game! (${GAME_COST.toFixed(2)})
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
                    <AlertDialogCancel onClick={handleCloseDialog}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        )}
         {dialogState === 'reelPause' && (
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Reel Pause!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Pause the first reel to lock in the first digit of your discount!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-around items-center gap-4 p-4 text-6xl font-black">
                    <span className="w-20 text-center">{reel1}</span>
                    <span className="w-20 text-center text-muted-foreground">?</span>
                </div>
                <AlertDialogFooter>
                    <Button size="lg" onClick={handlePauseReel1}>Pause Reel 1</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        )}
        {dialogState === 'reelPaused1' && (
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>First Reel Paused!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Now pause the second reel to complete your discount!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-around items-center gap-4 p-4 text-6xl font-black">
                    <span className="w-20 text-center text-primary">{pausedReel1}</span>
                    <span className="w-20 text-center">{reel2}</span>
                </div>
                <AlertDialogFooter>
                    <Button size="lg" onClick={handlePauseReel2}>Pause Reel 2</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        )}
        {dialogState === 'reelResult' && (
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Discount Locked!</AlertDialogTitle>
                    <AlertDialogDescription>
                        You've locked in a discount of <span className="font-bold text-primary">{pausedReel1}{reel2}%</span>! Your final price for {product.name} is <span className="font-bold text-foreground">${finalReelPrice.toFixed(2)}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0 sm:flex-row sm:justify-end sm:space-x-2">
                    <Button variant="secondary" onClick={handleCloseDialog}>Let it go</Button>
                    <Button variant="default" onClick={() => handleVault(finalReelPrice)}>Vault It!</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        )}
      </AlertDialog>
    </>
  );
}
