
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import { ChartContainer } from "./ui/chart";
import { DrawPad } from "./draw-pad";
import { Target, HelpCircle } from "lucide-react";

interface ShotTakerProps {
  product: Product;
  view?: 'full' | 'chart' | 'actions';
}

const RIDDLE_ANSWER = 80;
const RIDDLE_TIMER_SECONDS = 300; // 5 minutes
const DRAW_PASSCODE_ANSWER = '0,3,6,7,8'; // L-shape on 3x3 grid
const DRAW_PASSCODE_PRICE = 99;

export function ShotTaker({ product, view = 'full' }: ShotTakerProps) {
  const [currentPrice, setCurrentPrice] = useState(product.marketPrice);
  const [priceHistory, setPriceHistory] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      time: i,
      price: product.marketPrice * (1 + (Math.random() - 0.5) * 0.1),
    }))
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [capturedPrices, setCapturedPrices] = useState<number[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [capturedTime, setCapturedTime] = useState<Date | null>(null);

  // For reel-pause game
  const [reelNumbers, setReelNumbers] = useState<number[]>(Array(16).fill(0));
  const [isReelPaused, setIsReelPaused] = useState(false);
  const [selectedReelIndices, setSelectedReelIndices] = useState<number[]>([]);
  const reelInterval = useRef<NodeJS.Timeout>();

  // For riddle-calc game
  const [isRiddleDialogOpen, setIsRiddleDialogOpen] = useState(false);
  const [riddleTimer, setRiddleTimer] = useState(RIDDLE_TIMER_SECONDS);
  const [calculatorValue, setCalculatorValue] = useState("");
  const timerInterval = useRef<NodeJS.Timeout>();

  // For draw-passcode game
  const [isDrawPasscodeDialogOpen, setIsDrawPasscodeDialogOpen] = useState(false);
  const [drawPadValue, setDrawPadValue] = useState<number[]>([]);


  const { addToVault, walletBalance, spendShot, hasSeenShotInfo, setHasSeenShotInfo } = useStore();
  const { toast } = useToast();
  
  const isGame = product.game && ['reel-pause', 'riddle-calc', 'draw-passcode'].includes(product.game);
  
  // Advanced pricing model state
  const priceState = useRef({
      lastChangeTime: Date.now(),
      timeInDiscountZone: 0,
      currentTrend: 'stable', // 'stable', 'diving', 'climbing'
      isHovering: false,
      hoverStartTime: 0,
  }).current;

  const getNewPrice = useCallback((price: number, marketPrice: number) => {
    const now = Date.now();
    const discount = (marketPrice - price) / marketPrice;

    // --- Trend Management ---

    // Rule: Force price up if it stays in a deep discount zone for too long
    if (discount > 0.5 && now - priceState.lastChangeTime > 1000) { // Over 50% discount for >1s
        priceState.currentTrend = 'climbing';
    } else if (discount > 0.4 && now - priceState.lastChangeTime > 2000) { // Over 40% discount for >2s
        priceState.currentTrend = 'climbing';
    }

    // Rule: Chance to change trend when in the "safe" zone (low discount)
    if (discount < 0.1 && priceState.currentTrend !== 'diving') { 
        if (Math.random() < 0.1) { // 10% chance to start diving
            // If user is hovering for too long, make it less likely to dive
            const hoverDuration = priceState.isHovering ? now - priceState.hoverStartTime : 0;
            if (hoverDuration < 5000) { // Only dive if hover is less than 5 seconds
                 priceState.currentTrend = 'diving';
            }
        }
    }

    // --- Price Calculation based on Trend ---
    let newPrice;
    const majorVolatility = 0.3 + Math.random() * 0.4;
    const minorVolatility = 0.05;

    if (priceState.currentTrend === 'diving') {
        newPrice = price * (1 - majorVolatility * Math.random());
        // If discount gets big, or random chance, start climbing back up
        if (discount > 0.6 || Math.random() < 0.2) { 
            priceState.currentTrend = 'climbing';
        }
    } else if (priceState.currentTrend === 'climbing') {
        newPrice = price * (1 + majorVolatility * Math.random() * 0.5);
         // Once it reaches the safe zone, stabilize
         if (discount < 0.1) { 
            priceState.currentTrend = 'stable';
        }
    } else { // 'stable' trend
        const changePercent = (Math.random() - 0.5) * minorVolatility;
        newPrice = price * (1 + changePercent);
    }
    
    newPrice = Math.max(1, newPrice); // Floor price
    newPrice = Math.min(newPrice, marketPrice * 1.1); // Ceiling price

    priceState.lastChangeTime = now;
    return newPrice;

  }, [priceState]);

  useEffect(() => {
    let isMounted = true;
    if (!isGame) {
      const priceInterval = setInterval(() => {
        if (!isMounted) return;
        const newPrice = getNewPrice(currentPrice, product.marketPrice);
        setCurrentPrice(newPrice);
        setPriceHistory(prev => {
          const newHistory = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, price: newPrice }];
          return newHistory;
        });
      }, 300 + Math.random() * 400);

      return () => {
          isMounted = false;
          clearInterval(priceInterval);
      };
    }
  }, [isGame, currentPrice, product.marketPrice, getNewPrice]);
  
  // Cleanup intervals on component unmount
  useEffect(() => {
    return () => {
        if (reelInterval.current) clearInterval(reelInterval.current);
        if (timerInterval.current) clearInterval(timerInterval.current);
    }
  }, []);

  useEffect(() => {
    // Start the reel game automatically
    if (product.game === 'reel-pause' && !isReelPaused && view !== 'chart') {
      startReelGame();
    }
  }, [product.game, isReelPaused, view]);
  
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
  
  const handleTakeShot = (shotAction: () => void) => {
    if (!hasSeenShotInfo) {
      setIsInfoDialogOpen(true);
      return;
    }

    const shotTaken = spendShot();
    if (shotTaken) {
      shotAction();
    } else {
      toast({
        variant: "destructive",
        title: "Out of Shots!",
        description: `You need shots to play. Go to your vault to trade-in items for more.`,
      });
    }
  }

  const handleShot = () => {
    if (isGame) {
      return;
    }
    
    handleTakeShot(() => {
        if (product.game === 'multi-shot') {
            const prices = [
              getNewPrice(currentPrice, product.marketPrice), 
              getNewPrice(currentPrice, product.marketPrice), 
              getNewPrice(currentPrice, product.marketPrice)
            ];
            setCapturedPrices(prices);
            setSelectedPrice(prices[0]);
        } else {
            setCapturedPrices([currentPrice]);
        }
        setCapturedTime(new Date());
        setIsDialogOpen(true);
    });
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
    handleTakeShot(() => {
      setRiddleTimer(RIDDLE_TIMER_SECONDS);
      setIsRiddleDialogOpen(true);
    });
  }

  const handleRiddleShot = () => {
    handleVault(RIDDLE_ANSWER);
    setCalculatorValue("");
    setIsRiddleDialogOpen(false);
  }

  const handleDrawPasscodeStart = () => {
    handleTakeShot(() => {
      setIsDrawPasscodeDialogOpen(true);
    });
  }

  const handleDrawPasscodeShot = () => {
    handleVault(DRAW_PASSCODE_PRICE);
    setDrawPadValue([]);
    setIsDrawPasscodeDialogOpen(false);
  }
  
  const minutes = Math.floor(riddleTimer / 60);
  const seconds = riddleTimer % 60;
  const timerColor = riddleTimer <= 60 ? "text-destructive" : "text-foreground";

  const isGameCard = product.game === 'reel-pause' || product.game === 'riddle-calc' || product.game === 'draw-passcode';

  const discountPercent = ((product.marketPrice - currentPrice) / product.marketPrice) * 100;
  const discountColor = discountPercent > 0 ? "text-accent" : "text-[hsl(var(--chart-4))]";
  
  const renderActions = () => {
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
                    <Button onClick={() => handleTakeShot(stopReelGame)} className="w-full h-12 text-lg font-bold">Pause</Button>
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

    if (product.game === 'draw-passcode') {
        const isCorrectAnswer = drawPadValue.join(',') === DRAW_PASSCODE_ANSWER;
        return (
            <div className="w-full flex flex-col gap-2">
                <DrawPad onPatternComplete={setDrawPadValue} />
                {isCorrectAnswer ? (
                    <Button onClick={handleDrawPasscodeShot} className="w-full h-12 text-lg font-bold">
                        Take the Shot for ${DRAW_PASSCODE_PRICE}!
                    </Button>
                ) : (
                    <Button onClick={handleDrawPasscodeStart} className="w-full h-12 text-lg font-bold">Start Challenge</Button>
                )}
            </div>
        )
    }

    // Default shot button
    return (
        <button
          className="w-full h-16 text-md font-bold text-primary-foreground rounded-md relative overflow-hidden bg-secondary flex items-center justify-center"
          onClick={handleShot}
        >
          <div className="absolute inset-0 moving-gradient"></div>
          <div className="relative flex items-baseline w-full justify-center">
               <span className={cn("font-black", product.game === 'multi-shot' ? "text-2xl" : "text-lg")}>
                {product.game === 'multi-shot' ? 'x3 Shot' : 'Shot'}
               </span>
          </div>
        </button>
    );
  }

  const renderChart = () => {
    if (isGameCard) {
      // Don't render chart for games, render their controls instead in the action view
      if (view === 'chart') return <div className="h-32 flex items-center justify-center bg-secondary/30 rounded-lg"><p className="text-muted-foreground">Game in progress...</p></div>;
      return null;
    }

    return (
        <div className="relative h-32">
           <div className="absolute inset-0">
                <ChartContainer config={{
                  price: { label: "Price", color: "hsl(var(--primary))" },
                }} className="h-full w-full">
                  <AreaChart data={priceHistory} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <Tooltip content={<></>} />
                    <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#chart-fill)" />
                  </AreaChart>
                </ChartContainer>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <span className={cn(
                "font-black tracking-wider text-white shimmer-text",
                 view === 'full' ? "text-3xl lg:text-4xl" : "text-4xl lg:text-6xl"
                )} style={{'--trend-color': discountPercent > 0 ? 'hsl(var(--accent))' : 'hsl(var(--chart-4))'} as React.CSSProperties}>${currentPrice.toFixed(2)}</span>
              <span className={cn("font-bold text-sm", discountColor)}>
                  {discountPercent > 0 && '+'}{discountPercent.toFixed(1)}%
              </span>
            </div>
         </div>
      )
  }

  const handleMouseEnter = () => {
    priceState.isHovering = true;
    priceState.hoverStartTime = Date.now();
  }
  const handleMouseLeave = () => {
    priceState.isHovering = false;
    priceState.hoverStartTime = 0;
  }

  if (view === 'chart') {
    return renderChart();
  }

  if (view === 'actions') {
    return renderActions();
  }

  return (
    <>
      <Card
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "flex h-full flex-col overflow-hidden transition-all duration-300 group relative",
          view === 'full' && "shadow-lg",
          isGameCard && "border-primary/50 border-2",
          product.game === 'multi-shot' && 'multi-shot-card'
        )}
      >
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
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-8">
                 <h3 className="text-white text-lg font-bold text-center">{product.name}</h3>
                <h3 className="text-white/80 text-sm font-semibold text-center">{product.subtitle}</h3>
              </div>
            </div>
          </CardHeader>
        </Link>
        <CardContent className="flex-grow p-4 pb-2 space-y-2">
            {isGameCard ? (
                 <div className="p-4"></div>
            ) : (
                renderChart()
            )}
        </CardContent>
        <CardFooter className="p-4 pt-2 flex-col items-center">
          {renderActions()}
        </CardFooter>
      </Card>

      <AlertDialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>How to Play</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-4">
               <div className="flex items-start gap-4">
                  <Target className="h-8 w-8 text-primary mt-1"/>
                  <div>
                    <h3 className="font-bold">Take a Shot</h3>
                    <p className="text-sm text-muted-foreground">Click the 'Shot' button on an item to lock in its current price. This costs 1 Shot from your balance.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <HelpCircle className="h-8 w-8 text-accent mt-1"/>
                   <div>
                    <h3 className="font-bold">Vault or Let Go</h3>
                    <p className="text-sm text-muted-foreground">Once you take a shot, you can choose to buy the item for the captured price and send it to your Vault, or you can let it go.</p>
                  </div>
                </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setHasSeenShotInfo(true);
              setIsInfoDialogOpen(false);
            }}>Let's Go!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
        <Dialog open={isDrawPasscodeDialogOpen} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setDrawPadValue([]);
            }
            setIsDrawPasscodeDialogOpen(isOpen);
        }}>
            <DialogContent className="max-w-md select-none">
                <DialogHeader>
                    <DialogTitle>Draw the Passcode</DialogTitle>
                    <DialogDescription>
                        The pattern will appear for a moment. Memorize it and draw it on the pad on the card.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center h-48">
                    <div className="animate-fade-out">
                         <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                                </linearGradient>
                            </defs>
                            <circle cx="20" cy="20" r="4" fill="hsl(var(--foreground))" fillOpacity="0.5" />
                            <circle cx="50" cy="20" r="4" fill="hsl(var(--foreground))" fillOpacity="0.5" />
                            <circle cx="80" cy="20" r="4" fill="hsl(var(--foreground))" fillOpacity="0.5" />
                            <circle cx="20" cy="50" r="4" fill="hsl(var(--foreground))" fillOpacity="0.5" />
                            <circle cx="50" cy="50" r="4" fill="hsl(var(--foreground))" fillOpacity="0.5" />
                            <circle cx="80" cy="50" r="4" fill="hsl(var(--foreground))" fillOpacity="0.5" />
                            <circle cx="20" cy="80" r="4" fill="hsl(var(--foreground))" fillOpacity="0.5" />
                            <circle cx="50" cy="80" r="4" fill="hsl(var(--foreground))" fillOpacity="0.5" />
                            <circle cx="80" cy="80" r="4" fill="hsl(var(--foreground))" fillOpacity="0.5" />
                            <path d="M20 20 L20 80 L80 80" stroke="url(#line-gradient)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </>
  );
}
