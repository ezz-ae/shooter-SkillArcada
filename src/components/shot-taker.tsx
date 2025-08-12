
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useStore } from "@/lib/store";
import type { Product } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Calculator } from "./calculator";

interface ShotTakerProps {
  product: Product;
  isPage?: boolean;
}

const SHOT_COST = 1;
const RIDDLE_ANSWER = 80;
const RIDDLE_TIMER_SECONDS = 300; // 5 minutes

export function ShotTaker({ product, isPage = false }: ShotTakerProps) {
  const [currentPrice, setCurrentPrice] = useState(product.marketPrice);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [capturedPrices, setCapturedPrices] = useState<number[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [capturedTime, setCapturedTime] = useState<Date | null>(null);

  // For reel-pause game
  const [reelNumbers, setReelNumbers] = useState<number[]>(Array(24).fill(0));
  const [isReelPaused, setIsReelPaused] = useState(false);
  const [selectedReelIndices, setSelectedReelIndices] = useState<number[]>([]);
  const reelInterval = useRef<NodeJS.Timeout>();

  // For riddle-calc game
  const [isRiddleDialogOpen, setIsRiddleDialogOpen] = useState(false);
  const [riddleTimer, setRiddleTimer] = useState(RIDDLE_TIMER_SECONDS);
  const [calculatorValue, setCalculatorValue] = useState("");
  const timerInterval = useRef<NodeJS.Timeout>();

  const { addToVault, walletBalance, spendFromWallet, hasTakenFirstShot, setHasTakenFirstShot } = useStore();
  const { toast } = useToast();
  
  const getNewPrice = (price: number) => {
      const volatility = 0.1;
      const changePercent = (Math.random() - 0.5) * volatility;
      let newPrice = price * (1 + changePercent);
      newPrice = Math.max(1, newPrice);
      return newPrice;
  }

  useEffect(() => {
    let isMounted = true;
    if (product.game !== 'reel-pause' && product.game !== 'riddle-calc') {
      const priceInterval = setInterval(() => {
        if (!isMounted) return;
        setCurrentPrice(getNewPrice);
      }, 1000 + Math.random() * 1000);

      return () => {
          isMounted = false;
          clearInterval(priceInterval);
      };
    }
  }, [product.game]);
  
  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
        if (reelInterval.current) clearInterval(reelInterval.current);
        if (timerInterval.current) clearInterval(timerInterval.current);
    }
  }, []);

  useEffect(() => {
    // Start the reel game automatically
    if (product.game === 'reel-pause' && !isReelPaused) {
      startReelGame();
    }
  }, [product.game, isReelPaused]);
  
  useEffect(() => {
    if (isRiddleDialogOpen && riddleTimer > 0) {
      timerInterval.current = setInterval(() => {
        setRiddleTimer(prev => prev - 1);
      }, 1000);
    } else if (riddleTimer === 0) {
      if (timerInterval.current) clearInterval(timerInterval.current);
      setIsRiddleDialogOpen(false);
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
  }, [isRiddleDialogOpen, riddleTimer]);

  const startReelGame = () => {
    setIsReelPaused(false);
    if (reelInterval.current) clearInterval(reelInterval.current);
    reelInterval.current = setInterval(() => {
        setReelNumbers(prev => prev.map(() => Math.floor(Math.random() * 10)));
    }, 100);
  }

  const stopReelGame = () => {
    if (reelInterval.current) clearInterval(reelInterval.current);
    setIsReelPaused(true);
  }

  const handleShot = () => {
    if (product.game === 'reel-pause' || product.game === 'riddle-calc') {
      return;
    }
    
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
    
    if (product.game === 'multi-shot') {
        const prices = [getNewPrice(currentPrice), getNewPrice(currentPrice), getNewPrice(currentPrice)];
        setCapturedPrices(prices);
        setSelectedPrice(prices[0]);
    } else {
        setCapturedPrices([currentPrice]);
    }
    setCapturedTime(new Date());
    setIsDialogOpen(true);
  };
  
  const handleVault = (price?: number) => {
    const priceToPay = price ?? (product.game === 'multi-shot' ? selectedPrice : capturedPrices[0]);

    if (priceToPay === null) return;
    
    if (walletBalance < priceToPay) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You cannot afford to vault this item for $${priceToPay.toFixed(2)}.`,
      });
      setIsDialogOpen(false);
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
    setIsDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCapturedPrices([]);
    setSelectedPrice(null);
  }

  const handleReelNumberClick = (index: number) => {
    if (!isReelPaused || selectedReelIndices.length >= 3) return;

    setSelectedReelIndices(prev => {
        if (prev.includes(index)) {
            return prev.filter(i => i !== index);
        }
        return [...prev, index];
    })
  }

  const handleReelShot = () => {
    if (selectedReelIndices.length !== 3) return;

    const priceString = selectedReelIndices.map(i => reelNumbers[i]).join('');
    const priceToPay = Number(priceString);

    if (walletBalance < priceToPay) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You cannot afford to vault this item for $${priceToPay.toFixed(2)}.`,
      });
      resetReelGame();
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
    resetReelGame();
  }

  const resetReelGame = () => {
    setSelectedReelIndices([]);
    setIsReelPaused(false);
    startReelGame();
  }
  
  const handleRiddleStart = () => {
    if (hasTakenFirstShot) {
      if (walletBalance < SHOT_COST) {
        toast({
          variant: 'destructive',
          title: 'Insufficient Funds',
          description: `You need at least $${SHOT_COST.toFixed(2)} to play.`,
        });
        return;
      }
      spendFromWallet(SHOT_COST);
    } else {
       toast({
        title: "Your First Shot is Free!",
        description: "Solve the riddle to set the price!",
      });
      setHasTakenFirstShot();
    }
    setRiddleTimer(RIDDLE_TIMER_SECONDS);
    setIsRiddleDialogOpen(true);
  }

  const handleRiddleShot = () => {
    handleVault(RIDDLE_ANSWER);
    setCalculatorValue("");
  }
  
  const minutes = Math.floor(riddleTimer / 60);
  const seconds = riddleTimer % 60;
  const timerColor = riddleTimer <= 60 ? "text-destructive" : "text-foreground";

  const CardComponent = isPage ? 'div' : Card;
  const isGameCard = product.game === 'reel-pause' || product.game === 'riddle-calc';

  const discountPercent = ((product.marketPrice - currentPrice) / product.marketPrice) * 100;
  const discountColor = discountPercent > 0 ? "text-accent" : "text-[hsl(var(--chart-4))]";
  
  const renderGameFooter = () => {
    if (product.game === 'reel-pause') {
        return (
            <div className="w-full flex flex-col gap-2">
                <div className="grid grid-cols-4 gap-2">
                    {reelNumbers.map((num, index) => (
                        <button key={index}
                            onClick={() => handleReelNumberClick(index)}
                            disabled={!isReelPaused || selectedReelIndices.length >= 3 && !selectedReelIndices.includes(index)}
                            className={cn(
                                "h-10 border rounded-md flex items-center justify-center text-2xl font-mono transition-all",
                                isReelPaused ? "cursor-pointer" : "cursor-default",
                                isReelPaused && selectedReelIndices.includes(index) && "bg-primary text-primary-foreground",
                                isReelPaused && !selectedReelIndices.includes(index) && "blur-sm",
                            )}
                        >{num}</button>
                    ))}
                </div>
                {!isReelPaused ? (
                    <Button onClick={stopReelGame} className="w-full h-12 text-lg font-bold">Pause</Button>
                ) : (
                    <Button onClick={handleReelShot} disabled={selectedReelIndices.length !== 3} className="w-full h-12 text-lg font-bold">
                        Shot
                    </Button>
                )}
            </div>
        )
    }
    
    if (product.game === 'riddle-calc') {
        const isCorrectAnswer = calculatorValue === String(RIDDLE_ANSWER);
        return (
             <div className="w-full flex flex-col gap-2">
                <Calculator value={calculatorValue} onValueChange={setCalculatorValue} />
                 {isCorrectAnswer ? (
                     <Button onClick={handleRiddleShot} className="w-full h-12 text-lg font-bold">
                        Take the Shot for ${RIDDLE_ANSWER}!
                    </Button>
                 ) : (
                    <Button onClick={handleRiddleStart} className="w-full h-12 text-lg font-bold">Start Riddle</Button>
                 )}
            </div>
        )
    }

    return null;
  }

  return (
    <>
      <CardComponent
        className={cn(
          "flex h-full flex-col overflow-hidden transition-all duration-300 group relative",
          !isPage && "shadow-lg",
          isGameCard && "border-primary/50 border-2",
          product.game === 'multi-shot' && 'multi-shot-card'
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
             <Link href={`/product/${product.id}`} className="flex-grow">
              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors truncate">
                {product.name}
              </CardTitle>
            </Link>
          )}
           {isGameCard ? (
             <div className="text-sm text-muted-foreground min-h-[4rem]" />
           ) : (
             <div className="flex flex-col">
                <span className="text-3xl font-black tracking-wider text-white shimmer-text" style={{'--trend-color': 'hsl(var(--primary))'} as React.CSSProperties}>${currentPrice.toFixed(2)}</span>
                <span className={cn("font-bold text-sm", discountColor)}>
                    {discountPercent > 0 && '+'}{discountPercent.toFixed(1)}%
                </span>
             </div>
          )}
           {isPage && (
             <div className="mt-4">
               {product.game === 'regular' || !product.game && (
                 <div className="flex flex-col">
                    <span className="text-4xl font-black tracking-wider text-white shimmer-text" style={{'--trend-color': 'hsl(var(--primary))'} as React.CSSProperties}>${currentPrice.toFixed(2)}</span>
                    <span className={cn("mt-1 font-bold", discountColor)}>
                          {discountPercent > 0 && '+'}{discountPercent.toFixed(1)}%
                      </span>
                 </div>
               )}
            </div>
           )}
        </CardContent>
        <CardFooter className={cn("p-4 pt-2 flex-col items-center", isPage && "p-0 pt-4")}>
          {isGameCard ? renderGameFooter() : (
            <button
              className="w-full h-12 text-md font-bold text-primary-foreground rounded-md relative overflow-hidden bg-secondary flex items-center justify-center"
              onClick={handleShot}
            >
              <div className="absolute inset-0 moving-gradient"></div>
              <div className="relative flex items-baseline w-full justify-center">
                   <span className={cn("font-black", product.game === 'multi-shot' ? "text-2xl" : "text-lg")}>
                    {product.game === 'multi-shot' ? 'x3 Shot' : 'Shot'}
                   </span>
              </div>
            </button>
          )}
        </CardFooter>
      </CardComponent>

      <AlertDialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
             <AlertDialogContent onEscapeKeyDown={handleCloseDialog}>
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
                     <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4">
                        <div className="text-right">
                        <div className="bg-black/50 text-white p-2 rounded-md text-sm font-mono inline-block">
                            {capturedTime?.toLocaleTimeString()}
                        </div>
                        </div>

                        {product.game === 'multi-shot' ? (
                            <div className="space-y-2">
                                {capturedPrices.map((price, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedPrice(price)}
                                        className={cn(
                                            "w-full bg-black/50 p-2 rounded-lg text-center transition-all",
                                            selectedPrice === price ? "ring-2 ring-primary" : "hover:bg-black/70"
                                        )}
                                    >
                                        <div className="text-sm text-muted-foreground">Shot {index + 1}</div>
                                        <div className={cn("relative text-2xl font-black text-white", selectedPrice === price && "shimmer-text")} style={{'--trend-color': 'hsl(var(--primary))'} as React.CSSProperties}>
                                            ${price.toFixed(2)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                           <div className="bg-black/50 p-4 rounded-lg text-center">
                                <div className="text-sm text-muted-foreground">Captured Price</div>
                                <div className="relative text-3xl font-black text-white shimmer-text" style={{'--trend-color': 'hsl(var(--primary))'} as React.CSSProperties}>
                                    ${capturedPrices[0]?.toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <AlertDialogDescription className="text-center">
                     You've captured <span className="font-bold text-foreground">{product.name}</span>! 
                     {product.game === 'multi-shot' 
                        ? ` Choose one price to vault.`
                        : ` Vault it now for a great price or let it go.`
                     }
                </AlertDialogDescription>
                
                <AlertDialogFooter className="gap-2 sm:gap-0 sm:flex-row sm:justify-center">
                    <AlertDialogCancel onClick={handleCloseDialog}>Let it go</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleVault()} disabled={product.game === 'multi-shot' && selectedPrice === null}>Vault It!</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
      </AlertDialog>

       <Dialog open={isRiddleDialogOpen} onOpenChange={setIsRiddleDialogOpen}>
            <DialogContent className="max-w-md select-none">
                <DialogHeader>
                    <DialogTitle>Solve the Riddle to Set the Price</DialogTitle>
                     <DialogDescription>
                        Use the calculator on the item card to enter your answer.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                     <p className="text-lg font-mono p-4 bg-secondary rounded-md text-center">
                        If you have a pen, you win.
                    </p>
                    <p className="text-lg font-mono p-4 bg-secondary rounded-md text-center">
                        We bought a hundred for two, to earn ten. Sold with fifty off, for only half then.
                    </p>
                </div>
                <div className={cn("text-center text-4xl font-black font-mono", timerColor)}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
            </DialogContent>
        </Dialog>
    </>
  );
}
