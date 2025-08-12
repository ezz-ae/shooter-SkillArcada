
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Area, AreaChart } from "recharts";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ChartContainer } from "./ui/chart";
import { Bitcoin, Check, Gamepad, Target, X, Trophy } from "lucide-react";
import { Input } from "./ui/input";

const GAME_DURATION_SECONDS = 180; // 3 minutes

type GameState = 'idle' | 'playing' | 'finished';
type Trend = 'upward' | 'downward' | 'stable';

interface GameResult {
    isWinner: boolean;
    prize: number;
    accuracy: number;
}

interface PriceModel {
    trend: Trend;
    stepsRemaining: number;
}

export function CryptoLuckGame() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [marketPrice, setMarketPrice] = useState(70000);
  const [currentPrice, setCurrentPrice] = useState(70000);
  const [priceHistory, setPriceHistory] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      time: i,
      price: 70000 * (1 + (Math.random() - 0.5) * 0.01),
    }))
  );
  const [timer, setTimer] = useState(GAME_DURATION_SECONDS);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  
  const [guessedPrice, setGuessedPrice] = useState("");
  const [isGuessLocked, setIsGuessLocked] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const { luckshots, spendLuckshot, addLuckshots } = useStore();
  const { toast } = useToast();
  
  const timerInterval = useRef<NodeJS.Timeout>();
  const priceInterval = useRef<NodeJS.Timeout>();
  const priceModel = useRef<PriceModel>({ trend: 'stable', stepsRemaining: 0 });

  const getNewPrice = useCallback((price: number) => {
    let { trend, stepsRemaining } = priceModel.current;

    // Check if we need to change the trend
    if (stepsRemaining <= 0) {
      const random = Math.random();
      if (random < 0.3) {
        trend = 'upward';
        stepsRemaining = 5 + Math.floor(Math.random() * 10); // 5-15 steps
      } else if (random < 0.6) {
        trend = 'downward';
        stepsRemaining = 5 + Math.floor(Math.random() * 10);
      } else {
        trend = 'stable';
        stepsRemaining = 3 + Math.floor(Math.random() * 5); // 3-8 steps
      }
    } else {
        stepsRemaining--;
    }

    priceModel.current = { trend, stepsRemaining };

    const majorVolatility = 0.003; // More dramatic swings
    const minorVolatility = 0.001;
    let changePercent = 0;

    switch (trend) {
        case 'upward':
            changePercent = (Math.random() * majorVolatility) + (minorVolatility / 2);
            break;
        case 'downward':
            changePercent = -(Math.random() * majorVolatility) - (minorVolatility / 2);
            break;
        case 'stable':
            changePercent = (Math.random() - 0.5) * minorVolatility;
            break;
    }

    let newPrice = price * (1 + changePercent);
    newPrice = Math.max(1, newPrice);
    return newPrice;
  }, []);

  const stopIntervals = () => {
    if (priceInterval.current) clearInterval(priceInterval.current);
    if (timerInterval.current) clearInterval(timerInterval.current);
  }

  // Price ticker effect
  useEffect(() => {
    if (gameState === 'playing') {
      priceInterval.current = setInterval(() => {
        const newPrice = getNewPrice(currentPrice);
        setCurrentPrice(newPrice);
        setPriceHistory(prev => {
          const newHistory = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, price: newPrice }];
          return newHistory;
        });
      }, 1000 + Math.random() * 500);
    }
    return () => {
       if (priceInterval.current) clearInterval(priceInterval.current);
    }
  }, [gameState, currentPrice, getNewPrice]);

  // Game timer effect
  useEffect(() => {
    if (gameState === 'playing' && timer > 0) {
      timerInterval.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer <= 0 && gameState === 'playing') {
      stopIntervals();
      const finalPriceValue = currentPrice;
      setGameState('finished');
      setFinalPrice(finalPriceValue);

      if (!isGuessLocked || !guessedPrice) {
        setGameResult({ isWinner: false, prize: 0, accuracy: 0 });
        toast({ variant: "destructive", title: "Time's up!", description: "You didn't lock in a guess." });
        return;
      }
      
      const numericalGuessedPrice = parseFloat(guessedPrice);
      const difference = Math.abs(finalPriceValue - numericalGuessedPrice);
      const accuracy = (difference / finalPriceValue); // lower is better
      
      let prize = 0;
      if (accuracy <= 0.01) { // Within 1%
        prize = 50;
      } else if (accuracy <= 0.05) { // Within 5%
        prize = 10;
      }
      
      if (prize > 0) {
        addLuckshots(prize);
        setGameResult({ isWinner: true, prize, accuracy });
        toast({ title: "You won!", description: `Your prediction was very accurate! You've won ${prize} Shots!` });
      } else {
        setGameResult({ isWinner: false, prize: 0, accuracy });
        toast({ variant: "destructive", title: "You lost!", description: "Your prediction wasn't close enough this time." });
      }
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
  }, [gameState, timer, currentPrice, addLuckshots, toast, isGuessLocked, guessedPrice]);
  
  const handleStartGame = () => {
    if (luckshots < 1) {
      toast({
        variant: "destructive",
        title: "Not enough Luckshots!",
        description: "You need 1 Luckshot to play.",
      });
      return;
    }
    spendLuckshot(1);
    setGameState('playing');
    setTimer(GAME_DURATION_SECONDS);
    setMarketPrice(currentPrice); // Set the starting price for comparison
    setIsGuessLocked(false);
    setGuessedPrice("");
    setFinalPrice(null);
    setGameResult(null);
  };

  const handleLockGuess = () => {
    if (!guessedPrice || isNaN(parseFloat(guessedPrice))) {
      toast({ variant: "destructive", title: "Invalid Guess", description: "Please enter a valid price." });
      return;
    }
    setIsGuessLocked(true);
    toast({ title: "Guess Locked In!", description: "Good luck!" });
  }

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  
  const renderGameResult = () => {
    if (gameState !== 'finished' || !gameResult) return null;

    if (gameResult.isWinner) {
        return (
            <div className="text-center space-y-2">
                <div className={cn("flex items-center justify-center gap-2 text-2xl font-bold", gameResult.prize >= 50 ? "text-primary" : "text-green-500")}>
                    {gameResult.prize >= 50 ? <Trophy size={28} /> : <Check size={28} />} 
                    You Won {gameResult.prize} Shots!
                </div>
                <p className="text-muted-foreground">The final price was ${finalPrice?.toFixed(2)}</p>
                <Button onClick={handleStartGame} size="lg" className="w-full">
                    Play Again
                </Button>
            </div>
        )
    }

    return (
        <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-destructive">
                <X size={28} /> Not Close Enough!
            </div>
            <p className="text-muted-foreground">The final price was ${finalPrice?.toFixed(2)}. Your guess was ${parseFloat(guessedPrice).toFixed(2)}</p>
            <Button onClick={handleStartGame} size="lg" className="w-full">
                Play Again
            </Button>
        </div>
    )
  }

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><Bitcoin className="text-yellow-500" /> Crypto Luck</CardTitle>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Time Left</p>
                <p className={cn("text-2xl font-bold font-mono", timer < 60 && 'text-destructive')}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
             <ChartContainer config={{
                  price: { label: "Price", color: "hsl(var(--accent))" },
                }} className="h-full w-full">
                  <AreaChart data={priceHistory} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chart-fill-crypto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} fill="url(#chart-fill-crypto)" />
                  </AreaChart>
                </ChartContainer>
            <div className="absolute inset-0 flex items-center justify-center">
                 <span className="font-black tracking-wider text-foreground text-5xl lg:text-6xl text-shadow-lg bg-background/50 px-4 py-2 rounded-lg backdrop-blur-sm">${currentPrice.toFixed(2)}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        {gameState === 'idle' && (
            <Button onClick={handleStartGame} size="lg" className="w-full">
                <Gamepad className="mr-2"/>
                Play for 1 Luckshot
            </Button>
        )}
        {gameState === 'playing' && (
            <div className="w-full space-y-4">
                 <Input 
                    type="number"
                    placeholder="Your price guess"
                    className="h-12 text-lg text-center"
                    value={guessedPrice}
                    onChange={(e) => setGuessedPrice(e.target.value)}
                    disabled={isGuessLocked}
                />
                <Button onClick={handleLockGuess} size="lg" className="w-full" disabled={isGuessLocked}>
                    <Target className="mr-2"/>
                    {isGuessLocked ? 'Guess Locked!' : 'Lock in Guess'}
                </Button>
            </div>
        )}
        {gameState === 'finished' && renderGameResult()}

      </CardFooter>
    </Card>
  );
}
